(this.webpackJsonpsim=this.webpackJsonpsim||[]).push([[0],{14:function(e,r,t){},15:function(e,r,t){"use strict";t.r(r);var n=t(0),a=t(1),o=t.n(a),s=t(7),c=t.n(s),d=(t(14),t(3)),l=t(2),i=t(8),u=t(4);function f(e){if(!e||!e.length)return null;var r,t="",n=Object(u.a)(e);try{for(n.s();!(r=n.n()).done;){var a=r.value;if(t+=a.letter+" ",a.coords){var o,s=Object(u.a)(a.coords);try{for(s.s();!(o=s.n()).done;){var c=o.value;t+=c.x+" "+c.y+" "}}catch(d){s.e(d)}finally{s.f()}}}}catch(d){n.e(d)}finally{n.f()}return t}function m(e){var r=Object(a.useRef)(),t=Object(a.useState)({}),o=Object(l.a)(t,2),s=o[0],c=o[1],m=Object(a.useState)([{numberOfBackward:1,numberOfForward:2,angle:0,order:0},{numberOfBackward:1,numberOfForward:1,angle:110,order:1},{numberOfBackward:2,numberOfForward:3,angle:170,order:2},{numberOfBackward:1,numberOfForward:1,angle:300,order:3}]),g=Object(l.a)(m,2),w=g[0],p=g[1],O=Object(i.a)((function(e){var r=e.event,t=Object(l.a)(e.args,1)[0];if(r.x&&r.y){var n=h(r,function(e,r){var t=e.x*r,n=e.y*r;return{x:t,y:n}}(s,-1)),a=Math.atan2(n.y,n.x)*(180/Math.PI);(a%=360)<0&&(a+=360);var o=w.map((function(e){return Object(d.a)({},e)}));o.sort((function(e,r){return e.angle-r.angle}));for(var c=0;c<o.length;c++)t===o[c].order&&(o[c].angle=a);p(o)}}));Object(a.useEffect)((function(){function e(){var e=function(e,r){if(!e.current)return null;var t=e.current.getBoundingClientRect(),n=(t.right-t.left)/2,a=(t.bottom-t.top)/2,o=Math.max.apply(Math,r.map((function(e){return e.numberOfForward+e.numberOfBackward}))),s=Math.min(n,a);return{x:n,y:a,roadLength:s/2,roadWidth:s/o*.6,maxRoadWidth:o}}(r,w);c(e)}return e(),window.addEventListener("resize",e),function(){window.removeEventListener("resize",e)}}),[r,w]);var x=function(e,r,t,a){if(!e||!r)return null;for(var o={debug:{elements:{forward:[],backward:[]},strings:{forward:[],backward:[]}},asphalt:{elements:{forward:[],backward:[]},strings:{forward:[],backward:[]}},line:{elements:{striped:[],continous:[]},strings:{striped:[],continous:[]}},center:{},curb:{}},s={rotate:{strings:[]},lanes:{strings:{forward:{add:[],remove:[]},backward:{add:[],remove:[]}},elements:{forward:{},backward:{}}}},c={offsetBottom:function(e){return h(r,e.first)},offsetTop:function(e){return h(r,e.last)},halfRoadLeft:function(e){return b(r.roadWidth/2,e.angle-90)},halfRoadRight:function(e){return b(r.roadWidth/2,e.angle+90)},laneBottomLeft:function(e,r){return h(c.halfRoadLeft(r),c.offsetBottom(e))},laneTopLeft:function(e,r){return h(c.halfRoadLeft(r),c.offsetTop(e))},laneBottomRight:function(e,r){return h(c.halfRoadRight(r),c.offsetBottom(e))},laneTopRight:function(e,r){return h(c.halfRoadRight(r),c.offsetTop(e))},roadBottomLeft:function(e){return h(h(e.backward[0].first,r),c.halfRoadLeft(e))},roadBottomRight:function(e){return h(h(e.forward[e.forward.length-1].first,r),c.halfRoadRight(e))},roadTopLeft:function(e){return h(h(e.backward[0].last,r),c.halfRoadLeft(e))},roadTopRight:function(e){return h(h(e.forward[e.forward.length-1].last,r),c.halfRoadRight(e))},roadTopMiddle:function(e){return h(b(r.roadLength,e.angle),h(b((e.numberOfForward+e.numberOfBackward)*r.roadWidth/2,e.angle+90),c.roadBottomLeft(e)))}},i=function(){var t,d=g[m],i=Object(u.a)(e.entries());try{for(i.s();!(t=i.n()).done;){var w,p=Object(l.a)(t.value,2),O=p[0],x=p[1],j=Object(u.a)(x[d].entries());try{for(j.s();!(w=j.n()).done;){var v=Object(l.a)(w.value,2),y=v[0],k=v[1];o.asphalt.strings[d].push(f([{letter:"M",coords:[c.offsetBottom(k)]},{letter:"L",coords:[c.laneBottomLeft(k,x),c.laneTopLeft(k,x),c.laneTopRight(k,x),c.laneBottomRight(k,x)]},{letter:"Z"}])),o.debug.strings[d].push([c.offsetBottom(k),c.offsetTop(k)]),y===x[d].length-1&&"backward"!==d||(y===x[d].length-1&&"backward"===d?o.line.strings.continous.push([c.laneBottomRight(k,x),c.laneTopRight(k,x)]):o.line.strings.striped.push([c.laneBottomRight(k,x),c.laneTopRight(k,x)]))}}catch(B){j.e(B)}finally{j.f()}"backward"===d&&s.rotate.strings.push({vectors:c.roadTopMiddle(x),order:x.order}),0===O&&(o.center.string=f([{letter:"M",coords:[c.roadBottomLeft(x)]}])),o.center.string+=f([{letter:"L",coords:[c.roadBottomLeft(x),c.roadBottomRight(x)]}]),o.coordInfo=Object(n.jsx)("circle",{cx:r.x,cy:r.y,r:"5"}),0===O&&(o.curb.string=f([{letter:"M",coords:[c.roadBottomLeft(x)]}])),o.curb.string+=f([{letter:"L",coords:[c.roadBottomLeft(x),c.roadTopLeft(x)]},{letter:"M",coords:[c.roadTopRight(x)]},{letter:"L",coords:[c.roadBottomRight(x)]}]),O===e.length-1&&(o.curb.string+=f([{letter:"L",coords:[c.roadBottomLeft(e[0])]}])),o.asphalt.elements[d]=o.asphalt.strings[d].map((function(e,r){return Object(n.jsx)("path",{d:e,className:d+"-asphalt"},r)})),o.debug.elements[d]=o.debug.strings[d].map((function(e,r){return Object(n.jsx)("line",{x1:e[0].x,y1:e[0].y,x2:e[1].x,y2:e[1].y,className:d+"-debug"},r)})),o.line.elements.striped=o.line.strings.striped.map((function(e,r){return Object(n.jsx)("line",{x1:e[0].x,y1:e[0].y,x2:e[1].x,y2:e[1].y,className:d+"-line",strokeDasharray:"30, 60"},r)})),o.line.elements.continous=o.line.strings.continous.map((function(e,r){return Object(n.jsx)("line",{x1:e[0].x,y1:e[0].y,x2:e[1].x,y2:e[1].y,className:d+"-line"},r)})),"backward"===d&&(s.lanes.strings.forward.remove.push(h(c.roadBottomLeft(x),b(r.roadLength/3,x.angle))),s.lanes.strings.forward.add.push(h(c.roadBottomLeft(x),b(2*r.roadLength/3,x.angle))),s.lanes.strings.backward.remove.push(h(c.roadBottomRight(x),b(r.roadLength/3,x.angle))),s.lanes.strings.backward.add.push(h(c.roadBottomRight(x),b(2*r.roadLength/3,x.angle))),s.lanes.elements.forward.remove=s.lanes.strings.forward.remove.map((function(e,r){return Object(n.jsx)("circle",{cx:e.x,cy:e.y,r:"10",className:"add-lane",onClick:function(){return a(r,"Forward",-1)}},r)})),s.lanes.elements.forward.add=s.lanes.strings.forward.add.map((function(e,r){return Object(n.jsx)("circle",{cx:e.x,cy:e.y,r:"10",className:"add-lane",onClick:function(){return a(r,"Forward",1)}},r)})),s.lanes.elements.backward.remove=s.lanes.strings.backward.remove.map((function(e,r){return Object(n.jsx)("circle",{cx:e.x,cy:e.y,r:"10",className:"add-lane",onClick:function(){return a(r,"Backward",-1)}},r)})),s.lanes.elements.backward.add=s.lanes.strings.backward.add.map((function(e,r){return Object(n.jsx)("circle",{cx:e.x,cy:e.y,r:"10",className:"add-lane",onClick:function(){return a(r,"Backward",1)}},r)})))}}catch(B){i.e(B)}finally{i.f()}},m=0,g=["forward","backward"];m<g.length;m++)i();return o.center.element=Object(n.jsx)("path",{d:o.center.string,className:"center"}),o.curb.element=Object(n.jsx)("path",{d:o.curb.string,className:"curb"}),s.rotate.elements=s.rotate.strings.map((function(e,r){return Object(n.jsx)("circle",Object(d.a)({cx:e.vectors.x,cy:e.vectors.y,r:"10",className:"rotate"},t(e.order)),r)})),[o,s]}(function(e,r){var t=[];if(!(r&&r.roadLength&&r.roadWidth))return null;for(var n=0;n<e.length;n++){var a=e[n],o=(a.numberOfForward+a.numberOfBackward-1)*r.roadWidth/2;t[n]={forward:[],backward:[],maxDistance:o,angle:a.angle,order:a.order,numberOfForward:a.numberOfForward,numberOfBackward:a.numberOfBackward};for(var s=a.numberOfForward+a.numberOfBackward,c=0;c<s;c++){var d=h(b(o-c*r.roadWidth,a.angle-90),b(r.maxRoadWidth*r.roadWidth*.8,a.angle)),l=h(d,b(r.roadLength,a.angle));c>=a.numberOfForward?t[n].forward.push({first:d,last:l}):t[n].backward.push({first:d,last:l})}}return t}(w,s),s,O,(function(e,r,t){var n=w.map((function(e){return Object(d.a)({},e)}));(n[e]["numberOf"+r]>1||t>0)&&(n[e]["numberOf"+r]+=t),p(n)})),j=x||[null,null],v=Object(l.a)(j,2),y=v[0],k=v[1];return Object(n.jsx)("div",{style:{touchAction:"none"},children:Object(n.jsxs)("svg",{className:"artboard",ref:r,children:[y?y.asphalt.elements.forward:null,y?y.asphalt.elements.backward:null,y?y.center.element:null,y?y.curb.element:null,y?y.line.elements.continous:null,y?y.line.elements.striped:null,k?k.rotate.elements:null,k?k.lanes.elements.forward.remove:null,k?k.lanes.elements.forward.add:null,k?k.lanes.elements.backward.remove:null,k?k.lanes.elements.backward.add:null,y?null:Object(n.jsx)("text",{children:"Loading"})]})})}function b(e,r){var t=r*Math.PI/180;return{x:e*Math.cos(t),y:e*Math.sin(t)}}function h(e,r){return{x:e.x+r.x,y:e.y+r.y}}function g(){return Object(n.jsx)(n.Fragment,{children:Object(n.jsx)(m,{})})}c.a.render(Object(n.jsx)(o.a.StrictMode,{children:Object(n.jsx)(g,{})}),document.getElementById("root"))}},[[15,1,2]]]);
//# sourceMappingURL=main.7d2c31a3.chunk.js.map