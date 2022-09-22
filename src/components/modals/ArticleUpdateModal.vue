<template>
  <div
    id="articleUpdateModal"
    ref="modal"
    class="modal fade"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="articleUpdateModalLabel"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-xl"
      role="document"
    >
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white fw-bold">
          <h5
            id="articleUpdateModalLabel"
            class="modal-title"
          >
            <span class="fw-bold">{{ isNew ? '新增' : '編輯' }}文章</span>
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            aria-label="Close"
            @click="checkBeforeHide"
          />
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-lg-4 position-relative">
              <VueLoading
                :active="isUploading"
                :is-full-page="false"
              />
              <div class="mb-3">
                <label
                  for="image"
                  class="form-label"
                >輸入圖片網址</label>
                <input
                  id="image"
                  v-model.lazy="tempArticle.image"
                  type="text"
                  class="form-control"
                  placeholder="請輸入圖片連結"
                >
              </div>
              <div class="mb-3">
                <label
                  for="customFile"
                  class="form-label"
                >或 上傳圖片
                </label>
                <input
                  id="customFile"
                  ref="fileInput"
                  type="file"
                  class="form-control"
                  @change="uploadFile"
                >
              </div>
              <img
                v-if="tempArticle.image"
                class="w-100 h-lv6 ojf-cover mb-3 mb-lg-0"
                :src="tempArticle.image"
                :alt="tempArticle.title"
              >
            </div>
            <div class="col-lg-8">
              <div class="mb-3">
                <label
                  for="title"
                  class="form-label"
                >標題</label>
                <input
                  id="title"
                  v-model="tempArticle.title"
                  type="text"
                  class="form-control"
                  placeholder="請輸入標題"
                >
              </div>

              <div class="row gx-2">
                <div class="mb-3 col-md-6">
                  <label
                    for="author"
                    class="form-label"
                  >作者</label>
                  <input
                    id="author"
                    v-model="tempArticle.author"
                    type="text"
                    class="form-control"
                    placeholder="請輸入分類"
                  >
                </div>
                <div class="mb-3 col-md-6">
                  <label
                    for="create_at"
                    class="form-label"
                  >日期</label>
                  <input
                    id="create_at"
                    v-model="isoCreate_at"
                    type="date"
                    class="form-control"
                    placeholder=""
                  >
                </div>
              </div>

              <div class="mb-3">
                <label
                  for="description"
                  class="form-label"
                >概述</label>
                <textarea
                  id="description"
                  v-model="tempArticle.description"
                  type="text"
                  class="form-control"
                  placeholder="請輸入概述"
                />
              </div>
              <div class="mb-3">
                <label
                  for="content"
                  class="form-label"
                >內容</label>
                <textarea
                  id="content"
                  v-model="tempArticle.content"
                  type="text"
                  class="form-control"
                  placeholder="請輸入內容"
                />
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input
                    id="isPublic"
                    v-model="tempArticle.isPublic"
                    class="form-check-input"
                    type="checkbox"
                    :true-value="true"
                    :false-value="false"
                  >
                  <label
                    class="form-check-label"
                    for="isPublic"
                  >
                    是否啟用
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            v-if="isUploading"
            type="button"
            class="btn btn-outline-secondary me-auto"
            @click="abortUploadImg"
          >
            取消上傳圖片
          </button>
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="checkBeforeHide"
          >
            取消
          </button>
          <button
            type="button"
            class="btn btn-primary"
            :disabled="isUploading"
            @click="$emit('update-article', tempArticle)"
          >
            儲存
          </button>
        </div>
      </div>
    </div>
  </div>

  <CloseEditConfirmModal
    ref="confirmModal"
    @close-two-modal="closeTwoModal"
  />
</template>

<script>
import modalMixin from '@/mixins/modalMixin';
import CloseEditConfirmModal from '@/components/modals/CloseEditConfirmModal.vue';

export default {
  components: {
    CloseEditConfirmModal,
  },
  mixins: [modalMixin],
  inject: ['$dayjs', '$pushMessageState'],
  props: {
    article: {
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
  emits: ['update-article'],
  data() {
    return {
      tempArticle: {},
      isUploading: false,
      isoCreate_at: '',
      modal: {},
      controller: {},
    };
  },
  watch: {
    article() {
      this.tempArticle = JSON.parse(JSON.stringify(this.article));
      this.isoCreate_at = this.$dayjs.unix(this.tempArticle.create_at).tz('Asia/Taipei').format('YYYY-MM-DD');
    },
    isoCreate_at() {
      this.tempArticle.create_at = this.$dayjs(this.isoCreate_at).tz('Asia/Taipei').unix();
    },
  },
  mounted() {
    this.$refs.modal.addEventListener('hide.bs.modal', this.hideModalHandler);
  },
  beforeUnmount() {
    this.$refs.modal.removeEventListener('hide.bs.modal', this.hideModalHandler);
  },
  methods: {
    uploadFile() {
      this.isUploading = true;
      const uploadedFile = this.$refs.fileInput.files[0];
      const formData = new FormData();
      formData.append('file-to-upload', uploadedFile);
      this.controller = new AbortController();
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/upload`;
      this.$http.post(url, formData, { signal: this.controller.signal })
        .then((res) => {
          this.tempArticle.image = res.data.imageUrl;
          this.isUploading = false;
          this.$refs.fileInput.value = '';
          this.$refs.confirmModal.hideModal();
          // 如果使用者恰好在圖片上傳成功瞬間關閉編輯 modal
          // 這時候出現上傳圖片成功的訊息
          // 反而會讓使用者誤會該品項已經更新圖片了
          // （但實際上和其它欄位一樣，還要儲存該次編輯）
          // 所以只提示圖片上傳失敗的訊息
          if (!res.data.success) {
            this.$pushMessageState(res, '圖片上傳');
          }
        })
        .catch((err) => {
          if (err.code === 'ERR_CANCELED') {
            const abortRes = {
              data: {
                message: '圖片上傳已中斷',
              },
            };
            this.$pushMessageState(abortRes, '圖片上傳');
          } else {
            this.$pushMessageState(err.response, '圖片上傳');
          }
          this.isUploading = false;
          this.$refs.fileInput.value = '';
        });
    },
    abortUploadImg() {
      if (this.isUploading) {
        this.controller.abort();
        this.controller = {};
        this.isUploading = false;
      }
    },
    hideModalHandler() {
      this.abortUploadImg();
    },
    checkBeforeHide() {
      if (this.isUploading) {
        this.$refs.confirmModal.showModal();
      } else {
        this.hideModal();
      }
    },
    closeTwoModal() {
      this.$refs.confirmModal.hideModal();
      this.hideModal();
    },
  },
};
</script>
