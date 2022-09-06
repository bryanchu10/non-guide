<template>
  <div
    class="toast-container position-absolute ps-3 pt-3 top-0"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <ToastMessage
      v-for="(msg, key) in messages"
      :key="key"
      :msg="msg"
    />
  </div>
</template>

<script>
import ToastMessage from '@/components/helpers/ToastMessage.vue';

export default {
  components: { ToastMessage },
  inject: ['$emitter'],
  data() {
    return {
      messages: [],
    };
  },
  mounted() {
    this.$emitter.on('push-message', (message) => {
      console.log(message);

      const {
        style = 'primary',
        title,
        content,
        status,
      } = message;

      this.messages.push({
        style,
        title,
        content,
        status,
      });
    });
  },
};
</script>
