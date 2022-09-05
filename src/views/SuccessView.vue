<template>
  <nav class="navbar fixed-top py-3">
    <div class="container justify-content-center justify-content-sm-start">
      <router-link class="navbar-brand d-flex align-items-center pe-2 py-0" to="/">
        <img class="me-2" src="@/assets/images/logo.svg" alt="logo" width="24" height="24">
        <h1 class="fs-4 fw-bold text-light text-lg-dark lh-base mb-0">烏有指南</h1>
      </router-link>
    </div>
  </nav>
  <section class="banner container-fluid vh-100 position-relative">
    <div class="container h-100">
      <div class="row h-100">
        <div class="col-lg-6 d-flex flex-column align-items-center align-items-lg-start
                    justify-content-between justify-content-lg-center py-4">
          <div class="d-lg-none py-4"></div>
          <div class="mb-5">
            <h2 class="text-white text-lg-black text-center text-lg-start fw-bold fs-1 mb-4">
              旅程即將<br class="d-sm-none">展開
            </h2>
            <p class="text-light text-lg-secondary fw-lg-bold fs-lg-4
                      text-center text-lg-start mb-0">
              付款成功，您將在 24 小時內收到<br>您訂購的指南，祝您一路順風。
            </p>
          </div>
          <div class="col-12 col-sm-8 col-md-6">
            <button class="btn btn-primary btn-lg w-100" type="button"
                    @click.prevent="$router.push('/products/list')">
              繼續選購
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-end">
      <div class="col-lg-6 position-absolute top-0 bottom-0 bgp-center bgsz-cover zindex-n1"
            style="background-image: url(https://images.unsplash.com/photo-1534531835045-dac73bb24d14?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1665&q=80);">
      </div>
      <div class="d-lg-none bg-black bg-opacity-50
                  position-absolute top-0 bottom-0 zindex-n1"></div>
    </div>
  </section>
</template>

<script>
export default {

};
</script>
