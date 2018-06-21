exports = {
    manifest: {
        author: "Cynosphere",
        name: "Character Counter",
        description: "Counts characters in the chatbox."
    },
    start: function(){
        function setupCharCount() {
            if (document.body.contains(charcount)) return;
            if (!text || !document.body.contains(text)) {
                text = document.querySelector('textarea[class^="textArea-"]');
            }
            if (!text) return;

            text.parentNode.appendChild(charcount);
        }

        let charcount = document.createElement("span");
        charcount.id = "charcounter";
        charcount.innerHTML = "0/2000";
        charcount.style.right = "40px";
        charcount.style.bottom = "4px";
        charcount.style.opacity = "0.5";
        charcount.style.position = "absolute";
        charcount.style.display = "block";
        charcount.style["font-size"] = "85%";

        let text = null;

        let charcount_mo = new MutationObserver(setupCharCount);
        charcount_mo.observe(document.querySelector(".app.flex-vertical"), {
            childList: true,
            subtree: true
        });

        document.addEventListener("keydown", ev => {
            if (!text) return;

            setImmediate(()=>{
                let length = text.value.length;
                charcount.innerHTML = `${length}/2000`;

                if (length > 1999) {
                    charcount.style.color = "#FF0000";
                } else if (length > 1899) {
                    charcount.style.color = "#FF4500";
                } else if (length > 1499) {
                    charcount.style.color = "#FFA500";
                } else if (length > 999) {
                    charcount.style.color = "#F1C40F";
                } else {
                    charcount.style.color = "#FFFFFF";
                }
            });
        });
    }
}