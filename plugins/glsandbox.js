shwatcher = null, shtag = null, setupShaders = function (n) {
    var e = fs.readFileSync(n, "utf-8");
    null === shtag && (shtag = document.createElement("script").modify(x=>x.type ="x-shader/x-vertex").withId('shaderCode'), document.head.appendChild(shtag)), shtag.innerHTML = e, null === shwatcher && (shwatcher = fs.watch(n, {
        encoding: "utf-8"
    }, function (e, w) {
        if ("change" === e) {
            var i = fs.readFileSync(n, "utf-8");
            shtag.innerHTML = i
            compile();
        }
    }))
};

exports = {
    manifest: {
        author: "Cynosphere",
        name: "GLSandboxBG",
        description: "GL shaders as a background",
    },
    start: function(){
        createElement('script')
        .modify(x=>{
            x.type = 'text/javascript';
            x.src = 'https://rawgit.com/Cynosphere/42aec2ef76646dc52cff435cc5447f48/raw/36c3c45abee126f8550d3f3fc039b3136ab92c90/glsandbox.js?_='+Date.now();
        })
        .appendTo(document.head);

        createElement('script')
        .withId('surfaceVertexShader')
        .modify(x=>x.type = 'x-shader/x-vertex')
        .withContents(`attribute vec3 position;
attribute vec2 surfacePosAttrib;
varying vec2 surfacePosition;

void main() {
    surfacePosition = surfacePosAttrib;
    gl_Position = vec4( position, 1.0 );
}`)
        .appendTo(document.head);

        createElement('script')
        .withId('fragmentShader')
        .modify(x=>x.type = 'x-shader/x-vertex')
        .withContents(`#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform sampler2D texture;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    gl_FragColor = texture2D( texture, uv );
}`)
        .appendTo(document.head);

        createElement('script')
        .withId('vertexShader')
        .modify(x=>x.type = 'x-shader/x-vertex')
        .withContents(`attribute vec3 position;

void main() {
    gl_Position = vec4( position, 1.0 );
}`)
        .appendTo(document.head);

        createElement('canvas')
        .withId("glsandbox")
        .modify(x=>{
            x.style.height = "100%";
            x.style.width = "100%";
            x.style.top = 0;
            x.style.left = 0;
            x.style.position = "absolute";
            x.style["z-index"] = 0;
        })
        .appendTo($('[class^="app-"]'));

        $(".app").modify(x=>x.style['z-index']=1);

        if(!$api.localStorage.get('glsbbg_firstrun')){
            console.log("%c[GLSandboxBG] ","font-weight:bold;background: linear-gradient(to bottom right, #c080ff, #ff80c0);-webkit-background-clip: text;-webkit-text-fill-color: transparent;",`To edit the shader, edit the file located in \`${$api.data}shader.frag\``);
            console.log("%c[GLSandboxBG] ","font-weight:bold;background: linear-gradient(to bottom right, #c080ff, #ff80c0);-webkit-background-clip: text;-webkit-text-fill-color: transparent;","If the file doesn't exist, just create it.");
            $api.localStorage.set('glsbbg_firstrun',true);
        }

        if (fs.existsSync($api.data + 'shader.frag'))
            setupShaders($api.data + 'shader.frag');

        document.addEventListener("ep-ready",_=>{
            setTimeout(_=>{
                initGLSB();
                if (gl) animate();
            },500);
        });
    }
}