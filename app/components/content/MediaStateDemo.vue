<template>
  <div class="ms-demo demo">
    <p class="demo__label">{{ text.label }}</p>

    <fieldset class="demo__options">
      <legend>{{ text.modeLegend }}</legend>
      <label v-for="m in modes" :key="m" class="demo__option">
        <input v-model="mode" type="radio" :name="`${uid}-mode`" :value="m" />
        <span>{{ text.modes[m] }}</span>
      </label>
    </fieldset>

    <!--
      播放器外觀（圖示）由媒體狀態偽類決定：.ms-demo__player:has(audio:playing) …
      不支援的瀏覽器改用 JS 設定的 data-playing／data-muted（見 demos.css）
    -->
    <div
      class="ms-demo__player"
      :class="{ 'is-fallback': supported === false }"
      :data-playing="playing || undefined"
      :data-muted="muted || undefined"
    >
      <audio ref="audio" :src="src" preload="auto" />

      <button
        type="button"
        class="ms-demo__button"
        :aria-label="playLabel"
        @click="togglePlay"
      >
        <svg
          class="ms-demo__icon ms-demo__icon--play"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M7 4.5v15l12-7.5z" />
        </svg>
        <svg
          class="ms-demo__icon ms-demo__icon--pause"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M6 4.5h4v15H6zM14 4.5h4v15h-4z" />
        </svg>
      </button>

      <button
        type="button"
        class="ms-demo__button"
        :aria-label="text.mute"
        :aria-pressed="muted ? 'true' : 'false'"
        @click="toggleMute"
      >
        <svg
          class="ms-demo__icon ms-demo__icon--sound"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M4 9h4l5-4v14l-5-4H4z" />
          <path
            d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        <svg
          class="ms-demo__icon ms-demo__icon--muted"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M4 9h4l5-4v14l-5-4H4z" />
          <path
            d="M16 9l5 6M21 9l-5 6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>

      <label class="ms-demo__volume">
        <span>{{ text.volume }}</span>
        <input
          v-model.number="volume"
          type="range"
          min="0"
          max="100"
          step="10"
          :aria-valuetext="`${volume}%`"
        />
        <output>{{ volume }}%</output>
      </label>

      <p class="ms-demo__time">{{ timeText }}</p>
    </div>

    <button type="button" class="ms-demo__external" @click="externalPause">
      {{ text.external }}
    </button>

    <dl class="attr-demo__readout" :class="{ 'is-mismatch': mismatch }">
      <div>
        <dt>{{ text.pseudoLabel }}</dt>
        <dd>{{ pseudoText }}</dd>
      </div>
      <div>
        <dt>{{ text.nameLabel }}</dt>
        <dd>
          {{ text.quote(playLabel)
          }}<template v-if="mismatch">{{ text.wrong }}</template>
        </dd>
      </div>
      <div>
        <dt>{{ text.pressedLabel }}</dt>
        <dd>{{ muted ? "true" : "false" }}</dd>
      </div>
      <div>
        <dt>{{ text.silentLabel }}</dt>
        <dd>{{ silentText }}</dd>
      </div>
    </dl>

    <p class="demo__status">{{ modeText }}</p>
    <p class="demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：媒體狀態偽類（:playing、:paused、:muted…）管外觀，按鈕的名稱和狀態要另外同步
// 用法：::media-state-demo
type Mode = "css" | "click" | "events";

const uid = useDemoId("ms");
const audio = ref<HTMLAudioElement | null>(null);

const modes: Mode[] = ["css", "click", "events"];
const pseudos = [
  ":playing",
  ":paused",
  ":seeking",
  ":buffering",
  ":stalled",
  ":muted",
  ":volume-locked",
];

const mode = ref<Mode>("css");
const src = ref<string | undefined>(undefined);
const supported = ref<boolean | null>(null);
// 以下都由媒體事件更新（play、pause、volumechange…），不是由點擊更新
const playing = ref(false);
const muted = ref(false);
const volume = ref(100);
const current = ref(0);
const duration = ref(0);
const matched = ref<string[]>([]);
// 「點擊時更新」模式用：只在按下播放鍵時改
const clickPlaying = ref(false);

const messages = {
  "zh-Hant-TW": {
    label:
      "互動範例：按播放後，圖示由 :playing、:paused 切換；按鈕的名稱（報讀軟體念的）由下方選項決定。試著按「從其他地方暫停」，或等它播完，看名稱會不會跟著變",
    modeLegend: "播放鍵的名稱怎麼更新",
    modes: {
      css: "只靠 CSS（名稱固定）",
      click: "按下按鈕時更新",
      events: "監聽 play、pause 事件更新",
    },
    play: "播放",
    pause: "暫停",
    mute: "靜音",
    volume: "音量",
    external: "從其他地方暫停（程式呼叫 pause()）",
    pseudoLabel: "音訊目前符合的偽類",
    nameLabel: "播放鍵的名稱",
    quote: (s: string) => `「${s}」`,
    wrong: "：跟實際狀態不符",
    pressedLabel: "靜音鍵的 aria-pressed",
    silentLabel: "實際有聲音嗎？",
    silent: (v: number, m: boolean) =>
      m
        ? "沒有（靜音中）"
        : v === 0
          ? "沒有（音量 0，但 muted 仍是 false，所以不符合 :muted）"
          : "有",
    unsupported: "（不支援，無法判斷）",
    none: "（無）",
    native:
      "你的瀏覽器支援媒體狀態偽類：圖示是由 :playing、:paused、:muted 切換的",
    fallback:
      "你的瀏覽器不支援媒體狀態偽類，圖示改用 JavaScript 設定的 data 屬性切換",
    detecting: "偵測中（需要 JavaScript）",
    print: "此處為互動範例，請在網頁上操作。",
  },
  en: {
    label:
      "Live demo: after you press play, the icon is switched by :playing and :paused; the button's name (what screen readers announce) depends on the option below. Try “Pause from elsewhere”, or let it play to the end, and see whether the name keeps up",
    modeLegend: "How the play button's name is updated",
    modes: {
      css: "CSS only (fixed name)",
      click: "Updated when the button is pressed",
      events: "Updated on play and pause events",
    },
    play: "Play",
    pause: "Pause",
    mute: "Mute",
    volume: "Volume",
    external: "Pause from elsewhere (script calls pause())",
    pseudoLabel: "Pseudo-classes the audio matches",
    nameLabel: "Play button's name",
    quote: (s: string) => `“${s}”`,
    wrong: ": doesn't match the actual state",
    pressedLabel: "Mute button's aria-pressed",
    silentLabel: "Is there sound?",
    silent: (v: number, m: boolean) =>
      m
        ? "No (muted)"
        : v === 0
          ? "No (volume is 0, but muted is still false, so :muted doesn't match)"
          : "Yes",
    unsupported: "(not supported, can't tell)",
    none: "(none)",
    native:
      "Your browser supports the media state pseudo-classes: the icons are switched by :playing, :paused, and :muted",
    fallback:
      "Your browser doesn't support the media state pseudo-classes, so the icons are switched by data attributes set with JavaScript",
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
      : text.value.fallback,
);

const playLabel = computed(() => {
  if (mode.value === "css") return text.value.play;
  const isPlaying = mode.value === "click" ? clickPlaying.value : playing.value;
  return isPlaying ? text.value.pause : text.value.play;
});
// 名稱描述的是「按下去會做什麼」：播放中應該是「暫停」，暫停中應該是「播放」
const mismatch = computed(
  () =>
    playLabel.value !== (playing.value ? text.value.pause : text.value.play),
);

const pseudoText = computed(() =>
  supported.value === false
    ? text.value.unsupported
    : matched.value.join(" ") || text.value.none,
);
const silentText = computed(() => text.value.silent(volume.value, muted.value));

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const timeText = computed(
  () => `${fmt(current.value)} / ${fmt(duration.value)}`,
);

function togglePlay() {
  const a = audio.value;
  if (!a) return;
  if (a.paused) {
    a.play().catch(() => {});
    clickPlaying.value = true;
  } else {
    a.pause();
    clickPlaying.value = false;
  }
}
function toggleMute() {
  if (audio.value) audio.value.muted = !audio.value.muted;
}
function externalPause() {
  audio.value?.pause();
}

watch(volume, (v) => {
  if (audio.value) audio.value.volume = v / 100;
});
watch(mode, () => {
  clickPlaying.value = playing.value;
});

// 媒體元素的狀態，一律從事件讀回來
function sync() {
  const a = audio.value;
  if (!a) return;
  playing.value = !a.paused;
  muted.value = a.muted;
  current.value = a.currentTime;
  duration.value = Number.isFinite(a.duration) ? a.duration : 0;
  if (supported.value) matched.value = pseudos.filter((p) => a.matches(p));
}
const events = [
  "play",
  "pause",
  "playing",
  "waiting",
  "seeking",
  "seeked",
  "ended",
  "volumechange",
  "timeupdate",
  "loadedmetadata",
];

// 自己產生 8 秒的提示音（每秒一聲），不用外部檔案
function makeTone() {
  const rate = 8000;
  const seconds = 8;
  const n = rate * seconds;
  const buf = new ArrayBuffer(44 + n * 2);
  const v = new DataView(buf);
  const str = (o: number, s: string) =>
    [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, "RIFF");
  v.setUint32(4, 36 + n * 2, true);
  str(8, "WAVEfmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, rate, true);
  v.setUint32(28, rate * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  str(36, "data");
  v.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) {
    const t = (i % rate) / rate;
    const on = t < 0.15;
    const s = on ? Math.sin((2 * Math.PI * 440 * i) / rate) * 0.2 : 0;
    v.setInt16(44 + i * 2, s * 32767, true);
  }
  return URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
}

onMounted(() => {
  supported.value = featureDetectors["media-pseudos"]!.detect();
  src.value = makeTone();
  const a = audio.value;
  if (a) for (const e of events) a.addEventListener(e, sync);
  sync();
});
onBeforeUnmount(() => {
  const a = audio.value;
  if (a) {
    a.pause();
    for (const e of events) a.removeEventListener(e, sync);
  }
  if (src.value) URL.revokeObjectURL(src.value);
});
</script>
