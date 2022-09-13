import Modal from 'bootstrap/js/dist/modal';

export default {
  methods: {
    showModal() {
      this.modal.show();
    },
    hideModal() {
      this.modal.hide();
    },
  },
  mounted() {
    this.modal = new Modal(this.$refs.modal);
    // if (this.confirmModal) {
    //   this.confirmModal = new Modal(this.$refs.confirmModal);
    // }
  },
  beforeUnmount() {
    this.hideModal();
    // if (this.confirmModal) {
    //   this.confirmModal = new Modal(this.$refs.confirmModal);
    // }
  },
};
