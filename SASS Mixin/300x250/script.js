// Hide elements before running animations
function init() {
    var banner = document.querySelector('#banner');
    var snowflakes = document.querySelectorAll('.snowflake');
    // if (Enabler.isInitialized()) {
    //     init();
    // } else {
    //     Enabler.addEventListener(studio.events.StudioEvent.INIT, init);
    // }

    // Runs when Enabler is ready.
    // function init() {
    //     if (Enabler.isPageLoaded()) {
    //         politeInit();
    //     } else {
    //         Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, politeInit);
    //     }
    // };

    politeInit();

    // Runs when the page is completely loaded.
    function politeInit() {

    var loops = 0;
    var max_loops = 3;

    loop();

    function loop() {
        loops++

        if (loops <= max_loops) {
            animate();
        }
        if (loops > max_loops) {
            reset();
        }
    }

    function animate() {
        banner.classList.remove('animate'); 
        setTimeout(function(){       banner.classList.add('animate'); }, 200);
        setTimeout(function(){ loop() }, 10000);
    }

    function reset() {
        snowflakes.css("display", "none")
    }
    }
}

window.onload =  init