"use strict";(self.webpackChunktian_site=self.webpackChunktian_site||[]).push([[849],{8063:function(e,t,n){var r=n(5987),o=n(7462),a=n(7294),i=n(5505),l=n(4621),s=a.forwardRef((function(e,t){var n=e.classes,l=e.className,s=e.component,c=void 0===s?"div":s,u=e.square,d=void 0!==u&&u,f=e.elevation,g=void 0===f?1:f,m=e.variant,h=void 0===m?"elevation":m,p=(0,r.Z)(e,["classes","className","component","square","elevation","variant"]);return a.createElement(c,(0,o.Z)({className:(0,i.Z)(n.root,l,"outlined"===h?n.outlined:n["elevation".concat(g)],!d&&n.rounded),ref:t},p))}));t.Z=(0,l.Z)((function(e){var t={};return e.shadows.forEach((function(e,n){t["elevation".concat(n)]={boxShadow:e}})),(0,o.Z)({root:{backgroundColor:e.palette.background.paper,color:e.palette.text.primary,transition:e.transitions.create("box-shadow")},rounded:{borderRadius:e.shape.borderRadius},outlined:{border:"1px solid ".concat(e.palette.divider)}},t)}),{name:"MuiPaper"})(s)},4046:function(e,t,n){n.r(t),n.d(t,{default:function(){return u}});var r=n(7294),o=(n(5444),n(3574)),a=n(3751),i=n(1293),l=n(838),s=n(8063),c=(0,n(920).Z)((function(e){var t,n;return{pannel:{padding:0,margin:0,height:"calc(100vh - 64px - 16px - 49px - 38px)",listStyle:"none",display:"flex",flexWrap:"wrap",rowGap:"0px",alignContent:"flex-start"},monthBlock_passed:{textAlign:"center",backgroundColor:"#cfd8dc",borderRadius:"2px",border:"0px solid lightgrey",color:"grey",margin:"0px","&:hover":(t={backgroundColor:"rgba(26, 32, 39, 0.7)","-webkit-transition":"background-color 100ms linear","-ms-transition":"background-color 100ms linear",transition:"background-color 100ms linear"},t["-webkit-transition"]="font-weight 100ms linear",t["-ms-transition"]="font-weight 100ms linear",t.transition="font-weight 100ms linear",t)},monthBlock_future:{textAlign:"center",backgroundColor:"#f5f5f5",borderRadius:"2px",border:"0px solid lightgrey",color:"grey",margin:"0px","&:hover":(n={backgroundColor:"rgba(26, 32, 39, 0.7)","-webkit-transition":"background-color 100ms linear","-ms-transition":"background-color 100ms linear",transition:"background-color 100ms linear"},n["-webkit-transition"]="font-weight 100ms linear",n["-ms-transition"]="font-weight 100ms linear",n.transition="font-weight 100ms linear",n)}}}));function u(e){var t=c(),n=(0,r.useRef)(null),u=(0,r.useState)(0),d=u[0],f=u[1],g=Array.from({length:960},(function(e,t){return t+1})),m=12*((new Date).getFullYear()-1991)+(new Date).getMonth();return(0,r.useEffect)((function(){if(console.log("width",n.current?n.current.offsetWidth:0),console.log("height",n.current?n.current.offsetHeight:0),n.current){var e=Math.sqrt(n.current.offsetWidth*n.current.offsetHeight/960);console.log(e);var t=Math.floor(n.current.offsetWidth/e);console.log(t),e=n.current.offsetWidth/(t+2),console.log(e),f(e)}}),[n.current]),r.createElement(o.Z,null,r.createElement(a.Z,{title:"Life in Month"}),r.createElement(i.Z,{maxWidth:"xl"},r.createElement(l.Z,{container:!0,justifyContent:"center"},r.createElement(l.Z,{item:!0,xs:12,sm:8,md:6,ref:n},r.createElement("ul",{className:t.pannel},g.map((function(e){return r.createElement("li",{style:{margin:"0px",width:d+"px",height:d+"px"}},r.createElement(s.Z,{elevation:0,className:e<m?t.monthBlock_passed:t.monthBlock_future,style:{width:d-2+"px",height:d-2+"px"}}))})))))))}}}]);
//# sourceMappingURL=component---src-pages-life-in-month-js-84e50244cf75d6ee9e80.js.map