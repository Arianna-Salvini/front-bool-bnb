<script>
import axios from 'axios';

export default {
    components: {

    },
    name: 'AppFooter',
    data() {
        return {

        }
    },
    methods: {
    },

}
</script>

<template>
    <footer>
        <div class="container footer-grid">
            <div class="left">
                <div class="footer-logo">
                    <img src="/img/logo.png" alt="Logo" width="70">
                </div>
                <div class="footer-links">
                    <router-link :to="{ name: 'home' }">Home</router-link>
                    <router-link :to="{ name: 'about' }">About</router-link>
                    <router-link :to="{ name: 'contacts' }">Contacts</router-link>
                </div>
            </div>
            <div class="right footer-button">
                <a class="btn btn-principal btn-sm rounded-5 px-3" href="http://127.0.0.1:8000/login" role="button">Rent
                    your apartment</a>
            </div>
            <div class="footer-copyright">
                <p>&copy; 2024 Boolbnb. All rights reserved.</p>
            </div>
        </div>
    </footer>
</template>

<style scoped>
footer {
    background-color: #333;
    color: white;
    text-align: center;
    padding: 20px 0;
    margin-top: auto;
}

footer .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;

    gap: 20px;
}

.footer-grid {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.footer-logo img {
    max-width: 100%;
}

.footer-links {
    display: flex;
    gap: 10px;
}

.footer-links a {
    color: #ddd;
    text-decoration: none;
    transition: color 0.3s ease;

}

.footer-button {
    a {
        text-decoration: none !important;
    }
}

.footer-links a:hover {
    color: #bbb;
    text-decoration: none;
}

.footer-button .btn-principal {
    background-color: #45C2B1;
    border-color: #45C2B1;
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    transition: background-color 0.3s ease, color 0.3s ease;
    border-radius: 1.2rem;
}

.footer-button .btn-principal:hover {
    background-color: #3aa79e;
    border-color: #3aa79e;
}

.footer-copyright {
    margin-top: 10px;
    font-size: 14px;
}

.d-flex {
    display: flex;
}

.align-items-center {
    align-items: center;
}

.rounded-5 {
    border-radius: 5px;
}
</style>
