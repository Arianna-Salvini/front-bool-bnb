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
            range_distance: 20, //defaulf value
            isError: false,
            isSearching: false

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
                .get(url, { params: { address: this.search_address, range_distance: this.range_distance } }) //Add range_distance in params for back-end call
                .then(response => {
                    console.log(response);
                    if (response.data.success) {
                        console.log(response.data.response.data);
                        this.results = response.data.response.data;

                        //must use query object
                        //query objects are strings -> must convert them to json
                        this.$router.push({ name: 'research', query: { results: JSON.stringify(this.results) } });
                        //console.log(this.$router);
                    }
                    else {
                        this.results = [];
                    }
                })
                .catch(err => {
                    console.log(err);
                    console.log('non puoi fare la ricerca così');
                    this.isError = true;
                });
            this.isSearching = true;
        },


        searchButton() {
            return /^[a-zA-Z0-9]+[a-zA-Z0-9 ,\/]*$/.test(this.search_address.trim());
        },


    },
    mounted() {
        this.getApartments();
        console.log(this.search_address);
    }
};
</script>

<template>
    <section id="homepage">

        <div class="container">

            <!-- title + searchbar -->
            <div class="top-bar d-flex">

                <!-- title -->
                <h2>All Apartments</h2>

                <!-- search -->
                <div class="search d-flex">

                    <form @submit.prevent="searchApartments()" class="search-form d-flex">

                        <!-- range input -->
                        <div class="range-wrap d-flex">

                            <input type="range" id="rangeDistance" name="rangeDistance" value="20" min="1" max="80"
                                oninput="this.nextElementSibling.value = this.value" v-model="range_distance"
                                class="range">
                            <div class="bubble">
                                <output>{{ range_distance }} </output>
                                <span> km</span>
                            </div>

                        </div>

                        <!-- search input -->
                        <input type="search" name="search" id="search" v-model="search_address" @input="getSuggestions"
                            placeholder="Via dei cipressi">

                        <!-- submit btn -->
                        <button type="submit" class="btn search-btn" :disabled="!searchButton()">
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </button>

                    </form>
                </div>

            </div>

            <ul v-if="suggestions.length != 0" class="suggestion-list">
                <li v-for="suggestion in suggestions" @click="fillSearch(suggestion.address.freeformAddress)">
                    {{ suggestion.address.freeformAddress }}
                </li>
            </ul>




        </div>

        <div v-for="apartment in this.apartments">
            <router-link :to="{ name: 'SingleApartment', params: { slug: apartment.slug } }">
                <h2>{{ apartment.title }}</h2>
                <p>{{ apartment.description }}</p>
                <p v-show="apartment.user_id">user_id :{{ apartment.user_id }}</p>
                <p v-if="apartment.user"> {{ apartment.user.name }}</p>
                <img v-show="apartment.image" class="card-img-top" :src="state.base_api + '/storage/' + apartment.image"
                    alt="Title" width="100" />
                <p>{{ apartment.address }}</p>
            </router-link>
        </div>

    </section>

</template>

<style scoped>
.top-bar {
    justify-content: space-between;
    align-items: center;

    .search {
        gap: 0.5rem;
        align-items: center;

        .search-form {
            padding: 0.5rem;
            border: 1px solid var(--color_grey_shadow);
            border-radius: 60px;
            gap: 1rem;
            align-items: center;

            .range-wrap {
                padding: 0 1rem;
                border-right: 1px solid var(--color_grey_shadow);
                gap: 0.5rem;

                .bubble {
                    color: var(--bnb-lighter);
                    background-color: var(--bnb-main);
                    border-radius: 20px;
                    padding: 0.5rem;
                }
            }

            #search {
                padding: 0 1rem;
                outline: none;
                border: none;
            }
        }

        .search-btn {
            border-radius: 50%;
            border: 1px solid var(--color_dark);
            aspect-ratio: 1/1;
            width: 3rem;
            padding: 0.5rem;
            color: var(--bnb-lighter);
            background-color: var(--bnb-main);
            border: none;
        }
    }
}
</style>
