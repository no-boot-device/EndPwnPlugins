exports.manifest = {
    author: "Cynosphere, Jiiks",
    name: "Double Click Edit",
    description: "Double click messages to edit them. Hold ctrl while double clicking to copy message contents."
}
exports.start = function(){
    document.addEventListener("dblclick", ev => {
        let target = ev.target;
        console.log(target);
        if(target && target.className && (target.className.includes("markup") || target.className.includes("hljs") || targe.className.includes("inline"))) {
            let msg = target;
            if(!ev.ctrlKey){
                let opt = msg.parentNode.parentNode.className.includes("markup") ? msg.parentNode.parentNode.parentNode.querySelector(".btn-option") : msg.parentNode.querySelector(".btn-option");
                opt.click();
                let options = document.querySelectorAll(".option-popout .btn-item");
                for(i in options){
                    let o = options[i];
                    if(o.innerHTML == "Edit") o.click();
                }
            }else{
                var range = document.createRange();
                range.selectNode(msg);
                window.getSelection().addRange(range);
                try {
                    for(var i=0;i<5;i++){
                        document.execCommand('copy');
                    }
                } catch (err) {
                    console.log(err);
                }
                window.getSelection().removeRange(range);
            }
        }
    });
}