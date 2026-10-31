<template>
  <div class="usermedia-demo demo">
    <p class="demo__label">{{ text.label }}</p>

    <!-- 先讓讀者知情同意，勾選後才建立 <usermedia>；取消勾選時關閉相機並移除範例 -->
    <label class="demo__option usermedia-demo__consent">
      <input v-model="consent" type="checkbox" />
      {{ text.consent }}
    </label>

    <div v-if="consent" class="usermedia-demo__lobby">
      <div class="usermedia-demo__controls">
        <fieldset class="demo__options">
          <legend>lang</legend>
          <label v-for="l in langs" :key="l" class="demo__option">
            <input
              v-model="lang"
              type="radio"
              :name="`${uid}-lang`"
              :value="l"
            />
            <code>{{ l }}</code>
          </label>
        </fieldset>
        <fieldset class="demo__options">
          <legend>{{ text.color }}</legend>
          <label v-for="c in colors" :key="c" class="demo__option">
            <input
              v-model="color"
              type="radio"
              :name="`${uid}-color`"
              :value="c"
            />
            {{ text.colors[c] }}
          </label>
        </fieldset>
      </div>

      <video
        ref="preview"
        class="usermedia-demo__preview"
        autoplay
        muted
        playsinline
        :aria-label="text.preview"
      ></video>

      <!-- <usermedia> 由 JavaScript 建立後放在這裡 -->
      <div ref="slot" class="usermedia-demo__slot"></div>
      <p :id="hintId" class="usermedia-demo__hint">{{ text.hint }}</p>

      <p class="usermedia-demo__status" role="status">{{ status }}</p>

      <div v-if="streaming" class="usermedia-demo__actions">
        <button
          type="button"
          class="usermedia-demo__action"
          @click="toggleCamera"
        >
          {{ cameraOn ? text.cameraOff : text.cameraOn }}
        </button>
        <button type="button" class="usermedia-demo__action" @click="stopAll()">
          {{ text.stop }}
        </button>
      </div>
    </div>

    <p class="demo__status">{{ modeText }}</p>
    <p class="demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：視訊會議的等候室，示範 <usermedia> 的 lang、對比限制、狀態訊息與關閉鏡頭
// 用法：::usermedia-demo
type Lang = "zh-Hant-TW" | "zh-TW";
type Color = "brand" | "low";

const uid = useDemoId("umd");
const hintId = `${uid}-hint`;
const preview = ref<HTMLVideoElement | null>(null);
const slot = ref<HTMLElement | null>(null);

const langs: Lang[] = ["zh-Hant-TW", "zh-TW"];
const colors: Color[] = ["brand", "low"];
const consent = ref(false);
const lang = ref<Lang>("zh-Hant-TW");
const color = ref<Color>("brand");
const status = ref("");
const streaming = ref(false);
const cameraOn = ref(true);
const supported = ref<boolean | null>(null);

let element: HTMLElement | null = null;
let stream: MediaStream | null = null;
let readyTimer: ReturnType<typeof setTimeout> | undefined;

const messages = {
  "zh-Hant-TW": {
    label: "互動範例：視訊會議的等候室",
    consent:
      "我了解：按下範例裡的按鈕會開啟我的攝影機和麥克風，畫面只在我的瀏覽器裡顯示，不會傳到任何地方。",
    color: "按鈕顏色",
    colors: {
      brand: "品牌色（對比足夠）",
      low: "淺灰（對比低於 3:1）",
    } as Record<Color, string>,
    preview: "你的攝影機預覽",
    hint: "開啟後，會議中的其他人會看到你的畫面、聽到你的聲音。",
    fallback: "開啟攝影機和麥克風",
    preparing: "按鈕準備中，請稍等一秒……",
    ready: "按鈕可以使用了。",
    started: "攝影機和麥克風已開啟，其他人看得到你、聽得到你。",
    cancelled:
      "沒有開啟攝影機和麥克風。需要時，可以再按一次「使用麥克風和攝影機」。",
    notFound: "找不到攝影機或麥克風，請確認裝置已經連接。",
    invalidStyle:
      "按鈕失效了：文字和背景的對比低於 3:1。按鈕外觀沒有變化，只有程式收到錯誤（正式網站應該在開發時就修正）。",
    notReady: "按鈕還沒準備好，請稍等一秒再按一次。",
    failed: "無法開啟攝影機和麥克風，請稍後再試。",
    cameraOff: "關閉鏡頭",
    cameraOn: "開啟鏡頭",
    cameraOffDone: "鏡頭已關閉，其他人看不到你的畫面。",
    cameraOnDone: "鏡頭已開啟。",
    stop: "關閉攝影機和麥克風",
    stopped: "攝影機和麥克風已關閉。",
    native: "你的瀏覽器支援 <usermedia>",
    fallbackMode:
      "你的瀏覽器不支援 <usermedia>，範例會改用一般按鈕和 getUserMedia()，lang 與按鈕顏色的效果看不到",
    detecting: "偵測中（需要 JavaScript）",
    print: "此處為互動範例，請在網頁上操作。",
  },
  en: {
    label: "Live demo: a video call waiting room",
    consent:
      "I understand: pressing the button in the demo turns on my camera and microphone. The video stays in my browser and isn't sent anywhere.",
    color: "Button colors",
    colors: {
      brand: "Brand color (enough contrast)",
      low: "Light gray (contrast below 3:1)",
    } as Record<Color, string>,
    preview: "Your camera preview",
    hint: "Once on, others in the call can see and hear you.",
    fallback: "Turn on camera and microphone",
    preparing: "Getting the button ready, one moment…",
    ready: "The button is ready.",
    started: "Your camera and microphone are on. Others can see and hear you.",
    cancelled:
      "Your camera and microphone weren't turned on. Press the button again whenever you're ready.",
    notFound:
      "No camera or microphone found. Check that your devices are connected.",
    invalidStyle:
      "The button stopped working: its text and background contrast is below 3:1. It looks the same, and only the code gets an error (a real site should fix this during development).",
    notReady: "The button wasn't ready yet. Wait a second and press it again.",
    failed:
      "Couldn't turn on your camera and microphone. Please try again later.",
    cameraOff: "Turn off camera",
    cameraOn: "Turn on camera",
    cameraOffDone: "Your camera is off. Others can't see you.",
    cameraOnDone: "Your camera is on.",
    stop: "Turn off camera and microphone",
    stopped: "Your camera and microphone are off.",
    native: "Your browser supports <usermedia>",
    fallbackMode:
      "Your browser doesn't support <usermedia>, so the demo uses a regular button and getUserMedia(); the lang and color options have no visible effect",
    detecting: "Detecting (requires JavaScript)",
    print: "This is an interactive demo. Try it on the web page.",
  },
};

const text = useDemoText(messages);

const modeText = computed(() =>
  supported.value === null
    ? text.value.detecting
    : supported.value
      ? text.value.native
      : text.value.fallbackMode,
);

// 按鈕剛出現、樣式剛改變時，有一小段時間不能按；先告訴使用者，約一秒後再說可以了
function prepare() {
  clearTimeout(readyTimer);
  status.value = text.value.preparing;
  readyTimer = setTimeout(() => {
    if (!streaming.value) status.value = text.value.ready;
  }, 1200);
}

function started(next: MediaStream) {
  stream = next;
  if (preview.value) preview.value.srcObject = next;
  streaming.value = true;
  cameraOn.value = true;
  clearTimeout(readyTimer);
  status.value = text.value.started;
}

function errorMessage(error: DOMException | Error | null | undefined) {
  if (error?.name === "NotFoundError") return text.value.notFound;
  if (error?.name === "InvalidStateError") {
    // 範例才分得出「樣式不合格」；正式網站通常只會遇到「還沒準備好」
    return error.message.includes("invalid style")
      ? text.value.invalidStyle
      : text.value.notReady;
  }
  return text.value.failed;
}

function createElement() {
  if (!slot.value) return;
  const el = document.createElement("usermedia");
  el.className = "usermedia-demo__button";
  el.classList.toggle("is-low", color.value === "low");
  el.lang = lang.value;
  el.setAttribute("aria-describedby", hintId);

  // 不支援時顯示的後備按鈕：自己呼叫 getUserMedia()
  const fallback = document.createElement("button");
  fallback.type = "button";
  fallback.className = "usermedia-demo__action";
  fallback.textContent = text.value.fallback;
  fallback.addEventListener("click", async () => {
    try {
      started(
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true }),
      );
    } catch (error) {
      status.value = errorMessage(error as DOMException);
    }
  });
  el.append(fallback);

  // 成功後 error 屬性不會清空，所以用「哪個事件」判斷結果，不要看 error 有沒有值
  el.addEventListener("stream", () => {
    const s = (el as HTMLElement & { stream?: MediaStream }).stream;
    if (s) started(s);
  });
  el.addEventListener("cancel", () => {
    status.value = text.value.cancelled;
  });
  el.addEventListener("error", () => {
    status.value = errorMessage(
      (el as HTMLElement & { error?: DOMException }).error,
    );
  });

  slot.value.append(el);
  element = el;
  if (supported.value) prepare();
}

function stopAll(announce = true) {
  stream?.getTracks().forEach((track) => track.stop());
  stream = null;
  if (preview.value) preview.value.srcObject = null;
  if (streaming.value && announce) status.value = text.value.stopped;
  streaming.value = false;
}

// 關閉鏡頭要自己做：<camera>、<usermedia> 開啟後再按不會切換
function toggleCamera() {
  const video = stream?.getVideoTracks()[0];
  if (!video) return;
  video.enabled = !video.enabled;
  cameraOn.value = video.enabled;
  status.value = video.enabled
    ? text.value.cameraOnDone
    : text.value.cameraOffDone;
}

watch(consent, async (on) => {
  if (on) {
    await nextTick();
    createElement();
  } else {
    clearTimeout(readyTimer);
    stopAll(false);
    element?.remove();
    element = null;
    status.value = "";
  }
});

// lang 改了按鈕文字會立刻更新，不需要等待
watch(lang, (l) => {
  if (element) element.lang = l;
});

// 樣式改變後要等一下才能按
watch(color, (c) => {
  element?.classList.toggle("is-low", c === "low");
  if (element && supported.value && !streaming.value) prepare();
});

onMounted(() => {
  supported.value = "HTMLUserMediaElement" in window;
});
onBeforeUnmount(() => {
  clearTimeout(readyTimer);
  stopAll(false);
});
</script>
