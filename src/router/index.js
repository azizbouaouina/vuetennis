// import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
// import CreateMatch from '../views/CreateMatch.vue'

// const routes = [
//   {
//     path: '/',
//     name: 'home',
//     component: HomeView
//   },
//   {
//     path: '/creatematch',
//     name: 'match',
//     component: CreateMatch,

//   },
  
// ]


// const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
//   routes
// })

// export default router


import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CreateMatch from '../views/CreateMatch.vue';
import EditProfile from '../views/EditProfile.vue';



const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/editprofile',
    name: 'edit',
    component: EditProfile
  },

  {
    path: '/creatematch',
    name: 'match',
    component: CreateMatch,
    meta: { requiresAuth: true } // Add this meta field to specify authentication requirement
  },
  
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(async(to, from, next) => {
  // Check if the route requires authentication
  if (to.matched.some(route => route.meta.requiresAuth)) {
    // Check if the user is authenticated (local storage item is set to 'true')
    // if (localStorage.getItem('loggedIn') === 'true') {
          // if (HomeView.methods.checkLoggedIn.call(router.currentRoute.instance)) {

      const isAuthenticated = await HomeView.methods.checkLoggedIn.call(router.currentRoute.instance);
      console.log('isAuthenticated :---------------------------:',isAuthenticated)

  if (isAuthenticated) {
    

      // User is authenticated, allow navigation
      next();
    } else {
      // User is not authenticated, redirect to login or another route
      next('/'); // Replace '/login' with the route you want to redirect to
    }
  } else {
    // If the route does not require authentication, allow navigation
    next();
  }
});

export default router;
