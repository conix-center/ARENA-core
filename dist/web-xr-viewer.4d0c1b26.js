parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"iX0f":[function(require,module,exports) {
function e(t){let o=window.importScript.__db[t];if(void 0===o){const n=t.replace("'","\\'"),i=Object.assign(document.createElement("script"),{type:"module",textContent:`import * as x from '${n}'; importScript.__db['${n}'].resolve(x);`});(o=e.__db[t]={}).promise=new Promise((e,t)=>{o.resolve=e,i.onerror=t}),document.head.appendChild(i),i.remove()}return o.promise}e.__db={},window.importScript=e,window.addEventListener("enter-vr",function(e){if(document.querySelector("a-scene").is("ar-mode")){if(window.lastMouseTarget=void 0,navigator.userAgent.includes("WebXRViewer")){const e=document.createElement("script");e.onload=(async()=>{await ARENAUtils.importScript("./src/apriltag/script.js")}),e.src="./src/apriltag/base64_binary.js",document.head.appendChild(e),document.addEventListener("mousedown",function(e){if(window.lastMouseTarget){const e=window.ARENA.sceneObjects[window.lastMouseTarget],t=new THREE.Vector3;e.object3D.getWorldPosition(t);const o={x:t.x,y:t.y,z:t.z};e.emit("mousedown",{clicker:window.ARENA.camName,intersection:{point:o},cursorEl:!0},!1)}}),document.addEventListener("mouseup",function(e){if(window.lastMouseTarget){const e=window.ARENA.sceneObjects[window.lastMouseTarget],t=new THREE.Vector3;e.object3D.getWorldPosition(t);const o={x:t.x,y:t.y,z:t.z};e.emit("mouseup",{clicker:window.ARENA.camName,intersection:{point:o},cursorEl:!0},!1)}});let t=document.getElementById("mouseCursor");const o=t.parentNode;o.removeChild(t),(t=document.createElement("a-cursor")).setAttribute("fuse",!1),t.setAttribute("scale","0.1 0.1 0.1"),t.setAttribute("position","0 0 -0.1"),t.setAttribute("color","#333"),t.setAttribute("max-distance","10000"),t.setAttribute("id","fuse-cursor"),o.appendChild(t)}document.getElementById("env").setAttribute("visible",!1)}});
},{}]},{},["iX0f"], null)
//# sourceMappingURL=/web-xr-viewer.4d0c1b26.js.map