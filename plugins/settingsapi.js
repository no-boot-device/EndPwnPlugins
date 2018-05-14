//Stolen from StackOverflow :^)
let convertToText = function(obj) {
    var string = [];

    if (obj == undefined) {
    	return String(obj);
    } else if (typeof(obj) == "object" && (obj.join == undefined)) {
        for (prop in obj) {
        	if (obj.hasOwnProperty(prop))
            string.push(prop + ": " + convertToText(obj[prop]));
        };
        return "{" + string.join(",") + "}";
    } else if (typeof(obj) == "object" && !(obj.join == undefined)) {
        for(prop in obj) {
            string.push(convertToText(obj[prop]));
        }
        return "[" + string.join(",") + "]";
    } else if (typeof(obj) == "function") {
        string.push(obj.toString())
    } else {
        string.push(JSON.stringify(obj))
    }

    return string.join(",");
}

exports = {
    manifest: {
        author: "Cynosphere, BlockBuilder57",
        name: "Settings API",
        description: "Hijack the settings menu in any way you feel."
    },
    replacements: {
        '/function z\\(\\){return\\[{(.+)}]}/':'window.$settingsapi={sections:[{$1}]};function z(){return window.$settingsapi.sections;}',
    },
    start: function(){
        var buttons = $api.util.findFuncExports('button-', 'colorBlack');
        var checkboxes = $api.util.findFuncExports('checkboxEnabled');
        var misc = $api.util.findFuncExports('statusRed-', 'inputDefault');
        var misc2 = $api.util.findFuncExports('multiInputField');
        var headers = $api.util.findFuncExports('h5-', 'h5');

        var panels = wc.findFunc('flexChild-')[0].exports;
        var panels2 = $api.util.findFuncExports('errorMessage-', 'inputWrapper');

        let sections = window.$settingsapi.sections;

        window.$settingsapi = {
            sections: sections,
            ourSections: [],
            _callbacks: {},
            _panels: {},
            addSection: function(name,label,callback,color){
                let data = {};

                data.section = name || `SAPI_${Math.floor(Math.random()*10000)}`;
                data.label = label;
                data.color = color || undefined;
                data.element = $api.util.findConstructor('FormSection', 'FormSection').FormSection;

                $settingsapi.ourSections.push(data);
                $settingsapi.sections.splice($settingsapi.sections.length-4,0,data);
                $settingsapi._callbacks[name] = callback;
            },
            exportSections: function(){
                let out = "";

                for(i in $settingsapi._sections){
                    out = out + convertToText($settingsapi._sections[i]);
                }

                return out;
            },
            //All of these allow us to use Discord's elements.
            elements: {
                createVerticalPanel: function() {
                    return createElement("div")
                        .withClass(panels2.vertical, 'epButtonPanel')
                },
                createHorizontalPanel: function() {
                    return createElement("div")
                        .withClass(panels.horizontal, 'epButtonPanel')
                },
                createButton: function(name) {
                    return createElement('button')
                        .withContents(name)
                        .withClass(
                            buttons.button,
                            buttons.lookFilled,
                            buttons.colorBrand,
                            buttons.sizeSmall,
                            buttons.grow,
                            'epMargin'
                        );
                },
                createWarnButton: function(name) {
                    return createElement('button')
                        .withContents(name)
                        .withClass(
                            buttons.button,
                            buttons.lookOutlined,
                            buttons.colorYellow,
                            buttons.sizeSmall,
                            buttons.grow,
                            'epMargin'
                        );
                },
                createDangerButton: function(name) {
                    return createElement('button')
                        .withContents(name)
                        .withClass(
                            buttons.button,
                            buttons.lookOutlined,
                            buttons.colorRed,
                            buttons.sizeSmall,
                            buttons.grow,
                            'epMargin'
                        );
                },
                createH2: function(text) {
                    return createElement("h2")
                        .withClass(
                            headers.h2,
                            headers.title,
                            headers.size16,
                            headers.height20,
                            headers.weightSemiBold,
                            headers.defaultColor,
                            'epMargin'
                        )
                        .withText(text);
                },
                createH5: function(text) {
                    return createElement("h5")
                        .withClass(
                            headers.h5,
                            headers.title,
                            headers.size12,
                            headers.height16,
                            headers.weightSemiBold
                        )
                        .withText(text);
                },
                createInput: function(v) {
                    return createElement("input")
                        .withClass(
                            misc.inputDefault,
                            misc.input,
                            misc.size16,
                            'epMargin'
                        )
                        .modify(x => x.value = v)
                },
                updateSwitch: function(s, w) {
                    if (s.checked) {
                        w.classList.remove(checkboxes.valueUnchecked.split(' ')[0]);
                        w.classList.add(checkboxes.valueChecked.split(' ')[0])
                    }
                    else {
                        w.classList.remove(checkboxes.valueChecked.split(' ')[0]);
                        w.classList.add(checkboxes.valueUnchecked.split(' ')[0])
                    }
                },
                createSwitch: function(c, i) {
                    if (c === undefined) c = () => { };
                    if (i === undefined) i = false;
                    var s, w = createElement('div')
                        .withClass(
                            checkboxes.switch,
                            checkboxes.switchEnabled,
                            checkboxes.size,
                            checkboxes.sizeDefault,
                            checkboxes.themeDefault
                        )
                        .withChildren(
                            s = createElement("input")
                                .withClass(
                                    checkboxes.checkbox,
                                    checkboxes.checkboxEnabled
                                )
                                .modify(x => x.type = 'checkbox')
                                .modify(x => x.checked = i)
                                .modify(x => x.onchange = () => {
                                    updateSwitch(s, w);
                                    c(s.checked);
                                })
                        )
                    $settingsapi.elements.updateSwitch(s, w);
                    return w;
                }
            }
        }

        //Example settings tab
        /*$settingsapi.addSection("TESTING","test owo",function(pnl){
            $settingsapi.elements.createH2("Hello World!").appendTo(pnl);
        });*/

        $api.events.hook("USER_SETTINGS_MODAL_SET_SECTION", function(e){
            if ($settingsapi._panels[e.section]) $settingsapi._panels[e.section].remove();

            for(let i in $settingsapi.ourSections){
                let data = $settingsapi.ourSections[i];
                if(e.section == data.section){
                    var pane = $(".content-column.default");
                    if (!pane) return;

                    $settingsapi._panels[data.section] = createElement('div')
                    .withClass('flex-vertical')
                    .appendTo(pane);

                    $settingsapi._callbacks[data.section]($settingsapi._panels[data.section]);
                }
            }
        });
    }
}