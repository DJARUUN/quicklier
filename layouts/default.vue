<template>
  <div class="p-6 h-dvh w-full overflow-hidden">
    <Background
      :quantity="250"
      color="#565656"
      class="size-full absolute inset-0 -z-50"
    />

    <slot />
  </div>
</template>
