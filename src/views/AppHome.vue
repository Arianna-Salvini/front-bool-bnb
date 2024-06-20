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

            api_key: 'TubXmNyzFnYoGMpgu1RAnYEHnVO24pfI',
            search_address: '',
            suggestions: [],
            search_url: '/api/apartments/search',
            results: [],
            range_distance: 20,

            //addressValue: search_address.replace(' ', '%20'),
            //tomtom_url: `https://api.tomtom.com/search/2/search/${addressValue}.json?view=Unified&relatedPois=off&key=${api_key}`,
        }
    },
    methods: {
        getApartments() {
            axios
                .get(state.base_api + state.apartment_url)
                .then(response => {
                    // console.log(response.data.results);
                    this.apartments = response.data.results.data
                    console.log(this.apartments)
                })
                .catch(error => {
                    console.error('Error fetching projects:', error);
                });
        },

        /* get address real time suggestions on input */
        getSuggestions() {
            /* if search field isn't empty */
            if (this.search_address.trim() != '') {
                let addressValue = this.search_address.replace(' ', '%20');
                let tomtom_url = `https://api.tomtom.com/search/2/search/${addressValue}.json?view=Unified&relatedPois=off&key=${this.api_key}`;

                /* call tomtom url */
                axios
                    .get(tomtom_url)
                    .then(response => {
                        //console.log(response);
                        /* get first 5 results */
                        this.suggestions = response.data.results.slice(0, 5);
                        //console.log(this.suggestions);
                    })
                    .catch(err => console.log(err))
            }
            else {
                this.suggestions = [];
            }
        },

        fillSearch(address) {
            /* when I click on a suggestion, my research input gets filled */
            this.search_address = address;
            /* remove suggestions */
            this.suggestions = [];
        },

        searchApartments() {
            this.suggestions = [];
            let url = state.base_api + this.search_url;
            axios
                .get(url, { params: { address: this.search_address, range_distance: this.rangeDistance } })
                .then(response => {
                    console.log(response.data.response.data);
                    this.results = response.data.response.data;
                    console.log($results);
                })
                .catch(err => console.log(err));
        },


        searchButton() {
            return /^[a-zA-Z0-9][a-zA-Z0-9,\/]*$/.test(this.search_address.trim());
        },


    },
    mounted() {
        this.getApartments();
        console.log(this.search_address);
    }
};
</script>

<template>
    <form @submit.prevent="searchApartments()">
        <input type="search" name="search" id="search" v-model="search_address" @input="getSuggestions">


        <!-- Add dinamic range input for range distance for result  -->
        <div class="range">
            <label for="rangeDistance">Dinstance range </label>
            <div>
                <input type="range" id="rangeDistance" name="rangeDistance" value="20" min="1" max="80"
                    oninput="this.nextElementSibling.value = this.value" v-model="range_distance">
                <output>{{ range_distance }}</output>
            </div>
        </div>
        <button type="submit" :disabled="!searchButton()">Cerca</button>

        <!--     <button type="submit">Search</button> -->

    </form>
    <ul v-if="suggestions.length != 0">
        <li v-for="suggestion in suggestions" @click="fillSearch(suggestion.address.freeformAddress)">{{
        suggestion.address.freeformAddress }}</li>
    </ul>

    <ul v-if="results.length != 0">
        <li v-for="result in results">{{ result.title }}</li>
    </ul>
    <p v-else>No results</p>

    <h1>Ecco i tuoi appartmenti</h1>

    <div v-for="apartment in this.apartments">
        <h2>{{ apartment.title }}</h2>
        <p>{{ apartment.description }}</p>
        <p v-show="apartment.user_id">user_id :{{ apartment.user_id }}</p>
        <p v-if="apartment.user"> {{ apartment.user.name }}</p>
        <img v-show="apartment.image" class="card-img-top" :src="state.base_api + '/storage/' + apartment.image"
            alt="Title" width="100" />
        <p>{{ apartment.address }}</p>
    </div>
</template>

<style></style>
