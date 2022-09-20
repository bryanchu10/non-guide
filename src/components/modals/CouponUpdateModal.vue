<template>
  <div
    id="exampleModal"
    ref="modal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div
      class="modal-dialog"
      role="document"
    >
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white fw-bold">
          <h5
            id="exampleModalLabel"
            class="modal-title"
          >
            <span class="fw-bold">{{ isNew ? '新增' : '編輯' }}優惠代碼</span>
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div class="modal-body">
          <div class="row gx-2">
            <div class="col-12">
              <div class="mb-3">
                <label
                  for="title"
                  class="form-label"
                >標題</label>
                <input
                  id="title"
                  v-model="tempCoupon.title"
                  type="text"
                  class="form-control"
                  placeholder="請輸入標題"
                >
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label
                  for="code"
                  class="form-label"
                >代碼</label>
                <input
                  id="code"
                  v-model="tempCoupon.code"
                  type="text"
                  class="form-control"
                  placeholder="請設定代碼"
                >
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label
                  for="price"
                  class="form-label"
                >折扣</label>
                <div class="input-group mb-3">
                  <input
                    id="price"
                    v-model="tempCoupon.percent"
                    type="number"
                    class="form-control"
                    placeholder="請輸入單位"
                  >
                  <span
                    id="basic-addon2"
                    class="input-group-text"
                  >%</span>
                </div>
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <label
                for="due_date_date"
                class="form-label"
              >到期日</label>
              <input
                id="due_date_date"
                v-model="isoDue_date_date"
                type="date"
                class="form-control"
                placeholder=""
              >
            </div>
            <div class="col-6 mb-3">
              <label
                for="due_date_time"
                class="form-label"
              >到期時間</label>
              <input
                id="due_date_time"
                v-model="isoDue_date_time"
                type="time"
                class="form-control"
                placeholder=""
              >
            </div>
            <div class="mb-3">
              <div class="form-check">
                <input
                  id="is_enabled"
                  v-model="tempCoupon.is_enabled"
                  class="form-check-input"
                  type="checkbox"
                  :true-value="1"
                  :false-value="0"
                >
                <label
                  class="form-check-label"
                  for="is_enabled"
                >
                  是否啟用
                </label>
              </div>
            </div>
          </div>
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
            class="btn btn-primary"
            @click="$emit('update-coupon', tempCoupon)"
          >
            確認
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
  inject: ['$dayjs'],
  props: {
    coupon: {
      type: Object,
      default() {
        return {};
      },
    },
    isNew: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update-coupon'],
  data() {
    return {
      tempCoupon: {},
      isLoading: false,
      isoDue_date_date: '',
      isoDue_date_time: '',
      modal: {},
    };
  },
  computed: {
    timeToBackend() {
      const combineIsoTime = `${this.isoDue_date_date}T${this.isoDue_date_time}+08:00`;
      const unixTime = this.$dayjs(combineIsoTime).unix();
      return unixTime;
    },
  },
  watch: {
    coupon() {
      this.tempCoupon = JSON.parse(JSON.stringify(this.coupon));
      if (this.tempCoupon.due_date || this.isoDue_date_date) {
        this.isoDue_date_date = this.$dayjs.unix(this.tempCoupon.due_date).tz('Asia/Taipei').format('YYYY-MM-DD');
      }
      if (this.tempCoupon.due_date || this.isoDue_date_time) {
        this.isoDue_date_time = this.$dayjs.unix(this.tempCoupon.due_date).tz('Asia/Taipei').format('HH:mm:ss');
      }
    },
    timeToBackend() {
      this.tempCoupon.due_date = this.timeToBackend;
    },
  },
};
</script>
