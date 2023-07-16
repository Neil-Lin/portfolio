import{f,g as $,z as V,o,c as i,a as e,t as r,d as _,F as b,q as k,j as l,b as m,w as g,p as M,e as D,s as y,A as z,r as X,h as A,y as T}from"./entry.b32906c0.js";import{a as Y,u as C}from"./composables.a2e37dcd.js";import{_ as U}from"./nuxt-link.6011ff79.js";import{_ as L}from"./_plugin-vue_export-helper.c27b6911.js";import{_ as H}from"./akContainer.16cf24c7.js";const O={class:"lang-switcher"},B={id:"lang-text",class:"visually-hidden"},R=["value","selected"],K=f({__name:"theLangSwitcher",setup(a){const{locale:s,locales:t}=$(),d=t.value,c=V(),n=Y();function h(w){const u=w.target;c.push({path:n(u.value)})}return(w,u)=>(o(),i("div",O,[e("span",null,[e("span",B,r(w.$t("name.language")),1),_("🌐")]),e("select",{"aria-labelledby":"lang-text",onChange:h},[(o(!0),i(b,null,k(l(d),v=>(o(),i("option",{key:v.code,value:v.code,selected:l(s)===v.code},r(v.name),9,R))),128))],32)]))}}),q=""+globalThis.__publicAssetsURL("images/avatar.webp"),S=a=>(M("data-v-c0e15f5e"),a=a(),D(),a),W={class:"toolbar"},E=["title"],F={class:"intro"},N=["alt"],Z={class:"text"},G={class:"margin-bottom"},j=["aria-label"],x={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 640 512"},J=S(()=>e("path",{d:"M180.5,74.262C80.813,74.262,0,155.633,0,256S80.819,437.738,180.5,437.738,361,356.373,361,256,280.191,74.262,180.5,74.262Zm288.25,10.646c-49.845,0-90.245,76.619-90.245,171.095s40.406,171.1,90.251,171.1,90.251-76.619,90.251-171.1H559C559,161.5,518.6,84.908,468.752,84.908Zm139.506,17.821c-17.526,0-31.735,68.628-31.735,153.274s14.2,153.274,31.735,153.274S640,340.631,640,256C640,171.351,625.785,102.729,608.258,102.729Z"},null,-1)),Q={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 512"},ee=S(()=>e("path",{d:"M256 8C119.252 8 8 119.252 8 256s111.252 248 248 248 248-111.252 248-248S392.748 8 256 8zm163.97 114.366c29.503 36.046 47.369 81.957 47.835 131.955-6.984-1.477-77.018-15.682-147.502-6.818-5.752-14.041-11.181-26.393-18.617-41.614 78.321-31.977 113.818-77.482 118.284-83.523zM396.421 97.87c-3.81 5.427-35.697 48.286-111.021 76.519-34.712-63.776-73.185-116.168-79.04-124.008 67.176-16.193 137.966 1.27 190.061 47.489zm-230.48-33.25c5.585 7.659 43.438 60.116 78.537 122.509-99.087 26.313-186.36 25.934-195.834 25.809C62.38 147.205 106.678 92.573 165.941 64.62zM44.17 256.323c0-2.166.043-4.322.108-6.473 9.268.19 111.92 1.513 217.706-30.146 6.064 11.868 11.857 23.915 17.174 35.949-76.599 21.575-146.194 83.527-180.531 142.306C64.794 360.405 44.17 310.73 44.17 256.323zm81.807 167.113c22.127-45.233 82.178-103.622 167.579-132.756 29.74 77.283 42.039 142.053 45.189 160.638-68.112 29.013-150.015 21.053-212.768-27.882zm248.38 8.489c-2.171-12.886-13.446-74.897-41.152-151.033 66.38-10.626 124.7 6.768 131.947 9.055-9.442 58.941-43.273 109.844-90.795 141.978z"},null,-1)),te=f({__name:"theHeader",setup(a){const s=C();return(t,d)=>{const c=K,n=U;return o(),i("header",null,[e("div",W,[e("a",{id:"ak-header",href:"#ak-header",title:t.$t("shortcut.header"),accesskey:"U"},":::",8,E),m(c)]),e("div",F,[m(n,{to:l(s)("/"),title:t.$t("action.goToHomePage")},{default:g(()=>[e("img",{src:q,alt:t.$t("name.avatar")},null,8,N),e("div",Z,r(t.$t("intro.greet",{shortTime:"Hi"})),1)]),_:1},8,["to","title"])]),e("div",G,[e("p",null,r(t.$t("intro.des1")),1),e("p",null,r(t.$t("intro.des2")),1),e("nav",{class:"submenu","aria-label":t.$t("subMenu.subMenu")},[e("ul",null,[e("li",null,[m(n,{class:"btn-submenu",to:l(s)("/sitemap"),title:t.$t("action.goTo")+t.$t("mainMenu.sitemap")},{default:g(()=>[_(r(t.$t("mainMenu.sitemap")),1)]),_:1},8,["to","title"])]),e("li",null,[m(n,{class:"btn-submenu",to:l(s)("/about"),title:t.$t("action.goTo")+t.$t("mainMenu.about")},{default:g(()=>[_(r(t.$t("mainMenu.about")),1)]),_:1},8,["to","title"])]),e("li",null,[m(n,{class:"btn-submenu",to:"https://medium.com/@neil-lin",title:t.$t("action.goTo")+"Medium"+t.$t("action.openWindow"),target:"_blank",ref:"noreferrer noopener"},{default:g(()=>[(o(),i("svg",x,[e("title",null,r(t.$t("action.goTo"))+" Medium",1),J]))]),_:1},8,["title"])]),e("li",null,[m(n,{class:"btn-submenu",to:"https://dribbble.com/Neil_lin",title:t.$t("action.goTo")+"Dribbble"+t.$t("action.openWindow"),target:"_blank",ref:"noreferrer noopener"},{default:g(()=>[(o(),i("svg",Q,[e("title",null,r(t.$t("action.goTo"))+" Dribbble",1),ee]))]),_:1},8,["title"])])])],8,j)])])}}});const ae=L(te,[["__scopeId","data-v-c0e15f5e"]]),oe={key:0,class:"card"},ie={class:"card-text"},se={class:"card-des"},re={key:0,class:"tag-list"},ne={class:"visually-hidden"},le={class:"tag"},ce={class:"card-hero"},me=["src"],de={key:1,class:"card card--disabled"},ue={class:"card-text"},he={class:"card-title"},pe={class:"card-des"},ge={key:0,class:"tag-list"},we={class:"tag"},ve={class:"card-hero"},_e=["src"],be=f({__name:"theCard",props:{cardHeroImagePath:{type:String,required:!0},cardHeroImageAlt:{type:String,required:!0},cardTitle:{type:String,required:!0},cardLink:{type:String,required:!0},cardDes:{type:String,required:!0},cardTags:{type:Array,required:!0},cardDisabled:{type:Boolean}},setup(a){const s=C();return(t,d)=>{const c=U;return a.cardDisabled!=!0?(o(),i("div",oe,[e("div",ie,[m(c,{class:"card-title",to:l(s)(a.cardLink),title:t.$t("action.goTo")+`${a.cardTitle}`},{default:g(()=>[_(r(a.cardTitle),1)]),_:1},8,["to","title"]),e("div",se,r(a.cardDes),1),a.cardTags.length!=0?(o(),i("ul",re,[(o(!0),i(b,null,k(a.cardTags,(n,h)=>(o(),i("li",{key:h},[e("span",ne,r(t.$t("name.tag")),1),e("span",le,r(n),1)]))),128))])):y("",!0)]),e("div",ce,[e("img",{src:a.cardHeroImagePath,alt:"",loading:"lazy"},null,8,me)])])):(o(),i("div",de,[e("div",ue,[e("div",he,r(a.cardTitle),1),e("div",pe,r(a.cardDes),1),a.cardTags.length!=0?(o(),i("ul",ge,[(o(!0),i(b,null,k(a.cardTags,(n,h)=>(o(),i("li",{key:h},[e("span",we,r(n),1)]))),128))])):y("",!0)]),e("div",ve,[e("img",{src:a.cardHeroImagePath,alt:"",loading:"lazy"},null,8,_e)])]))}}}),ke={},fe={class:"empty-block"};function ye(a,s){return o(),i("div",fe,[z(a.$slots,"default")])}const $e=L(ke,[["render",ye]]),Ue=["title"],Te=e("span",null,"© 2023 copyright",-1),Ie=f({__name:"theFooter",setup(a){const s=Y(),{locale:t,locales:d}=$(),c=d.value;return(n,h)=>{const w=U;return o(),i("footer",null,[e("a",{id:"ak-footer",href:"#ak-footer",title:n.$t("shortcut.footer"),accesskey:"Z"}," ::: ",8,Ue),l(c).length!=0?(o(!0),i(b,{key:0},k(l(c),u=>(o(),i("span",{key:u.code},[m(w,{to:l(s)(u.code),title:n.$t("action.switch")+u.name},{default:g(()=>[_(r(u.name),1)]),_:2},1032,["to","title"])]))),128)):y("",!0),Te])}}}),Ye=[{code:"Piman",image:{path:"/portfolio/images/piman-thumbnail.webp",alt:"Piman - 無障礙 UI 框架"},name:"Piman - 無障礙 UI 框架",link:"/works/piman",overview:"Piman 是一款聚焦於無障礙網頁設計、基於 Vue 的開源 UI Frameworework。",startYear:2021,tags:["UI","UX","切版","Open Source","2021 - Today"],relatedLink:"",modifyYear:2022},{code:"choose",image:{path:"/portfolio/images/choose-chart-thumbnail.webp",alt:"Choose 蛛思：資料視覺化"},name:"Choose 蛛思：資料視覺化",link:"/works/choose-chart",overview:"藍星球資訊獨家開發圖表 - Choose 蛛思：資料視覺化",startYear:2021,tags:["UI","UX","Chart","Data Visualization","2021 - Today"],relatedLink:"https://choose.blueplanet.com.tw/lab",modifyYear:2022},{code:"scout",image:{path:"/portfolio/images/scout-thumbnail.webp",alt:"ΣCOUT 實告"},name:"ΣCOUT 實告",link:"/works/scout",overview:"ΣCOUT 實告為國內首創第一個商業履歷查詢服務。",startYear:2020,tags:["UI","切版","Chart","Data Visualization","2020 - Today"],relatedLink:"https://scout.blueplanet.com.tw/",modifyYear:2022},{code:"bpgcms",image:{path:"/portfolio/images/bpgcms-thumbnail.webp",alt:"通用後台系統模版"},name:"BPGCMS 通用後台系統模版",link:"/works/bpgcms",overview:"",startYear:2019,tags:["UX","UI","切版","2019"],relatedLink:"",modifyYear:2019,disabled:!0},{code:"vitalcrm-web",image:{path:"/portfolio/images/vitalcrm-web-thumbnail.webp",alt:"Vital CRM New Web 縮圖"},name:"Vital CRM Web",link:"/works/vitalcrm-web",overview:"業績提升、增加回購率及熟客經營最佳首選。",startYear:2018,tags:["UX","2018"],relatedLink:"https://www.gsscloud.com/tw/vital/crm",modifyYear:2018,disabled:!0},{code:"vitalttc",image:{path:"/portfolio/images/ttc-thumbnail.webp",alt:"image description"},name:"Vital TTC 物聯客",link:"/works/vitalttc",overview:"以不同回饋、獎勵與會員分級機制，達到刺激消費並留住忠誠顧客。 ",startYear:2018,tags:["UX","UI","切版","2018"],relatedLink:"https://www.gsscloud.com/tw/vital/ttc",modifyYear:2018,disabled:!0},{code:"vitalsespsurvey",image:{path:"/portfolio/images/vitalsespsurvey-thumbnail.webp",alt:"Vitals ESP Survey thumbnail"},name:"Vitals ESP Survey",link:"/works/vitalsespsurvey",overview:"提供多樣化、有效率的線上問卷調查工具，提供內部滿意度、課後問卷、意見徵求，以及外部活動滿意度調查問卷。",startYear:2017,tags:["UX","2017"],relatedLink:"https://www.vitalsesp.com/survey.html",modifyYear:2018},{code:"vitaluikit",image:{path:"/portfolio/images/vitaluikit-thumbnail.webp",alt:"Vital UI Kit thumbnail"},name:"Vital UI Kit",link:"/works/vitaluikit",overview:"一個優雅且容易客製化的前端 UI 框架。",startYear:2016,tags:["UX","切版","2016"],relatedLink:"https://vitaluikit.com/",modifyYear:2018},{code:"mpos",image:{path:"/portfolio/images/KSI-mpos-thumbnail.webp",alt:"KSI mPOS thumbnail"},name:"KSI mPOS",link:"/works/mpos",overview:"行動版餐飲 POS 系統，無論你人在哪裡，都能不受限的利用平板為顧客服務。",startYear:2016,tags:["UI","UX","2016"],relatedLink:"https://pos.ksi.com.tw/Home/MPOS",modifyYear:2018},{code:"vitalcrm-app",image:{path:"/portfolio/images/vitalcrm-app-thumbnail.webp",alt:"Vital CRM APP thumbnail"},name:"Vital CRM APP",link:"/works/vitalcrm-app",overview:"業績提升、增加回購率及熟客經營最佳首選。",startYear:2014,tags:["UI","UX","切版","2014"],relatedLink:"https://www.gsscloud.com/tw/vital/crm",modifyYear:2014}],Ce=[{code:"Piman",image:{path:"/portfolio/images/piman-thumbnail.webp",alt:"Piman - A11Y UI Framework"},name:"Piman - A11Y UI Framework",link:"/works/piman",overview:"Piman is an open-source UI framework based on Vue, with a focus on accessible web design",startYear:2021,tags:["UI","UX","Layout","Open Source","2021 - Today"],relatedLink:"",modifyYear:2022},{code:"choose",image:{path:"/portfolio/images/choose-chart-thumbnail.webp",alt:"Choose - Data Visualization"},name:"Choose: Data Visualization",link:"/works/choose-chart",overview:" Choose: Data Visualization",startYear:2021,tags:["UI","UX","Chart","Data Visualization","2021 - Today"],relatedLink:"https://choose.blueplanet.com.tw/lab",modifyYear:2022},{code:"scout",image:{path:"/portfolio/images/scout-thumbnail.webp",alt:"ΣCOUT"},name:"ΣCOUT",link:"/works/scout",overview:"ΣCOUT - The first-ever domestic commercial resume searching service in the country",startYear:2020,tags:["UI","Layout","Chart","Data Visualization","2020 - Today"],relatedLink:"https://scout.blueplanet.com.tw/",modifyYear:2022},{code:"bpgcms",image:{path:"/portfolio/images/bpgcms-thumbnail.webp",alt:"General Back-end Template by Blue Planet Inc."},name:"BPGCMS Back-end Template",link:"/works/bpgcms",overview:"",startYear:2019,tags:["UX","UI","Layout","2019"],relatedLink:"",modifyYear:2019,disabled:!0},{code:"vitalcrm-web",image:{path:"/portfolio/images/vitalcrm-web-thumbnail.webp",alt:"Vital CRM New Web"},name:"Vital CRM Web",link:"/works/vitalcrm-web",overview:"Achieving performance growth, increasing repurchase rates, and cultivating loyal customers - the ultimate choice.",startYear:2018,tags:["UX","2018"],relatedLink:"https://www.gsscloud.com/tw/vital/crm",modifyYear:2018,disabled:!0},{code:"vitalttc",image:{path:"/portfolio/images/ttc-thumbnail.webp",alt:"image description"},name:"Vital TTC",link:"/works/vitalttc",overview:"By implementing diverse feedback, rewards, and a membership tier system, we aim to stimulate consumer spending and retain loyal customers. ",startYear:2018,tags:["UX","UI","Layout","2018"],relatedLink:"https://www.gsscloud.com/tw/vital/ttc",modifyYear:2018,disabled:!0},{code:"vitalsespsurvey",image:{path:"/portfolio/images/vitalsespsurvey-thumbnail.webp",alt:"Vitals ESP Survey thumbnail"},name:"Vitals ESP Survey",link:"/works/vitalsespsurvey",overview:"We provide a diverse and efficient online survey tool that caters to various needs, including internal satisfaction surveys, post-event questionnaires, soliciting feedback, and external event satisfaction surveys.",startYear:2017,tags:["UX","2017"],relatedLink:"https://www.vitalsesp.com/survey.html",modifyYear:2018},{code:"vitaluikit",image:{path:"/portfolio/images/vitaluikit-thumbnail.webp",alt:"Vital UI Kit"},name:"Vital UI Kit",link:"/works/vitaluikit",overview:"An elegant and easily customizable front-end UI framework.",startYear:2016,tags:["UX","Layout","2016"],relatedLink:"https://vitaluikit.com/",modifyYear:2018},{code:"mpos",image:{path:"/portfolio/images/KSI-mpos-thumbnail.webp",alt:"KSI mPOS thumbnail"},name:"KSI mPOS",link:"/works/mpos",overview:"A mobile-friendly restaurant POS system that allows you to serve customers using a tablet from anywhere, without limitations.",startYear:2016,tags:["UI","UX","2016"],relatedLink:"https://pos.ksi.com.tw/Home/MPOS",modifyYear:2018},{code:"vitalcrm-app",image:{path:"/portfolio/images/vitalcrm-app.webp",alt:"Vital CRM APP"},name:"Vital CRM APP",link:"/works/vitalcrm-app",overview:"Achieving performance growth, increasing repurchase rates, and cultivating loyal customers - the ultimate choice.",startYear:2014,tags:["UI","UX","Layout","2014"],relatedLink:"https://www.gsscloud.com/tw/vital/crm",modifyYear:2014}],I=(a,s)=>new Date(a.StartYear).getTime()-new Date(s.startYear).getTime();function Le(){const{locale:a}=$();let s=X();return a.value==="en"?s=Ce.sort(I):s=Ye.sort(I),{workList:s}}const Se={class:"card-list-block"},Pe=["aria-label"],He=f({__name:"theAside",setup(a){const s=A(),{workList:t}=Le();return(d,c)=>{const n=ae,h=H,w=be,u=$e,v=Ie;return o(),i("div",Se,[m(n),l(s).path==="/"||l(s).path==="/en"?(o(),T(h,{key:0})):y("",!0),l(t).length!=0?(o(),i("nav",{key:1,"aria-label":d.$t("mainMenu.mainMenu"),class:"card-list"},[e("ul",null,[(o(!0),i(b,null,k(l(t),(p,P)=>(o(),i("li",{key:P,class:"card-item",onClick:c[0]||(c[0]=Ve=>d.$emit("closeMobileMenu"))},[m(w,{cardLink:p.link,cardTitle:p.name,cardDes:p.overview,cardHeroImagePath:p.image.path,cardHeroImageAlt:p.image.alt,cardTags:p.tags,cardTime:p.time,cardDisabled:p.disabled},null,8,["cardLink","cardTitle","cardDes","cardHeroImagePath","cardHeroImageAlt","cardTags","cardTime","cardDisabled"])]))),128))])],8,Pe)):(o(),T(u,{key:2},{default:g(()=>[_(r(d.$t("des.noData")),1)]),_:1})),m(v)])}}});export{He as _,Le as u};
