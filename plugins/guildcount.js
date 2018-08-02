function formattedGuildCount(shortened) {
    const guildCount = document.querySelectorAll("[class^='guild'] > div[draggable=true]").length;
    return `${guildCount} Guilds`;
}

function setupServerCount() {
    if (document.querySelector(".server-count")) return;

    let gc = document.createElement("div");
    gc.className = "server-count";

    let glist = document.querySelector("[class^=friendsOnline]");
    if (!glist) return;

    glist.parentNode.insertBefore(gc, glist.nextSibling);
  }

function updateServerCount() {
    if (document.querySelector(".server-count") && document.querySelector(".server-count").innerHTML == formattedGuildCount()) return;
    document.querySelector(".server-count").innerHTML = formattedGuildCount();
}

function scCSS() {
    let css = document.createElement("style");
    css.type = "text/css";
    css.id = "css-scount";
    css.innerHTML = `.server-count {
    color: hsla(0,0%,100%,.3);
    font-size: 10px;
    font-weight: 500;
    line-height: 130%;
    margin: 10px 0;
    text-align: center;
    text-transform: uppercase;
    white-space: nowrap;
    width: 50px;
    word-wrap: normal;
}`;
    document.body.appendChild(css);
}

exports.manifest = {
    author: "Cynosphere",
    name: "Guild Count",
    description: "Shows guild count under online count."
}
exports.start = () => {
    scCSS();

    let observer = new MutationObserver(() => {
        setupServerCount();
        updateServerCount();
    });
    observer.observe(document.querySelector("div[class*=\"app-\"]"), {
        childList: true,
        subtree: true
    });
}
