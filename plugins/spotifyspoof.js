exports = {
    meta: {
        author: "Cynosphere",
        name: "Spotify Premium Spoof",
        desc: "Spoofs premium check and allows listen along without premium."
    },
    replacements: {
        'r.isPremium=n':'r.isPremium=true'
    }
}