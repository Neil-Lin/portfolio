var G=Object.defineProperty;var X=(o,a,t)=>a in o?G(o,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[a]=t;var O=(o,a,t)=>X(o,typeof a!="symbol"?a+"":a,t);import{_ as J}from"./BzcRdoL_.js";import{s as Q,u as Y,a as S,r as z,b as Z,t as A,g as tt,o as et,c as at,w as st,d as L,e as nt,f as ot,h as p,i as x,j as it,k as rt,l as E,m as I,n as v,p as C,q as $,F as U,v as N,x as K,y as k,z as R,A as q,B as b,_ as ct,C as lt,D as ut,E as dt,G as ft,H as ht}from"./D5jHarp1.js";import{_ as W}from"./C7h8amAY.js";const _t=[1779033703,-1150833019,1013904242,-1521486534,1359893119,-1694144372,528734635,1541459225],mt=[1116352408,1899447441,-1245643825,-373957723,961987163,1508970993,-1841331548,-1424204075,-670586216,310598401,607225278,1426881987,1925078388,-2132889090,-1680079193,-1046744716,-459576895,-272742522,264347078,604807628,770255983,1249150122,1555081692,1996064986,-1740746414,-1473132947,-1341970488,-1084653625,-958395405,-710438585,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,-2117940946,-1838011259,-1564481375,-1474664885,-1035236496,-949202525,-778901479,-694614492,-200395387,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,-2067236844,-1933114872,-1866530822,-1538233109,-1090935817,-965641998],gt="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",M=[];class pt{constructor(){O(this,"_data",new T);O(this,"_hash",new T([..._t]));O(this,"_nDataBytes",0);O(this,"_minBufferSize",0)}finalize(a){a&&this._append(a);const t=this._nDataBytes*8,s=this._data.sigBytes*8;return this._data.words[s>>>5]|=128<<24-s%32,this._data.words[(s+64>>>9<<4)+14]=Math.floor(t/4294967296),this._data.words[(s+64>>>9<<4)+15]=t,this._data.sigBytes=this._data.words.length*4,this._process(),this._hash}_doProcessBlock(a,t){const s=this._hash.words;let e=s[0],n=s[1],i=s[2],f=s[3],l=s[4],_=s[5],h=s[6],r=s[7];for(let d=0;d<64;d++){if(d<16)M[d]=a[t+d]|0;else{const c=M[d-15],P=(c<<25|c>>>7)^(c<<14|c>>>18)^c>>>3,g=M[d-2],V=(g<<15|g>>>17)^(g<<13|g>>>19)^g>>>10;M[d]=P+M[d-7]+V+M[d-16]}const B=l&_^~l&h,D=e&n^e&i^n&i,w=(e<<30|e>>>2)^(e<<19|e>>>13)^(e<<10|e>>>22),u=(l<<26|l>>>6)^(l<<21|l>>>11)^(l<<7|l>>>25),y=r+u+B+mt[d]+M[d],m=w+D;r=h,h=_,_=l,l=f+y|0,f=i,i=n,n=e,e=y+m|0}s[0]=s[0]+e|0,s[1]=s[1]+n|0,s[2]=s[2]+i|0,s[3]=s[3]+f|0,s[4]=s[4]+l|0,s[5]=s[5]+_|0,s[6]=s[6]+h|0,s[7]=s[7]+r|0}_append(a){typeof a=="string"&&(a=T.fromUtf8(a)),this._data.concat(a),this._nDataBytes+=a.sigBytes}_process(a){let t,s=this._data.sigBytes/64;a?s=Math.ceil(s):s=Math.max((s|0)-this._minBufferSize,0);const e=s*16,n=Math.min(e*4,this._data.sigBytes);if(e){for(let i=0;i<e;i+=16)this._doProcessBlock(this._data.words,i);t=this._data.words.splice(0,e),this._data.sigBytes-=n}return new T(t,n)}}class T{constructor(a,t){O(this,"words");O(this,"sigBytes");a=this.words=a||[],this.sigBytes=t===void 0?a.length*4:t}static fromUtf8(a){const t=unescape(encodeURIComponent(a)),s=t.length,e=[];for(let n=0;n<s;n++)e[n>>>2]|=(t.charCodeAt(n)&255)<<24-n%4*8;return new T(e,s)}toBase64(){const a=[];for(let t=0;t<this.sigBytes;t+=3){const s=this.words[t>>>2]>>>24-t%4*8&255,e=this.words[t+1>>>2]>>>24-(t+1)%4*8&255,n=this.words[t+2>>>2]>>>24-(t+2)%4*8&255,i=s<<16|e<<8|n;for(let f=0;f<4&&t*8+f*6<this.sigBytes*8;f++)a.push(gt.charAt(i>>>6*(3-f)&63))}return a.join("")}concat(a){if(this.words[this.sigBytes>>>2]&=4294967295<<32-this.sigBytes%4*8,this.words.length=Math.ceil(this.sigBytes/4),this.sigBytes%4)for(let t=0;t<a.sigBytes;t++){const s=a.words[t>>>2]>>>24-t%4*8&255;this.words[this.sigBytes+t>>>2]|=s<<24-(this.sigBytes+t)%4*8}else for(let t=0;t<a.sigBytes;t+=4)this.words[this.sigBytes+t>>>2]=a.words[t>>>2];this.sigBytes+=a.sigBytes}}function yt(o){return new pt().finalize(o).toBase64()}function wt(o){return yt(Q(o))}const vt=o=>o==="defer"||o===!1;function bt(...o){var w;const a=typeof o[o.length-1]=="string"?o.pop():void 0;typeof o[0]!="string"&&o.unshift(a);let[t,s,e={}]=o;if(typeof t!="string")throw new TypeError("[nuxt] [asyncData] key must be a string.");if(typeof s!="function")throw new TypeError("[nuxt] [asyncData] handler must be a function.");const n=Y(),i=s,f=()=>S.value,l=()=>n.isHydrating?n.payload.data[t]:n.static.data[t];e.server??(e.server=!0),e.default??(e.default=f),e.getCachedData??(e.getCachedData=l),e.lazy??(e.lazy=!1),e.immediate??(e.immediate=!0),e.deep??(e.deep=S.deep),e.dedupe??(e.dedupe="cancel");const _=e.getCachedData(t,n),h=_!=null;if(!n._asyncData[t]||!e.immediate){(w=n.payload._errors)[t]??(w[t]=S.errorValue);const u=e.deep?z:Z;n._asyncData[t]={data:u(h?_:e.default()),pending:z(!h),error:A(n.payload._errors,t),status:z("idle"),_default:e.default}}const r={...n._asyncData[t]};delete r._default,r.refresh=r.execute=(u={})=>{if(n._asyncDataPromises[t]){if(vt(u.dedupe??e.dedupe))return n._asyncDataPromises[t];n._asyncDataPromises[t].cancelled=!0}if(u._initial||n.isHydrating&&u._initial!==!1){const m=u._initial?_:e.getCachedData(t,n);if(m!=null)return Promise.resolve(m)}r.pending.value=!0,r.status.value="pending";const y=new Promise((m,c)=>{try{m(i(n))}catch(P){c(P)}}).then(async m=>{if(y.cancelled)return n._asyncDataPromises[t];let c=m;e.transform&&(c=await e.transform(m)),e.pick&&(c=Bt(c,e.pick)),n.payload.data[t]=c,r.data.value=c,r.error.value=S.errorValue,r.status.value="success"}).catch(m=>{if(y.cancelled)return n._asyncDataPromises[t];r.error.value=ot(m),r.data.value=p(e.default()),r.status.value="error"}).finally(()=>{y.cancelled||(r.pending.value=!1,delete n._asyncDataPromises[t])});return n._asyncDataPromises[t]=y,n._asyncDataPromises[t]},r.clear=()=>Dt(n,t);const d=()=>r.refresh({_initial:!0}),B=e.server!==!1&&n.payload.serverRendered;{const u=tt();if(u&&B&&e.immediate&&!u.sp&&(u.sp=[]),u&&!u._nuxtOnBeforeMountCbs){u._nuxtOnBeforeMountCbs=[];const c=u._nuxtOnBeforeMountCbs;et(()=>{c.forEach(P=>{P()}),c.splice(0,c.length)}),at(()=>c.splice(0,c.length))}B&&n.isHydrating&&(r.error.value||_!=null)?(r.pending.value=!1,r.status.value=r.error.value?"error":"success"):u&&(n.payload.serverRendered&&n.isHydrating||e.lazy)&&e.immediate?u._nuxtOnBeforeMountCbs.push(d):e.immediate&&d();const y=nt();if(e.watch){const c=st(e.watch,()=>r.refresh());y&&L(c)}const m=n.hook("app:data:refresh",async c=>{(!c||c.includes(t))&&await r.refresh()});y&&L(m)}const D=Promise.resolve(n._asyncDataPromises[t]).then(()=>r);return Object.assign(D,r),D}function Dt(o,a){a in o.payload.data&&(o.payload.data[a]=void 0),a in o.payload._errors&&(o.payload._errors[a]=S.errorValue),o._asyncData[a]&&(o._asyncData[a].data.value=p(o._asyncData[a]._default()),o._asyncData[a].error.value=S.errorValue,o._asyncData[a].pending.value=!1,o._asyncData[a].status.value="idle"),a in o._asyncDataPromises&&(o._asyncDataPromises[a]&&(o._asyncDataPromises[a].cancelled=!0),o._asyncDataPromises[a]=void 0)}function Bt(o,a){const t={};for(const s of a)t[s]=o[s];return t}function Ct(o,a,t){const[s={},e]=[{},a],n=x(()=>E(o)),i=s.key||wt([e,typeof n.value=="string"?n.value:"",...kt(s)]);if(!i||typeof i!="string")throw new TypeError("[nuxt] [useFetch] key must be a string: "+i);if(!o)throw new Error("[nuxt] [useFetch] request is missing.");const f=i===e?"$f"+i:i;if(!s.baseURL&&typeof n.value=="string"&&n.value[0]==="/"&&n.value[1]==="/")throw new Error('[nuxt] [useFetch] the request URL must not start with "//".');const{server:l,lazy:_,default:h,transform:r,pick:d,watch:B,immediate:D,getCachedData:w,deep:u,dedupe:y,...m}=s,c=it({...rt,...m,cache:typeof s.cache=="boolean"?void 0:s.cache}),P={server:l,lazy:_,default:h,transform:r,pick:d,immediate:D,getCachedData:w,deep:u,dedupe:y,watch:B===!1?[]:[c,n,...B||[]]};let g;return bt(f,()=>{var H;(H=g==null?void 0:g.abort)==null||H.call(g,new DOMException("Request aborted as another request to the same endpoint was initiated.","AbortError")),g=typeof AbortController<"u"?new AbortController:{};const F=E(s.timeout);let j;return F&&(j=setTimeout(()=>g.abort(new DOMException("Request aborted due to timeout.","AbortError")),F),g.signal.onabort=()=>clearTimeout(j)),(s.$fetch||globalThis.$fetch)(n.value,{signal:g.signal,...c}).finally(()=>{clearTimeout(j)})},P)}function kt(o){var t;const a=[((t=E(o.method))==null?void 0:t.toUpperCase())||"GET",E(o.baseURL)];for(const s of[o.params||o.query]){const e=E(s);if(!e)continue;const n={};for(const[i,f]of Object.entries(e))n[E(i)]=E(f);a.push(n)}return a}const $t={key:0},Pt={key:1},Ot={key:2,class:"blog-list"},Mt=I({__name:"mediumPosts",props:{username:{type:String,required:!0}},setup(o){const a=o,{data:t,pending:s,error:e}=Ct(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/${a.username}`,"$l9VJqXAsgX"),n=x(()=>!t.value||t.value.status!=="ok"?[]:t.value.items.filter(i=>i.categories.length>0).map(i=>({title:i.title,link:i.link,description:i.description.replace(/<\/?[^>]+(>|$)/g,"").substring(0,150)+"..."})));return(i,f)=>{const l=W,_=K("SchemaOrg");return b(),v("div",null,[p(s)?(b(),v("div",$t,"Loading...")):p(e)?(b(),v("div",Pt,"Error: "+$(p(e).message),1)):(b(),v("ul",Ot,[(b(!0),v(U,null,N(p(n),h=>(b(),v("li",{key:h.link,class:"blog-item"},[k("h3",null,[C(l,{to:h.link,title:`${i.$t("action.openWindow")} ${i.$t("action.goTo")} ${h.title}`,target:"_blank"},{default:R(()=>[q($(h.title),1)]),_:2},1032,["to","title"])]),k("p",null,$(h.description),1)]))),128))])),C(_,{posts:p(n)},null,8,["posts"])])}}}),Et=Object.assign(ct(Mt,[["__scopeId","data-v-ed002fb6"]]),{__name:"MediumPosts"}),St={class:"page page--narrow"},Tt={class:"page-container"},xt={key:1},Vt=I({__name:"blog",setup(o){const{t:a}=lt(),t=ft(),s=ut(),e=x(()=>a("mainMenu.blog")),n=x(()=>a("des.blog"));dt({title:e,meta:[{hid:"description",name:"description",content:n.value},{hid:"og:url",property:"og:url",content:t.public.baseUrl+s.path},{hid:"og:title",property:"og:title",content:e.value},{hid:"og:description",property:"og:description",content:n.value},{hid:"twitter:url",name:"twitter:url",content:t.public.baseUrl+s.path},{hid:"twitter:title",name:"twitter:title",content:e.value},{hid:"twitter:description",name:"twitter:description",content:n.value}]});const i=x(()=>[{link:"/",title:a("action.goToHomePage")},{link:"",title:a("mainMenu.blog")}]);return(f,l)=>{const _=J,h=ht,r=W,d=K("SchemaOrg"),B=Et;return b(),v("main",St,[k("div",Tt,[C(_,{list:p(i)},null,8,["list"]),C(h),k("h2",null,$(p(e)),1),k("p",null,$(p(a)("page.blog.hint")),1),l[0]||(l[0]=k("br",null,null,-1)),C(B,{username:"@neil-lin"},{default:R(({posts:D})=>[D.length?(b(),v(U,{key:0},[k("ul",null,[(b(!0),v(U,null,N(D,w=>(b(),v("li",{key:w.link},[C(r,{to:w.link,target:"_blank",title:`${f.$t("action.openWindow")} ${f.$t("action.goTo")} ${w.title}`},{default:R(()=>[q($(w.title),1)]),_:2},1032,["to","title"])]))),128))]),C(d,{posts:D},null,8,["posts"])],64)):(b(),v("p",xt,$(p(a)("page.blog.noPosts")),1))]),_:1}),l[1]||(l[1]=k("br",null,null,-1)),C(r,{to:"https://neil-lin.medium.com/",title:`${p(a)("action.openWindow")} ${p(a)("action.goTo")} Medium`,target:"_blank",class:"btn"},{default:R(()=>[q($(p(a)("page.blog.forward")),1)]),_:1},8,["title"])])])}}});export{Vt as default};
