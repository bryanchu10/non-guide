<template>
  <div
    id="exampleModal"
    ref="modal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-danger">
          <h5 class="modal-title text-light fw-bold">
            <slot name="title" />
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div class="modal-body pb-0">
          <slot name="body" />
        </div>
        <div class="modal-footer border-0">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modalMixin from '@/mixins/modalMixin';

export default {
  mixins: [modalMixin],
  data() {
    return {
      modal: {},
    };
  },
  mounted() {
    this.$refs.modal.addEventListener('hide.bs.modal', this.hideModalHandler);
  },
  beforeUnmount() {
    this.$refs.modal.removeEventListener('hide.bs.modal', this.hideModalHandler);
  },
  methods: {
    hideModalHandler() {
      this.$router.push('/products/list');
    },
  },
};
</script>
