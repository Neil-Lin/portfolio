import{_ as r}from"./theAside.vue.059f076f.js";import{a as u,f as _,h as n,u as o,i as l,j as c,o as d,s as b}from"./entry.2d04bb1e.js";import{u as f}from"./useMobileMenuBtn.e4109571.js";import"./nuxt-link.fc80dded.js";import"./_plugin-vue_export-helper.c27b6911.js";import"./akContainer.8d7b3a57.js";const M={class:"page"},g={class:"page-container"},B=n("span",null,"選單",-1),C=[B],w=u({__name:"works",setup(k){const{mobileMenuStatus:t,handleToggleMobileMenuBtn:a,handleCloseMobileMenuBtn:i}=f();return(v,e)=>{const m=r,p=b;return d(),_("div",M,[n("div",{class:c(["page-aside",o(t)?"page-aside--open":""])},[n("button",{class:"btn-close-mobile-menu",onClick:e[0]||(e[0]=(...s)=>o(i)&&o(i)(...s))},"關閉選單"),l(m,{onCloseMobileMenu:e[1]||(e[1]=s=>t.value=!1)})],2),n("main",g,[n("button",{class:"btn-open-mobile-menu",onClick:e[2]||(e[2]=(...s)=>o(a)&&o(a)(...s))},C),l(p)])])}}});export{w as default};