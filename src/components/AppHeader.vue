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
            <div class="logo_space">
                <img src="/img/logo.png" alt="Logo BoolBnB" class="logo">
            </div>

            <div class="links d-flex">
                <i class="fa fa-home" aria-hidden="true"></i>
                <router-link :to="{ name: 'home' }">
                    Home
                </router-link>

            </div>

            <div class="navigation">


                <!-- <a :href="`${base_api} /login`">Login</a>
                    <a :href="`${base_api} /register`">Register</a> -->
                <!-- proobabili problematiche di sicurezza nell'accesso da siti esterni, verifica -->
                <!-- <a href="http://127.0.0.1:8000/login">LogIn</a>
                    <a href="http://127.0.0.1:8000/register">Register</a> -->
                <div class="social d-flex">
                    <a class="btn btn-principal btn-sm rounded-5 px-3" href="http://127.0.0.1:8000/login" role="button">
                        Rent your apartment </a>
                </div>
            </div>
        </div>
    </header>


</template>

<style scoped>
header {
    background-color: rgb(255, 255, 255);
    box-shadow: 0 0 10px var(--color_grey_shadow);
    margin-bottom: 2rem;

    .container {
        max-width: 1400px;
        margin: auto;
        justify-content: space-between;
        align-items: center;

        .logo_space {
            width: 20%;

            .logo {
                width: 3.5rem;
                padding-top: 0.5rem;
            }
        }


        .navigation {
            display: flex;
            width: 20%;

        }

        .links {
            align-items: center;


            & a {
                color: black;
                text-decoration: none;
                transition: color 200ms;
                padding: 2rem 0;
                font-size: 1.1rem;

            }

            .fa-home {
                padding-right: 0.5rem;
            }

            &:hover a,
            &:hover .fa-home {
                color: rgb(151, 151, 151);
            }

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
    border-radius: 1.2rem;
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    transition: background-color 0.3s ease, color 0.3s ease;
    text-decoration: none;
}

.btn-principal:hover {
    background-color: #3aa79e;
    border-color: #3aa79e;
    color: white;
}
</style>
