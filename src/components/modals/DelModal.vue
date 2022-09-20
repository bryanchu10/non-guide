<template>
  <div
    ref="modal"
    class="modal"
    tabindex="-1"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title">
            刪除項目
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div class="modal-body">
          <p>是否刪除<strong class="text-danger">{{ titleStr }}</strong>？（刪除後將無法恢復）</p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button
            type="button"
            class="btn btn-danger"
            @click="$emit('del-item', tempItem)"
          >
            確認刪除
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
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  emits: ['del-item'],
  data() {
    return {
      tempItem: {},
      titleStr: '',
      modal: {},
    };
  },
  watch: {
    item() {
      this.tempItem = JSON.parse(JSON.stringify(this.item));
      if (this.$route.name === 'ordersManage') {
        this.titleStr = this.item.id;
      } else {
        this.titleStr = this.item.title;
      }
    },
  },
};
</script>
