var J=Object.defineProperty;var X=(o,e,t)=>e in o?J(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var $=(o,e,t)=>X(o,typeof e!="symbol"?e+"":e,t);import{_ as Q}from"./B7kJJQI1.js";import{s as Y,u as Z,a as M,r as R,b as A,t as tt,g as et,o as at,c as st,w as nt,d as H,e as ot,f as rt,h as _,i as T,j as it,k as ct,l as E,m as z,n as lt,p as b,q as C,F as q,v as K,x as k,y as x,z as j,A as U,B as w,_ as W,C as ut,D as dt,E as ft,G as ht,H as _t,I as mt,J as gt,K as pt}from"./-R-GYC2A.js";import{_ as G}from"./BnTRdCGt.js";import{_ as yt}from"./CfaQGSnu.js";const wt=[1779033703,-1150833019,1013904242,-1521486534,1359893119,-1694144372,528734635,1541459225],bt=[1116352408,1899447441,-1245643825,-373957723,961987163,1508970993,-1841331548,-1424204075,-670586216,310598401,607225278,1426881987,1925078388,-2132889090,-1680079193,-1046744716,-459576895,-272742522,264347078,604807628,770255983,1249150122,1555081692,1996064986,-1740746414,-1473132947,-1341970488,-1084653625,-958395405,-710438585,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,-2117940946,-1838011259,-1564481375,-1474664885,-1035236496,-949202525,-778901479,-694614492,-200395387,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,-2067236844,-1933114872,-1866530822,-1538233109,-1090935817,-965641998],vt="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",O=[];class Dt{constructor(){$(this,"_data",new S);$(this,"_hash",new S([...wt]));$(this,"_nDataBytes",0);$(this,"_minBufferSize",0)}finalize(e){e&&this._append(e);const t=this._nDataBytes*8,s=this._data.sigBytes*8;return this._data.words[s>>>5]|=128<<24-s%32,this._data.words[(s+64>>>9<<4)+14]=Math.floor(t/4294967296),this._data.words[(s+64>>>9<<4)+15]=t,this._data.sigBytes=this._data.words.length*4,this._process(),this._hash}_doProcessBlock(e,t){const s=this._hash.words;let a=s[0],n=s[1],i=s[2],r=s[3],u=s[4],f=s[5],m=s[6],c=s[7];for(let h=0;h<64;h++){if(h<16)O[h]=e[t+h]|0;else{const l=O[h-15],P=(l<<25|l>>>7)^(l<<14|l>>>18)^l>>>3,y=O[h-2],I=(y<<15|y>>>17)^(y<<13|y>>>19)^y>>>10;O[h]=P+O[h-7]+I+O[h-16]}const v=u&f^~u&m,D=a&n^a&i^n&i,B=(a<<30|a>>>2)^(a<<19|a>>>13)^(a<<10|a>>>22),d=(u<<26|u>>>6)^(u<<21|u>>>11)^(u<<7|u>>>25),g=c+d+v+bt[h]+O[h],p=B+D;c=m,m=f,f=u,u=r+g|0,r=i,i=n,n=a,a=g+p|0}s[0]=s[0]+a|0,s[1]=s[1]+n|0,s[2]=s[2]+i|0,s[3]=s[3]+r|0,s[4]=s[4]+u|0,s[5]=s[5]+f|0,s[6]=s[6]+m|0,s[7]=s[7]+c|0}_append(e){typeof e=="string"&&(e=S.fromUtf8(e)),this._data.concat(e),this._nDataBytes+=e.sigBytes}_process(e){let t,s=this._data.sigBytes/64;e?s=Math.ceil(s):s=Math.max((s|0)-this._minBufferSize,0);const a=s*16,n=Math.min(a*4,this._data.sigBytes);if(a){for(let i=0;i<a;i+=16)this._doProcessBlock(this._data.words,i);t=this._data.words.splice(0,a),this._data.sigBytes-=n}return new S(t,n)}}class S{constructor(e,t){$(this,"words");$(this,"sigBytes");e=this.words=e||[],this.sigBytes=t===void 0?e.length*4:t}static fromUtf8(e){const t=unescape(encodeURIComponent(e)),s=t.length,a=[];for(let n=0;n<s;n++)a[n>>>2]|=(t.charCodeAt(n)&255)<<24-n%4*8;return new S(a,s)}toBase64(){const e=[];for(let t=0;t<this.sigBytes;t+=3){const s=this.words[t>>>2]>>>24-t%4*8&255,a=this.words[t+1>>>2]>>>24-(t+1)%4*8&255,n=this.words[t+2>>>2]>>>24-(t+2)%4*8&255,i=s<<16|a<<8|n;for(let r=0;r<4&&t*8+r*6<this.sigBytes*8;r++)e.push(vt.charAt(i>>>6*(3-r)&63))}return e.join("")}concat(e){if(this.words[this.sigBytes>>>2]&=4294967295<<32-this.sigBytes%4*8,this.words.length=Math.ceil(this.sigBytes/4),this.sigBytes%4)for(let t=0;t<e.sigBytes;t++){const s=e.words[t>>>2]>>>24-t%4*8&255;this.words[this.sigBytes+t>>>2]|=s<<24-(this.sigBytes+t)%4*8}else for(let t=0;t<e.sigBytes;t+=4)this.words[this.sigBytes+t>>>2]=e.words[t>>>2];this.sigBytes+=e.sigBytes}}function Bt(o){return new Dt().finalize(o).toBase64()}function kt(o){return Bt(Y(o))}const Ct=o=>o==="defer"||o===!1;function Pt(...o){var B;const e=typeof o[o.length-1]=="string"?o.pop():void 0;typeof o[0]!="string"&&o.unshift(e);let[t,s,a={}]=o;if(typeof t!="string")throw new TypeError("[nuxt] [asyncData] key must be a string.");if(typeof s!="function")throw new TypeError("[nuxt] [asyncData] handler must be a function.");const n=Z(),i=s,r=()=>M.value,u=()=>n.isHydrating?n.payload.data[t]:n.static.data[t];a.server??(a.server=!0),a.default??(a.default=r),a.getCachedData??(a.getCachedData=u),a.lazy??(a.lazy=!1),a.immediate??(a.immediate=!0),a.deep??(a.deep=M.deep),a.dedupe??(a.dedupe="cancel");const f=a.getCachedData(t,n),m=f!=null;if(!n._asyncData[t]||!a.immediate){(B=n.payload._errors)[t]??(B[t]=M.errorValue);const d=a.deep?R:A;n._asyncData[t]={data:d(m?f:a.default()),pending:R(!m),error:tt(n.payload._errors,t),status:R("idle"),_default:a.default}}const c={...n._asyncData[t]};delete c._default,c.refresh=c.execute=(d={})=>{if(n._asyncDataPromises[t]){if(Ct(d.dedupe??a.dedupe))return n._asyncDataPromises[t];n._asyncDataPromises[t].cancelled=!0}if(d._initial||n.isHydrating&&d._initial!==!1){const p=d._initial?f:a.getCachedData(t,n);if(p!=null)return Promise.resolve(p)}c.pending.value=!0,c.status.value="pending";const g=new Promise((p,l)=>{try{p(i(n))}catch(P){l(P)}}).then(async p=>{if(g.cancelled)return n._asyncDataPromises[t];let l=p;a.transform&&(l=await a.transform(p)),a.pick&&(l=Ot(l,a.pick)),n.payload.data[t]=l,c.data.value=l,c.error.value=M.errorValue,c.status.value="success"}).catch(p=>{if(g.cancelled)return n._asyncDataPromises[t];c.error.value=rt(p),c.data.value=_(a.default()),c.status.value="error"}).finally(()=>{g.cancelled||(c.pending.value=!1,delete n._asyncDataPromises[t])});return n._asyncDataPromises[t]=g,n._asyncDataPromises[t]},c.clear=()=>$t(n,t);const h=()=>c.refresh({_initial:!0}),v=a.server!==!1&&n.payload.serverRendered;{const d=et();if(d&&v&&a.immediate&&!d.sp&&(d.sp=[]),d&&!d._nuxtOnBeforeMountCbs){d._nuxtOnBeforeMountCbs=[];const l=d._nuxtOnBeforeMountCbs;at(()=>{l.forEach(P=>{P()}),l.splice(0,l.length)}),st(()=>l.splice(0,l.length))}v&&n.isHydrating&&(c.error.value||f!=null)?(c.pending.value=!1,c.status.value=c.error.value?"error":"success"):d&&(n.payload.serverRendered&&n.isHydrating||a.lazy)&&a.immediate?d._nuxtOnBeforeMountCbs.push(h):a.immediate&&h();const g=ot();if(a.watch){const l=nt(a.watch,()=>c.refresh());g&&H(l)}const p=n.hook("app:data:refresh",async l=>{(!l||l.includes(t))&&await c.refresh()});g&&H(p)}const D=Promise.resolve(n._asyncDataPromises[t]).then(()=>c);return Object.assign(D,c),D}function $t(o,e){e in o.payload.data&&(o.payload.data[e]=void 0),e in o.payload._errors&&(o.payload._errors[e]=M.errorValue),o._asyncData[e]&&(o._asyncData[e].data.value=_(o._asyncData[e]._default()),o._asyncData[e].error.value=M.errorValue,o._asyncData[e].pending.value=!1,o._asyncData[e].status.value="idle"),e in o._asyncDataPromises&&(o._asyncDataPromises[e]&&(o._asyncDataPromises[e].cancelled=!0),o._asyncDataPromises[e]=void 0)}function Ot(o,e){const t={};for(const s of e)t[s]=o[s];return t}function xt(o,e,t){const[s={},a]=[{},e],n=T(()=>E(o)),i=s.key||kt([a,typeof n.value=="string"?n.value:"",...Et(s)]);if(!i||typeof i!="string")throw new TypeError("[nuxt] [useFetch] key must be a string: "+i);if(!o)throw new Error("[nuxt] [useFetch] request is missing.");const r=i===a?"$f"+i:i;if(!s.baseURL&&typeof n.value=="string"&&n.value[0]==="/"&&n.value[1]==="/")throw new Error('[nuxt] [useFetch] the request URL must not start with "//".');const{server:u,lazy:f,default:m,transform:c,pick:h,watch:v,immediate:D,getCachedData:B,deep:d,dedupe:g,...p}=s,l=it({...ct,...p,cache:typeof s.cache=="boolean"?void 0:s.cache}),P={server:u,lazy:f,default:m,transform:c,pick:h,immediate:D,getCachedData:B,deep:d,dedupe:g,watch:v===!1?[]:[l,n,...v||[]]};let y;return Pt(r,()=>{var F;(F=y==null?void 0:y.abort)==null||F.call(y,new DOMException("Request aborted as another request to the same endpoint was initiated.","AbortError")),y=typeof AbortController<"u"?new AbortController:{};const L=E(s.timeout);let V;return L&&(V=setTimeout(()=>y.abort(new DOMException("Request aborted due to timeout.","AbortError")),L),y.signal.onabort=()=>clearTimeout(V)),(s.$fetch||globalThis.$fetch)(n.value,{signal:y.signal,...l}).finally(()=>{clearTimeout(V)})},P)}function Et(o){var t;const e=[((t=E(o.method))==null?void 0:t.toUpperCase())||"GET",E(o.baseURL)];for(const s of[o.params||o.query]){const a=E(s);if(!a)continue;const n={};for(const[i,r]of Object.entries(a))n[E(i)]=E(r);e.push(n)}return e}function Mt(o){let e="";for(const t of o)typeof t.children=="string"&&(e+=t.children.trim());return e}function N(o){let e=o.replace(/-./g,t=>t[1].toUpperCase());return(e==="type"||e==="id")&&(e=`@${e}`),e}function St(o){return o.startsWith("aria-")||o.startsWith("data-")?!1:o==="class"||o==="style"}function Tt(o,e){return z({name:o,props:{as:String},setup(t,{slots:s,attrs:a}){const n=R(null),i=T(()=>{const r={};if(Object.entries(_(a)).forEach(([u,f])=>{St(u)||(r[N(u)]=_(f))}),!n.value)for(const[u,f]of Object.entries(s))!f||u==="default"||(r[N(u)]=Mt(f(t)));return r});return()=>{const r=_(i);if(!s.default)return null;const u=[];return s.default&&u.push(s.default(r)),lt(t.as||"div",{},u)}}})}const jt=Tt("SchemaOrgItemList"),Rt={key:0},Ut={key:1},Vt={key:2,class:"blog-list"},qt=z({__name:"mediumPosts",props:{username:{type:String,required:!0}},setup(o,{expose:e}){const t=o,{data:s,pending:a,error:n}=xt(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${t.username}`,"$l9VJqXAsgX"),i=T(()=>!s.value||s.value.status!=="ok"?[]:s.value.items.filter(r=>r.categories.length>0).map(r=>({title:r.title,link:r.link,description:r.description.replace(/<\/?[^>]+(>|$)/g,"").substring(0,150)+"..."})));return e({posts:i}),(r,u)=>{const f=G;return w(),b("div",null,[_(a)?(w(),b("div",Rt,"Loading...")):_(n)?(w(),b("div",Ut,"Error: "+C(_(n).message),1)):(w(),b("ul",Vt,[(w(!0),b(q,null,K(_(i),m=>(w(),b("li",{key:m.link,class:"blog-item"},[k("h3",null,[x(f,{to:m.link,target:"_blank",title:`${r.$t("action.openWindow")} ${r.$t("action.goTo")} ${m.title}`},{default:j(()=>[U(C(m.title),1)]),_:2},1032,["to","title"])]),k("p",null,C(m.description),1)]))),128))]))])}}}),zt=Object.assign(W(qt,[["__scopeId","data-v-a6fb049b"]]),{__name:"MediumPosts"}),It={class:"page page--narrow"},Lt={class:"page-container"},Ft={class:"blog-list"},Ht={key:0},Nt=z({__name:"blog",props:{posts:{type:Array,required:!0}},setup(o){const{t:e}=ut(),t=ht(),s=dt(),a=T(()=>e("mainMenu.blog")),n=T(()=>e("des.blog"));ft({title:a,meta:[{hid:"description",name:"description",content:n.value},{hid:"og:url",property:"og:url",content:t.public.baseUrl+s.path},{hid:"og:title",property:"og:title",content:a.value},{hid:"og:description",property:"og:description",content:n.value},{hid:"twitter:url",name:"twitter:url",content:t.public.baseUrl+s.path},{hid:"twitter:title",name:"twitter:title",content:a.value},{hid:"twitter:description",name:"twitter:description",content:n.value}]});const i=o;_t(()=>{!i.posts||i.posts.length});const r=T(()=>[{link:"/",title:e("action.goToHomePage")},{link:"",title:e("mainMenu.blog")}]);return(u,f)=>{const m=Q,c=mt,h=G,v=jt,D=yt,B=zt;return w(),b("main",It,[k("div",Lt,[x(m,{list:_(r)},null,8,["list"]),x(c),k("h2",null,C(_(a)),1),k("p",null,C(_(e)("page.blog.hint")),1),f[0]||(f[0]=k("br",null,null,-1)),x(B,{username:"@neil-lin"},{default:j(({posts:d})=>[d.length?(w(),b(q,{key:0},[k("ul",Ft,[(w(!0),b(q,null,K(d,g=>(w(),b("li",{key:g.link,class:"blog-item"},[x(h,{to:g.link,target:"_blank",title:`${_(e)("action.openWindow")} ${_(e)("action.goTo")} ${g.title}`},{default:j(()=>[U(C(g.title),1)]),_:2},1032,["to","title"])]))),128))]),d.length>0?(w(),b("div",Ht,[x(v,{posts:d},null,8,["posts"])])):pt("",!0)],64)):(w(),gt(D,{key:1},{default:j(()=>[U(C(_(e)("page.blog.noPosts")),1)]),_:1}))]),_:1}),f[1]||(f[1]=k("br",null,null,-1)),x(h,{to:"https://neil-lin.medium.com/",title:`${_(e)("action.openWindow")} ${_(e)("action.goTo")} Medium`,target:"_blank",class:"btn"},{default:j(()=>[U(C(_(e)("page.blog.forward")),1)]),_:1},8,["title"])])])}}}),Yt=W(Nt,[["__scopeId","data-v-9311c274"]]);export{Yt as default};
