(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{325:function(t,e,l){"use strict";var v=l(89),_=Object(v.b)({props:{path:{type:Array,default:[{title:"home",to:"/"}],required:!0}},setup:function(){return{}}}),r=l(36),component=Object(r.a)(_,(function(){var t=this,e=t.$createElement,l=t._self._c||e;return l("div",{staticClass:"breadcrumbs"},[t.path.length?l("bpa-breadcrumb",t._l(t.path,(function(e,v){return l("bpa-breadcrumb-item",{key:"path-"+v,attrs:{title:e.title,to:e.to}},[t._v(t._s(e.title))])})),1):t._e()],1)}),[],!1,null,null,null);e.a=component.exports},330:function(t,e,l){"use strict";l.r(e);var v=l(89),_=l(325),r=Object(v.b)({head:{},components:{breadcrumbs:_.a},setup:function(){var t=Object(v.g)(),e=Object(v.d)("Vital UI Kit");Object(v.f)((function(){return{title:e.value,meta:[{hid:"description",name:"description",content:"Vital UI Kit"},{hid:"og:title",property:"og:title",content:"Vital UI Kit"},{hid:"og:description",property:"og:description",content:"Vital UI Kit"},{hid:"twitter:title",name:"twitter:title",content:"Vital UI Kit"},{hid:"twitter:description",name:"twitter:description",content:"Vital UI Kit"}]}}));var path=Object(v.a)((function(){return[{title:"首頁",to:"/"},{title:"作品",to:"/"},{title:e.value,to:"/works/"+t.value.params.var}]}));return{pageTitle:e,path:path}}}),n=l(36),component=Object(n.a)(r,(function(){var t=this,e=t.$createElement,l=t._self._c||e;return l("div",{staticClass:"page page--work"},[l("main",{staticClass:"container"},[l("nuxt-link",{attrs:{to:t.$nuxt.$route.path+"#ak-container",id:"ak-container",name:"ak-container",title:"內容",accesskey:"C"}},[t._v(":::")]),t._v(" "),l("breadcrumbs",{attrs:{path:t.path}}),t._v(" "),l("h2",[t._v(t._s(t.pageTitle))]),t._v(" "),l("article",[t._m(0),t._v(" "),t._m(1),t._v(" "),t._m(2),t._v(" "),l("section",[l("h3",[t._v("相關連結")]),t._v(" "),l("div",{staticClass:"flex-list"},[l("div",[l("h4",{staticClass:"flex-list-title"},[t._v("網站")]),t._v(" "),l("ol",[l("li",[l("a",{ref:"noreferrer noopener",attrs:{href:"https://vitaluikit.com/",title:"前往 Vital UI Kit(另開視窗)",target:"_blank"}},[t._v("Vital UI Kit")])])])])])])])],1)])}),[function(){var t=this,e=t.$createElement,l=t._self._c||e;return l("section",[l("div",{staticClass:"flex-list flex-list--page-intro"},[l("div",[l("div",{staticClass:"flex-list-title"},[t._v("目標")]),t._v(" "),l("ul",[l("li",[t._v("建造設計系統")]),t._v(" "),l("li",[t._v("屬於台灣開源的 UI Kit")]),t._v(" "),l("li",[t._v("建造工程師與設計師之謙的橋樑")])])]),t._v(" "),l("div",[l("div",{staticClass:"flex-list-title"},[t._v("角色")]),t._v(" "),l("ul",[l("li",[t._v("UX Designer(UX Writer)")]),t._v(" "),l("li",[t._v("切版")])])]),t._v(" "),l("div",[l("div",{staticClass:"flex-list-title"},[t._v("工具")]),t._v(" "),l("ul",[l("li",[t._v("Sketch app")]),t._v(" "),l("li",[t._v("Fabricator")])])])])])},function(){var t=this,e=t.$createElement,l=t._self._c||e;return l("section",[l("h3",[t._v("概要")]),t._v(" "),l("p",[t._v("Vital UI Kit 是一款優雅且容易客製化的前端 UI 框架。")]),t._v(" "),l("figure",[l("img",{attrs:{src:"images/vitaluikit-thumbnail.webp",alt:"Vital UI Kit 簡介"}}),t._v(" "),l("figcaption",{staticClass:"hint"},[t._v("Vital UI Kit 簡介")])])])},function(){var t=this,e=t.$createElement,l=t._self._c||e;return l("section",[l("h3",[t._v("過程")]),t._v(" "),l("div",{staticClass:"flex-list"},[l("div",[l("h4",{staticClass:"flex-list-title"},[t._v("觀察市場產品")]),t._v(" "),l("ul",[l("li",[t._v("jQuery UI")]),t._v(" "),l("li",[t._v("Bootstrap")]),t._v(" "),l("li",[t._v("Foundation")]),t._v(" "),l("li",[t._v("Semantic UI")]),t._v(" "),l("li",[t._v("Material UI")])])]),t._v(" "),l("div",[l("h4",{staticClass:"flex-list-title"},[t._v("學習領域知識")]),t._v(" "),l("ul",[l("li",[t._v("什麼是設計系統？")]),t._v(" "),l("li",[t._v("什麼是 UI kit？")]),t._v(" "),l("li",[t._v("有什麼競品？")]),t._v(" "),l("li",[t._v("誰會使用？")]),t._v(" "),l("li",[t._v("為什麼台灣沒有開源 UI Kit？")])])])]),t._v(" "),l("div",{staticClass:"flex-list"},[l("div",[l("h4",{staticClass:"flex-list-title"},[t._v("Persona 1")]),t._v(" "),l("ol",[l("li",[t._v("Neil / 28 / UI Designer")]),t._v(" "),l("li",[t._v("痛點：設計稿版本控管、重複使用設計與快速協作。")]),t._v(" "),l("li",[t._v("目標：初始化專案時，設計稿便已經準備好且共同修改容易。")])])]),t._v(" "),l("div",[l("h4",{staticClass:"flex-list-title"},[t._v("Persona 2")]),t._v(" "),l("ol",[l("li",[t._v("CJ / 26 / Front-end engineer")]),t._v(" "),l("li",[t._v("痛點：產品間沒有共同設計語言以及浪費時間重工元件。")]),t._v(" "),l("li",[t._v("目標：專案初始化時，元件全部到定位、修改容易以及與其他套件兼容。")])])])]),t._v(" "),l("div",{staticClass:"flex-list"},[l("div",[l("h4",{staticClass:"flex-list-title"},[t._v("研究")]),t._v(" "),l("ol",[l("li",[t._v("研究前述各大前端 UI 框架設計稿與切版如何搭配。")]),t._v(" "),l("li",[t._v("研究 Sketch App 設計稿管理與協作規則制定，例如參數設定等。")]),t._v(" "),l("li",[t._v("研究 CSS 管理與命名規則。")]),t._v(" "),l("li",[t._v("研究融合 設計稿 與 CSS 命名規則，方便一眼便知是哪個元件。")]),t._v(" "),l("li",[t._v("研究以何種方式建立 Document 網站內容。")]),t._v(" "),l("li",[t._v("研究LandingPage 文案、個性朔造。")])])])]),t._v(" "),l("div",{staticClass:"flex-list"},[l("div",[l("h4",{staticClass:"flex-list-title"},[t._v("產出")]),t._v(" "),l("figure",[l("img",{attrs:{src:"images/vitaluikit-sketch.webp",alt:"Sketch App檔案示意圖"}}),t._v(" "),l("figcaption",{staticClass:"hint"},[t._v("Sketch App檔案示意圖")])]),t._v(" "),l("figure",[l("img",{attrs:{src:"images/vitaluikit-docs.webp",alt:"文件示意圖"}}),t._v(" "),l("figcaption",{staticClass:"hint"},[t._v("使用 Fabricator 建立文件")])])])])])}],!1,null,null,null);e.default=component.exports}}]);