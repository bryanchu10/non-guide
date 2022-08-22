<template>
  <div class="modal fade" id="exampleModal" tabindex="-1"
        aria-labelledby="exampleModalLabel" aria-hidden="true"
        ref="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-danger">
          <h5 class="modal-title text-light fw-bold">
            <slot name="title"></slot>
          </h5>
          <button type="button" class="btn-close btn-close-white"
                data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body pb-0">
          <slot name="body"></slot>
        </div>
        <div class="modal-footer border-0">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modalMixin from '@/mixins/modalMixin';

export default {
  methods: {
    hideModalHandler() {
      this.$router.push('/products/list');
    },
  },
  mounted() {
    this.$refs.modal.addEventListener('hide.bs.modal', this.hideModalHandler);
  },
  beforeUnmount() {
    this.$refs.modal.removeEventListener('hide.bs.modal', this.hideModalHandler);
  },
  mixins: [modalMixin],
};
</script>
