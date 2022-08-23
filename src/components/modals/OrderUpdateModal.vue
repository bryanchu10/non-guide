<template>
  <div class="modal fade" id="exampleModal"
        tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true" ref="modal">
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white fw-bold">
          <h5 class="modal-title" id="exampleModalLabel">
            <span class="fw-bold">編輯單號：{{ tempOrder.id }}</span>
          </h5>
          <button type="button" class="btn-close btn-close-white"
                  data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-lg-6">
              <div class="row gx-2">
                <div class="col-6 mb-3">
                  <label for="create_at_date" class="form-label">成立日期</label>
                  <input type="date" class="form-control" id="create_at_date"
                          placeholder="修改訂單成立日期" v-model="isoCreate_at_date"/>
                </div>
                <div class="col-6 mb-3">
                  <label for="create_at_time" class="form-label">成立時間</label>
                  <input type="time" class="form-control" id="create_at_time"
                          placeholder="修改訂單成立時間" v-model="isoCreate_at_time"/>
                </div>
                <hr>
                <div class="col-6 mb-3" v-if="tempOrder.user">
                  <label for="userName" class="form-label">收件人姓名</label>
                  <input type="text" class="form-control" id="userName"
                          placeholder="修改收件人姓名" v-model="tempOrder.user.name"/>
                </div>
                <div class="col-6 mb-3" v-if="tempOrder.user">
                  <label for="userTel" class="form-label">收件人手機號碼</label>
                  <input type="tel" class="form-control" id="userTel"
                          placeholder="修改收件人手機號碼" v-model.lazy="tempOrder.user.tel"/>
                </div>
                <div class="col-12 mb-3" v-if="tempOrder.user">
                  <label for="userEmail" class="form-label">收件人電子郵箱位置</label>
                  <input type="email" class="form-control" id="userEmail"
                          placeholder="修改收件人電子郵箱位置" v-model.lazy="tempOrder.user.email"/>
                </div>
                <div class="col-12 mb-3" v-if="tempOrder.user">
                  <label for="userAddress" class="form-label">收件地址</label>
                  <input type="text" class="form-control" id="userAddress"
                          placeholder="修改收件地址" v-model.lazy="tempOrder.user.address"/>
                </div>
                <button v-if="!hasMessage" class="btn btn-outline-secondary"
                        @click="hasMessage = true">開啟備註欄</button>
                <div class="col-12 mb-3" v-if="hasMessage">
                  <label for="userMessage" class="form-label">備註</label>
                  <textarea class="form-control" id="userMessage"
                          placeholder="修改備註" v-model.lazy="tempOrder.message"></textarea>
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="mb-3">
                <label for="total" class="form-label">總金額</label>
                <div class="input-group mb-3">
                  <span class="input-group-text" id="basic-addon1">NT$</span>
                  <input type="text" class="form-control" id="total"
                        placeholder="請輸入金額" v-model="tempOrder.total"/>
                </div>
              </div>
              <hr>
              <template v-for="(product, key) in tempOrder.products" :key="key">
                <h3 class="fs-6">{{ product.product.title }}</h3>
                <div class="row gx-2">
                  <div class="col-6">
                    <label :for="`${key}title`"
                            class="form-label">
                      標題
                    </label>
                    <input type="text" class="form-control" :id="`${key}title`"
                            placeholder="請輸入標題" v-model="tempOrder.products[key].product.title"/>
                  </div>
                  <div class="col-6">
                    <label :for="`${key}qty`"
                            class="form-label">
                      數量
                    </label>
                    <input type="number" class="form-control" :id="`${key}qty`"
                            placeholder="請輸入數量" v-model="tempOrder.products[key].qty"/>
                  </div>
                </div>
                <hr>
              </template>
              <div class="">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox"
                          :true-value="true"
                          :false-value="false"
                          id="is_paid"
                          v-model="tempOrder.is_paid"
                          @change="addPaid_date(tempOrder.is_paid)"/>
                  <label class="form-check-label" for="is_paid">
                    是否付款（手動修改後以當前時間為付款時間）
                  </label>
                </div>
              </div>
              <span v-if="tempOrder.is_paid" class="">
                付款時間：{{ this.$dayjs.unix(this.tempOrder.paid_date)
                                  .tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss') }}
              </span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary"
                  data-bs-dismiss="modal">取消
          </button>
          <button type="button" class="btn btn-primary"
                  @click="$emit('update-order', tempOrder)">確認</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modalMixin from '@/mixins/modalMixin';

export default {
  inject: ['$filters', '$dayjs'],
  props: {
    order: {
      type: Object,
      default() {
        return {};
      },
    },
  },
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
  mixins: [modalMixin],
};
</script>
