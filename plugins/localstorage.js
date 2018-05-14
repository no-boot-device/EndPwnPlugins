exports = {
    manifest: {
        author: "Cynosphere",
        name: "Restore Local Storage",
        description: "Restore window.localStorage."
    },
    replacements: {
        'try{delete window.localStorage}catch(e){}':''
    }
}