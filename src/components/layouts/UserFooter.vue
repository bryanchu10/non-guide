<template>
  <footer
    ref="section"
    class="bg-black"
  >
    <div class="container pt-4 px-4 pb-3">
      <div class="row flex-column flex-xl-row">
        <div class="col-xl-10 d-flex flex-column mb-5 mb-xl-0">
          <router-link
            class="text-decoration-none align-self-start"
            to="/"
          >
            <h2 class="fs-4 fw-bold text-white mb-5 mb-xl-2 me-3">
              烏有指南
            </h2>
          </router-link>
          <p class="text-secondary fw-bold text-indent-n1 mb-0 ms-3 pb-2">
            © 2022. 版面設計修改自六角學院授權設計稿，圖片來自於 Unsplash 上的創作者。此網站為個人作品展示，非商業使用。
          </p>
        </div>
        <div class="col-xl-2 d-flex justify-content-xl-end">
          <button
            v-if="isLoggedIn"
            type="button"
            class="btn btn-link link-secondary text-decoration-none align-self-end ps-0 py-2"
            @click="$router.push('/admin/products')"
          >
            <i class="bi bi-person-circle me-2" />
            <span class="fw-bold">進入控制台</span>
          </button>
          <button
            v-else
            type="button"
            class="btn btn-link link-secondary text-decoration-none align-self-end ps-0 py-2"
            @click="$emit('show-login-modal')"
          >
            <i class="bi bi-person-circle me-2" />
            <span class="fw-bold">管理員登入</span>
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import windowResizeMixin from '@/mixins/windowResizeMixin';

export default {
  mixins: [windowResizeMixin],
  inject: ['$pushMessageState'],
  emits: ['show-login-modal'],
  data() {
    return {
      browserWidth: 0,
      sectionHeight: 0,
      isLoggedIn: false,
    };
  },
  watch: {
    browserWidth() {
      this.sectionHeight = this.$refs.section.offsetHeight;
    },
  },
  created() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexVue3CourseApiToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    this.$http.defaults.headers.common.Authorization = token;
    const api = `${process.env.VUE_APP_API}/api/user/check`;
    this.$http.post(api)
      .then((res) => {
        if (res.data.success) {
          this.isLoggedIn = true;
        }
      })
      .catch((err) => {
        this.$pushMessageState(err.response, '檢查登入狀態');
      });
  },
};
</script>
