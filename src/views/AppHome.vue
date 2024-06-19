<script>

import axios from 'axios';


export default {
    components: {

    },
    data() {
        return {
            apartments: [],
            base_api: 'http://127.0.0.1:8000',
            url_apartment: '/api/apartments'
        };
    },
    methods: {
        callApi() {
            axios.get().then(response => {
                console.log(response);
            }).catch(error => {
                console.error('Error fetching projects:', error);
            });
        },
    },
    mounted() {
        this.callApi();
    }
};
</script>

<template>
    <h1>Ecco la tua home</h1>
</template>

<style scoped></style>
