import { createWebHistory, createRouter } from 'vue-router';

import AppHome from './views/AppHome.vue';
import AppContacts from './views/AppContacts.vue';
import AppAbout from './views/AppAbout.vue';
import SingleApartment from './views/SingleApartment.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: AppHome
        },
        {
            path: '/about',
            name: 'about',
            component: AppAbout
        },
        {
            path: '/contacts',
            name: 'contacts',
            component: AppContacts
        },
        {
            path: '/apartment/:slug',
            name: 'SingleApartmanet',
            component: SingleApartment
        },

    ]
})

export default router;
