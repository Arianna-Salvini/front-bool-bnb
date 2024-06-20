<script>

import axios from 'axios';
import { state } from '../state.js';


export default {
    name: 'SingleApartment',
    components: {

    },
    data() {
        return {
            state: state,
            apartment: {},
            base_api: 'http://127.0.0.1:8000/api/',
            url_apartment: 'apartments/'
        }
    },
    methods: {
        callApartment() {
            const apartmentSlug = this.$route.params.slug
            const fullUrl = this.base_api + this.url_apartment + apartmentSlug
            axios.get(fullUrl).then(response => {
                if (response.data.success) {
                    this.apartment = response.data.response;
                    console.log(this.apartment)
                } else {

                }
            })
        }
    },
    mounted() {
        this.callApartment()
    }
};
</script>

<template>
    <div class="container">
        <h1>{{ apartment.title }}</h1>
    </div>
</template>

<style></style>
