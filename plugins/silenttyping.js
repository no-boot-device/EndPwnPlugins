window._silenttyping = false;

exports = {
    manifest: {
        author:"Cynosphere",
        name:"SilentTyping",
        description:"Toggleable typing indicators. Toggle with Ctrl+F12",
        replacements:[
            {signature:/sendTyping:function\((.)\){(.*)}/,payload:"sendTyping:function($1){if(window._silenttyping) return;$2}"}
        ]
    },
    start:function(){
        document.addEventListener("keydown", function(ev) {
            if (ev.ctrlKey && ev.key == "F12") {
                window._silenttyping = !window._silenttyping;
                $api.ui.fakeMsg(`Your typing indicator is now ${window._silenttyping ? "dis" : "en"}abled`);
            }
        });
    }
}