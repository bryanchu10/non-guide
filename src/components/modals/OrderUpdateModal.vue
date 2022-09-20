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
      class="modal-dialog modal-xl"
      role="document"
    >
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white fw-bold">
          <h5
            id="exampleModalLabel"
            class="modal-title"
          >
            <span class="fw-bold">編輯單號：{{ tempOrder.id }}</span>
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-lg-6">
              <div class="row gx-2">
                <div class="col-6 mb-3">
                  <label
                    for="create_at_date"
                    class="form-label"
                  >成立日期</label>
                  <input
                    id="create_at_date"
                    v-model="isoCreate_at_date"
                    type="date"
                    class="form-control"
                    placeholder="修改訂單成立日期"
                  >
                </div>
                <div class="col-6 mb-3">
                  <label
                    for="create_at_time"
                    class="form-label"
                  >成立時間</label>
                  <input
                    id="create_at_time"
                    v-model="isoCreate_at_time"
                    type="time"
                    class="form-control"
                    placeholder="修改訂單成立時間"
                  >
                </div>
                <hr>
                <div
                  v-if="tempOrder.user"
                  class="col-6 mb-3"
                >
                  <label
                    for="userName"
                    class="form-label"
                  >收件人姓名</label>
                  <input
                    id="userName"
                    v-model="tempOrder.user.name"
                    type="text"
                    class="form-control"
                    placeholder="修改收件人姓名"
                  >
                </div>
                <div
                  v-if="tempOrder.user"
                  class="col-6 mb-3"
                >
                  <label
                    for="userTel"
                    class="form-label"
                  >收件人手機號碼</label>
                  <input
                    id="userTel"
                    v-model.lazy="tempOrder.user.tel"
                    type="tel"
                    class="form-control"
                    placeholder="修改收件人手機號碼"
                  >
                </div>
                <div
                  v-if="tempOrder.user"
                  class="col-12 mb-3"
                >
                  <label
                    for="userEmail"
                    class="form-label"
                  >收件人電子郵箱位置</label>
                  <input
                    id="userEmail"
                    v-model.lazy="tempOrder.user.email"
                    type="email"
                    class="form-control"
                    placeholder="修改收件人電子郵箱位置"
                  >
                </div>
                <div
                  v-if="tempOrder.user"
                  class="col-12 mb-3"
                >
                  <label
                    for="userAddress"
                    class="form-label"
                  >收件地址</label>
                  <input
                    id="userAddress"
                    v-model.lazy="tempOrder.user.address"
                    type="text"
                    class="form-control"
                    placeholder="修改收件地址"
                  >
                </div>
                <button
                  v-if="!hasMessage"
                  class="btn btn-outline-secondary"
                  @click="hasMessage = true"
                >
                  開啟備註欄
                </button>
                <div
                  v-if="hasMessage"
                  class="col-12 mb-3"
                >
                  <label
                    for="userMessage"
                    class="form-label"
                  >備註</label>
                  <textarea
                    id="userMessage"
                    v-model.lazy="tempOrder.message"
                    class="form-control"
                    placeholder="修改備註"
                  />
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="mb-3">
                <label
                  for="total"
                  class="form-label"
                >總金額</label>
                <div class="input-group mb-3">
                  <span
                    id="basic-addon1"
                    class="input-group-text"
                  >NT$</span>
                  <input
                    id="total"
                    v-model="tempOrder.total"
                    type="text"
                    class="form-control"
                    placeholder="請輸入金額"
                  >
                </div>
              </div>
              <hr>
              <template
                v-for="(product, key) in tempOrder.products"
                :key="key"
              >
                <h3 class="fs-6">
                  {{ product.product.title }}
                </h3>
                <div class="row gx-2">
                  <div class="col-6">
                    <label
                      :for="`${key}title`"
                      class="form-label"
                    >
                      標題
                    </label>
                    <input
                      :id="`${key}title`"
                      v-model="tempOrder.products[key].product.title"
                      type="text"
                      class="form-control"
                      placeholder="請輸入標題"
                    >
                  </div>
                  <div class="col-6">
                    <label
                      :for="`${key}qty`"
                      class="form-label"
                    >
                      數量
                    </label>
                    <input
                      :id="`${key}qty`"
                      v-model="tempOrder.products[key].qty"
                      type="number"
                      class="form-control"
                      placeholder="請輸入數量"
                    >
                  </div>
                </div>
                <hr>
              </template>
              <div class="">
                <div class="form-check">
                  <input
                    id="is_paid"
                    v-model="tempOrder.is_paid"
                    class="form-check-input"
                    type="checkbox"
                    :true-value="true"
                    :false-value="false"
                    @change="addPaid_date(tempOrder.is_paid)"
                  >
                  <label
                    class="form-check-label"
                    for="is_paid"
                  >
                    是否付款（手動修改後以當前時間為付款時間）
                  </label>
                </div>
              </div>
              <span v-if="tempOrder.is_paid">
                付款時間：{{ $dayjs.unix(tempOrder.paid_date)
                  .tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss') }}
              </span>
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
            @click="$emit('update-order', tempOrder)"
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
  inject: ['$filters', '$dayjs'],
  props: {
    order: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  emits: ['update-order'],
  data() {
    return {
      tempOrder: {},
      isLoading: false,
      isoCreate_at_date: '',
      isoCreate_at_time: '',
      isoPaid_date: '',
      hasMessage: false,
      modal: {},
    };
  },
  computed: {
    timeToBackend() {
      const combineIsoTime = `${this.isoCreate_at_date}T${this.isoCreate_at_time}+08:00`;
      const unixTime = this.$dayjs(combineIsoTime).unix();
      return unixTime;
    },
  },
  watch: {
    order() {
      this.tempOrder = JSON.parse(JSON.stringify(this.order));
      this.isoCreate_at_date = this.$dayjs.unix(this.tempOrder.create_at).tz('Asia/Taipei').format('YYYY-MM-DD');
      this.isoCreate_at_time = this.$dayjs.unix(this.tempOrder.create_at).tz('Asia/Taipei').format('HH:mm:ss');
      if (this.tempOrder.message) {
        this.hasMessage = true;
      } else {
        this.hasMessage = false;
      }
    },
    timeToBackend() {
      this.tempOrder.create_at = this.timeToBackend;
    },
  },
  methods: {
    addPaid_date(value) {
      if (value) {
        this.tempOrder.paid_date = Math.floor(new Date().getTime() / 1000);
      }
    },
  },
};
</script>
