parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"m114":[function(require,module,exports) {
AFRAME.registerSystem("render-order",{schema:{type:"array"},init:function(){this.el.renderer.sortObjects=!0},update:function(){for(this.order={},i=0;i<this.data.length;i++)this.order[this.data[i]]=i}}),AFRAME.registerComponent("render-order",{schema:{type:"string"},multiple:!0,init:function(){this.set=this.set.bind(this),this.el.addEventListener("object3dset",e=>{"nonrecursive"!==this.id&&e.detail.object.traverse(this.set)})},update:function(){"nonrecursive"===this.id?this.set(this.el.object3D):this.el.object3D.traverse(this.set)},set:function(e){isNaN(this.data)?e.renderOrder=this.system.order[this.data]:e.renderOrder=parseFloat(this.data)}}),AFRAME.registerComponent("render-order-recursive",{init:function(){this.el.addEventListener("child-attached",e=>{e.detail.el.setAttribute("render-order",this.el.getAttribute("render-order"))})}});
},{}]},{},["m114"], null)
//# sourceMappingURL=/transparent-occlude.008d451b.js.map