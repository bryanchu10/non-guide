<template>
  <nav class="navbar navbar-expand-md bg-light fixed-top"
        :class="{'fixed-top--hide': isScrollUp}">
    <div class="container-fluid">
      <a class="navbar-brand fw-bold" href="#">烏有指南</a>
      <button class="navbar-toggler" type="button"
              data-bs-toggle="collapse" data-bs-target="#navbarNav"
              aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav w-100">
          <li class="nav-item">
            <router-link to="/admin/products" class="nav-link">出版品</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/orders" class="nav-link">訂單</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/coupons" class="nav-link">優惠券</router-link>
          </li>
          <li class="nav-item mb-3 mb-md-0">
            <router-link to="/admin/articles" class="nav-link">文章</router-link>
          </li>
          <button class="btn btn-outline-secondary ms-sm-auto mb-2 mb-md-0"
                  @click="logOut">登出</button>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isScrollUp: false,
      scrollYPosition: 0,
    };
  },
  methods: {
    logOut() {
      const api = `${process.env.VUE_APP_API}/logout`;
      this.$http.post(api)
        .then((res) => {
          if (res.data.success) {
            this.$router.push('/');
          }
        });
    },
    scrollYHandler() {
      this.scrollYPosition = window.scrollY;
    },
  },
  watch: {
    scrollYPosition(newPoisiton, oldPosition) {
      if (newPoisiton < oldPosition) {
        this.isScrollUp = false;
      } else {
        this.isScrollUp = true;
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', this.scrollYHandler);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.scrollYHandler);
  },
};
</script>

<style lang="scss" scoped>
.fixed-top{
  transition: ease-out 0.2s;
  &--hide{
    top: -3.5rem;
    transition: ease-out 0.2s;
  }
}
</style>
