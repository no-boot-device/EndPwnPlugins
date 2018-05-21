exports.manifest = {
    author: "Cynosphere, Jiiks",
    name: "Double Click Edit",
    description: "Double click messages to edit them."
}
exports.start = function(){
    document.addEventListener("dblclick", ev => {
        let target = ev.target;
        if(target && target.className && target.className.includes("markup")) {
            let msg = target;
            let opt = msg.parentNode.querySelector(".btn-option");
            opt.click();
            let options = document.querySelectorAll(".option-popout .btn-item");
            for(i in options){
                let o = options[i];
                if(o.innerHTML == "Edit") o.click();
            }
        }
    });
}