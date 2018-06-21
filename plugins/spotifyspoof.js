exports = {
    manifest: {
        author: "Cynosphere, Murm",
        name: "Spotify Premium Spoof",
        description: "Spoofs premium check and allows listen along without premium.",
        replacements: [
            {signature:'r.isPremium=n',payload:'r.isPremium=true'},
            {signature:'isPremium:"premium"===t.body.product',payload:'isPremium:true'}
        ]
    }
}