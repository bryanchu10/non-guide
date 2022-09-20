<template>
  <AdminNavbar />
  <router-view />
</template>

<script>
import AdminNavbar from '@/components/layouts/AdminNavbar.vue';

export default {
  components: {
    AdminNavbar,
  },
  inject: ['$pushMessageState'],
  created() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexVue3CourseApiToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    this.$http.defaults.headers.common.Authorization = token;
    const api = `${process.env.VUE_APP_API}/api/user/check`;
    this.$http.post(api)
      .then((res) => {
        if (!res.data.success) {
          this.$router.push('/');
        }
      }).catch((err) => {
        this.$pushMessageState(err.response, '登入狀態檢查');
        this.$router.push('/');
      });
  },
};
</script>
