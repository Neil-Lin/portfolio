import{_ as u}from"./nuxt-link.7c9694c6.js";import{u as m}from"./composables.c1b455b3.js";import{f as p,o as d,c as _,a,b as r,w as l,d as i,t as s,j as c}from"./entry.308f0be4.js";const g={"aria-label":"breadcrumb",class:"breadcrumb"},k=p({__name:"theBreadcrumb",props:{pageTitle:{type:String,required:!0},pageLink:{type:String,required:!0}},setup(e){const o=m();return(t,f)=>{const n=u;return d(),_("nav",g,[a("ul",null,[a("li",null,[r(n,{to:c(o)("/"),title:t.$t("action.goToHomePage")},{default:l(()=>[i(s(t.$t("name.home")),1)]),_:1},8,["to","title"])]),a("li",null,[r(n,{to:c(o)(e.pageLink),title:t.$t("action.goTo")+e.pageTitle},{default:l(()=>[i(s(e.pageTitle),1)]),_:1},8,["to","title"])])])])}}});export{k as _};