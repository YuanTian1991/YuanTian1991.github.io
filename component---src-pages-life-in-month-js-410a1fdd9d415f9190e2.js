"use strict";(self.webpackChunktian_site=self.webpackChunktian_site||[]).push([[849],{4046:function(e,t,n){n.r(t),n.d(t,{default:function(){return m}});var r=n(7294),o=(n(5444),n(7526)),i=n(3751),a=n(1293),l=n(838),s=n(8063);const c=(0,n(920).Z)((e=>({pannel:{padding:0,margin:0,height:"calc(100vh - 64px - 16px - 49px - 38px - 31px)",listStyle:"none",display:"flex",flexWrap:"wrap",rowGap:"0px",alignContent:"flex-start"},monthBlock_passed:{textAlign:"center",backgroundColor:"#cfd8dc",borderRadius:"2px",border:"0px solid lightgrey",color:"grey",margin:"0px","&:hover":{backgroundColor:"rgba(26, 32, 39, 0.7)","-webkit-transition":"background-color 100ms linear","-ms-transition":"background-color 100ms linear",transition:"background-color 100ms linear","-webkit-transition":"font-weight 100ms linear","-ms-transition":"font-weight 100ms linear",transition:"font-weight 100ms linear"}},monthBlock_future:{textAlign:"center",backgroundColor:"#f5f5f5",borderRadius:"2px",border:"0px solid lightgrey",color:"grey",margin:"0px","&:hover":{backgroundColor:"rgba(26, 32, 39, 0.7)","-webkit-transition":"background-color 100ms linear","-ms-transition":"background-color 100ms linear",transition:"background-color 100ms linear","-webkit-transition":"font-weight 100ms linear","-ms-transition":"font-weight 100ms linear",transition:"font-weight 100ms linear"}}})));function m(e){const t=c(),n=(0,r.useRef)(null),{0:m,1:u}=(0,r.useState)(0),{0:f,1:g}=(0,r.useState)(""),h=Array.from({length:960},((e,t)=>t+1)),d=12*((new Date).getFullYear()-1991)+(new Date).getMonth()+1;(0,r.useEffect)((()=>{if(n.current){let e=Math.sqrt(n.current.offsetWidth*n.current.offsetHeight/960);console.log(n.current.offsetWidth),console.log(n.current.offsetHeight);let t=Math.floor(n.current.offsetWidth/e);e=n.current.offsetWidth/(t+2),u(e)}}),[n.current]);return r.createElement(o.Z,null,r.createElement(i.Z,{title:"Life in Month"}),r.createElement(a.Z,{maxWidth:"xl"},r.createElement(l.Z,{container:!0,justifyContent:"center"},r.createElement(l.Z,{item:!0,xs:12,sm:8,md:6,ref:n},r.createElement("ul",{className:t.pannel},h.map((e=>r.createElement("li",{style:{margin:"0px",width:m+"px",height:m+"px"}},r.createElement(s.Z,{elevation:0,className:e<=d?t.monthBlock_passed:t.monthBlock_future,style:{width:m-2+"px",height:m-2+"px"},onMouseOver:()=>(e=>{let t=Math.floor(e/12+1991),n=e%12;0===n&&(t-=1,n=12),g(t+" - "+n)})(e),onMouseLeave:()=>g("")})))))),r.createElement(l.Z,{item:!0,xs:12,sm:2},r.createElement("p",{style:{margin:"1em",textAlign:"center",fontSize:"0.8em"}},f)))))}}}]);
//# sourceMappingURL=component---src-pages-life-in-month-js-410a1fdd9d415f9190e2.js.map