import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CreateMatch from '../views/CreateMatch.vue';
import EditProfile from '../views/EditProfile.vue';
import Requests from '../views/Requests.vue';
import NotFound from '../views/NotFound.vue';



const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/editprofile',
    name: 'edit',
    component: EditProfile,
  },

  {
    path: '/request/:postId',
    name: 'request',
    component: Requests,
  },

  {
    path: '/creatematch',
    name: 'match',
    component: CreateMatch,
  },
  {
    path: '/:pathMatch(.*)*',  // Wildcard route for handling 404
    name: 'not-found',
    component: NotFound,
  }
  
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  // If the target route is not the home route
  if (to.name !== 'home') {
    const isAuthenticated = await HomeView.methods.checkLoggedIn.call(router.currentRoute.instance);
    console.log('isAuthenticated :---------------------------:', isAuthenticated);

    if (isAuthenticated) {
      // User is authenticated, allow navigation
      next();
    } else {
      // User is not authenticated, redirect to home or login route
      next('/');
    }
  } else {
    // If the route is the home route, allow navigation
    next();
  }
});

export default router;
