exports = {
    manifest: {
        author: "Cynosphere",
        name: "Spotify Premium Spoof",
        description: "Spoofs premium check and allows listen along without premium."
    },
    replacements: {
        'r.isPremium=n':'r.isPremium=true'
    }
}