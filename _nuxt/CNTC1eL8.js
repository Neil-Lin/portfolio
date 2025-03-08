import{m as S,E as j,C as $,Y as A,p as _,q as f,y as o,B as k,v as h,F as P,x as C,f as c,Z as U,D as q,L as z,h as N,r as M,M as H,z as t,A as y,R as F,_ as O,J as R,$ as V,G as Y,N as J,O as I,W as Z,X as G}from"./CQOyxY9x.js";import{_ as D}from"./BZvXyRX4.js";const W=s=>{const e=Object.create(null);for(const l in s){const r=s[l];r!==void 0&&(e[l]=r)}return e},T=(s,e)=>(l,r)=>(j(()=>s({...W(l),...r.attrs},r)),()=>{var p,g;return e?(g=(p=r.slots).default)==null?void 0:g.call(p):null}),L={accesskey:String,autocapitalize:String,autofocus:{type:Boolean,default:void 0},class:[String,Object,Array],contenteditable:{type:Boolean,default:void 0},contextmenu:String,dir:String,draggable:{type:Boolean,default:void 0},enterkeyhint:String,exportparts:String,hidden:{type:Boolean,default:void 0},id:String,inputmode:String,is:String,itemid:String,itemprop:String,itemref:String,itemscope:String,itemtype:String,lang:String,nonce:String,part:String,slot:String,spellcheck:{type:Boolean,default:void 0},style:[String,Object,Array],tabindex:String,title:String,translate:String},X=S({name:"Link",inheritAttrs:!1,props:{...L,as:String,crossorigin:String,disabled:Boolean,fetchpriority:String,href:String,hreflang:String,imagesizes:String,imagesrcset:String,integrity:String,media:String,prefetch:{type:Boolean,default:void 0},referrerpolicy:String,rel:String,sizes:String,title:String,type:String,methods:String,target:String,body:Boolean,renderPriority:[String,Number]},setup:T(s=>({link:[s]}))}),K=S({name:"Meta",inheritAttrs:!1,props:{...L,charset:String,content:String,httpEquiv:String,name:String,body:Boolean,renderPriority:[String,Number]},setup:T(s=>{const e={...s};return e.httpEquiv&&(e["http-equiv"]=e.httpEquiv,delete e.httpEquiv),{meta:[e]}})}),Q=S({name:"Html",inheritAttrs:!1,props:{...L,manifest:String,version:String,xmlns:String,renderPriority:[String,Number]},setup:T(s=>({htmlAttrs:s}),!0)}),x=S({name:"Body",inheritAttrs:!1,props:{...L,renderPriority:[String,Number]},setup:T(s=>({bodyAttrs:s}),!0)}),tt={class:"lang-switcher"},et={id:"lang-text",class:"visually-hidden"},nt=["value","selected"],ot=S({__name:"theLangSwitcher",setup(s){const{locale:e,locales:l}=$(),r=l.value,p=A();async function g(i){const a=i.target;await U({path:p(a.value)})}return(i,a)=>(f(),_("div",tt,[o("span",null,[o("span",et,h(i.$t("words.language")),1),a[0]||(a[0]=k(" 🌐 "))]),o("select",{"aria-labelledby":"lang-text",onChange:g},[(f(!0),_(P,null,C(c(r),n=>(f(),_("option",{key:n.code,value:n.code,selected:c(e)===n.code},h(n.name),9,nt))),128))],32)]))}}),it=Object.assign(ot,{__name:"TheLangSwitcher"}),st=""+new URL("avatar.DFz9OjpA.webp",import.meta.url).href,at=["title"],rt={class:"visually-hidden"},lt={class:"header-container"},ct={class:"left"},dt=["title"],ut={class:"logo"},pt=["alt"],mt={class:"slogan intro"},gt={class:"right"},ht={class:"intro"},ft=["aria-label"],_t={class:"sub-menu"},St=10,vt=S({__name:"theHeader",setup(s){const{t:e}=$(),l=q(),r=z(),p=d=>{const u=d.getHours();let m;return u<12&&u>5?m=e("action.morning"):u>=12&&u<20?m=e("action.afternoon"):m=e("action.evening"),m},g=N(()=>[{link:"/sitemap",title:e("mainMenu.sitemap")},{link:"/products",title:e("mainMenu.products")},{link:"/projects",title:e("mainMenu.projects")},{link:"/blog",title:e("mainMenu.blog")}]),i=N(()=>{if(!(l.path==="/"||l.path==="/en"))return"collapsed"}),a=M(!1);let n=0;const v=()=>{var m;const d=((m=document.querySelector("header"))==null?void 0:m.getBoundingClientRect().height)||0,u=window.scrollY;u>d?u>n?a.value=!0:n-u>St&&(a.value=!1):a.value=!1,n=u};return H(()=>{window.addEventListener("scroll",v)}),(d,u)=>{const m=D,B=it;return f(),_("header",{class:F([c(i),c(a)?"scrolled":""])},[o("a",{id:"ak-jump",href:"#ak-container",title:d.$t("shortcut.skipToContent")},h(d.$t("shortcut.skipToContent")),9,at),o("h1",rt,h(d.$t("website.name")),1),o("div",lt,[o("div",ct,[o("a",{id:"ak-header",href:"#ak-header",title:d.$t("shortcut.header"),accesskey:"U"}," ::: ",8,dt),o("div",ut,[t(m,{to:c(r)("/"),title:d.$t("action.goToHomePage")},{default:y(()=>[o("img",{src:st,alt:d.$t("words.avatar")},null,8,pt),o("div",mt,[o("span",null,h(p(new Date)),1),o("span",null,h(d.$t("intro.greet")),1)]),u[0]||(u[0]=o("span",{class:"visually-hidden"},"回首頁",-1))]),_:1},8,["to","title"])])]),o("div",gt,[o("div",ht,[o("p",null,h(d.$t("intro.des1")),1),u[1]||(u[1]=o("br",null,null,-1))]),o("nav",{"aria-label":d.$t("mainMenu.mainMenu"),class:"main-menu"},[o("ul",null,[(f(!0),_(P,null,C(c(g),(b,w)=>(f(),_("li",{key:w},[t(m,{to:c(r)(b.link),title:`${d.$t("action.goTo")} ${b.title}`,class:"btn"},{default:y(()=>[k(h(b.title),1)]),_:2},1032,["to","title"])]))),128))])],8,ft)]),o("div",_t,[t(B)])])],2)}}}),bt=Object.assign(O(vt,[["__scopeId","data-v-c5943293"]]),{__name:"TheHeader"}),yt=["title"],wt={class:"footer-container"},$t=S({__name:"theFooter",setup(s){const e=A(),{locales:l}=$(),r=l.value;return(p,g)=>{const i=D;return f(),_("footer",null,[o("a",{id:"ak-footer",href:"#ak-footer",title:p.$t("shortcut.footer"),accesskey:"Z"}," ::: ",8,yt),o("div",wt,[c(r).length!=0?(f(!0),_(P,{key:0},C(c(r),a=>(f(),_("span",{key:a.code},[t(i,{to:c(e)(a.code),title:p.$t("action.switch")+a.name},{default:y(()=>[k(h(a.name),1)]),_:2},1032,["to","title"])]))),128)):R("",!0),g[0]||(g[0]=o("span",null,"© Neil",-1))])])}}}),kt=Object.assign(O($t,[["__scopeId","data-v-db146064"]]),{__name:"TheFooter"});function Tt(){const s=M(),e=M();return{scrollDistance:e,scrollTimer:s,elementOffset:()=>{s.value||(s.value=setTimeout(()=>{e.value=window.scrollY,clearTimeout(s.value),s.value=0},100))}}}function Lt(){const s=()=>{window.scrollTo({top:0,behavior:"smooth"})};H(()=>{window.addEventListener("scroll",l)});const{scrollDistance:e,elementOffset:l}=Tt();return{scrollDistance:e,scrollToTop:s}}const Bt={class:"layout"},Mt={class:"visually-hidden"},Nt=S({__name:"default",setup(s){const{t:e}=$(),l=Y(),r=V();j({titleTemplate:i=>i?`${i} - `+e("website.name"):e("website.name"),link:[...r.value.link||[]],script:[{src:l.public.baseUrl+"/js/clarity.js"}],meta:[{hid:"og:image",property:"og:image",content:"https://neil-lin.github.io/portfolio/images/social-media.png"},...r.value.meta||[]]});const{scrollToTop:p,scrollDistance:g}=Lt();return(i,a)=>{var b,w;const n=K,v=X,d=bt,u=kt,m=x,B=Q;return f(),J(B,{lang:(b=c(r).htmlAttrs)==null?void 0:b.lang,dir:(w=c(r).htmlAttrs)==null?void 0:w.dir},{default:y(()=>[t(n,{charse:"utf-8"}),t(n,{name:"viewport",content:"width=device-width, initial-scale=1"}),t(n,{hid:"keywords",name:"keywords",content:i.$t("words.a11y")+", "+i.$t("words.designManagement")+", "+i.$t("words.dataVisualization")+", "+i.$t("words.ui")+", "+i.$t("words.ux")+", "+i.$t("words.webLayout")},null,8,["content"]),t(n,{name:"author",content:"Neil"}),t(n,{name:"copyright",content:"Neil"}),t(n,{name:"format-detection",content:"telephone=no"}),t(n,{hid:"description",name:"description",content:i.$t("intro.des2")},null,8,["content"]),t(n,{hid:"og:url",property:"og:url",content:c(l).public.baseUrl},null,8,["content"]),t(n,{hid:"og:title",property:"og:title",content:i.$t("website.name")},null,8,["content"]),t(n,{hid:"og:description",property:"og:description",content:i.$t("intro.des2")},null,8,["content"]),t(n,{hid:"og:image",property:"og:image",content:"https://neil-lin.github.io/portfolio/images/social-media.png"}),t(n,{name:"twitter:card",content:"summary_large_image"}),t(n,{hid:"twitter:url",name:"twitter:url",content:c(l).public.baseUrl},null,8,["content"]),t(n,{hid:"twitter:title",name:"twitter:title",content:i.$t("website.name")},null,8,["content"]),t(n,{hid:"twitter:description",name:"twitter:description",content:i.$t("intro.des2")},null,8,["content"]),t(n,{hid:"twitter:image",name:"twitter:image",content:"https://neil-lin.github.io/portfolio/images/social-media.png"}),t(n,{name:"mobile-web-app-capable",content:"yes"}),t(n,{name:"apple-touch-fullscreen",content:"yes"}),t(n,{name:"apple-mobile-web-app-title",content:i.$t("website.name")},null,8,["content"]),t(n,{name:"apple-mobile-web-app-status-bar-style",content:"black"}),t(v,{rel:"canonical",href:"https://neil-lin.github.io/portfolio"}),t(v,{rel:"shortcut icon",type:"image/x-icon",href:"https://neil-lin.github.io/portfolio/favicon.ico"}),t(v,{rel:"preconnect",href:"https://fonts.googleapis.com"}),t(v,{rel:"preconnect",href:"https://fonts.gstatic.com",crossorigin:""}),t(v,{rel:"stylesheet",href:"https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&display=swap"}),t(m,{class:"wrapper"},{default:y(()=>[o("div",Bt,[a[1]||(a[1]=o("noscript",{class:"noscript"}," 您的瀏覽器不支援 JavaScript 功能，若網頁功能無法正常使用時，請開啟瀏覽器 JavaScript 狀態。 Your browser does not support JavaScript! ",-1)),t(d),Z(i.$slots,"default"),t(u)]),I(o("button",{type:"button",class:"btn-back-to-top",onClick:a[0]||(a[0]=(...E)=>c(p)&&c(p)(...E))},[o("span",Mt,h(i.$t("action.backToTop")),1),a[2]||(a[2]=k(" 🔝 "))],512),[[G,c(g)>300]])]),_:3})]),_:3},8,["lang","dir"])}}});export{Nt as default};
