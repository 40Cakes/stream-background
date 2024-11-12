max_onscreen = 16;
shiny_odds = 1 / 128;
reload_mins = 5;
big_wailords = true;
spheal_spin = true;
heights = true;

create();
window.onload = function () {
    //250ms delay to ensure all html elements are loaded prior to attempting to apply new sizes
    if(heights)
    {
        setTimeout(function () {
            randomOrder()
        }, 250);
    }
    else
    {
        randomOrder()
    }

}

$(function () {
    $('body').fadeIn(500);
    setTimeout(function () {
        $('body').fadeOut(500, function () {
            location.reload(true);
        });
    }, reload_mins * 60000);
});

function create() {
    var height_pos= [];
    var height_multi = [];
    var shuffled_size = [];
    var body_wrapper = document.getElementById("body");
    if(heights)
    {
        //Ensures both arrays of objects are shuffled identically
        multishuffle(pokemon, pokemonsize)
        shuffled_pokemon = pokemon
        shuffled_size = pokemonsize
    }
    else
    {
        shuffled_pokemon = shuffle(pokemon)
    }

    // Fakemon sprites
    if (Math.random() < shiny_odds)  {
        if(heights)
            {
                max_onscreen + 1
                //Ensures both arrays of objects are shuffled identically
                multishuffle(fakemon,fakemonsize)
                shuffled_fakemon = fakemon
                shuffled_pokemon.unshift(shuffled_fakemon[0])
                shuffled_fakesize = fakemonsize
                shuffled_size.unshift(shuffled_fakesize[0])
            }
        else
        {
            max_onscreen + 1
            shuffled_fakemon = shuffle(fakemon)
            shuffled_pokemon.unshift(shuffled_fakemon[0])
        }
    }

    onscreen_pokemon = ''
    export_data = { "background_sprites": [], "shiny_sprites": [] }

    shuffled_pokemon.slice(0, max_onscreen).forEach(function (pokemon) {
        for (var val in pokemon) {
            list = pokemon[val]
            formval = Math.floor(Math.random() * pokemon[val].length)
            form = pokemon[val][formval]
        }
        height_pos.push(formval)
        export_data["background_sprites"].push(form)

        if (Math.random() < shiny_odds) {
            sparkle = "sparkle"
            shiny = "shiny/"
            export_data["shiny_sprites"].push(form)
        } else {
            sparkle = "none"
            shiny = "normal/"
        }

        if (floating_pokemon.includes(form)) {
            area = "sky"
        } else {
            area = "ground"
        }

        special = ""

        //Do not enable big_wailords if heights is enabled. Causes Wailord to take up the entire screen while also rendering on-top of everything else.
        if (form == "wailord" && big_wailords && !heights) {
            special = "wailord"
        }

        if (form == "spheal" && spheal_spin) {
			special = "spheal"
		}

        onscreen_pokemon += '<img class="' + special + sparkle + '" id="' + area + '" src="sprites/' + shiny + form + '.gif" onerror="this.style.display=\'none\'" alt=/>';
    });
    i=0
    shuffled_size.slice(0, max_onscreen).forEach(function (pokemonsize) {
        for (var val in pokemonsize) {
            list = pokemonsize[val]
            form = pokemonsize[val][height_pos[i]]
            height_multi.push(form)
            i++
        }
    });

    body_wrapper.innerHTML = onscreen_pokemon
    if(heights){
    setTimeout(function(){
        i = 0
        $("img").each(function(){
            s = "Height slot: "+ height_pos[i] + " Multi: " + height_multi[i]+" OG Height: "+$(this).height()
            h = $(this).height() * height_multi[i];
            $(this).height(h);
            //Logging for checking which Pokemon are chosen, their original height in px, the multiplier applied to them, and their new height px
            //console.log(s + " New Height: " + $(this).height()+" ", shuffled_pokemon[i])
            i++
        });
    }, 200);
        //Change scale from 1.6x to 1.2x. Big mons at 1.6x are WAY too big.
        $('img').css('transform', 'translate(var(--x-position), var(--y-position)) scale(1.2)')
        //Remove max-width
        $('img').css('max-width', '9999px')
    }
}

var randomOrder = function () {
    var sparkles = ''
    var body_wrapper = document.getElementById("body");

    function shuffleSprites(selector, hTop, hBot) {
        sprites = document.querySelectorAll(selector);
        sprites.forEach((image) => {
            var h = 1440;
            var w = 4096;

            var x = Math.floor(Math.random() * ((w - image.offsetWidth) - 0 + 1));
            var y = Math.floor(Math.random() * ((h - image.offsetHeight - hBot) - hTop + 1)) + hTop;
            var z = y;

            if (image['className'] == "wailordnone") {
                y -= 50;
                z = 6969696969;
            } else if (image['className'] == "wailordsparkle") {
                y -= 200;
                z = 6969696969;
            }

            if (image['className'] == "sphealnone" || image['className'] == "sphealsparkle") {
                $('.sphealnone').css('margin-top', y)
				$('.sphealsparkle').css('margin-top', y)
			}

            image.style.cssText += "--x-position:" + x + "px; --y-position:" + y + "px; z-index:" + z;

            if (image['className'] == "sparkle") {
                sparkles += '<img style="--x-position:' + (x - (image['width'] / 6)) + 'px; --y-position:' + (y - (image['height'] / 6)) + 'px; z-index: -1; width: ' + (image['width'] * 1.3) + 'px; max-height: 150px; max-width: 150px" src="./sprites/sparkles.gif" onerror="this.style.display=\'none\'" alt=/>';
            } else if (image['className'] == "wailordsparkle") {
                sparkles += '<img style="--x-position:' + (x + (image['width'] / 6)) + 'px; --y-position:' + (y - (image['height'] / 6)) + 'px; z-index: -1; width: ' + (image['width'] * 1.3) + 'px; max-height: 1000px; max-width: 1000px" src="./sprites/sparkles.gif" onerror="this.style.display=\'none\'" alt=/>';
            }
        });
    }
    if(heights==true)
    {
        //Helps the smaller ground mons stay on the ground and keeps the bigger (mostly gmax) mons stay on screen
        shuffleSprites('#ground', 1100, 100)
        shuffleSprites('#sky', 10, 400)
    }
    else
    {
        shuffleSprites('#ground', 1000, 50)
        shuffleSprites('#sky', 10, 400)
    }
    body_wrapper.innerHTML += sparkles;
}

function shuffle(array) {
    let i = array.length,
        rand;

    while (i != 0) {
        rand = Math.floor(Math.random() * i);
        i--;
        [array[i], array[rand]] = [
            array[rand], array[i]
        ];
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