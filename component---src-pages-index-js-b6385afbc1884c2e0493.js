(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{RXBc:function(e,t,r){"use strict";r.r(t),r.d(t,"default",(function(){return O})),r.d(t,"pageQuery",(function(){return C}));r("f3/d"),r("a1Th"),r("XfO3"),r("HEwt"),r("rE2o"),r("ioFf"),r("Z2Ku"),r("L9s1"),r("Vd3H"),r("rGqo"),r("yt8O"),r("Btvt"),r("RW0V");var n=r("q1tI"),a=r.n(n),o=r("R/WZ"),i=r("tRbT"),c=(r("8+KV"),r("Ff2n")),l=r("wx14"),s=r("iuhU"),u=r("H2TA"),d=n.forwardRef((function(e,t){var r=e.classes,a=e.className,o=e.component,i=void 0===o?"div":o,u=e.square,d=void 0!==u&&u,m=e.elevation,f=void 0===m?1:m,g=e.variant,b=void 0===g?"elevation":g,p=Object(c.a)(e,["classes","className","component","square","elevation","variant"]);return n.createElement(i,Object(l.a)({className:Object(s.a)(r.root,a,"outlined"===b?r.outlined:r["elevation".concat(f)],!d&&r.rounded),ref:t},p))})),m=Object(u.a)((function(e){var t={};return e.shadows.forEach((function(e,r){t["elevation".concat(r)]={boxShadow:e}})),Object(l.a)({root:{backgroundColor:e.palette.background.paper,color:e.palette.text.primary,transition:e.transitions.create("box-shadow")},rounded:{borderRadius:e.shape.borderRadius},outlined:{border:"1px solid ".concat(e.palette.divider)}},t)}),{name:"MuiPaper"})(d),f=r("hlFM"),g=r("ofer"),b=r("9jPY"),p=r("5AJ6"),h=Object(p.a)(n.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");var v=n.forwardRef((function(e,t){var r=e.alt,a=e.children,o=e.classes,i=e.className,u=e.component,d=void 0===u?"div":u,m=e.imgProps,f=e.sizes,g=e.src,b=e.srcSet,p=e.variant,v=void 0===p?"circle":p,y=Object(c.a)(e,["alt","children","classes","className","component","imgProps","sizes","src","srcSet","variant"]),k=null,w=function(e){var t=e.src,r=e.srcSet,a=n.useState(!1),o=a[0],i=a[1];return n.useEffect((function(){if(t||r){i(!1);var e=!0,n=new Image;return n.src=t,n.srcSet=r,n.onload=function(){e&&i("loaded")},n.onerror=function(){e&&i("error")},function(){e=!1}}}),[t,r]),o}({src:g,srcSet:b}),E=g||b,S=E&&"error"!==w;return k=S?n.createElement("img",Object(l.a)({alt:r,src:g,srcSet:b,sizes:f,className:o.img},m)):null!=a?a:E&&r?r[0]:n.createElement(h,{className:o.fallback}),n.createElement(d,Object(l.a)({className:Object(s.a)(o.root,o.system,o[v],i,!S&&o.colorDefault),ref:t},y),k)})),y=Object(u.a)((function(e){return{root:{position:"relative",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,width:40,height:40,fontFamily:e.typography.fontFamily,fontSize:e.typography.pxToRem(20),lineHeight:1,borderRadius:"50%",overflow:"hidden",userSelect:"none"},colorDefault:{color:e.palette.background.default,backgroundColor:"light"===e.palette.type?e.palette.grey[400]:e.palette.grey[600]},circle:{},rounded:{borderRadius:e.shape.borderRadius},square:{borderRadius:0},img:{width:"100%",height:"100%",textAlign:"center",objectFit:"cover",color:"transparent",textIndent:1e4},fallback:{width:"75%",height:"75%"}}}),{name:"MuiAvatar"})(v),k=r("Wbzz"),w=r("Bl7J"),E=r("vrFN");function S(e){return function(e){if(Array.isArray(e))return x(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return x(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return x(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function x(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}var j=Object(o.a)((function(e){return{root:{padding:"1em",margin:"0.5em",cursor:"pointer",backgroundColor:"rgba(255, 0, 0, 0)","&:hover":{backgroundColor:"rgba(0, 0, 0, 0.07)","-webkit-transition":"background-color 100ms linear","-ms-transition":"background-color 100ms linear",transition:"background-color 100ms linear"}},tag:{fontFamily:"consolas",padding:"0.1em 0.5em",borderRadius:"0.1em",cursor:"pointer","&:hover":{backgroundColor:"lightgrey","-webkit-transition":"background-color 500ms linear","-ms-transition":"background-color 500ms linear",transition:"background-color 500ms linear"}},sideChipLabel:{fontSize:"1em",backgroundColor:"rgb(255,255,255, 0)",color:"#757575",fontWeight:"100",fontFamily:"'Menlo', 'Monaco', 'Andale Mono', 'Ubuntu Mono', 'SFMono-Regular', monospace"},sideChipLabelActive:{fontSize:"1em",backgroundColor:"rgb(255,255,255, 0)",color:"white",fontWeight:"900",fontFamily:"'Menlo', 'Monaco', 'Andale Mono', 'Ubuntu Mono', 'SFMono-Regular', monospace"}}}));function O(e){var t=j(),r=Object(n.useState)([]),o=r[0],c=r[1],l=Object(n.useState)([]),s=l[0],u=l[1];Object(n.useEffect)((function(){var t=[];e.data.allMarkdownRemark.edges.forEach((function(e){e.node.frontmatter.tags.forEach((function(e){t.push(e)}))})),t=t.reduce((function(e,t){return e[t]=++e[t]||1,e}),{});var r=Object.keys(t).map((function(e){return{tag:e,count:t[e]}}));r.sort((function(e,t){return t.count-e.count})),console.log(r),c(r)}),[]);var d=function(e){if(s.includes(e)){var t=S(s),r=s.indexOf(e);t.splice(r,1),u(t)}else{var n=[].concat(S(s),[e]);u(n)}};return a.a.createElement(w.a,null,a.a.createElement(E.a,{title:"Tian's blog"}),a.a.createElement(i.a,{container:!0,spacing:2},a.a.createElement(i.a,{item:!0,xs:9},e.data.allMarkdownRemark.edges.map((function(e,r){var n=e.node;if(0===s.length||s.some((function(e){return n.frontmatter.tags.indexOf(e)>=0})))return a.a.createElement(m,{key:r,elevation:0,className:t.root,onClick:function(){return e=n.frontmatter.slug,void Object(k.navigate)(e);var e}},a.a.createElement(f.a,{my:1},a.a.createElement("h2",{style:{fontWeight:"700",marginBottom:"0.2em"},className:t.title},n.frontmatter.title," "),a.a.createElement(g.a,{style:{fontWeight:"100",fontSize:"0.85em",color:"gray",margin:"15px 0px 15px 0px"}},n.frontmatter.date,n.frontmatter.tags.map((function(e,r){return a.a.createElement(b.a,{size:"small",key:r,label:a.a.createElement("code",{className:s.includes(e)?t.sideChipLabelActive:t.sideChipLabel},e),variant:s.includes(e)?"default":"outlined",style:{zIndex:9999,margin:"0px 5px",fontSize:"14px",backgroundColor:s.includes(e)?"hsla(0,0%,0%,0.8)":"white"},onClick:function(t){t.stopPropagation(),d(e)}})}))),a.a.createElement("p",{style:{fontWeight:"400",fontSize:"1em"}},n.frontmatter.abstract)))}))),a.a.createElement(i.a,{item:!0,xs:3},o.map((function(e,r){return a.a.createElement(b.a,{size:"small",key:r,label:a.a.createElement("code",{className:s.includes(e.tag)?t.sideChipLabelActive:t.sideChipLabel},e.tag),variant:s.includes(e.tag)?"default":"outlined",avatar:a.a.createElement(y,{style:{fontSize:"10px",color:"white",fontWeight:"700"}},e.count),style:{margin:"5px",fontSize:"14px",backgroundColor:s.includes(e.tag)?"hsla(0,0%,0%,0.8)":"white"},onClick:function(){return d(e.tag)}})})))))}var C="1572258741"}}]);
//# sourceMappingURL=component---src-pages-index-js-b6385afbc1884c2e0493.js.map