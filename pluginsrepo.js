/*
Plugins Repo Plugin for EndPwn
Made by Cynthia (Cynosphere)
*/

var baseurl = "https://raw.githubusercontent.com/Cynosphere/EndPwnPlugins/master/plugins/";

var internal = {
    print: function (str) {
        console.log(`%c[PluginsRepo]%c ` + str, 'font-weight:bold;color:#c8f', '');
    }
}

exports = {
    manifest: {
        author: "Cynosphere",
        name: "Plugins Repo",
        description: "Download plugins.",
        _version: 2
    },

    getInfo: async function(plugin){
        var exports = {};
        evaluate(await (await fetch(baseurl+plugin+'?_=' + Date.now())).text(), exports);
        window._prPluginStore[plugin.replace(".js","")] = exports;
        return {id:plugin.replace(".js",""),data:exports.manifest};
    },

    updateCheck:async function(){
        internal.print("Checking for updates...");
        var pr = {};
        evaluate(await (await fetch(baseurl.replace("plugins/","pluginsrepo.js")+'?_=' + Date.now())).text(), pr);
        if(pr && pr.manifest && pr.manifest._version && pr.manifest._version > this.manifest._version){
            internal.print("Update avaliable");
            $settingsapi.fancyDialog({
                header: 'Plugins Repo: Update',
                confirmText: 'Yes', cancelText: 'No',
                onConfirm: async () => {
                    fs.writeFileSync($api.data + '/plugins/pluginsrepo.js', await (await fetch(baseurl.replace("plugins/","pluginsrepo.js")+'?_=' + Date.now())).text());
                    electron.getCurrentWindow().loadURL(window.location.href);
                }
            },'Plugins Repo has an update, would you like to restart for it to be installed?');
        }else{
            internal.print("No update avaliable.");
            internal.print("Checking plugins for updates...");
            internal.print("Fetching plugins...");
            window._prTimeout = Date.now()+120;
            let plugins = await (await fetch('https://raw.githubusercontent.com/Cynosphere/EndPwnPlugins/master/plugins.txt?_=' + Date.now())).text();
            plugins=plugins.split("\n");

            var updated = [];
            var toUpdate = {};

            for(x in plugins){
                var d = await this.getInfo(plugins[x]);
                var id = d.id;
                var data = d.data;
                var info = {};
                info.name = data.name ? data.name : (id ? id : "<unnamed plugin???>");
                info.description = data.description ? data.description : "Manifest is missing for this plugin.";
                info.author = data.author ? data.author : "Unknown";
                info.loadAfter = data.loadAfter ? data.loadAfter : [];
                info.priority = data.priority ? data.priority : 0;
                info.replacements = data.replacements ? data.replacements : [];

                if(fs.existsSync(`${$api.data}/plugins/${id}.js`)){
                    var p = fs.readFileSync(`${$api.data}/plugins/${id}.js`).toString().replace(/\r\n/g,"\n").trim();
                    var np = await (await fetch(baseurl+id+'.js?_=' + Date.now())).text();
                    np=np.trim();

                    if(p !== np){
                        internal.print(`Update found for ${info.name} (${id}).`);
                        toUpdate[id] = np;
                        updated.push(`${info.name} (${id})`);
                    }
                }else{
                    internal.print(`Skipping ${info.name} (${id}), not installed.`);
                }
            }
        }

        if(updated.length > 0){
            $settingsapi.fancyDialog({
                header: 'Plugins Repo: Updated Plugins',
                confirmText: 'Yes',
                cancelText: 'No',
                onConfirm: async () => {
                    Object.keys(toUpdate).forEach(x=>{
                        fs.writeFileSync(`${$api.data}/plugins/${x}.js`,toUpdate[x]);
                        internal.print(`Wrote plugin: ${x}`);
                    });
                    internal.print(`Reloading!`);
                    electron.getCurrentWindow().loadURL(window.location.href);
                }
            },`The following plugins need to update: ${updated.join(", ")}. Would you like to restart for these plugins to be updated?`,);
        }
    },

    init:async function(){
        if(!window.$settingsapi){
            internal.print("Asking to install Settings API");
            $api.ui.showDialog({
                title: 'Plugins Repo: Settings API Installed',
                body: 'Settings API was not found, would you like to restart for it to be installed?',
                confirmText: 'Yes', cancelText: 'No',
                onConfirm: async () => {
                    fs.writeFileSync($api.data + '/plugins/settingsapi.js', await (await fetch(baseurl+'settingsapi.js?_=' + Date.now())).text());
                    electron.getCurrentWindow().loadURL(window.location.href);
                }
            });
            return;
        }

        let em = $settingsapi.elements;
        let int = em.internal;

        window._prPluginStore = {}
        window._prTimeout = 0;

        var setupInfo = function(id,data){
            var info = {};
            info.name = data.name ? data.name : (id ? id : "<unnamed plugin???>");
            info.description = data.description ? data.description : "Manifest is missing for this plugin.";
            info.author = data.author ? data.author : "Unknown";
            info.loadAfter = data.loadAfter ? data.loadAfter : [];
            info.priority = data.priority ? data.priority : 0;
            info.replacements = data.replacements ? data.replacements : [];

            var cont = em.createVerticalPanel();

            var head = em.createHorizontalPanel()
            .appendTo(cont);

            var title = createElement("h3")
            .withClass(
                int.headers.h3,
                int.headers.title,
                int.headers.size16,
                int.headers.height20,
                int.headers.defaultColor
            )
            .withText(info.name)
            .appendTo(head);

            em.createH5('By '+info.author)
            .appendTo(title);

            em.createButton("Download")
            .modify(x=>{
                if(fs.existsSync(`${$api.data}/plugins/${id}.js`)){
                    x.disabled = true;
                    x.className = `${x.className} ${int.buttons.disabled}`;
                }else{
                    x.onclick = async _ => {
                        internal.print("Downloading Plugin: "+id);
                        fs.writeFileSync(`${$api.data}/plugins/${id}.js`, await (await fetch(baseurl+id+'.js?_=' + Date.now())).text());
                        x.disabled = true;
                        x.className = `${x.className} ${int.buttons.disabled}`;
                        if(window._prDialogSeen) return;
                        $api.ui.showDialog({
                            title: 'New Plugin Installed',
                            body: 'Would you like to refresh for this plugin to take effect?\nIf you want to get more plugins, click no.',
                            minorText: 'This message will only show once per session.',
                            confirmText: 'Yes', cancelText: 'No',

                            onConfirm: () => {
                                electron.getCurrentWindow().loadURL(window.location.href);
                            }
                        });
                        window._prDialogSeen = true;
                    }
                }
            })
            .appendTo(head);

            createElement("div")
            .withClass(
                int.misc3.description,
                int.misc3.formText,
                int.misc3.modeDefault
            )
            .withText(info.description)
            .appendTo(cont);

            var body = em.createHorizontalPanel()
            .appendTo(cont);

            createElement("div")
            .withClass(
                int.misc3.description,
                int.misc3.formText,
                int.misc3.modeDefault
            )
            .withText(`Replacements: ${info.replacements.length}`)
            .appendTo(body);

            /*createElement("div")
            .withClass(
                int.misc3.description,
                int.misc3.formText,
                int.misc3.modeDefault
            )
            .modify(x=>x.style.marginLeft = "8px")
            .withText(`Priority: ${info.priority}`)
            .appendTo(body);

            createElement("div")
            .withClass(
                int.misc3.description,
                int.misc3.formText,
                int.misc3.modeDefault
            )
            .modify(x=>x.style.marginLeft = "8px")
            .withText(info.loadAfter.length > 0 ? `Depends on: ${info.loadAfter.join(", ")}` : "No dependencies")
            .appendTo(body);*/

            createElement("div")
            .withClass(em.internal.dividers.divider)
            .appendTo(cont);

            return cont;
        }

        var settingsPage = async function(pnl){
            em.createH2("Plugins Repo")
            .appendTo(pnl);

            let loading = createElement("div")
            .withClass(
                int.misc3.description,
                int.misc3.formText,
                int.misc3.modeDefault
            )
            .withText(`Loading, please wait...`)
            .appendTo(pnl);

            var btns = em.createHorizontalPanel()
            .appendTo(pnl);

            em.createButton("Reload list")
            .modify(async x=>{
                x.className = `${x.className} ${int.buttons.colorGreen}`;
                x.onclick=async ()=>{
                    if(Date.now() < window._prTimeout){
                        em.createH5(`Ratelimited, try again in ${Math.floor(window._prTimeout-Date.now())}s.`)
                        .modify(y=>setTimeout(_=>{y.parentNode.removeChild(y)},2000))
                        .appendTo(btns);
                        return;
                    }

                    list.purge();
                    window._prPluginStore = {};
                    window._prTimeout = Date.now()+120;
                    internal.print("Fetching plugins...");
                    let plugins = await (await fetch('https://raw.githubusercontent.com/Cynosphere/EndPwnPlugins/master/plugins.txt?_=' + Date.now())).text();
                    plugins=plugins.split("\n");

                    for(x in plugins){
                        var info = await exports.getInfo(plugins[x]);
                        setupInfo(info.id,info.data)
                        .appendTo(list);
                    }
                }
            })
            .appendTo(btns);

            em.createButton("Check for updates")
            .modify(async x=>{
                x.className = `${x.className} ${int.buttons.colorYellow}`;
                x.onclick=async ()=>{
                    if(Date.now() < window._prTimeout){
                        em.createH5(`Ratelimited, try again in ${Math.floor(window._prTimeout-Date.now())}s.`)
                        .modify(y=>setTimeout(_=>{y.parentNode.removeChild(y)},2000))
                        .appendTo(btns);
                        return;
                    }

                    exports.updateCheck();
                }
            })
            .appendTo(btns);

            var list = em.createVerticalPanel()
            .appendTo(pnl);

            if(Object.keys(_prPluginStore).length <= 0){
                internal.print("Fetching plugins...");
                window._prTimeout = Date.now()+120;
                let plugins = await (await fetch('https://raw.githubusercontent.com/Cynosphere/EndPwnPlugins/master/plugins.txt?_=' + Date.now())).text();
                plugins=plugins.split("\n");

                loading.modify(x=>x.parentNode.removeChild(x));

                for(x in plugins){
                    var info = await this.getInfo(plugins[x]);
                    setupInfo(info.id,info.data)
                    .appendTo(list);
                }
            }else{
                loading.modify(x=>x.parentNode.removeChild(x));

                Object.keys(_prPluginStore).forEach(x=>{
                    info = {id:x,data:_prPluginStore[x].manifest}
                    setupInfo(info.id,info.data)
                    .appendTo(list);
                });
            }
        }

        $settingsapi.addSection("PluginsRepo","Plugins Repo",null,settingsPage);
    },

    start:function(){
        this.updateCheck();
        setTimeout(this.init,200);
    }
}