exports = {
    manifest: {
        author: "Cynosphere, BlockBuilder57",
        name: "Settings API",
        description: "Hijack the settings menu in any way you feel.",
        replacements: [
            {signature:'/function (.)\\(\\){return\\[{(.+)}]}/',payload:'window.$settingsapi={sections:[{$2}]};function $1(){return window.$settingsapi.sections;}'}
        ]
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
            addSection: function(name,label,color=null,callback){
                let data = {};

                data.section = name || `SAPI_${Math.floor(Math.random()*10000)}`;
                data.label = label;
                data.color = color;
                data.element = $api.util.findConstructor('FormSection', 'FormSection').FormSection;

                $settingsapi.ourSections.push(data);
                $settingsapi.sections.splice($settingsapi.sections.length-4,0,data);
                $settingsapi._callbacks[name] = callback;
            },
            addDivider: function(){
                $settingsapi.ourSections.push({section:"DIVIDER"});
                $settingsapi.sections.splice($settingsapi.sections.length-4,0,{section:"DIVIDER"});
            },
            addHeader: function(label){
                $settingsapi.ourSections.push({section:"HEADER",label:label});
                $settingsapi.sections.splice($settingsapi.sections.length-4,0,{section:"HEADER",label:label});
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
                createInput: function(v, p) {
                    return createElement("input")
                        .withClass(
                            misc.inputDefault,
                            misc.input,
                            misc.size16,
                            'epMargin'
                        )
                        .modify(x => x.value = v ? v : "")
                        .modify(x => x.placeholder = p ? p : "")
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
                                    $settingsapi.elements.updateSwitch(s, w);
                                    c(s.checked);
                                })
                        )
                    $settingsapi.elements.updateSwitch(s, w);
                    return w;
                },
                internal:{
                    panels:panels,
                    panels2:panels2,
                    buttons:buttons,
                    checkboxes:checkboxes,
                    misc:misc,
                    misc2:misc2,
                    headers:headers
                }
            }
        }

        //Example settings tab
        $settingsapi.addDivider();
        $settingsapi.addHeader("Element Testing");
        $settingsapi.addSection("TESTING","Element Test Page",null,function(pnl){
            let em = $settingsapi.elements;
            em.createH2("Hello World! Heading 2").appendTo(pnl);
            em.createH5("Hello World! Heading 5").appendTo(pnl);
            em.createButton("Button!").appendTo(pnl);
            em.createWarnButton("Warning Button!").appendTo(pnl);
            em.createDangerButton("Danger Button!").appendTo(pnl);
            em.createInput("","Input Box!").appendTo(pnl);
            em.createSwitch().appendTo(pnl);

            let v = em.createVerticalPanel().appendTo(pnl);
            let h = em.createHorizontalPanel().appendTo(pnl);

            em.createH2("Vertical Panel!").appendTo(v);
            em.createButton("Beep Boop").appendTo(v);

            em.createH2("Horizontal Panel!").appendTo(h);
            em.createButton("Boop Beep").appendTo(h);
        });

        function setupSettings(e){
            for(let i in $settingsapi._panels){
                $settingsapi._panels[i].remove();
            }

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
        }

        $api.events.hook("USER_SETTINGS_MODAL_SET_SECTION",setupSettings);
        $api.events.hook("USER_SETTINGS_MODAL_INIT",e=>setTimeout(_=>setupSettings(e),200));
    }
}