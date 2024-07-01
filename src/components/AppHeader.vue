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
                <router-link :to="{ name: 'home' }">
                    <i class="fa fa-home" aria-hidden="true"></i>
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
                        <span class="text"> Rent your apartment </span>
                        <i class="fa-solid fa-house icon"></i>
                        <i class="fa-sm fa-plus icon"></i>
                    </a>
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
            justify-content: end;

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

@media (max-width: 768px) {
    .btn-principal .text {
        display: none;
    }

    .btn-principal .icon {
        display: inline-block;
    }
}

@media (min-width: 769px) and (max-width: 1176px) {
    .btn-principal .text {
        display: none;
    }

    .btn-principal .icon {
        display: inline-block;
    }
}

@media (max-width: 425px) {
    .btn-principal {
        padding: 5px 10px;
        font-size: 14px;
    }


}

@media (min-width: 1177px) {
    .btn-principal .text {
        display: inline-block;
    }

    .btn-principal .icon {
        display: none;
    }
}
</style>
