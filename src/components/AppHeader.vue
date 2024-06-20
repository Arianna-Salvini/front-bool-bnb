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
        <div class="container d-flex align-items-center">
            <div class="logo"><img src="../../public/img/logo.png" alt="" width="70"></div>
            
            
                <div class="navigation">
                    <div class="links d-flex">
                    
                    <router-link :to="{ name: 'home' }">Home</router-link>
                    <router-link :to="{ name: 'about' }">About</router-link>
                    <router-link :to="{ name: 'contacts' }">Contacts</router-link>
                    </div>

                    <!-- <a :href="`${base_api} /login`">Login</a>
                    <a :href="`${base_api} /register`">Register</a> -->
                    <!-- proobabili problematiche di sicurezza nell'accesso da siti esterni, verifica -->
                    <!-- <a href="http://127.0.0.1:8000/login">LogIn</a>
                    <a href="http://127.0.0.1:8000/register">Register</a> -->
                    <div class="social d-flex">
                    <a class="btn btn-principal btn-sm rounded-5 px-3" href="http://127.0.0.1:8000/login" role="button"> Rent your apartment </a>
                    </div>
                </div>
        </div>
    </header>


</template>

<style>
header {
    background-color: rgb(255, 255, 255);;
    .container {
        max-width: 1200px;
        margin: auto;
        justify-content: space-between;
        align-items: center;
        .logo {
            padding: 20px;
        }
        .navigation {
            display: flex;
            gap: 3rem;
        }
        .links {
            gap: 2.1rem;
            align-items: center;

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


/* move this to style.css */

.btn-principal {
    background-color: #45C2B1;
    border-color: #45C2B1;
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    transition: background-color 0.3s ease, color 0.3s ease;
}
.btn-principal:hover {
    background-color: #3aa79e;
    border-color: #3aa79e;
    color: white;
}

</style>
