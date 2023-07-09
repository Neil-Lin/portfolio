import{_ as U}from"./nuxt-link.5bcb16a9.js";import{a as f,b as $,B as S,o,i,j as t,t as l,p as v,F as b,x as _,u as c,k as n,w as d,y,C as L,r as V,e as M,c as C}from"./entry.263cc421.js";import{a as P,u as T}from"./composables.9833823f.js";import{_ as D}from"./akContainer.981a07f8.js";import{_ as X}from"./_plugin-vue_export-helper.c27b6911.js";const H={class:"lang-switcher"},O={id:"lang-text",class:"visually-hidden"},z=["value"],B=["value"],R=f({__name:"theLangSwitcher",setup(a){const{locale:s,locales:e}=$(),u=e.value,r=S(),m=P();function p(h){const g=h.target;r.push({path:m(g.value)})}return(h,g)=>(o(),i("div",H,[t("span",null,[t("span",O,l(h.$t("name.language")),1),v("🌐")]),t("select",{"aria-labelledby":"lang-text",value:c(s),onChange:p},[(o(!0),i(b,null,_(c(u),k=>(o(),i("option",{key:k.code,value:k.code},l(k.name),9,B))),128))],40,z)]))}}),A=""+globalThis.__publicAssetsURL("images/avatar.webp"),K={class:"toolbar"},E={class:"intro"},N=["alt"],W={class:"text"},q=["aria-label"],F=t("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 640 512"},[t("path",{d:"M180.5,74.262C80.813,74.262,0,155.633,0,256S80.819,437.738,180.5,437.738,361,356.373,361,256,280.191,74.262,180.5,74.262Zm288.25,10.646c-49.845,0-90.245,76.619-90.245,171.095s40.406,171.1,90.251,171.1,90.251-76.619,90.251-171.1H559C559,161.5,518.6,84.908,468.752,84.908Zm139.506,17.821c-17.526,0-31.735,68.628-31.735,153.274s14.2,153.274,31.735,153.274S640,340.631,640,256C640,171.351,625.785,102.729,608.258,102.729Z"})],-1),Z=t("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 512"},[t("path",{d:"M256 8C119.252 8 8 119.252 8 256s111.252 248 248 248 248-111.252 248-248S392.748 8 256 8zm163.97 114.366c29.503 36.046 47.369 81.957 47.835 131.955-6.984-1.477-77.018-15.682-147.502-6.818-5.752-14.041-11.181-26.393-18.617-41.614 78.321-31.977 113.818-77.482 118.284-83.523zM396.421 97.87c-3.81 5.427-35.697 48.286-111.021 76.519-34.712-63.776-73.185-116.168-79.04-124.008 67.176-16.193 137.966 1.27 190.061 47.489zm-230.48-33.25c5.585 7.659 43.438 60.116 78.537 122.509-99.087 26.313-186.36 25.934-195.834 25.809C62.38 147.205 106.678 92.573 165.941 64.62zM44.17 256.323c0-2.166.043-4.322.108-6.473 9.268.19 111.92 1.513 217.706-30.146 6.064 11.868 11.857 23.915 17.174 35.949-76.599 21.575-146.194 83.527-180.531 142.306C64.794 360.405 44.17 310.73 44.17 256.323zm81.807 167.113c22.127-45.233 82.178-103.622 167.579-132.756 29.74 77.283 42.039 142.053 45.189 160.638-68.112 29.013-150.015 21.053-212.768-27.882zm248.38 8.489c-2.171-12.886-13.446-74.897-41.152-151.033 66.38-10.626 124.7 6.768 131.947 9.055-9.442 58.941-43.273 109.844-90.795 141.978z"})],-1),x=f({__name:"theHeader",setup(a){const s=T();return(e,u)=>{const r=U,m=R;return o(),i("header",null,[t("div",K,[n(r,{id:"ak-header",to:"#ak-header",title:e.$t("shortcut.header"),accesskey:"U"},{default:d(()=>[v(":::")]),_:1},8,["title"]),n(m)]),t("div",E,[n(r,{to:c(s)("/"),title:e.$t("action.goToHomePage")},{default:d(()=>[t("img",{src:A,alt:e.$t("name.avatar")},null,8,N),t("div",W,l(e.$t("intro.greet",{shortTime:"Hi"})),1)]),_:1},8,["to","title"])]),t("article",null,[t("section",null,[t("p",null,l(e.$t("intro.des1")),1),t("p",null,l(e.$t("intro.des2")),1),t("nav",{class:"submenu","aria-label":e.$t("subMenu.subMenu")},[t("ul",null,[t("li",null,[n(r,{role:"button",to:c(s)("/sitemap"),title:e.$t("action.goTo")+e.$t("mainMenu.sitemap")},{default:d(()=>[v(l(e.$t("mainMenu.sitemap")),1)]),_:1},8,["to","title"])]),t("li",null,[n(r,{role:"button",to:c(s)("/about"),title:e.$t("action.goTo")+e.$t("mainMenu.about")},{default:d(()=>[v(l(e.$t("mainMenu.about")),1)]),_:1},8,["to","title"])]),t("li",null,[n(r,{role:"button",to:"https://medium.com/@neil-lin",title:e.$t("action.goTo")+"Medium"+e.$t("action.openWindow"),target:"_blank",ref:"noreferrer noopener"},{default:d(()=>[F]),_:1},8,["title"])]),t("li",null,[n(r,{role:"button",to:"https://dribbble.com/Neil_lin",title:e.$t("action.goTo")+"Dribbble"+e.$t("action.openWindow"),target:"_blank",ref:"noreferrer noopener"},{default:d(()=>[Z]),_:1},8,["title"])])])],8,q)])])])}}}),G={key:0,class:"card"},j={class:"card-text"},J={class:"card-des"},Q={key:0,class:"tag-list"},tt={class:"tag"},et={class:"card-hero"},at=["src"],ot={key:1,class:"card card--disabled"},it={class:"card-text"},st={class:"card-title"},rt={class:"card-des"},lt={key:0,class:"tag-list"},nt={class:"tag"},ct={class:"card-hero"},mt=["src"],dt=f({__name:"theCard",props:{cardHeroImagePath:{type:String,required:!0},cardHeroImageAlt:{type:String,required:!0},cardTitle:{type:String,required:!0},cardLink:{type:String,required:!0},cardDes:{type:String,required:!0},cardTags:{type:Array,required:!0},cardDisabled:{type:Boolean}},setup(a){const s=T();return(e,u)=>{const r=U;return a.cardDisabled!=!0?(o(),i("div",G,[t("div",j,[n(r,{class:"card-title",to:c(s)(a.cardLink),title:e.$t("action.goTo")+`${a.cardTitle}`},{default:d(()=>[v(l(a.cardTitle),1)]),_:1},8,["to","title"]),t("div",J,l(a.cardDes),1),a.cardTags.length!=0?(o(),i("ul",Q,[(o(!0),i(b,null,_(a.cardTags,(m,p)=>(o(),i("li",{key:p},[t("span",tt,l(m),1)]))),128))])):y("",!0)]),t("div",et,[t("img",{src:a.cardHeroImagePath,alt:"",loading:"lazy"},null,8,at)])])):(o(),i("div",ot,[t("div",it,[t("div",st,l(a.cardTitle),1),t("div",rt,l(a.cardDes),1),a.cardTags.length!=0?(o(),i("ul",lt,[(o(!0),i(b,null,_(a.cardTags,(m,p)=>(o(),i("li",{key:p},[t("span",nt,l(m),1)]))),128))])):y("",!0)]),t("div",ct,[t("img",{src:a.cardHeroImagePath,alt:"",loading:"lazy"},null,8,mt)])]))}}}),ut={},pt={class:"empty-block"};function ht(a,s){return o(),i("div",pt,[L(a.$slots,"default")])}const gt=X(ut,[["render",ht]]),wt=t("span",null,"© 2023 copyright",-1),vt=f({__name:"theFooter",setup(a){const s=P(),{locale:e,locales:u}=$(),r=u.value;return(m,p)=>{const h=U;return o(),i("footer",null,[n(h,{id:"ak-footer",to:"#ak-footer",title:m.$t("shortcut.footer"),accesskey:"Z"},{default:d(()=>[v(" ::: ")]),_:1},8,["title"]),c(r).length!=0?(o(!0),i(b,{key:0},_(c(r),g=>(o(),i("span",{key:g.code},[n(h,{to:c(s)(g.code)},{default:d(()=>[v(l(g.name),1)]),_:2},1032,["to"])]))),128)):y("",!0),wt])}}}),kt=[{code:"Piman",image:{path:"/portfolio/images/piman-thumbnail.webp",alt:"Piman - 無障礙 UI 框架"},name:"Piman - 無障礙 UI 框架",link:"/works/piman",overview:"Piman 是一款聚焦於無障礙網頁設計、基於 Vue 的開源 UI Frameworework。",startYear:2021,tags:["UI","UX","切版","open source","2021 - Today"],relatedLink:"",modifyYear:2022},{code:"choose",image:{path:"/portfolio/images/choose-chart-thumbnail.webp",alt:"Choose 蛛思-資料視覺化"},name:"Choose 蛛思-資料視覺化",link:"/works/choose-chart",overview:"藍星球資訊獨家開發圖表 - Choose蛛思 - 資料視覺化",startYear:2021,tags:["UI","UX","Chart","Data Visualization","2021 - Today"],relatedLink:"https://choose.blueplanet.com.tw/lab",modifyYear:2022},{code:"scout",image:{path:"/portfolio/images/scout-thumbnail.webp",alt:"ΣCOUT 實告"},name:"ΣCOUT 實告",link:"/works/scout",overview:"ΣCOUT 實告為國內首創第一個商業履歷查詢服務。",startYear:2020,tags:["UI","切版","Chart","Data Visualization","2020 - Today"],relatedLink:"https://scout.blueplanet.com.tw/",modifyYear:2022},{code:"bpgcms",image:{path:"/portfolio/images/bpgcms-thumbnail.webp",alt:"通用後台系統模版"},name:"BPGCMS 通用後台系統模版",link:"/works/bpgcms",overview:"",startYear:2019,tags:["UX","UI","切版","2019"],relatedLink:"",modifyYear:2019,disabled:!0},{code:"vitalcrm-web",image:{path:"/portfolio/images/vitalcrm-web-thumbnail.webp",alt:"Vital CRM New Web 縮圖"},name:"Vital CRM Web",link:"/works/vitalcrm-web",overview:"業績提升、增加回購率及熟客經營最佳首選。",startYear:2018,tags:["UX","2018"],relatedLink:"https://www.gsscloud.com/tw/vital/crm",modifyYear:2018,disabled:!0},{code:"vitalttc",image:{path:"/portfolio/images/ttc-thumbnail.webp",alt:"image description"},name:"Vital TTC 物聯客",link:"/works/vitalttc",overview:"以不同回饋、獎勵與會員分級機制，達到刺激消費並留住忠誠顧客。 ",startYear:2018,tags:["UX","UI","切版","2018"],relatedLink:"https://www.gsscloud.com/tw/vital/ttc",modifyYear:2018,disabled:!0},{code:"vitalsespsurvey",image:{path:"/portfolio/images/vitalsespsurvey-thumbnail.webp",alt:"Vitals ESP Survey thumbnail"},name:"Vitals ESP Survey",link:"/works/vitalsespsurvey",overview:"提供多樣化、有效率的線上問卷調查工具，提供內部滿意度、課後問卷、意見徵求，以及外部活動滿意度調查問卷。",startYear:2017,tags:["UX","2017"],relatedLink:"https://www.vitalsesp.com/survey.html",modifyYear:2018},{code:"vitaluikit",image:{path:"/portfolio/images/vitaluikit-thumbnail.webp",alt:"Vital UI Kit thumbnail"},name:"Vital UI Kit",link:"/works/vitaluikit",overview:"一個優雅且容易客製化的前端 UI 框架。",startYear:2016,tags:["UX","切版","2016"],relatedLink:"https://vitaluikit.com/",modifyYear:2018},{code:"mpos",image:{path:"/portfolio/images/KSI-mpos-thumbnail.webp",alt:"KSI mPOS thumbnail"},name:"KSI mPOS",link:"/works/mpos",overview:"行動版餐飲 POS 系統，無論你人在哪裡，都能不受限的利用平板為顧客服務。",startYear:2016,tags:["UI","UX","2016"],relatedLink:"https://pos.ksi.com.tw/Home/MPOS",modifyYear:2018},{code:"vitalcrm-app",image:{path:"/portfolio/images/vitalcrm-app.webp",alt:"Vital CRM APP thumbnail"},name:"Vital CRM APP",link:"/works/vitalcrm-app",overview:"業績提升、增加回購率及熟客經營最佳首選。",startYear:2014,tags:["UI","UX","切版","2014"],relatedLink:"https://www.gsscloud.com/tw/vital/crm",modifyYear:2014}],bt=[{code:"Piman",image:{path:"/portfolio/images/piman-thumbnail.webp",alt:"Piman - 無障礙 UI 框架"},name:"Piman - aaaaaa",link:"/works/piman",overview:"Piman 是一款聚焦於無障礙網頁設計、基於 Vue 的開源 UI Frameworework。",startYear:2021,tags:["UI","UX","切版","open source","2021 - Today"],relatedLink:"",modifyYear:2022},{code:"choose",image:{path:"/portfolio/images/choose-chart-thumbnail.webp",alt:"Choose 蛛思-資料視覺化"},name:"Choose 蛛思-資料視覺化",link:"/works/choose-chart",overview:"藍星球資訊獨家開發圖表 - Choose蛛思 - 資料視覺化",startYear:2021,tags:["UI","UX","Chart","Data Visualization","2021 - Today"],relatedLink:"https://choose.blueplanet.com.tw/lab",modifyYear:2022},{code:"scout",image:{path:"/portfolio/images/scout-thumbnail.webp",alt:"ΣCOUT 實告"},name:"ΣCOUT 實告",link:"/works/scout",overview:"ΣCOUT 實告為國內首創第一個商業履歷查詢服務。",startYear:2020,tags:["UI","切版","Chart","Data Visualization","2020 - Today"],relatedLink:"https://scout.blueplanet.com.tw/",modifyYear:2022},{code:"bpgcms",image:{path:"/portfolio/images/bpgcms-thumbnail.webp",alt:"通用後台系統模版"},name:"BPGCMS 通用後台系統模版",link:"/works/bpgcms",overview:"",startYear:2019,tags:["UX","UI","切版","2019"],relatedLink:"",modifyYear:2019,disabled:!0},{code:"vitalcrm-web",image:{path:"/portfolio/images/vitalcrm-web-thumbnail.webp",alt:"Vital CRM New Web 縮圖"},name:"Vital CRM Web",link:"/works/vitalcrm-web",overview:"業績提升、增加回購率及熟客經營最佳首選。",startYear:2018,tags:["UX","2018"],relatedLink:"https://www.gsscloud.com/tw/vital/crm",modifyYear:2018,disabled:!0},{code:"vitalttc",image:{path:"/portfolio/images/ttc-thumbnail.webp",alt:"image description"},name:"Vital TTC 物聯客",link:"/works/vitalttc",overview:"以不同回饋、獎勵與會員分級機制，達到刺激消費並留住忠誠顧客。 ",startYear:2018,tags:["UX","UI","切版","2018"],relatedLink:"https://www.gsscloud.com/tw/vital/ttc",modifyYear:2018,disabled:!0},{code:"vitalsespsurvey",image:{path:"/portfolio/images/vitalsespsurvey-thumbnail.webp",alt:"Vitals ESP Survey thumbnail"},name:"Vitals ESP Survey",link:"/works/vitalsespsurvey",overview:"提供多樣化、有效率的線上問卷調查工具，提供內部滿意度、課後問卷、意見徵求，以及外部活動滿意度調查問卷。",startYear:2017,tags:["UX","2017"],relatedLink:"https://www.vitalsesp.com/survey.html",modifyYear:2018},{code:"vitaluikit",image:{path:"/portfolio/images/vitaluikit-thumbnail.webp",alt:"Vital UI Kit thumbnail"},name:"Vital UI Kit",link:"/works/vitaluikit",overview:"一個優雅且容易客製化的前端 UI 框架。",startYear:2016,tags:["UX","切版","2016"],relatedLink:"https://vitaluikit.com/",modifyYear:2018},{code:"mpos",image:{path:"/portfolio/images/KSI-mpos-thumbnail.webp",alt:"KSI mPOS thumbnail"},name:"KSI mPOS",link:"/works/mpos",overview:"行動版餐飲 POS 系統，無論你人在哪裡，都能不受限的利用平板為顧客服務。",startYear:2016,tags:["UI","UX","2016"],relatedLink:"https://pos.ksi.com.tw/Home/MPOS",modifyYear:2018},{code:"vitalcrm-app",image:{path:"/portfolio/images/vitalcrm-app.webp",alt:"Vital CRM APP thumbnail"},name:"Vital CRM APP",link:"/works/vitalcrm-app",overview:"業績提升、增加回購率及熟客經營最佳首選。",startYear:2014,tags:["UI","UX","切版","2014"],relatedLink:"https://www.gsscloud.com/tw/vital/crm",modifyYear:2014}],Y=(a,s)=>new Date(a.StartYear).getTime()-new Date(s.startYear).getTime();function _t(){const{locale:a}=$();let s=V();return a.value==="en"?s=bt.sort(Y):s=kt.sort(Y),{workList:s}}const ft={class:"card-list-block"},yt=["aria-label"],It=f({__name:"theAside",setup(a){const s=M(),{workList:e}=_t();return(u,r)=>{const m=x,p=D,h=dt,g=gt,k=vt;return o(),i("div",ft,[n(m),c(s).path==="/"?(o(),C(p,{key:0})):y("",!0),c(e).length!=0?(o(),i("nav",{key:1,"aria-label":u.$t("mainMenu.mainMenu"),class:"card-list"},[t("ul",null,[(o(!0),i(b,null,_(c(e),(w,I)=>(o(),i("li",{key:I,onClick:r[0]||(r[0]=Ut=>u.$emit("closeMobileMenu"))},[n(h,{cardLink:w.link,cardTitle:w.name,cardDes:w.overview,cardHeroImagePath:w.image.path,cardHeroImageAlt:w.image.alt,cardTags:w.tags,cardTime:w.time,cardDisabled:w.disabled},null,8,["cardLink","cardTitle","cardDes","cardHeroImagePath","cardHeroImageAlt","cardTags","cardTime","cardDisabled"])]))),128))])],8,yt)):(o(),C(g,{key:2},{default:d(()=>[v(l(u.$t("des.noData")),1)]),_:1})),n(k)])}}});export{It as _,_t as u};
