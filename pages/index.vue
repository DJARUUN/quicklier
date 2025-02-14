<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const generatedCode = ref([]);
const initialContent = route.query.c || "";
const visibleCells = ref(new Set());

if (route.query.c) {
  const content = route.query.c;
  const { data } = await useFetch(`/api/generate/${content}`);
  generatedCode.value = data.value.generatedCode;
}

const newContent = ref(decodeURIComponent(initialContent));
const newContentBase64 = computed(() => encodeURIComponent(newContent.value));

const baseUrl = "/api/generate/";
const fetchUrl = computed(() => `${baseUrl}${newContentBase64.value}`);
const isValidUrl = computed(() => fetchUrl.value !== baseUrl);

const isPending = ref(false);

const cellSize = 10;
const gap = 1;

const viewBox = computed(() => {
  const rows = generatedCode.value.length || 25;
  const cols = generatedCode.value[0]?.length || 25;
  const viewWidth = cols * (cellSize + gap) - gap;
  const viewHeight = rows * (cellSize + gap) - gap;
  return `0 0 ${viewWidth} ${viewHeight}`;
});

function animateBlocks() {
  if (!generatedCode.value) return;

  visibleCells.value.clear();

  let cellIndex = 0;
  generatedCode.value.forEach((row: number[]) => {
    row.forEach((cell) => {
      if (cell.toString() !== "1" && cell.toString() !== "8") {
        visibleCells.value.add(cellIndex);
      }
      cellIndex++;
    });
  });

  const blackCells: number[] = [];
  cellIndex = 0;
  generatedCode.value.forEach((row: number[]) => {
    row.forEach((cell) => {
      if (cell.toString() === "1" || cell.toString() === "8") {
        blackCells.push(cellIndex);
      }
      cellIndex++;
    });
  });

  const delayBetweenCells = 15;
  blackCells.forEach((cellIndex, i) => {
    setTimeout(() => {
      visibleCells.value.add(cellIndex);
    }, i * delayBetweenCells);
  });
}

async function handleGenerateCode() {
  if (!isValidUrl.value) return;

  isPending.value = true;
  generatedCode.value = [];
  visibleCells.value.clear();

  const result: any = await $fetch(fetchUrl.value);
  if ("errors" in result) {
    console.error(result.errors);
    return;
  }

  isPending.value = false;
  generatedCode.value = result.generatedCode;
  router.replace({ path: route.path, query: { c: newContentBase64.value } });

  animateBlocks();
}

const qrSvg = ref();

function handleDownloadCode() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const svgElement = qrSvg.value;
  const bbox = svgElement.getBBox();
  canvas.width = bbox.width;
  canvas.height = bbox.height;

  const data = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0);

    const pngUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = "qr-code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  img.src = url;
}

const container = ref();
const qrContainer = ref();

function handleQrContainerSizing() {
  const containerRect = container.value.getBoundingClientRect();
  const qrContainerRect = qrContainer.value.getBoundingClientRect();

  if (qrContainerRect.width > containerRect.width) {
    qrContainer.value.style.width = "100%";
    qrContainer.value.style.height = "fit-content";
  } else if (qrContainerRect.height >= containerRect.height) {
    qrContainer.value.style.width = "fit-content";
    qrContainer.value.style.height = "100%";
  }
}

onMounted(() => {
  window.addEventListener("resize", handleQrContainerSizing);

  qrContainer.value.style.opacity = "100%";
  qrContainer.value.style.filter = "blur(0px)";
  handleQrContainerSizing();

  animateBlocks();
});

onUnmounted(() =>
  window.removeEventListener("resize", handleQrContainerSizing)
);
</script>

<template>
  <div class="gap-6 pb-6 size-full grid grid-rows-[auto_1fr] relative">
    <form
      @submit.prevent="handleGenerateCode"
      class="flex flex-col gap-3"
      method="GET"
      :action="fetchUrl"
    >
      <label for="content">Content</label>
      <textarea
        class="border border-border px-2 py-1"
        name="content"
        id="content"
        v-model="newContent"
      ></textarea>

      <button
        class="border border-border px-2 not-disabled:hover:bg-fg not-disabled:hover:text-bg cursor-pointer flex gap-2 justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed h-9 transition-all ease-out"
        type="submit"
        :disabled="!isValidUrl || isPending"
      >
        <template v-if="isPending">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            class="size-3.5"
          >
            <g stroke="currentColor">
              <circle
                cx="12"
                cy="12"
                r="9.5"
                fill="none"
                stroke-linecap="round"
                stroke-width="2.3"
              >
                <animate
                  attributeName="stroke-dasharray"
                  calcMode="spline"
                  dur="1.5s"
                  keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                  keyTimes="0;0.475;0.95;1"
                  repeatCount="indefinite"
                  values="0 150;42 150;42 150;42 150"
                ></animate>
                <animate
                  attributeName="stroke-dashoffset"
                  calcMode="spline"
                  dur="1.5s"
                  keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                  keyTimes="0;0.475;0.95;1"
                  repeatCount="indefinite"
                  values="0;-16;-59;-59"
                ></animate>
              </circle>
              <animateTransform
                attributeName="transform"
                dur="2s"
                repeatCount="indefinite"
                type="rotate"
                values="0 12 12;360 12 12"
              ></animateTransform>
            </g>
          </svg>
          <span>Generating</span>
        </template>
        <template v-else>
          <span>Generate</span>
        </template>
      </button>
    </form>

    <div
      ref="container"
      class="grid size-full overflow-hidden"
    >
      <div
        ref="qrContainer"
        class="aspect-square bg-fg rounded-xl p-3 w-fit h-full opacity-0 transition-all ease-out blur-xs grid m-auto relative group/qr"
        :class="{ 'animate-pulse': isPending }"
      >
        <svg
          v-if="isPending"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          class="size-6 text-bg m-auto"
        >
          <g stroke="currentColor">
            <circle
              cx="12"
              cy="12"
              r="9.5"
              fill="none"
              stroke-linecap="round"
              stroke-width="2.3"
            >
              <animate
                attributeName="stroke-dasharray"
                calcMode="spline"
                dur="1.5s"
                keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                keyTimes="0;0.475;0.95;1"
                repeatCount="indefinite"
                values="0 150;42 150;42 150;42 150"
              ></animate>
              <animate
                attributeName="stroke-dashoffset"
                calcMode="spline"
                dur="1.5s"
                keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                keyTimes="0;0.475;0.95;1"
                repeatCount="indefinite"
                values="0;-16;-59;-59"
              ></animate>
            </circle>
            <animateTransform
              attributeName="transform"
              dur="2s"
              repeatCount="indefinite"
              type="rotate"
              values="0 12 12;360 12 12"
            ></animateTransform>
          </g>
        </svg>

        <template v-else>
          <button
            @click="handleDownloadCode"
            class="group group-hover/qr:opacity-100 group-hover/qr:blur-none opacity-0 blur-xs transition-all ease-out border border-border bg-bg not-disabled:hover:bg-fg not-disabled:hover:text-bg cursor-pointer flex gap-2 justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed w-9 h-9 hover:w-auto text-fg hover:pl-3.5 hover:pr-3 rounded-md shadow-md shadow-bg/15 absolute bottom-3 right-3"
          >
            <p class="hidden group-hover:block font-medium text-sm">Download PNG</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              class="size-4.5"
            >
              <g fill="currentColor">
                <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129z" />
                <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25z" />
              </g>
            </svg>
          </button>

          <svg
            :viewBox="viewBox"
            xmlns="http://www.w3.org/2000/svg"
            class="size-full"
            ref="qrSvg"
          >
            <g
              v-for="(row, rowIndex) in generatedCode"
              :key="rowIndex"
            >
              <rect
                v-for="(cell, colIndex) in row"
                :key="colIndex"
                :x="colIndex * (cellSize + gap)"
                :y="rowIndex * (cellSize + gap)"
                :width="cellSize"
                :height="cellSize"
                :fill="(cell.toString() === '1' || cell.toString() === '8') ? 'var(--color-bg)' : 'transparent'"
                class="transition-all ease-out duration-300"
                :style="visibleCells.has(rowIndex * row.length + colIndex)
                ? 'transform: scale(1); opacity: 1; filter: blur(0px);'
                : 'transform: scale(0); opacity: 0; filter: blur(2px);'"
              />
            </g>
          </svg>
        </template>
      </div>
    </div>
  </div>
</template>
