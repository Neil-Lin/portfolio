import{a as d,f as S,r as f,b as _,D as $,q as x,c as B,w as v,u as l,o as A,k as t,j as p,t as h,C as T,s as C,v as N,p as j,m as D}from"./entry.2fe192e3.js";import{b as q}from"./composables.89568c34.js";const E=i=>Object.fromEntries(Object.entries(i).filter(([,o])=>o!==void 0)),m=(i,o)=>(s,a)=>(S(()=>i({...E(s),...a.attrs},a)),()=>{var c,u;return o?(u=(c=a.slots).default)==null?void 0:u.call(c):null}),g={accesskey:String,autocapitalize:String,autofocus:{type:Boolean,default:void 0},class:[String,Object,Array],contenteditable:{type:Boolean,default:void 0},contextmenu:String,dir:String,draggable:{type:Boolean,default:void 0},enterkeyhint:String,exportparts:String,hidden:{type:Boolean,default:void 0},id:String,inputmode:String,is:String,itemid:String,itemprop:String,itemref:String,itemscope:String,itemtype:String,lang:String,nonce:String,part:String,slot:String,spellcheck:{type:Boolean,default:void 0},style:String,tabindex:String,title:String,translate:String},L=d({name:"Link",inheritAttrs:!1,props:{...g,as:String,crossorigin:String,disabled:Boolean,fetchpriority:String,href:String,hreflang:String,imagesizes:String,imagesrcset:String,integrity:String,media:String,prefetch:{type:Boolean,default:void 0},referrerpolicy:String,rel:String,sizes:String,title:String,type:String,methods:String,target:String,body:Boolean,renderPriority:[String,Number]},setup:m(i=>({link:[i]}))}),M=d({name:"Meta",inheritAttrs:!1,props:{...g,charset:String,content:String,httpEquiv:String,name:String,body:Boolean,renderPriority:[String,Number]},setup:m(i=>{const o={...i};return o.httpEquiv&&(o["http-equiv"]=o.httpEquiv,delete o.httpEquiv),{meta:[o]}})}),O=d({name:"Html",inheritAttrs:!1,props:{...g,manifest:String,version:String,xmlns:String,renderPriority:[String,Number]},setup:m(i=>({htmlAttrs:i}),!0)}),P=d({name:"Body",inheritAttrs:!1,props:{...g,renderPriority:[String,Number]},setup:m(i=>({bodyAttrs:i}),!0)});function U(){const i=f(),o=f();return{scrollDistance:o,scrollTimer:i,elementOffset:()=>{i.value||(i.value=setTimeout(()=>{o.value=window.scrollY,clearTimeout(i.value),i.value=0},100))}}}const H={class:"layout"},z=p("noscript",{class:"noscript"},`
          您的瀏覽器不支援 JavaScript 功能，若網頁功能無法正常使用時，請開啟瀏覽器 JavaScript 狀態。
          Your browser does not support JavaScript!
        `,-1),V={class:"visually-hidden"},J=["title"],Y={class:"visually-hidden"},G=d({__name:"default",setup(i){const{t:o}=_(),s=D(),a=q({addSeoAttributes:!0,addDirAttribute:!0}),c=$(()=>a.value.htmlAttrs);S({titleTemplate:n=>n?`${n} - `+o("website.name"):o("website.name"),htmlAttrs:{lang:a.value.htmlAttrs.lang},link:[...a.value.link||[]],script:[{src:"/portfolio/js/clarity.js"}],meta:[...a.value.meta||[]]});const u=()=>{window.scrollTo({top:0,behavior:"smooth"})};x(()=>{window.addEventListener("scroll",y)});const{scrollDistance:b,elementOffset:y}=U();return(n,F)=>{const e=M,r=L,w=P,k=O;return A(),B(k,{lang:l(c).lang,dir:l(c).dir},{default:v(()=>[t(e,{charset:"utf-8"}),t(e,{name:"viewport",content:"width=device-width, initial-scale=1"}),t(e,{hid:"keywords",name:"keywords",content:n.$t("name.a11y")+", "+n.$t("name.designManagement")+", name.dataVisualization, "+n.$t("name.ui")+", "+n.$t("name.ux")+", "+n.$t("name.webLayout")},null,8,["content"]),t(e,{name:"author",content:"Neil"}),t(e,{name:"copyright",content:"copyright"}),t(e,{name:"format-detection",content:"telephone=no"}),t(e,{hid:"description",name:"description",content:n.$t("intro.des2")},null,8,["content"]),t(e,{hid:"og:url",property:"og:url",content:l(s).public.baseUrl},null,8,["content"]),t(e,{hid:"og:title",property:"og:title",content:n.$t("website.name")},null,8,["content"]),t(e,{hid:"og:description",property:"og:description",content:n.$t("intro.des2")},null,8,["content"]),t(e,{hid:"og:image",property:"og:image",content:l(s).public.baseUrl+"/images/social-media.png"},null,8,["content"]),t(e,{name:"twitter:card",content:"summary_large_image"}),t(e,{hid:"twitter:url",name:"twitter:url",content:l(s).public.baseUrl},null,8,["content"]),t(e,{hid:"twitter:title",name:"twitter:title",content:n.$t("website.name")},null,8,["content"]),t(e,{hid:"twitter:description",name:"twitter:description",content:n.$t("intro.des2")},null,8,["content"]),t(e,{hid:"twitter:image",name:"twitter:image",content:l(s).public.baseUrl+"/images/social-media.png"},null,8,["content"]),t(e,{name:"mobile-web-app-capable",content:"yes"}),t(e,{name:"apple-touch-fullscreen",content:"yes"}),t(e,{name:"apple-mobile-web-app-title",content:n.$t("website.name")},null,8,["content"]),t(e,{name:"apple-mobile-web-app-status-bar-style",content:"black"}),t(r,{rel:"shortcut icon",type:"image/x-icon",href:"/portfolio/favicon.ico"}),t(r,{rel:"apple-touch-icon-precomposed","data-res":"32x32",href:"/portfolio/favicon-32.ico"}),t(r,{rel:"apple-touch-icon-precomposed","data-res":"128x128",href:"/portfolio/favicon-128.ico"}),t(r,{rel:"apple-touch-icon-precomposed","data-res":"152x152",href:"/portfolio/favicon-152.ico"}),t(r,{rel:"apple-touch-icon-precomposed","data-res":"167x167",href:"/portfolio/favicon-167.ico"}),t(r,{rel:"apple-touch-icon-precomposed","data-res":"180x180",href:"/portfolio/favicon-180.ico"}),t(r,{rel:"apple-touch-icon-precomposed","data-res":"192x192",href:"/portfolio/favicon-192.ico"}),t(r,{rel:"apple-touch-icon-precomposed","data-res":"196x196",href:"/portfolio/favicon-196.ico"}),t(r,{rel:"apple-touch-startup-image",href:"/portfolio/images/splash/splash-640x1136.png",media:"(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"}),t(r,{rel:"apple-touch-startup-image",href:"/portfolio/images/splash/splash-750x1334.png",media:"(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"}),t(r,{rel:"apple-touch-startup-image",href:"/portfolio/images/splash/splash-1125x2436.png",media:"(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"}),t(r,{rel:"apple-touch-startup-image",href:"/portfolio/images/splash/splash-1242x2208.png",media:"(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"}),t(w,{class:"wrapper"},{default:v(()=>[p("div",H,[z,p("h1",V,h(n.$t("website.name")),1),p("a",{id:"ak-jump",href:"#ak-container",title:n.$t("shortcut.skipToContent")},h(n.$t("shortcut.skipToContent")),9,J),T(n.$slots,"default")]),C(p("button",{class:"btn-back-to-top",onClick:u},[p("span",Y,h(n.$t("action.backToTop")),1),j(" 🔝 ")],512),[[N,l(b)>300]])]),_:3})]),_:3},8,["lang","dir"])}}});export{G as default};
