import{_ as Z}from"./ClL6G7ct.js";import{m as x,C as ee,K as te,D as oe,L as se,r as w,i as _,w as S,M as le,E as ae,G as ne,p as a,x as t,y as U,J as u,N as T,h as n,H as re,F as g,q as r,O as N,P as V,Q as D,v as $,R as Q,z,S as ie,T as ue,B as F,A as s,U as de,_ as ce}from"./XIWjnJOt.js";import{_ as pe}from"./C5jruRqJ.js";import{_ as me}from"./B8ZooLIH.js";import{p as ve}from"./1OiEtZJD.js";const fe={class:"page page--grid"},_e={class:"page-container"},he={class:"filters"},ye={for:"sortorder"},ge={value:"desc"},ke={value:"asc"},we={for:"roleFilter"},$e={value:""},be=["value"],Re={for:"platformFilter"},Pe={value:""},Ce={class:"group-year-present"},Se={class:"portfolio-list"},qe={class:"portfolio-title"},Be={class:"portfolio-content"},Me=["src","alt"],Ue={key:1,class:"portfolio-intro"},Te={class:"portfolio-footer"},Ne={class:"tag"},Ve={key:0,class:"visually-hidden"},De={key:1,class:"tag"},Fe={key:2,class:"tag"},Ie={key:3,class:"visually-hidden"},Ae={key:1,class:"portfolio-link portfolio-link--disabled"},Ee={class:"portfolio-title"},He={class:"portfolio-content"},Le=["src"],We={key:0,class:"portfolio-intro"},Oe={class:"portfolio-footer"},Qe={class:"tag"},ze={key:0,class:"visually-hidden"},je={key:1,class:"tag"},Ge={key:2,class:"tag"},Je={key:3,class:"visually-hidden"},Ke=x({__name:"products",setup(Ye){const{t:m,locale:I}=ee(),q=te(),i=oe(),A=se(),k=w(null),E=w(ve),b=ne(),R=_(()=>m("words.products")),B=_(()=>m("words.careerWorks")),c=w(i.query.sortorder?String(i.query.sortorder):"desc"),v=w(i.query.role?String(i.query.role):""),f=w(i.query.platform?String(i.query.platform):""),h=_(()=>i.query.dialog==="true"&&i.params.name),j=_(()=>{const e=new Set;return E.value.forEach(o=>{o.roles[I.value].forEach(p=>e.add(p))}),Array.from(e)});S([v,f,c],()=>{q.replace({path:i.path,query:{role:v.value||void 0,platform:f.value||void 0,sortorder:c.value||void 0}})}),S(()=>i.query,e=>{v.value=e.role?String(e.role):"",f.value=e.platform?String(e.platform):"",c.value=e.sortorder?String(e.sortorder):"desc"});const G=_(()=>E.value.filter(e=>{const o=v.value===""||e.roles[I.value].includes(v.value),p=f.value===""||e.platform.includes(f.value);return o&&p}).sort((e,o)=>c.value==="asc"?e.yearRange.start-o.yearRange.start:o.yearRange.start-e.yearRange.start)),H=_(()=>{const e=[];return G.value.forEach(o=>{const p=o.yearRange.start;let y=e.find(M=>M.year===p);y||(y={year:p,products:[]},e.push(y)),y.products.push(o)}),e.sort((o,p)=>c.value==="asc"?o.year-p.year:p.year-o.year),e}),L=e=>e.end===null?`${e.start} - `+m("words.present"):`${e.start} - ${e.end}`,W=async()=>{var e;(e=k.value)==null||e.close(),await q.replace({path:A("/products"),query:{role:v.value||void 0,platform:f.value||void 0,sortorder:c.value||void 0}})};S(()=>i.fullPath,()=>{var e;h.value||(e=k.value)==null||e.close()}),S(h,async e=>{var o;e&&(await de(),(o=k.value)==null||o.showModal())}),le(()=>{var e;h.value&&((e=k.value)==null||e.showModal()),Object.keys(i.query).length>0&&q.replace(i.path)}),ae({title:R,meta:[{hid:"description",name:"description",content:B.value},{hid:"og:url",property:"og:url",content:b.public.baseUrl+i.path},{hid:"og:title",property:"og:title",content:R.value+" - "+m("website.name")},{hid:"og:description",property:"og:description",content:B.value},{hid:"twitter:url",name:"twitter:url",content:b.public.baseUrl+i.path},{hid:"twitter:title",name:"twitter:title",content:R.value+" - "+m("website.name")},{hid:"twitter:description",name:"twitter:description",content:B.value}]});const J=_(()=>i.params.name?[{link:"/",title:m("action.goToHomePage")},{link:"/products",title:m("mainMenu.products")},{title:i.params.name}]:[{link:"/",title:m("action.goToHomePage")},{link:"",title:m("mainMenu.products")}]);return(e,o)=>{const p=Z,y=re,M=pe,K=me,O=ue;return s(),a("main",fe,[t("div",_e,[U(p,{list:n(J)},null,8,["list"]),U(y),!n(i).params.name||n(h)?(s(),a(g,{key:0},[t("h2",null,r(n(R)),1),t("div",he,[t("div",null,[t("label",ye,r(e.$t("words.sort"))+"：",1),N(t("select",{id:"sortorder","onUpdate:modelValue":o[0]||(o[0]=d=>D(c)?c.value=d:null)},[t("option",ge,r(e.$t("words.newToOld")),1),t("option",ke,r(e.$t("words.oldToNew")),1)],512),[[V,n(c)]])]),t("div",null,[t("label",we,r(e.$t("words.roles"))+"：",1),N(t("select",{id:"roleFilter","onUpdate:modelValue":o[1]||(o[1]=d=>D(v)?v.value=d:null)},[t("option",$e,r(e.$t("words.all")),1),(s(!0),a(g,null,$(n(j),d=>(s(),a("option",{key:d,value:d},r(d),9,be))),128))],512),[[V,n(v)]])]),t("div",null,[t("label",Re,r(e.$t("words.platform"))+"：",1),N(t("select",{id:"platformFilter","onUpdate:modelValue":o[2]||(o[2]=d=>D(f)?f.value=d:null)},[t("option",Pe,r(e.$t("words.all")),1),o[3]||(o[3]=t("option",{value:"web"},"Web",-1)),o[4]||(o[4]=t("option",{value:"app"},"App",-1))],512),[[V,n(f)]])])]),n(H).length>0?(s(),a("div",{key:0,class:Q(["group-list",n(c)==="desc"?"group-list--top-space":"group-list--bottom-space"]),"aria-live":"polite"},[t("div",Ce,r(e.$t("words.today")),1),(s(!0),a(g,null,$(n(H),d=>(s(),a("div",{key:d.year,class:"portfolio-area"},[t("ul",Se,[(s(!0),a(g,null,$(d.products,l=>(s(),a("li",{key:l.id,class:"portfolio-item animation-fade-out"},[l.clickable?(s(),T(M,{key:0,to:{path:n(A)(`/products/${encodeURIComponent(l.slug)}`),query:{dialog:"true",role:n(v)||void 0,platform:n(f)||void 0,sortorder:n(c)||void 0}},title:`${l.name[e.$i18n.locale]}`,class:"portfolio-link"},{default:z(()=>{var P,C;return[t("h3",qe,r(l.name[e.$i18n.locale]),1),t("div",Be,[(C=(P=l.heroImage[e.$i18n.locale])==null?void 0:P[0])!=null&&C.src?(s(),a("img",{key:0,src:`${n(b).public.baseUrl}${l.heroImage[e.$i18n.locale][0].src}`,alt:`${l.name[e.$i18n.locale]}`,class:"portfolio-img"},null,8,Me)):u("",!0),l.intro[e.$i18n.locale]?(s(),a("div",Ue,[t("p",null,r(l.intro[e.$i18n.locale]),1)])):u("",!0)]),t("div",Te,[o[6]||(o[6]=t("span",{class:"visually-hidden"},"相關標籤：",-1)),t("span",Ne,[o[5]||(o[5]=t("span",{class:"visually-hidden"},"執行起始時間：",-1)),F(" "+r(L(l.yearRange)),1)]),l.platform.includes("web")||l.platform.includes("app")?(s(),a("span",Ve," 平臺種類： ")):u("",!0),l.platform.includes("web")?(s(),a("span",De," Web ")):u("",!0),l.platform.includes("app")?(s(),a("span",Fe," App ")):u("",!0),l.roles[e.$i18n.locale].length>0?(s(),a("span",Ie," 擔當角色： ")):u("",!0),(s(!0),a(g,null,$(l.roles[e.$i18n.locale],(Y,X)=>(s(),a("span",{key:X,class:"tag"},r(Y),1))),128))])]}),_:2},1032,["to","title"])):(s(),a("div",Ae,[t("h3",Ee,r(l.name[e.$i18n.locale]),1),t("div",He,[t("img",{src:`${n(b).public.baseUrl}${l.heroImage[e.$i18n.locale][0].src}`,alt:"",class:"portfolio-img"},null,8,Le),l.intro[e.$i18n.locale]?(s(),a("div",We,[t("p",null,r(l.intro[e.$i18n.locale]),1)])):u("",!0)]),t("div",Oe,[o[8]||(o[8]=t("span",{class:"visually-hidden"},"相關標籤：",-1)),t("span",Qe,[o[7]||(o[7]=t("span",{class:"visually-hidden"},"執行起始時間：",-1)),F(" "+r(L(l.yearRange)),1)]),l.platform.includes("web")||l.platform.includes("app")?(s(),a("span",ze," 平臺種類： ")):u("",!0),l.platform.includes("web")?(s(),a("span",je," Web ")):u("",!0),l.platform.includes("app")?(s(),a("span",Ge," App ")):u("",!0),l.roles[e.$i18n.locale].length>0?(s(),a("span",Je," 擔當角色： ")):u("",!0),(s(!0),a(g,null,$(l.roles[e.$i18n.locale],(P,C)=>(s(),a("span",{key:C,class:"tag"},r(P),1))),128))])]))]))),128))]),t("div",{class:Q(["group-year",n(c)==="desc"?"group-year--bottom":"group-year--top"])},r(d.year),3)]))),128))],2)):(s(),T(K,{key:1},{default:z(()=>[F(r(e.$t("data.nodata")),1)]),_:1}))],64)):u("",!0),n(i).params.name&&n(h)?(s(),a("dialog",{key:1,ref_key:"lightBox",ref:k,onCancel:ie(W,["prevent"])},[t("button",{type:"button",class:"btn btn--close-dialog",onClick:W},r(n(m)("action.closeDialog")),1),U(O)],544)):u("",!0),n(i).params.name&&!n(h)?(s(),T(O,{key:2})):u("",!0)])])}}}),st=ce(Ke,[["__scopeId","data-v-5442357a"]]);export{st as default};
