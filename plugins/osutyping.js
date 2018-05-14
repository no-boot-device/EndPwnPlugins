exportsexports = {
    manifest: {
        author: "Cynosphere, janeptrv",
        name: "osu! Typing",
        description: "Adds typing sounds from osu!."
    },
    start: function(){
        var sounds = [];
        for (var i = 1; i < 4; i++) {
            sounds.push(new Audio(`https://github.com/janeptrv/sounds/blob/master/osu_typing_click${i}.wav?raw=true`));
        }
        const backspace = new Audio("https://github.com/janeptrv/sounds/blob/master/osu_typing_erase.wav?raw=true");

        var keys = {};
        function typingSound(ev) {
            for (const sound of sounds) {
                sound.pause();
                sound.currentTime = 0;
            }
            backspace.pause();
            backspace.currentTime = 0;
            if (ev.key == "Backspace" || ev.key == "Delete") {
                backspace.play();
            } else {
                sounds[Math.floor(sounds.length * Math.random())].play();
            }
            return false;
        }
        document.addEventListener("keydown", typingSound);
    }
}