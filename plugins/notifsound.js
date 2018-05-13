exports.meta = {
    author: "dr1ft",
    name: "Notification Sound Replacer",
    desc: "Replaces notification sound with an unused sound thats nicer."
}
exports.start = function(){
    var s = wc.findFunc('playSound')[1].exports;
    s.playSoundOriginal = s.playSound;
    s.playSound = function (e) {
        switch (e) {
            case "message1":
                return s.playSoundOriginal('message3');
                //new Audio(window._sndURL).play();
                //return s.playSoundOriginal(e, 0);
            default:
                return s.playSoundOriginal(e);
                break;
        }
    }
}