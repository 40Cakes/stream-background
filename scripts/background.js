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
    heights: false // Biblically accurate Pokémon
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
    let onscreenPokemon = "";
    let shuffledPokemon = "";
    var height_pos= [];
    var shuffled_size = [];
    var bodyWrapper = document.getElementById("main");

    if(config.heights)
    {
        //Ensures both arrays of objects are shuffled identically
        multishuffle(pokemon, pokemonsize)
        shuffledPokemon = pokemon.slice(0, config.maxOnscreen)
        shuffled_size = pokemonsize.slice(0, config.maxOnscreen)
    }
    else
    {
        shuffledPokemon = shuffle(pokemon).slice(0, config.maxOnscreen);
    }

    // Fakemon sprites
    if (Math.random() < config.fakemonOdds)  {
        if(config.heights)
            {
                //Ensures both arrays of objects are shuffled identically
                multishuffle(fakemon,fakemonsize)
                const shuffledFakemon = fakemon
                shuffledPokemon.unshift(shuffledFakemon[0])
                shuffled_fakesize = fakemonsize
                shuffled_size.unshift(shuffled_fakesize[0])
            }
        else
        {
            const shuffledFakemon = shuffle(fakemon);
            shuffledPokemon.unshift(shuffledFakemon[0]);
        }
    }

    // Handle swarms
    if (config.swarms && Math.random() < config.swarmOdds) {
        const swarm = Array(config.swarmAmount).fill(shuffledPokemon[0]);
        shuffledPokemon.push(...swarm);

        if(config.heights)
        {
            const swarmHeight = Array(config.swarmAmount).fill(shuffled_size[0]);
            shuffled_size.push(...swarmHeight);
        }
    }

    // Process each Pokémon
    shuffledPokemon.forEach((pokemon) => {
        let form;
        for (const val in pokemon) {
            formval = Math.floor(Math.random() * pokemon[val].length)
            form = pokemon[val][formval];
        }
        height_pos.push(formval)

        const isShiny = Math.random() < config.shinyOdds;
        const sparkleClass = isShiny ? "sparkle" : "none";
        const spritePath = isShiny ? "shiny/" : "normal/";
        const area = floating_pokemon.includes(form) ? "sky" : "ground";

        let specialClass = ""

        //Do not enable big_wailords if heights is enabled. Causes Wailord to take up the entire screen while also rendering on-top of everything else.
        if (form == "wailord" && config.big_wailords && !config.heights) specialClass = "wailord"
        if (form == "spheal" && config.spheal_spin) specialClass = "spheal"

        // Append the Pokémon sprite
        onscreenPokemon += `
            <img class="${specialClass}${sparkleClass}" id="${area}" 
                src="sprites/${spritePath}${form}.gif" 
                onerror="this.style.display='none'" 
                alt="Pokemon">
            `;
    });
    i=0
    shuffled_size.forEach((pokemonsize) => {
        for (var val in pokemonsize) {
            list = pokemonsize[val]
            form = pokemonsize[val][height_pos[i]]
            height_multi.push(form)
            i++
        }
    });

    // Inject Pokémon sprites into the body
    document.getElementById("body").innerHTML = onscreenPokemon;
    
    if(config.heights){
    setTimeout(function(){
        i = 0
        $("img").each(function(){
            s = "Height slot: "+ height_pos[i] + " Multi: " + height_multi[i]+" OG Height: "+$(this).height()
            h = $(this).height() * height_multi[i];
            $(this).height(h);
            //Logging for checking which Pokemon are chosen, their original height in px, the multiplier applied to them, and their new height px
            //console.log(s + " New Height: " + $(this).height()+" ", shuffledPokemon[i])
            i++
        });
    }, 100);
        //Change scale from 1.6x to 1.2x. Big mons at 1.6x are WAY too big.
        $('img').css('transform', 'translate(var(--x-position), var(--y-position)) scale(1.2)')
        //Remove max-width
        $('img').css('max-width', '9999px')
    }
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

function multishuffle(array, array2) {
    let i = array.length,
        rand;

    while (i != 0) {
        rand = Math.floor(Math.random() * i);
        i--;
        [array[i], array[rand]] = [
            array[rand], array[i]
        ];
        [array2[i], array2[rand]] = [
            array2[rand], array2[i]
        ];
    }
}