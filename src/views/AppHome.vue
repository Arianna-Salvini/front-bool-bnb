<script>

import axios from 'axios';
import { state } from '../state.js';


export default {
    name: 'AppHome',
    components: {

    },
    data() {
        return {
            apartments: [],
            state: state,

            search_value: '',
        };
    },
    methods: {
        callApi() {
            axios
                .get(state.base_api + state.apartment_url)
                .then(response => {
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
    <input type="search" name="search" id="search" v-model="search_value">
    <h1>Ecco i tuoi appartmenti</h1>

    <div v-for="apartment in this.apartments">
        <h2>{{ apartment.title }}</h2>
        <p>{{ apartment.description }}</p>
        <p v-show="apartment.user_id">user_id :{{ apartment.user_id }}</p>
        <p v-if="apartment.user"> {{ apartment.user.name }}</p>
        <img v-show="apartment.image" class="card-img-top" :src="state.base_api + '/storage/' + apartment.image"
            alt="Title" width="100" />
    </div>
</template>

<style></style>
