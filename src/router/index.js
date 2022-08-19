import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    children: [
      {
        path: 'overview',
        name: 'overview',
        component: () => import('../views/AboutOverview.vue'),
      },
      {
        path: ':articleId',
        name: 'article',
        component: () => import('../views/AboutArticle.vue'),
      },
    ],
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('../views/ProductsView.vue'),
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('../views/ProductsList.vue'),
        children: [
          {
            // 用來轉址到 list 的時候透過 params 傳遞資料
            path: ':areaThroughRouter',
          },
        ],
      },
      {
        path: ':productId',
        name: 'product',
        component: () => import('../views/ProductsProduct.vue'),
      },
    ],
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('../views/CheckoutView.vue'),
    children: [
      {
        path: 'info',
        name: 'info',
        component: () => import('../views/CheckoutInfo.vue'),
      },
      {
        path: ':orderId',
        name: 'payment',
        component: () => import('../views/CheckoutPayment.vue'),
      },
    ],
  },
  {
    path: '/success/:orderId',
    name: 'success',
    component: () => import('../views/SuccessView.vue'),
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminView.vue'),
    children: [
      {
        path: 'products',
        name: 'productsManage',
        component: () => import('../views/AdminProducts.vue'),
      },
      {
        path: 'orders',
        name: 'ordersManage',
        component: () => import('../views/AdminOrders.vue'),
      },
      {
        path: 'coupons',
        name: 'couponsManage',
        component: () => import('../views/AdminCoupons.vue'),
      },
      {
        path: 'articles',
        name: 'articlesManage',
        component: () => import('../views/AdminArticles.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: 'active fw-bold',
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
