exports.meta = {
    author: "BlockBuilder57, Cynosphere",
    name: "Sailboat",
    desc: "Login as bot accounts."
}
exports.replacements = {
	'/i.default.Store.pauseEmittingChanges\\(\\),t.user.bot/':'false',
	'/.\\._reset\\(!0,1e3,"Disconnect requested by user"\\)/':'console.log("delightfully devilish seymour")',
	'/\\.experiments;v={},t\\.forEach/':'.experiments;if(t==undefined) return;v={},t.forEach',
	'/CONNECTION_OPEN:function\\(e\\){f=e\\.connected/':'CONNECTION_OPEN:function(e){if(e.connectedAccounts==undefined) return; f=e.connected',
	'/function S\\(e\\){var t=arguments/':'function S(e){if(e==undefined) return; var t=arguments',
	'totalUnavailableGuilds,n=[];':'totalUnavailableGuilds,n=[];if(e.readState==undefined) return;'
}