export default {
  methods: {
    getBrowserWidth() {
      this.browserWidth = window.innerWidth;
    },
    resizeHandler() {
      this.getBrowserWidth();
    },
  },
  mounted() {
    window.addEventListener('resize', this.resizeHandler);
    this.getBrowserWidth();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeHandler);
  },
};
