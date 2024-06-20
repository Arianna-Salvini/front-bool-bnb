<script>
import axios from 'axios';

export default {
    components: {

    },
    name: 'AppHeader',
    data() {
        return {
            base_api: 'http://127.0.0.1:8000'
        }
    },
    methods: {
    },

}
</script>

<template>
    <header>
        <div class="container d-flex">
            <div class="logo"><img src="../../public/img/Group_2.png" alt="" width="75"></div>
            <div class="links d-flex">
                <router-link :to="{ name: 'home' }">Home</router-link>
                <router-link :to="{ name: 'about' }">About</router-link>
                <router-link :to="{ name: 'contacts' }">Contacts</router-link>
            </div>
            <div class="social d-flex">
                <!-- <a :href="`${base_api} /login`">Login</a>
                <a :href="`${base_api} /register`">Register</a> -->
                <!-- proobabili problematiche di sicurezza nell'accesso da siti esterni, verifica -->
                <a href="http://127.0.0.1:8000/login">LogIn</a>
                <a href="http://127.0.0.1:8000/login">Register</a>
            </div>
        </div>
    </header>


</template>

<style>
header {
    background-color: antiquewhite;

    .container {
        max-width: 1200px;
        margin: auto;
        justify-content: space-between;
        align-items: center;

        .links {
            gap: 0.4rem;

            & a {
                color: black;
                text-decoration: none;
                padding: 0.3rem 0;
                transition: color 200ms;
            }

            .router-link-active,
            .router-link-exact-active {
                color: rgb(151, 151, 151);
            }

            & a:hover {
                color: rgb(151, 151, 151);
            }
        }

        .social {
            gap: 0.4rem;
        }
    }
}

.d-flex {
    display: flex;
}
</style>
