bdwatcher = null, bdtag = null, setupCSS = function (n) {
    var e = fs.readFileSync(n, "utf-8");
    null === bdtag && (bdtag = document.createElement("style"), document.head.appendChild(bdtag)), bdtag.innerHTML = e, null === bdwatcher && (bdwatcher = fs.watch(n, {
        encoding: "utf-8"
    }, function (e, w) {
        if ("change" === e) {
            var i = fs.readFileSync(n, "utf-8");
            bdtag.innerHTML = i
        }
    }))
};

exports.meta = {
    author: "dr1ft",
    name: "BeautifulDiscord Port",
    desc: "Allows CSS to be imported and updated on the fly."
},
exports.start = () => {
    if (fs.existsSync($api.data + 'style.css'))
        setupCSS($api.data + 'style.css');
}