(this.webpackJsonpsim=this.webpackJsonpsim||[]).push([[0],{23:function(r,a,e){},28:function(r,a,e){"use strict";e.r(a);var t=e(1),n=e(0),d=e.n(n),o=e(12),s=e.n(o),c=(e(23),e(8)),i=e(11),l=e(40);function u(r,a){var e=a*Math.PI/180;return{x:r*Math.cos(e),y:r*Math.sin(e)}}function f(r,a){return{x:r.x+a.x,y:r.y+a.y}}function b(r){var a=Object(n.useRef)(),e=r.roadInfo,d=Object(n.useState)({}),o=Object(i.a)(d,2),s=o[0],b=o[1];Object(n.useEffect)((function(){function r(){var r=function(r,a){if(!r.current)return null;var e=r.current.getBoundingClientRect(),t=(e.right-e.left)/2,n=(e.bottom-e.top)/2,d=Math.max.apply(Math,a.map((function(r){return r.numberOfForward+r.numberOfBackward}))),o=Math.min(t,n);return{x:t,y:n,roadLength:o/2,roadWidth:o/d*.5,maxRoadWidth:d}}(a,e);b(r)}return r(),window.addEventListener("resize",r),function(){window.removeEventListener("resize",r)}}),[a,e]);var w=function(r,a){var e={debug:{elements:{forward:[],backward:[]},strings:{forward:[],backward:[]}},asphalt:{elements:{forward:[],backward:[]},strings:{forward:[],backward:[]}}};if(!r||!a)return null;var n,d="",o=Object(c.a)(r.entries());try{for(o.s();!(n=o.n()).done;){var s=Object(i.a)(n.value,2),l=s[0],b=s[1];h(b,e,"forward","debug",a),h(b,e,"backward","debug",a),h(b,e,"forward","asphalt",a),h(b,e,"backward","asphalt",a);var w=f(f(b.backward[0].first,a),u(a.roadWidth/2,b.angle-90)),g=f(f(b.forward[b.forward.length-1].first,a),u(a.roadWidth/2,b.angle+90));0===l&&(d+="M "+w.x+" "+w.y+" "),d+="L "+w.x+" "+w.y+" ",d+="L "+g.x+" "+g.y+" "}}catch(m){o.e(m)}finally{o.f()}return e.center=Object(t.jsx)("path",{d:d,className:"forward-asphalt"}),e}(function(r,a){var e=[];if(!(a&&a.roadLength&&a.roadWidth))return null;for(var t=0;t<r.length;t++){var n=r[t];e[t]={forward:[],backward:[],angle:n.angle};for(var d=(n.numberOfForward+n.numberOfBackward-1)*a.roadWidth/2,o=n.numberOfForward+n.numberOfBackward,s=0;s<o;s++){var c=f(u(d-s*a.roadWidth,n.angle-90),u(a.maxRoadWidth*a.roadWidth*.8,n.angle)),i=f(c,u(a.roadLength,n.angle));s>=n.numberOfBackward?e[t].forward.push({first:c,last:i}):e[t].backward.push({first:c,last:i})}}return e}(e,s),s);return Object(t.jsxs)("svg",{id:"artboard",ref:a,children:[w?w.asphalt.elements.forward:null,w?w.asphalt.elements.backward:null,w?w.center:null,w?null:Object(t.jsx)(l.a,{children:"Loading"})]})}function h(r,a,e,n,d){switch(n){case"asphalt":var o,s=Object(c.a)(r[e]);try{for(s.s();!(o=s.n()).done;){var i=o.value,l="",b=f(d,i.first),h=f(u(d.roadWidth/2,r.angle-90),b),w=f(f(d,i.last),u(d.roadWidth/2,r.angle-90)),g=f(u(d.roadWidth,r.angle+90),w),m=f(u(d.roadWidth/2,r.angle+90),b);l+="M "+b.x+" "+b.y+" ",l+="L "+h.x+" "+h.y+" ",l+="L "+w.x+" "+w.y+" ",l+="L "+g.x+" "+g.y+" ",l+="L "+m.x+" "+m.y+" ",a[n].strings[e].push(l)}}catch(v){s.e(v)}finally{s.f()}a[n].elements[e]=a[n].strings[e].map((function(r,a){return Object(t.jsx)("path",{d:r,className:e+"-"+n},a)}));break;case"debug":var x,y=Object(c.a)(r[e]);try{for(y.s();!(x=y.n()).done;){var O=x.value,j={x1:d.x+O.first.x,y1:d.y+O.first.y,x2:d.x+O.last.x,y2:d.y+O.last.y};a[n].strings[e].push(j)}}catch(v){y.e(v)}finally{y.f()}a[n].elements[e]=a[n].strings[e].map((function(r,a){return Object(t.jsx)("line",{x1:r.x1,y1:r.y1,x2:r.x2,y2:r.y2,className:e+"-"+n},a)}));break;default:console.error("Wrong road layer")}}function w(){return Object(t.jsx)(t.Fragment,{children:Object(t.jsx)(b,{roadInfo:[{numberOfForward:1,numberOfBackward:1,angle:10},{numberOfForward:1,numberOfBackward:1,angle:110},{numberOfForward:2,numberOfBackward:2,angle:180},{numberOfForward:1,numberOfBackward:1,angle:300}]})})}s.a.render(Object(t.jsx)(d.a.StrictMode,{children:Object(t.jsx)(w,{})}),document.getElementById("root"))}},[[28,1,2]]]);
//# sourceMappingURL=main.190b2f53.chunk.js.map