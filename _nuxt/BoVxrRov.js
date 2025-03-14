import{m as h,c as b,X as U,j as F,E as D,Y,B as L,Z as E,n as y,A as _,v as a,z as P,p as f,F as H,q as M,h as c,$ as J,C as R,J as I,i as O,r as A,K as z,x as s,y as $,Q as Z,D as q,H as K,a0 as Q,L as W,M as X,N as G,V as tt,W as et}from"./P-x0R-Z6.js";import{_ as x}from"./D7kN0b1G.js";const j=Symbol("head-component"),N={body:{type:Boolean,default:void 0},tagPosition:{type:String}},T=i=>{const t=Object.fromEntries(Object.entries(i).filter(([e,o])=>o!==void 0));return typeof t.body<"u"&&(t.tagPosition=t.body?"bodyClose":"head"),typeof t.renderPriority<"u"&&(t.tagPriority=t.renderPriority),t};function v(){return U(j,nt,!0)}function nt(){const i=U(j,null);if(i)return i;const t=F({}),e=D(t),o={input:t,entry:e};return Y(j,o),o}const w={accesskey:String,autocapitalize:String,autofocus:{type:Boolean,default:void 0},class:{type:[String,Object,Array],default:void 0},contenteditable:{type:Boolean,default:void 0},contextmenu:String,dir:String,draggable:{type:Boolean,default:void 0},enterkeyhint:String,exportparts:String,hidden:{type:Boolean,default:void 0},id:String,inputmode:String,is:String,itemid:String,itemprop:String,itemref:String,itemscope:String,itemtype:String,lang:String,nonce:String,part:String,slot:String,spellcheck:{type:Boolean,default:void 0},style:{type:[String,Object,Array],default:void 0},tabindex:String,title:String,translate:String,renderPriority:[String,Number],tagPriority:{type:[String,Number]}};h({name:"NoScript",inheritAttrs:!1,props:{...w,...N,title:String},setup(i,{slots:t}){const{input:e}=v();e.noscript||(e.noscript=[]);const o=e.noscript.push({})-1;return b(()=>e.noscript[o]=null),()=>{var l;const u=T(i),m=(l=t.default)==null?void 0:l.call(t),r=m?m.filter(({children:n})=>n).map(({children:n})=>n).join(""):"";return r&&(u.innerHTML=r),e.noscript[o]=u,null}}});const ot=h({name:"Link",inheritAttrs:!1,props:{...w,...N,as:String,crossorigin:String,disabled:Boolean,fetchpriority:String,href:String,hreflang:String,imagesizes:String,imagesrcset:String,integrity:String,media:String,prefetch:{type:Boolean,default:void 0},referrerpolicy:String,rel:String,sizes:String,title:String,type:String,methods:String,target:String},setup(i){const{input:t}=v();t.link||(t.link=[]);const e=t.link.push({})-1;return b(()=>t.link[e]=null),()=>(t.link[e]=T(i),null)}});h({name:"Base",inheritAttrs:!1,props:{...w,href:String,target:String},setup(i){const{input:t}=v();return b(()=>t.base=null),()=>(t.base=T(i),null)}});const st=h({name:"Meta",inheritAttrs:!1,props:{...w,charset:String,content:String,httpEquiv:String,name:String,property:String},setup(i){const{input:t}=v();t.meta||(t.meta=[]);const e=t.meta.push({})-1;return b(()=>t.meta[e]=null),()=>{const o={"http-equiv":i.httpEquiv,...T(i)};return"httpEquiv"in o&&delete o.httpEquiv,t.meta[e]=o,null}}});h({name:"Style",inheritAttrs:!1,props:{...w,...N,type:String,media:String,nonce:String,title:String,scoped:{type:Boolean,default:void 0}},setup(i,{slots:t}){const{input:e}=v();e.style||(e.style=[]);const o=e.style.push({})-1;return b(()=>e.style[o]=null),()=>{var r,l,n;const u=T(i),m=(n=(l=(r=t.default)==null?void 0:r.call(t))==null?void 0:l[0])==null?void 0:n.children;return m&&(u.textContent=m),null}}});const it=h({name:"Html",inheritAttrs:!1,props:{...w,manifest:String,version:String,xmlns:String},setup(i,t){const{input:e}=v();return b(()=>e.htmlAttrs=null),()=>{var o,u;return e.htmlAttrs={...i},(u=(o=t.slots).default)==null?void 0:u.call(o)}}}),rt=h({name:"Body",inheritAttrs:!1,props:w,setup(i,t){const{input:e}=v();return b(()=>e.bodyAttrs=null),()=>{var o,u;return e.bodyAttrs={...i},(u=(o=t.slots).default)==null?void 0:u.call(o)}}}),at={class:"lang-switcher"},lt={id:"lang-text",class:"visually-hidden"},ct=["value","selected"],ut=h({__name:"theLangSwitcher",setup(i){const{locale:t,locales:e}=L(),o=e.value,u=E();async function m(r){const l=r.target;await J({path:u(l.value)})}return(r,l)=>(_(),y("div",at,[a("span",null,[a("span",lt,f(r.$t("words.language")),1),l[0]||(l[0]=P(" 🌐 "))]),a("select",{"aria-labelledby":"lang-text",onChange:m},[(_(!0),y(H,null,M(c(o),n=>(_(),y("option",{key:n.code,value:n.code,selected:c(t)===n.code},f(n.name),9,ct))),128))],32)]))}}),dt=Object.assign(ut,{__name:"TheLangSwitcher"}),pt=""+new URL("avatar.DFz9OjpA.webp",import.meta.url).href,mt=["title"],gt={class:"visually-hidden"},ht={class:"header-container"},ft={class:"left"},_t=["title"],yt={class:"logo"},St=["alt"],bt={class:"slogan intro"},vt={class:"right"},wt={class:"intro"},kt=["aria-label"],$t={class:"sub-menu"},Tt=10,Ct=h({__name:"theHeader",setup(i){const{t}=L(),e=R(),o=I(),u=d=>{const p=d.getHours();let g;return p<12&&p>5?g=t("action.morning"):p>=12&&p<20?g=t("action.afternoon"):g=t("action.evening"),g},m=O(()=>[{link:"/sitemap",title:t("mainMenu.sitemap")},{link:"/products",title:t("mainMenu.products")},{link:"/projects",title:t("mainMenu.projects")},{link:"/blog",title:t("mainMenu.blog")}]),r=O(()=>{if(!(e.path==="/"||e.path==="/en"))return"collapsed"}),l=A(!1);let n=0;const S=()=>{var g;const d=((g=document.querySelector("header"))==null?void 0:g.getBoundingClientRect().height)||0,p=window.scrollY;p>d?p>n?l.value=!0:n-p>Tt&&(l.value=!1):l.value=!1,n=p};return z(()=>{window.addEventListener("scroll",S)}),(d,p)=>{const g=x,B=dt;return _(),y("header",{class:Z([c(r),c(l)?"scrolled":""])},[a("a",{id:"ak-jump",href:"#ak-container",title:d.$t("shortcut.skipToContent")},f(d.$t("shortcut.skipToContent")),9,mt),a("h1",gt,f(d.$t("website.name")),1),a("div",ht,[a("div",ft,[a("a",{id:"ak-header",href:"#ak-header",title:d.$t("shortcut.header"),accesskey:"U"}," ::: ",8,_t),a("div",yt,[s(g,{to:c(o)("/"),title:d.$t("action.goToHomePage")},{default:$(()=>[a("img",{src:pt,alt:d.$t("words.avatar")},null,8,St),a("div",bt,[a("span",null,f(u(new Date)),1),a("span",null,f(d.$t("intro.greet")),1)]),p[0]||(p[0]=a("span",{class:"visually-hidden"},"回首頁",-1))]),_:1},8,["to","title"])])]),a("div",vt,[a("div",wt,[a("p",null,f(d.$t("intro.des1")),1),p[1]||(p[1]=a("br",null,null,-1))]),a("nav",{"aria-label":d.$t("mainMenu.mainMenu"),class:"main-menu"},[a("ul",null,[(_(!0),y(H,null,M(c(m),(k,C)=>(_(),y("li",{key:C},[s(g,{to:c(o)(k.link),title:`${d.$t("action.goTo")} ${k.title}`,class:"btn"},{default:$(()=>[P(f(k.title),1)]),_:2},1032,["to","title"])]))),128))])],8,kt)]),a("div",$t,[s(B)])])],2)}}}),Lt=Object.assign(q(Ct,[["__scopeId","data-v-c5943293"]]),{__name:"TheHeader"}),Pt=["title"],Bt={class:"footer-container"},At=h({__name:"theFooter",setup(i){const t=E(),{locales:e}=L(),o=e.value;return(u,m)=>{const r=x;return _(),y("footer",null,[a("a",{id:"ak-footer",href:"#ak-footer",title:u.$t("shortcut.footer"),accesskey:"Z"}," ::: ",8,Pt),a("div",Bt,[c(o).length!=0?(_(!0),y(H,{key:0},M(c(o),l=>(_(),y("span",{key:l.code},[s(r,{to:c(t)(l.code),title:u.$t("action.switch")+l.name},{default:$(()=>[P(f(l.name),1)]),_:2},1032,["to","title"])]))),128)):K("",!0),m[0]||(m[0]=a("span",null,"© Neil",-1))])])}}}),jt=Object.assign(q(At,[["__scopeId","data-v-db146064"]]),{__name:"TheFooter"});function Ht(){const i=A(),t=A();return{scrollDistance:t,scrollTimer:i,elementOffset:()=>{i.value||(i.value=setTimeout(()=>{t.value=window.scrollY,clearTimeout(i.value),i.value=0},100))}}}function Mt(){const i=()=>{window.scrollTo({top:0,behavior:"smooth"})};z(()=>{window.addEventListener("scroll",e)});const{scrollDistance:t,elementOffset:e}=Ht();return{scrollDistance:t,scrollToTop:i}}const Nt={class:"layout"},Ot={class:"visually-hidden"},Et=h({__name:"default",setup(i){const{t}=L(),e=W(),o=Q();D({titleTemplate:r=>r?`${r} - `+t("website.name"):t("website.name"),link:[...o.value.link||[]],script:[{src:e.public.baseUrl+"/js/clarity.js"}],meta:[...o.value.meta||[]]});const{scrollToTop:u,scrollDistance:m}=Mt();return(r,l)=>{var k,C;const n=st,S=ot,d=Lt,p=jt,g=rt,B=it;return _(),X(B,{lang:(k=c(o).htmlAttrs)==null?void 0:k.lang,dir:(C=c(o).htmlAttrs)==null?void 0:C.dir},{default:$(()=>[s(n,{charse:"utf-8"}),s(n,{name:"viewport",content:"width=device-width, initial-scale=1"}),s(n,{hid:"keywords",name:"keywords",content:r.$t("words.a11y")+", "+r.$t("words.designManagement")+", "+r.$t("words.dataVisualization")+", "+r.$t("words.ui")+", "+r.$t("words.ux")+", "+r.$t("words.webLayout")},null,8,["content"]),s(n,{name:"author",content:"Neil"}),s(n,{name:"copyright",content:"Neil"}),s(n,{name:"format-detection",content:"telephone=no"}),s(n,{hid:"description",name:"description",content:r.$t("intro.des2")},null,8,["content"]),s(n,{hid:"og:url",property:"og:url",content:c(e).public.baseUrl},null,8,["content"]),s(n,{hid:"og:title",property:"og:title",content:r.$t("website.name")},null,8,["content"]),s(n,{hid:"og:description",property:"og:description",content:r.$t("intro.des2")},null,8,["content"]),s(n,{hid:"og:image",property:"og:image",content:c(e).public.baseUrl+"/images/social-media.png"},null,8,["content"]),s(n,{name:"twitter:card",content:"summary_large_image"}),s(n,{hid:"twitter:url",name:"twitter:url",content:c(e).public.baseUrl},null,8,["content"]),s(n,{hid:"twitter:title",name:"twitter:title",content:r.$t("website.name")},null,8,["content"]),s(n,{hid:"twitter:description",name:"twitter:description",content:r.$t("intro.des2")},null,8,["content"]),s(n,{hid:"twitter:image",name:"twitter:image",content:c(e).public.baseUrl+"/images/social-media.png"},null,8,["content"]),s(n,{name:"mobile-web-app-capable",content:"yes"}),s(n,{name:"apple-touch-fullscreen",content:"yes"}),s(n,{name:"apple-mobile-web-app-title",content:r.$t("website.name")},null,8,["content"]),s(n,{name:"apple-mobile-web-app-status-bar-style",content:"black"}),s(S,{rel:"canonical",href:c(e).public.baseUrl},null,8,["href"]),s(S,{rel:"shortcut icon",type:"image/x-icon",href:`${c(e).public.baseUrl}/favicon.ico`},null,8,["href"]),s(S,{rel:"preconnect",href:"https://fonts.googleapis.com"}),s(S,{rel:"preconnect",href:"https://fonts.gstatic.com",crossorigin:""}),s(S,{rel:"stylesheet",href:"https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&display=swap"}),s(g,{class:"wrapper"},{default:$(()=>[a("div",Nt,[l[1]||(l[1]=a("noscript",{class:"noscript"}," 您的瀏覽器不支援 JavaScript 功能，若網頁功能無法正常使用時，請開啟瀏覽器 JavaScript 狀態。 Your browser does not support JavaScript! ",-1)),s(d),tt(r.$slots,"default"),s(p)]),G(a("button",{type:"button",class:"btn-back-to-top",onClick:l[0]||(l[0]=(...V)=>c(u)&&c(u)(...V))},[a("span",Ot,f(r.$t("action.backToTop")),1),l[2]||(l[2]=P(" 🔝 "))],512),[[et,c(m)>300]])]),_:3})]),_:3},8,["lang","dir"])}}});export{Et as default};
