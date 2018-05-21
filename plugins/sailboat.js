exports.manifest = {
    author: "Adryd, BlockBuilder57, Cynosphere",
    name: "Sailboat",
    description: "Login as bot accounts.",
	replacements = [
		{signature:'/i.default.Store.pauseEmittingChanges\\(\\),t.user.bot/',payload:'false'},
		{signature:'/.\\._reset\\(!0,1e3,"Disconnect requested by user"\\)/',payload:'console.log("delightfully devilish seymour")'},
		{signature:'/\\.experiments;v={},t\\.forEach/',payload:'.experiments;if(t==undefined) return;v={},t.forEach'},
		{signature:'/CONNECTION_OPEN:function\\(e\\){f=e\\.connected/',payload:'CONNECTION_OPEN:function(e){if(e.connectedAccounts==undefined) return; f=e.connected'},
		{signature:'/function S\\(e\\){var t=arguments/',payload:'function S(e){if(e==undefined) return; var t=arguments'},
		{signature:'totalUnavailableGuilds,n=[];',payload:'totalUnavailableGuilds,n=[];if(e.readState==undefined) return;'}
	]
}