exports = {
    manifest: {
        author: "Cynosphere",
        name: "Restore Local Storage",
        description: "Restore window.localStorage.",
        replacements: [
            {signature:'try{delete window.localStorage}catch(e){}',payload:''}
        ]
    }
}