<script setup lang="ts">
import { twMerge } from 'tailwind-merge';

defineProps<{ class?: string; isPending?: boolean }>();
</script>

<template>
  <button
    :class="twMerge('border border-border px-2 bg-bg not-disabled:hover:bg-fg not-disabled:hover:text-bg cursor-pointer inline-flex gap-2 justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed h-9 transition-all ease-out', $props.class)">
    <template v-if="isPending !== undefined && isPending">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" class="size-3.5">
        <g stroke="currentColor">
          <circle cx="12" cy="12" r="9.5" fill="none" stroke-linecap="round" stroke-width="2.3">
            <animate attributeName="stroke-dasharray" calcMode="spline" dur="1.5s"
              keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" keyTimes="0;0.475;0.95;1" repeatCount="indefinite"
              values="0 150;42 150;42 150;42 150"></animate>
            <animate attributeName="stroke-dashoffset" calcMode="spline" dur="1.5s"
              keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" keyTimes="0;0.475;0.95;1" repeatCount="indefinite"
              values="0;-16;-59;-59"></animate>
          </circle>
          <animateTransform attributeName="transform" dur="2s" repeatCount="indefinite" type="rotate"
            values="0 12 12;360 12 12"></animateTransform>
        </g>
      </svg>

      <span>
        <slot name="pending" />
      </span>
    </template>

    <template v-else>
      <slot />
    </template>
  </button>
</template>
