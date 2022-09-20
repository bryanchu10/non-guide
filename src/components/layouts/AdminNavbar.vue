<template>
  <nav
    class="navbar navbar-expand-md bg-light fixed-top fixed-top-animate"
    :class="{'fixed-top-animate--hide': isScrollUp}"
  >
    <div class="container-fluid">
      <router-link
        class="navbar-brand d-flex align-items-center pe-3 pb-2"
        to="/"
      >
        <img
          class="me-2"
          src="@/assets/images/logo.svg"
          alt="logo"
          width="24"
          height="24"
        >
        <h1 class="fs-4 fw-bold mb-0">
          烏有指南
        </h1>
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <div
        id="navbarNav"
        ref="menuCollapse"
        class="collapse navbar-collapse"
      >
        <ul class="navbar-nav w-100">
          <li class="nav-item">
            <router-link
              to="/admin/products"
              class="nav-link"
              @click="closeCollapse"
            >
              出版品
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/admin/orders"
              class="nav-link"
              @click="closeCollapse"
            >
              訂單
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/admin/coupons"
              class="nav-link"
              @click="closeCollapse"
            >
              優惠券
            </router-link>
          </li>
          <li class="nav-item mb-3 mb-md-0">
            <router-link
              to="/admin/articles"
              class="nav-link"
              @click="closeCollapse"
            >
              文章
            </router-link>
          </li>
          <button
            class="btn btn-outline-secondary ms-sm-auto mb-2 mb-md-0"
            @click="logOut"
          >
            登出
          </button>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import Collapse from 'bootstrap/js/dist/collapse';

export default {
  data() {
    return {
      isScrollUp: false,
      scrollYPosition: 0,
      collapse: {},
    };
  },
  watch: {
    scrollYPosition(newPosition, oldPosition) {
      if (newPosition < oldPosition) {
        this.isScrollUp = false;
      } else {
        this.isScrollUp = true;
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', this.scrollYHandler);
    this.collapse = new Collapse(this.$refs.menuCollapse, {
      toggle: false,
    });
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.scrollYHandler);
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
    closeCollapse() {
      this.collapse.hide();
    },
    scrollYHandler() {
      this.scrollYPosition = window.scrollY;
    },
  },
};
</script>
