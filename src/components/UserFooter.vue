<template>
  <footer class="bg-black">
    <div class="container pt-4 px-4 pb-3">
      <div class="row flex-column flex-xl-row">
        <div class="col-xl-10 mb-5 mb-xl-0">
          <router-link class="text-decoration-none" to="/">
            <h2 class="fs-4 fw-bold text-white mb-5 mb-xl-2 me-3">
              烏有指南
            </h2>
          </router-link>
          <p class="text-secondary fw-bold mb-0 ms-3 pb-2">
            © 2022. 版面設計修改自六角學院授權設計稿，圖片來自於 Unsplash 上的創作者，「出版品」與「關於」內文由唬爛產生器產生。此網站為個人作品展示，非商業使用。
          </p>
        </div>
        <div class="col-xl-2 d-flex justify-content-xl-end">
          <button class="btn btn-link link-secondary text-decoration-none
                          align-self-end ps-0 py-2"
                  @click="$emit('showLoginModal')">
            <i class="bi bi-person-circle me-2"></i>
            <span class="fw-bold">管理員登入</span>
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
export default {

};
</script>
<style lang="scss" scoped>
footer {
  p {
    text-indent: -1rem;
  }
}
</style>
