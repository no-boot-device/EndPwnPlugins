exportsexports = {
    manifest: {
        author: "Cynosphere, Adryd",
        name: "Mentions Fixer",
        description: "See hidden channel mentions and remove #deleted-channel."
    },
    replacements: {
        '/t\\.type===(.+)\\.ChannelTypes\\.GUILD_TEXT&&(.+)\\.default\\.can\\((.+)\\.Permissions\\.VIEW_CHANNEL,n,t\\)/':'true',
        '/"#deleted-channel"/':'"<#"+e[1]+">"',
        '/"@deleted-role"/':'"<@&"+e[1]+">"',
        '/guildId:null!=t\\?t\\.guild_id:null,/':'guildId:null!=t.guild_id?t.guild_id:"@me",'
    }
}