<template>
  <div class="modal fade" id="exampleModal"
        tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true" ref="modal">
    <div class="modal-dialog" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white fw-bold">
          <h5 class="modal-title" id="exampleModalLabel">
            <span class="fw-bold">{{ isNew ? '新增' : '編輯'}}優惠代碼</span>
          </h5>
          <button type="button" class="btn-close btn-close-white"
                  data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row gx-2">
            <div class="col-12">
              <div class="mb-3">
                <label for="title" class="form-label">標題</label>
                <input type="text" class="form-control" id="title"
                        placeholder="請輸入標題" v-model="tempCoupon.title"/>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label for="code" class="form-label">代碼</label>
                <input type="text" class="form-control" id="code"
                        placeholder="請設定代碼" v-model="tempCoupon.code"/>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label for="price" class="form-label">折扣</label>
                <div class="input-group mb-3">
                  <input type="number" class="form-control" id="price"
                          placeholder="請輸入單位" v-model="tempCoupon.percent"/>
                  <span class="input-group-text" id="basic-addon2">%</span>
                </div>
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <label for="due_date_date" class="form-label">到期日</label>
              <input type="date" class="form-control" id="due_date_date"
                      placeholder="" v-model="isoDue_date_date"/>
            </div>
            <div class="col-6 mb-3">
              <label for="due_date_time" class="form-label">到期時間</label>
              <input type="time" class="form-control" id="due_date_time"
                      placeholder="" v-model="isoDue_date_time"/>
            </div>
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox"
                        :true-value="1"
                        :false-value="0"
                        id="is_enabled"
                        v-model="tempCoupon.is_enabled"/>
                <label class="form-check-label" for="is_enabled">
                  是否啟用
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary"
                  data-bs-dismiss="modal">取消
          </button>
          <button type="button" class="btn btn-primary"
                  @click="$emit('update-coupon', tempCoupon)">確認</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modalMixin from '@/mixins/modalMixin';

export default {
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
      defautl: false,
    },
  },
  data() {
    return {
      tempCoupon: {},
      isLoading: false,
      isoDue_date_date: '',
      isoDue_date_time: '',
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
  methods: {
    uploadFile() {
      this.isLoading = true;
      const uploadedFile = this.$refs.fileInput.files[0];
      const formData = new FormData();
      formData.append('file-to-upload', uploadedFile);
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/upload`;
      this.$http.post(url, formData)
        .then((res) => {
          this.isLoading = false;
          if (res.data.success) {
            this.tempCoupon.imageUrl = res.data.imageUrl;
          }
        });
    },
  },
  mixins: [modalMixin],
};
</script>
