import{u as $,_ as k}from"./DwXk-RXb.js";import{_ as C}from"./CVQ6_Qm0.js";import{_ as S}from"./CSrGFHw3.js";import{_ as w}from"./CVCxioTe.js";import{f as y,g as T,r as g,h as B,u as V,i as D,c as N,a as t,j as n,t as o,b as l,n as A,w as r,k as O,o as G,d as b}from"./LFP3Ht_2.js";import"./DlAUqK2U.js";const R={class:"page"},W={class:"page-container"},j={class:"page-content"},z=t("br",null,null,-1),E={class:"flex-list"},H={class:"flex-list-title"},L=t("ul",null,[t("li",null,"HTML5"),t("li",null,"CSS/SCSS"),t("li",null,"Javascript/jQuery"),t("li",null,"Vue/Nuxt"),t("li",null,"Version Control")],-1),U={class:"flex-list-title"},F=t("li",null,"Data visualization",-1),I=t("li",null,"DesignOps/Design System",-1),J=t("li",null,"OKR/OGSM",-1),K=t("li",null,"Scrum",-1),Q=t("li",null,"SEO",-1),q={class:"flex-list-title"},x=t("ul",null,[t("li",null,"Figma"),t("li",null,"VScode"),t("li",null,"Sourcetree"),t("li",null,"Wordpress")],-1),ot=y({__name:"about",setup(P){const{t:a}=T(),d=O(),i=g(a("mainMenu.about")),c=g(a("des.about")),p=B();V({title:i,meta:[{hid:"description",name:"description",content:c.value},{hid:"og:url",property:"og:url",content:d.public.baseUrl+p.path},{hid:"og:title",property:"og:title",content:i.value+" - "+a("website.name")},{hid:"og:description",property:"og:description",content:c.value},{hid:"twitter:url",name:"twitter:url",content:d.public.baseUrl+p.path},{hid:"twitter:title",name:"twitter:title",content:i.value+" - "+a("website.name")},{hid:"twitter:description",name:"twitter:description",content:c.value}]});const s=$();return(e,u)=>{const f=k,v=C,M=S,_=D("i18n-t"),h=w;return G(),N("div",R,[t("div",{class:A(["page-aside",n(s).mobileMenuStatus?"page-aside--open":""])},[t("button",{type:"button",class:"btn-close-mobile-menu",onClick:u[0]||(u[0]=(...m)=>n(s).handleCloseMobileMenuBtn&&n(s).handleCloseMobileMenuBtn(...m))},o(e.$t("action.closeMenu")),1),l(f)],2),t("main",W,[t("button",{type:"button",class:"btn-open-mobile-menu",onClick:u[1]||(u[1]=(...m)=>n(s).handleToggleMobileMenuBtn&&n(s).handleToggleMobileMenuBtn(...m))},[t("span",null,o(e.$t("name.menu")),1)]),l(v),l(M,{"page-title":n(i),"page-link":`${n(p).path}`},null,8,["page-title","page-link"]),t("h2",null,o(n(i)),1),t("div",j,[t("section",null,[t("h3",null,o(e.$t("name.intro")),1),l(_,{keypath:"page.about.p1",tag:"p",scope:"global"},{default:r(()=>[z]),_:1})]),t("section",null,[t("div",E,[t("div",null,[t("h4",H,o(e.$t("name.programming")),1),L]),t("div",null,[t("h4",U,o(e.$t("name.promote")),1),t("ul",null,[t("li",null,[l(h,{to:"https://ithelp.ithome.com.tw/users/20152260/ironman/5614",title:e.$t("action.goTo")+e.$t("des.ithomeA11y")+e.$t("action.openWindow"),target:"_blank",ref:"noreferrer noopener"},{default:r(()=>[b(" Accessibility ")]),_:1},8,["title"])]),F,I,J,K,Q])]),t("div",null,[t("h4",q,o(e.$t("name.tools")),1),x])])]),t("section",null,[l(_,{keypath:"page.about.p2",tag:"p",scope:"global"},{link:r(()=>[l(h,{to:"https://github.com/Neil-Lin/portfolio",title:e.$t("action.goTo")+"Github"+e.$t("action.openWindow"),target:"_blank",ref:"noreferrer noopener"},{default:r(()=>[b(" Github ")]),_:1},8,["title"])]),_:1})])])])])}}});export{ot as default};