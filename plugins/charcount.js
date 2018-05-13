function setupCharCount() {
    if (document.getElementById("charcounter")) return;
    if (!document.querySelector("textarea[class*=\"textAreaEnabled-\"]")) return;

    let charcount = document.createElement("span");
    charcount.id = "charcounter";
    charcount.innerHTML = "0/2000";
    charcount.style.right = "40px";
    charcount.style.bottom = "4px";
    charcount.style.opacity = "0.5";
    charcount.style.position = "absolute";
    charcount.style.display = "block";
    charcount.style["font-size"] = "85%";

    document.querySelector("div[class*=\"channelTextAreaEnabled-\"]").appendChild(charcount);
}

exports = {
    meta: {
        author: "Cynosphere",
        name: "Character Counter",
        desc: "Counts characters in the chatbox."
    },
    start: function(){
        let charcount_mo = new MutationObserver(setupCharCount);
        charcount_mo.observe(document.querySelector("div[class*=\"app-\"]"), {
            childList: true,
            subtree: true
        });

        document.addEventListener("keydown", ev => {
            if (!document.getElementById("charcounter") || !document.querySelector("textarea[class*=\"textAreaEnabled-\"]")) return;

            setTimeout(()=>{
                let length = document.querySelector("textarea[class*=\"textAreaEnabled-\"]").value.length;
                document.getElementById("charcounter").innerHTML = `${length}/2000`;

                if (length > 1999) {
                    document.getElementById("charcounter").style.color = "#FF0000";
                } else if (length > 1899) {
                    document.getElementById("charcounter").style.color = "#FF4500";
                } else if (length > 1499) {
                    document.getElementById("charcounter").style.color = "#FFA500";
                } else if (length > 999) {
                    document.getElementById("charcounter").style.color = "#F1C40F";
                } else {
                    document.getElementById("charcounter").style.color = "#FFFFFF";
                }
            }, 50);
        });
    }
}