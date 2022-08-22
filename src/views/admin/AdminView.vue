<template>
  <AdminNavbar/>
  <router-view/>
  <ToastList/>
</template>

<script>
import AdminNavbar from '@/components/layouts/AdminNavbar.vue';
import ToastList from '@/components/helpers/ToastList.vue';
import pushMessageState from '@/methods/pushMessageState';

export default {
  components: {
    AdminNavbar,
    ToastList,
  },
  provide() {
    return {
      pushMessageState,
    };
  },
  created() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexVue3CourseApiToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    this.$http.defaults.headers.common.Authorization = token;
    const api = `${process.env.VUE_APP_API}/api/user/check`;
    this.$http.post(api)
      .then((res) => {
        if (!res.data.success) {
          this.$router.push('/');
        }
      });
  },
};
</script>
