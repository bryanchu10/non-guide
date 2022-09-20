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
    component: () => import('../views/about/AboutView.vue'),
    children: [
      {
        path: 'overview',
        name: 'overview',
        component: () => import('../views/about/children/AboutOverview.vue'),
      },
      {
        path: ':articleId',
        name: 'article',
        component: () => import('../views/about/children/AboutArticle.vue'),
      },
    ],
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('../views/products/ProductsView.vue'),
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('../views/products/children/ProductsList.vue'),
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
        component: () => import('../views/products/children/ProductsProduct.vue'),
      },
    ],
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('../views/checkout/CheckoutView.vue'),
    children: [
      {
        path: 'info',
        name: 'info',
        component: () => import('../views/checkout/children/CheckoutInfo.vue'),
      },
      {
        path: ':orderId',
        name: 'payment',
        component: () => import('../views/checkout/children/CheckoutPayment.vue'),
      },
    ],
  },
  {
    path: '/success/:orderId',
    name: 'success',
    component: () => import('../views/SuccessView.vue'),
  },
  {
    path: '/favorite',
    name: 'favorite',
    component: () => import('../views/FavoriteView.vue'),
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/admin/AdminView.vue'),
    children: [
      {
        path: 'products',
        name: 'productsManage',
        component: () => import('../views/admin/children/AdminProducts.vue'),
      },
      {
        path: 'orders',
        name: 'ordersManage',
        component: () => import('../views/admin/children/AdminOrders.vue'),
      },
      {
        path: 'coupons',
        name: 'couponsManage',
        component: () => import('../views/admin/children/AdminCoupons.vue'),
      },
      {
        path: 'articles',
        name: 'articlesManage',
        component: () => import('../views/admin/children/AdminArticles.vue'),
      },
    ],
  },
  { path: '/:pathMatch(.*)*', component: HomeView },
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
