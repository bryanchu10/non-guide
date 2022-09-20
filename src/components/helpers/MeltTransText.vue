<template>
  <div
    ref="meltTransTextBox"
    class="box position-relative mb-3"
  >
    <Transition name="melt">
      <span
        v-if="!wordChanged"
        ref="meltTransText"
        class="text text-white fs-4 fw-bold position-absolute"
      >
        <slot name="init" />
      </span>
      <span
        v-else
        class="text text-white fs-4 fw-bold position-absolute"
      >
        <slot name="final" />
      </span>
    </Transition>
  </div>
</template>

<script>
export default {
  props: {
    wordChanged: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.setBoxHeight();
  },
  methods: {
    setBoxHeight() {
      const boxHeight = this.$refs.meltTransText.offsetHeight;
      this.$refs.meltTransTextBox.style.height = `${boxHeight}px`;
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  filter: contrast(5);
  .text {
    text-shadow: 0 0 120px #000000;
  }
}

.melt-enter-active {
  animation: blur 2s;
}
.melt-leave-active {
  animation: blur 2s reverse;
}

@keyframes blur {
  0% {
    opacity: 0;
    filter: blur(0px);
  }
  10% {
    opacity: 0;
    filter: blur(6px);
  }
  90% {
    opacity: .8;
    filter: blur(6px);
  }
  100% {
    opacity: 1;
    filter: blur(0px);
  }
}
</style>
