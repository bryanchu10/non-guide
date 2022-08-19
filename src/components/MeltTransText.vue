<template>
  <div class="box position-relative mb-3"
        ref="meltTransTextBox">
    <Transition name="melt">
      <span class="text text-white fs-4 fw-bold position-absolute"
            ref="meltTransText"
            v-if="!wordChanged">
        <slot name="init"/>
      </span>
      <span class="text text-white fs-4 fw-bold position-absolute"
            v-else>
        <slot name="final"/>
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
  methods: {
    setBoxHeight() {
      const boxHeight = this.$refs.meltTransText.offsetHeight;
      this.$refs.meltTransTextBox.style.height = `${boxHeight}px`;
    },
  },
  mounted() {
    this.setBoxHeight();
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
