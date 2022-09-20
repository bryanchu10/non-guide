<template>
  <router-view />
  <ToastList />
</template>

<script>
import ToastList from '@/components/helpers/ToastList.vue';

export default {
  components: {
    ToastList,
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;700&display=swap');
@import "./assets/scss/all";
</style>
