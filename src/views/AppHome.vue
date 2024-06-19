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
            axios.get(this.base_api + this.url_apartment).then(response => {
                // console.log(response.data.results);
                this.apartments = response.data.results.data
                console.log(this.apartments)
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
    <h1>Ecco i tuoi appartmenti</h1>

    <div v-for="apartment in this.apartments">
        <h2>{{ apartment.title }}</h2>
        <p>{{ apartment.description }}</p>
        <p v-show="apartment.user_id">user_id :{{ apartment.user_id }}</p>
        <img v-show="apartment.image" class="card-img-top" :src="base_api + '/storage/' + apartment.image" alt="Title"
            width="100" />
    </div>
</template>

<style></style>
