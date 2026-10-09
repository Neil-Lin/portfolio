// 宣告式 Shadow DOM 文章範例用的 iframe 文件（srcdoc）。
// 範例刻意放進 iframe：sandbox 不給 allow-scripts 就等於「關掉 JavaScript」，
// 而且 Vue 模板會把 <slot>、<style> 當成自己的語法處理，不能直接寫在元件模板裡。

export interface DsdDemoText {
  lang: string;
  title: string;
  body: string;
  note: string;
}

const CARD_STYLE = `
  :host { display: block; }
  .card {
    border: 2px solid #6042a0;
    border-radius: 12px;
    padding: 12px 16px;
    background: #f6f2ff;
    font: 16px/1.6 system-ui, sans-serif;
    color: #222;
  }
  .card strong { display: block; font-size: 1.125rem; color: #3b2470; }
  .card p { margin: 4px 0 0; }
`;

const CARD_SHADOW = `<style>${CARD_STYLE}</style><div class="card"><strong><slot name="title"></slot></strong><p><slot name="body"></slot></p></div>`;

const PAGE_STYLE = `<style>
  body { margin: 12px; font: 14px/1.5 system-ui, sans-serif; color: #222; background: #fff; }
  .status { margin-top: 10px; font-size: 13px; color: #555; }
  .status b { color: #6042a0; }
</style>`;

const lightDom = (t: DsdDemoText) =>
  `<span slot="title">${t.title}</span><span slot="body">${t.body}</span>`;

// 傳統寫法：shadow root 由 JavaScript 建立
export function imperativeCardDoc(t: DsdDemoText) {
  return `<!doctype html><html lang="${t.lang}"><meta charset="utf-8">${PAGE_STYLE}
<my-card>${lightDom(t)}</my-card>
<p class="status">${t.note}</p>
<script>
customElements.define("my-card", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = ${JSON.stringify(CARD_SHADOW)};
  }
});
</script></html>`;
}

// 宣告式寫法：shadow root 直接寫在 HTML 裡，不需要 JavaScript
export function declarativeCardDoc(t: DsdDemoText) {
  return `<!doctype html><html lang="${t.lang}"><meta charset="utf-8">${PAGE_STYLE}
<my-card><template shadowrootmode="open">${CARD_SHADOW}</template>${lightDom(t)}</my-card>
<p class="status">${t.note}</p></html>`;
}

export interface DsdHydrateText extends DsdDemoText {
  waiting: string;
  kept: string;
  wiped: string;
  rerendered: string;
}

// 元件定義延遲載入：比較「直接 attachShadow」與「接手既有 shadow root」
export function hydrateDoc(t: DsdHydrateText, mode: "wrong" | "right") {
  const define =
    mode === "wrong"
      ? `constructor() {
    super();
    // 不管有沒有 SSR，直接 attachShadow：伺服器輸出的內容會被清空
    this.attachShadow({ mode: "open" });
    status.innerHTML = ${JSON.stringify(t.wiped)};
    // 模擬元件之後才重新畫出內容（例如等資料、等 render 排程）
    setTimeout(() => {
      this.shadowRoot.innerHTML = ${JSON.stringify(CARD_SHADOW)};
      status.innerHTML = ${JSON.stringify(t.rerendered)};
    }, 1200);
  }`
      : `constructor() {
    super();
    // 有宣告式 shadow root 就接手，沒有才自己建
    const root = this.attachInternals().shadowRoot;
    if (root) {
      status.innerHTML = ${JSON.stringify(t.kept)};
    } else {
      this.attachShadow({ mode: "open" }).innerHTML = ${JSON.stringify(CARD_SHADOW)};
    }
  }`;
  return `<!doctype html><html lang="${t.lang}"><meta charset="utf-8">${PAGE_STYLE}
<my-card><template shadowrootmode="open">${CARD_SHADOW}</template>${lightDom(t)}</my-card>
<p class="status" id="status">${t.waiting}</p>
<script>
const status = document.getElementById("status");
// 模擬 JavaScript 比 HTML 晚 1.5 秒到
setTimeout(() => {
  customElements.define("my-card", class extends HTMLElement {
  ${define}
  });
}, 1500);
</script></html>`;
}
