(this.webpackJsonpsim=this.webpackJsonpsim||[]).push([[0],{41:function(r,e,t){},49:function(r,e,t){"use strict";t.r(e);var a=t(2),n=t(0),o=t.n(n),c=t(9),d=t.n(c),s=t(32),i=t(64),f=(t(41),t(3)),l=t(27),u=t(33),b=t(5),m=t(66),g={offsetBottom:function(r,e){return I(e,r.first)},offsetTop:function(r,e){return I(e,r.last)},halfRoadLeft:function(r,e){return R(e.roadWidth/2,r.angle-90)},halfRoadRight:function(r,e){return R(e.roadWidth/2,r.angle+90)},laneBottomLeft:function(r,e,t){return I(g.halfRoadLeft(e,t),g.offsetBottom(r,t))},laneTopLeft:function(r,e,t){return I(g.halfRoadLeft(e,t),g.offsetTop(r,t))},laneBottomRight:function(r,e,t){return I(g.halfRoadRight(e,t),g.offsetBottom(r,t))},laneTopRight:function(r,e,t){return I(g.halfRoadRight(e,t),g.offsetTop(r,t))},roadBottomLeft:function(r,e){return I(I(r.backward[0].first,e),g.halfRoadLeft(r,e))},roadBottomRight:function(r,e){return I(I(r.forward[r.forward.length-1].first,e),g.halfRoadRight(r,e))},roadTopLeft:function(r,e){return I(I(r.backward[0].last,e),g.halfRoadLeft(r,e))},roadTopRight:function(r,e){return I(I(r.forward[r.forward.length-1].last,e),g.halfRoadRight(r,e))},roadTopMiddle:function(r,e){return I(R(e.roadLength,r.angle),I(R((r.numberOfForward+r.numberOfBackward)*e.roadWidth/2,r.angle+90),g.roadBottomLeft(r,e)))}};function h(r){if(!r||!r.length)return null;var e,t="",a=Object(b.a)(r);try{for(a.s();!(e=a.n()).done;){var n=e.value;if(t+=n.letter+" ",n.coords){var o,c=Object(b.a)(n.coords);try{for(c.s();!(o=c.n()).done;){var d=o.value;t+=d.x+" "+d.y+" "}}catch(s){c.e(s)}finally{c.f()}}}}catch(s){a.e(s)}finally{a.f()}return t}function j(r){var e=r.accept,t=r.onDrop,n=r.indexRoad,o=r.children,c=r.side,d=Object(m.a)({accept:e,drop:function(r){return t(r,n,c)}}),s=Object(f.a)(d,2)[1];return Object(a.jsx)("g",{ref:s,children:o})}function v(r){var e=r.string,t=r.side,n=r.indexLane,o=r.indexRoad,c=r.accept,d=r.onDrop,s=Object(m.a)({accept:c,drop:function(r){return d(r,o,t,n)}}),i=Object(f.a)(s,2)[1];return Object(a.jsx)("path",{ref:i,d:e,className:t+"-asphalt"},n)}function p(r){var e=r.points,t=r.coordInfo,n=r.disabled;if(!e||!t||void 0!==n&&n)return null;for(var o={strings:{forward:[],backward:[]},elements:{}},c=function(){var r,n=s[d],c=Object(b.a)(e);try{for(c.s();!(r=c.n()).done;){var i,f=r.value,l=Object(b.a)(f[n]);try{for(l.s();!(i=l.n()).done;){var u=i.value;o.strings[n].push([g.offsetBottom(u,t),g.offsetTop(u,t)])}}catch(m){l.e(m)}finally{l.f()}}}catch(m){c.e(m)}finally{c.f()}o.elements[n]=o.strings[n].map((function(r,e){return Object(a.jsx)("line",{x1:r[0].x,y1:r[0].y,x2:r[1].x,y2:r[1].y,className:n+"-debug"},e)}))},d=0,s=["forward","backward"];d<s.length;d++)c();return Object(a.jsxs)("g",{children:[o.elements.forward,o.elements.backward]})}function O(r){var e=r.points,t=r.coordInfo;if(!e||!t)return null;for(var n={elements:{},strings:{continous:[],striped:[]}},o=0,c=["forward","backward"];o<c.length;o++){var d,s=c[o],i=Object(b.a)(e);try{for(i.s();!(d=i.n()).done;){var l,u=d.value,m=Object(b.a)(u[s].entries());try{for(m.s();!(l=m.n()).done;){var h=Object(f.a)(l.value,2),j=h[0],v=h[1];j===u[s].length-1&&"backward"!==s||(j===u[s].length-1&&"backward"===s?n.strings.continous.push([g.laneBottomRight(v,u,t),g.laneTopRight(v,u,t)]):n.strings.striped.push([g.laneBottomRight(v,u,t),g.laneTopRight(v,u,t)]))}}catch(p){m.e(p)}finally{m.f()}}}catch(p){i.e(p)}finally{i.f()}}return n.elements.continous=n.strings.continous.map((function(r,e){return Object(a.jsx)("line",{x1:r[0].x,y1:r[0].y,x2:r[1].x,y2:r[1].y,className:"line"},e)})),n.elements.striped=n.strings.striped.map((function(r,e){return Object(a.jsx)("line",{x1:r[0].x,y1:r[0].y,x2:r[1].x,y2:r[1].y,className:"line",strokeDasharray:"30, 60"},e)})),Object(a.jsxs)("g",{children:[n.elements.continous,n.elements.striped]})}function w(r){var e=r.points,t=r.coordInfo,n=r.rotateBind;if(!(e&&t&&n))return null;var o,c={strings:[]},d=Object(b.a)(e);try{for(d.s();!(o=d.n()).done;){var s=o.value;c.strings.push({vectors:g.roadTopMiddle(s,t),order:s.order})}}catch(i){d.e(i)}finally{d.f()}return c.elements=c.strings.map((function(r,e){return Object(a.jsx)("circle",Object(u.a)({cx:r.vectors.x,cy:r.vectors.y,r:"10",className:"rotate"},n(r.order)),e)})),Object(a.jsx)("g",{children:c.elements})}function x(r){var e=r.points,t=r.coordInfo,n=r.addLanes;if(!e||!t)return null;var o,c={strings:{forward:{remove:[],add:[]},backward:{remove:[],add:[]}},elements:{forward:{remove:[],add:[]},backward:{remove:[],add:[]}}},d=Object(b.a)(e);try{for(d.s();!(o=d.n()).done;){var s=o.value;c.strings.forward.remove.push(I(g.roadBottomLeft(s,t),R(t.roadLength/3,s.angle))),c.strings.forward.add.push(I(g.roadBottomLeft(s,t),R(2*t.roadLength/3,s.angle))),c.strings.backward.remove.push(I(g.roadBottomRight(s,t),R(t.roadLength/3,s.angle))),c.strings.backward.add.push(I(g.roadBottomRight(s,t),R(2*t.roadLength/3,s.angle)))}}catch(i){d.e(i)}finally{d.f()}return c.elements.forward.remove=c.strings.forward.remove.map((function(r,e){return Object(a.jsx)("circle",{cx:r.x,cy:r.y,r:"10",className:"add-lane",onClick:function(){return n(e,"Forward",-1)}},e)})),c.elements.forward.add=c.strings.forward.add.map((function(r,e){return Object(a.jsx)("circle",{cx:r.x,cy:r.y,r:"10",className:"add-lane",onClick:function(){return n(e,"Forward",1)}},e)})),c.elements.backward.remove=c.strings.backward.remove.map((function(r,e){return Object(a.jsx)("circle",{cx:r.x,cy:r.y,r:"10",className:"add-lane",onClick:function(){return n(e,"Backward",-1)}},e)})),c.elements.backward.add=c.strings.backward.add.map((function(r,e){return Object(a.jsx)("circle",{cx:r.x,cy:r.y,r:"10",className:"add-lane",onClick:function(){return n(e,"Backward",1)}},e)})),Object(a.jsxs)("g",{children:[c.elements.forward.remove,c.elements.forward.add,c.elements.backward.remove,c.elements.backward.add]})}function y(r){var e=r.points,t=r.coordInfo;if(!e||!t)return null;var n={};n.string=h([{letter:"M",coords:[g.roadBottomLeft(e[0],t)]}]);var o,c=Object(b.a)(e);try{for(c.s();!(o=c.n()).done;){var d=o.value;n.string+=h([{letter:"L",coords:[g.roadBottomLeft(d,t),g.roadBottomRight(d,t)]}])}}catch(s){c.e(s)}finally{c.f()}return n.element=Object(a.jsx)("path",{d:n.string,className:"center"}),n.element}function k(r){var e=r.points,t=r.coordInfo;if(!e||!t)return null;var n={};n.string=h([{letter:"M",coords:[g.roadBottomLeft(e[0],t)]}]);var o,c=Object(b.a)(e.entries());try{for(c.s();!(o=c.n()).done;){var d=Object(f.a)(o.value,2),s=d[0],i=d[1];n.string+=h([{letter:"L",coords:[g.roadBottomLeft(i,t),g.roadTopLeft(i,t)]},{letter:"M",coords:[g.roadTopRight(i,t)]},{letter:"L",coords:[g.roadBottomRight(i,t)]}]),s===e.length-1&&(n.string+=h([{letter:"L",coords:[g.roadBottomLeft(e[0],t)]}]))}}catch(l){c.e(l)}finally{c.f()}return n.element=Object(a.jsx)("path",{d:n.string,className:"curb"}),n.element}var B=t(43);function L(){var r=Object(n.useRef)(),e=Object(n.useState)({}),t=Object(f.a)(e,2),o=t[0],c=t[1],d=Object(n.useState)([{numberOfBackward:1,numberOfForward:2,angle:0,order:0},{numberOfBackward:1,numberOfForward:1,angle:110,order:1},{numberOfBackward:2,numberOfForward:3,angle:170,order:2},{numberOfBackward:1,numberOfForward:1,angle:300,order:3}]),s=Object(f.a)(d,2),i=s[0],u=s[1],m=Object(l.a)((function(r){var e=r.event,t=Object(f.a)(r.args,1)[0];if(e.x&&e.y){var a=I(e,function(r,e){var t=r.x*e,a=r.y*e;return{x:t,y:a}}(o,-1)),n=Math.atan2(a.y,a.x)*(180/Math.PI);(n%=360)<0&&(n+=360);var c=B.cloneDeep(i);c.sort((function(r,e){return r.angle-e.angle}));for(var d=0;d<c.length;d++)t===c[d].order&&(c[d].angle=n);u(c)}}));Object(n.useEffect)((function(){function e(){var e=function(r,e){if(!r.current)return null;var t=r.current.getBoundingClientRect(),a=(t.right-t.left)/2,n=(t.bottom-t.top)/2,o=Math.max.apply(Math,e.map((function(r){return r.numberOfForward+r.numberOfBackward}))),c=Math.min(a,n);return{x:a,y:n,roadLength:c/2,roadWidth:c/o*.5,maxRoadWidth:o}}(r,i);c(e)}return e(),window.addEventListener("resize",e),function(){window.removeEventListener("resize",e)}}),[r,i]);var L=function(r,e){var t=[];if(!(e&&e.roadLength&&e.roadWidth))return null;for(var a=0;a<r.length;a++){var n=r[a],o=(n.numberOfForward+n.numberOfBackward-1)*e.roadWidth/2;t[a]={forward:[],backward:[],maxDistance:o,angle:n.angle,order:n.order,numberOfForward:n.numberOfForward,numberOfBackward:n.numberOfBackward};for(var c=n.numberOfForward+n.numberOfBackward,d=0;d<c;d++){var s=I(R(o-d*e.roadWidth,n.angle-90),R(e.maxRoadWidth*e.roadWidth*.7,n.angle)),i=I(s,R(e.roadLength,n.angle));d>=n.numberOfForward?t[a].forward.push({first:s,last:i}):t[a].backward.push({first:s,last:i})}}return t}(i,o),N=Object(n.useState)([{backward:[],forward:[]},{backward:[],forward:[]},{backward:[],forward:[]},{backward:[],forward:[]}]),T=Object(f.a)(N,2),M=T[0],D=T[1];console.log(M);var F=function(r){var e=r.points,t=r.coordInfo,n=r.handleSignDrop,o=r.handleCarDrop;if(!e||!t)return null;var c,d={forward:[],backward:[]},s=Object(b.a)(e.entries());try{var i=function(){for(var r=Object(f.a)(c.value,2),e=r[0],s=r[1],i={forward:[],backward:[]},l=0,u=["forward","backward"];l<u.length;l++){var m,p=u[l],O=Object(b.a)(s[p]);try{for(O.s();!(m=O.n()).done;){var w=m.value;i[p].push(h([{letter:"M",coords:[g.offsetBottom(w,t)]},{letter:"L",coords:[g.laneBottomLeft(w,s,t),g.laneTopLeft(w,s,t),g.laneTopRight(w,s,t),g.laneBottomRight(w,s,t)]},{letter:"Z"}]))}}catch(B){O.e(B)}finally{O.f()}}for(var x=function(){var r=k[y];d[r].push(Object(a.jsx)(j,{indexRoad:e,accept:["sign"],side:r,onDrop:function(t){return n(t,e,r)},children:i[r].map((function(t,n){return Object(a.jsx)(v,{string:t,side:r,indexLane:n,indexRoad:e,accept:["car"],onDrop:function(t){return o(t,e,r,n)}},n)}))},e))},y=0,k=["forward","backward"];y<k.length;y++)x()};for(s.s();!(c=s.n()).done;)i()}catch(l){s.e(l)}finally{s.f()}return d}({points:L,coordInfo:o,handleSignDrop:function(r,e,t){if("forward"===t){var a=B.cloneDeep(M);a[e].signs||(a[e].signs=[]),a[e].signs.push(r),D(a)}},handleCarDrop:function(r,e,t,a){var n=B.cloneDeep(M);n[e][t][a]||(n[e][t][a]=[]),n[e][t][a].push(r),D(n)}});return Object(a.jsx)("div",{style:{touchAction:"none"},children:Object(a.jsxs)("svg",{className:"artboard",ref:r,children:[Object(a.jsxs)("g",{children:[F?F.backward:null,F?F.forward:null]}),Object(a.jsx)(y,{points:L,coordInfo:o}),Object(a.jsx)(k,{points:L,coordInfo:o}),Object(a.jsx)(O,{points:L,coordInfo:o}),Object(a.jsx)(p,{points:L,coordInfo:o,disabled:!0}),Object(a.jsx)(w,{points:L,coordInfo:o,rotateBind:m}),Object(a.jsx)(x,{points:L,coordInfo:o,addLanes:function(r,e,t){var a=B.cloneDeep(i);(a[r]["numberOf"+e]>1||t>0)&&(a[r]["numberOf"+e]+=t),u(a)}})]})})}function R(r,e){var t=e*Math.PI/180;return{x:r*Math.cos(t),y:r*Math.sin(t)}}function I(r,e){return{x:r.x+e.x,y:r.y+e.y}}var N=t(65),T=t(67),M=t.p+"static/media/forward.fc55a6c4.svg",D=t.p+"static/media/give way.db0b54fd.svg",F=t.p+"static/media/left.1aa9e07d.svg",W=t.p+"static/media/right.ff8f1205.svg",C=t.p+"static/media/stop.4938481c.svg",S=t.p+"static/media/priority.1971fe2a.svg";function E(){var r=[M,D,F,W,C,S].map((function(r,e){return Object(a.jsx)(J,{src:r,index:e},e)}));return Object(a.jsxs)("div",{className:"inventory",children:[r,Object(a.jsx)(z,{})]})}function z(){var r=Object(T.a)({item:{id:"car",type:"car"}}),e=Object(f.a)(r,2)[1];return Object(a.jsx)("div",{className:"drag",ref:e,children:Object(a.jsx)("div",{className:"item car",draggable:!1})})}function J(r){var e=r.src,t=r.index,n=Object(T.a)({item:{id:t,type:"sign"}}),o=Object(f.a)(n,2)[1];return Object(a.jsx)(N.a,{className:"drag",ref:o,children:Object(a.jsx)("img",{src:e,className:"item sign",alt:e,draggable:!1})})}function P(){return Object(a.jsxs)(a.Fragment,{children:[Object(a.jsx)(E,{}),Object(a.jsx)(L,{})]})}d.a.render(Object(a.jsx)(o.a.StrictMode,{children:Object(a.jsx)(i.a,{backend:s.a,children:Object(a.jsx)(P,{})})}),document.getElementById("root"))}},[[49,1,2]]]);
//# sourceMappingURL=main.3c5d844c.chunk.js.map