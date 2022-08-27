export default {
  methods: {
    getBrowserWidth() {
      this.browserWidth = window.innerWidth;
    },
    getBrowserHeight() {
      this.browserHeight = window.innerHeight;
    },
    resizeHandler() {
      this.getBrowserWidth();
      this.getBrowserHeight();
    },
  },
  mounted() {
    window.addEventListener('resize', this.resizeHandler);
    this.getBrowserWidth();
    this.getBrowserHeight();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeHandler);
  },
};
