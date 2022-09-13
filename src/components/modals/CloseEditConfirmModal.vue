<template>
  <div
    id="closeEditConfirm"
    ref="modal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="closeEditConfirmLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-danger text-white">
          <h5
            id="closeEditConfirmLabel"
            class="modal-title"
          >
            圖片還在上傳當中
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            aria-label="Close"
            data-bs-dismiss="modal"
          />
        </div>
        <div class="modal-body">
          確定要結束編輯嗎？圖片可能需要重新上傳。
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            等待上傳完成
          </button>
          <button
            type="button"
            class="btn btn-danger"
            @click="$emit('close-two-modal')"
          >
            結束編輯
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
  emits: ['close-two-modal'],
  data() {
    return {
      modal: {},
    };
  },
};
</script>
