exports = {
    manifest: {
        author: "Cynosphere, Adryd",
        name: "Mentions Fixer",
        description: "See hidden channel mentions and remove #deleted-channel.",
        replacements: [
            {signature:'/t\\.type===(.+)\\.ChannelTypes\\.GUILD_TEXT&&(.+)\\.default\\.can\\((.+)\\.Permissions\\.VIEW_CHANNEL,n,t\\)/',payload:'true'},
            {signature:/"#deleted-channel"/g,payload:'"<#"+e[1]+">"'},
            {signature:'/"@deleted-role"/',payload:'"<@&"+e[1]+">"'},
            {signature:'/guildId:null!=t\\?t\\.guild_id:null,/',payload:'guildId:null!=t.guild_id?t.guild_id:"@me",'}
        ]
    },

}