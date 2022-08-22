<template>
  <div class="toast-container position-absolute ps-3 pt-3 top-0">
    <toast-message v-for="(msg, key) in messages" :key="key"
      :msg="msg"
    />
  </div>
</template>

<script>
import ToastMessage from '@/components/helpers/ToastMessage.vue';

export default {
  components: { ToastMessage },
  data() {
    return {
      messages: [],
    };
  },
  inject: ['$emitter'],
  mounted() {
    this.$emitter.on('push-message', (message) => {
      const { style = 'primary', title, content } = message;
      this.messages.push({ style, title, content });
    });
  },
};
</script>
