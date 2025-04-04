// Stream background config
const config = {
    maxOnscreen: 16, // Maximum number of unique species to display at a time
    reloadMinutes: 5, // Refresh and shuffle background every n minutes
    shinyOdds: 1 / 128, // Chance for each species to be shiny (multiple can shine at once)
    swarms: true, // Chance for a species to swarm (adds swarmAmount of that species)
    swarmAmount: 16,
    swarmOdds: 1 / 64,
    fakemonOdds: 1 / 128, // Chance to add a single "fakemon" from Smogon's CAP - https://www.smogon.com/dex/ss/formats/cap/
    bigWailords: true, // BIG FUCKINF WAILORD
    sphealSpin: true, // Spinny boi
    afd: true, // April Fools day sprite replacement
};

// Create background elements on load
create();
window.onload = randomOrder;

// Fade in/out effect and periodic reload
$(function () {
    $('body').fadeIn(500);
    setTimeout(() => {
        $('body').fadeOut(500, () => location.reload(true));
    }, config.reloadMinutes * 60000);
});

// Generate Pokémon and their attributes
function create() {
    let afd = false
    const now = new Date();
    if (config.afd && now.getMonth() == 3 && now.getDate() == 1) { // 1st of April
        afd = true
    }

    if (afd){
        pokemon = afd_pokemon
        fakemon = afd_fakemon
        spriteDir = "sprites/afd-"
        spriteExt = "png"
    } else {
        spriteDir = "sprites/"
        spriteExt = "gif"
    }

    let onscreenPokemon = "";
    const shuffledPokemon = shuffle(pokemon).slice(0, config.maxOnscreen);

    // Handle Fakemon
    if (Math.random() < config.fakemonOdds) {
        const shuffledFakemon = shuffle(fakemon);
        shuffledPokemon.unshift(shuffledFakemon[0]);
    }

    // Handle swarms
    if (config.swarms && Math.random() < config.swarmOdds) {
        const swarm = Array(config.swarmAmount).fill(shuffledPokemon[0]);
        shuffledPokemon.push(...swarm);
    }

    // Process each Pokémon
    shuffledPokemon.forEach((pokemon) => {
        let form;
        for (const val in pokemon) {
            form = pokemon[val][Math.floor(Math.random() * pokemon[val].length)];
        }

        const isShiny = Math.random() < config.shinyOdds;
        const sparkleClass = isShiny ? "sparkle" : "none";
        const spritePath = isShiny ? spriteDir + "shiny/" : spriteDir + "normal/";
        const area = floating_pokemon.includes(form) ? "sky" : "ground";

        // Special cases
        let specialClass = "";
        if (form === "wailord" && config.bigWailords) specialClass = "wailord";
        if (form === "spheal" && config.sphealSpin) specialClass = "spheal";

        // Append the Pokémon sprite
        onscreenPokemon += `
            <img class="${specialClass}${sparkleClass}" id="${area}" 
                 src="${spritePath}${form}.${spriteExt}"
                 onerror="this.style.display='none'" 
                 alt="Pokemon">
        `;
    });

    // Inject Pokémon sprites into the body
    document.getElementById("body").innerHTML = onscreenPokemon;
}

// Randomly position and style Pokémon sprites
function randomOrder() {
    let sparklesHTML = "";
    const bodyWrapper = document.getElementById("body");

    function shuffleSprites(selector, hTop, hBot) {
        const sprites = document.querySelectorAll(selector);
        const maxHeight = 1440;
        const maxWidth = 4096;

        sprites.forEach((sprite) => {
            const x = Math.floor(Math.random() * (maxWidth - sprite.offsetWidth));
            let y = Math.floor(Math.random() * (maxHeight - sprite.offsetHeight - hBot - hTop)) + hTop;
            let z = y;

            // Special adjustments for classes
            if (sprite.classList.contains("wailordnone")) {
                y -= 50;
                z = 9999;
            } else if (sprite.classList.contains("wailordsparkle")) {
                y -= 200;
                z = 9999;
            }

            if (sprite.classList.contains("sphealnone") || sprite.classList.contains("sphealsparkle")) {
                document.querySelectorAll(".sphealnone, .sphealsparkle").forEach(spheal => {
                    spheal.style.marginTop = `${y}px`;
                });
            }

            // Apply styles
            sprite.style.cssText += `
                --x-position: ${x}px;
                --y-position: ${y}px;
                z-index: ${z};
            `;

            // Add sparkle images
            if (sprite.classList.contains("sparkle") || sprite.classList.contains("wailordsparkle")) {
                const offset = sprite.offsetWidth / 6;
                const sparkleSize = sprite.offsetWidth * 1.3;
                const sparkleMaxSize = sprite.classList.contains("wailordsparkle") ? 1000 : 150;

                sparklesHTML += `
                    <img style="--x-position: ${x + (sprite.classList.contains("wailordsparkle") ? offset : -offset)}px; 
                                 --y-position: ${y - offset}px; 
                                 z-index: -1; width: ${sparkleSize}px; 
                                 max-height: ${sparkleMaxSize}px; max-width: ${sparkleMaxSize}px;" 
                         src="./sprites/sparkles.gif" 
                         onerror="this.style.display='none'" 
                         alt="Sparkle">
                `;
            }
        });
    }

    // Shuffle sprites for ground and sky
    shuffleSprites('#ground', 1000, 50);
    shuffleSprites('#sky', 10, 400);

    // Append sparkles to the body
    bodyWrapper.innerHTML += sparklesHTML;
}

// Fisher-Yates shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const rand = Math.floor(Math.random() * (i + 1));
        [array[i], array[rand]] = [array[rand], array[i]];
    }
    return array;
}
