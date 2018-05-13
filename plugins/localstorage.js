exports = {
    meta: {
        author: "Cynosphere, Adryd",
        name: "Restore Local Storage",
        desc: "Restore window.localStorage."
    },
    replacements: {
        'try{delete window.localStorage}catch(e){}':''
    }
}