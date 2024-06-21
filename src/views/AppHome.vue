<script>

import axios from 'axios';
import { state } from '../state.js';
import AppJumbo from '../components/AppJumbo.vue'


export default {
    name: 'AppHome',
    components: {
        AppJumbo
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
            isSearching: false,

            currentPage: 1,
            lastPage: null

            //addressValue: search_address.replace(' ', '%20'),
            //tomtom_url: `https://api.tomtom.com/search/2/search/${addressValue}.json?view=Unified&relatedPois=off&key=${api_key}`,
        }
    },
    methods: {
        getApartments(url) {
            axios
                .get(url)
                .then(response => {
                    // console.log(response.data.results);
                    this.apartments = response.data.results.data
                    console.log(this.apartments);
                    console.log(response.data.results);
                    this.currentPage = response.data.results.current_page;
                    this.lastPage = response.data.results.last_page;
                })
                .catch(error => {
                    console.error('Error fetching projects:', error);
                });
        },

        showNext() {
            if (this.currentPage < this.lastPage) {
                let nextPage = this.currentPage + 1;
                let url = `${state.base_api}${state.apartment_url}?page=${nextPage}`;
                this.getApartments(url);
            }
        },

        showPrev() {
            if (this.currentPage > 1) {
                let prevPage = this.currentPage - 1;
                let url = `${state.base_api}${state.apartment_url}?page=${prevPage}`
                this.getApartments(url);

            }
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
                        state.updateResults(response.data.response.data);
                        this.$router.push({ name: 'research'/* , query: { results: JSON.stringify(this.results) } */ });
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
        let url = state.base_api + state.apartment_url;
        this.getApartments(url);
        console.log(this.search_address);
    }
};
</script>

<template>
    <section id="homepage">

        <AppJumbo />

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
            <div class="suggestions" v-if="suggestions.length != 0">
                <ul>
                    <li v-for="suggestion in suggestions" @click="fillSearch(suggestion.address.freeformAddress)">
                        {{ suggestion.address.freeformAddress }}
                    </li>
                </ul>
            </div>

            <div class="row g-4">
                <div v-for="apartment in this.apartments" class="col-6">

                    <router-link :to="{ name: 'SingleApartment', params: { slug: apartment.slug } }"
                        style="text-decoration: none;">
                        <div class="card">
                            <img v-if="apartment.image"
                                :src="apartment.image.startsWith('http') ? apartment.image : state.base_api + '/storage/' + apartment.image"
                                alt="Apartment Image" class="card-img-top w-100" style="height: 350px;">
                            <img v-else
                                src="https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png"
                                alt="not-available" style="height: 350px;">
                            <div class="card-body">
                                <h3>{{ apartment.title }}</h3>
                                <p class="card-text">
                                    <i class="fa-solid fa-location-dot"></i>
                                    {{ apartment.address }}
                                </p>
                                <p class="card-text" v-if="apartment.description">
                                    {{ apartment.description }}
                                </p>

                            </div>
                        </div>
                    </router-link>

                </div>
            </div>
            <div class="navigation">
                <button type="button" class="prev" v-if="currentPage > 1" @click="showPrev">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <button type="button" class="next" v-if="currentPage < lastPage" @click="showNext">
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>



        </div>


    </section>

</template>

<style scoped>
#homepage {
    padding-bottom: 5rem;

    h2 {
        font-size: 2.5rem;
        font-weight: bold;
    }

    .top-bar {
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        margin-top: 6rem;

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

    .suggestions {
        display: flex;
        justify-content: end;

        ul {
            list-style: none;
            padding: 0;
            padding: 1rem;
            border: 1px solid var(--color_grey_shadow);
            border-radius: 20px;
        }
    }

    .card,
    img {
        border-radius: 20px;
    }

    .card {
        box-shadow: 0 0 12px 1px var(--color_grey_shadow);
        height: 100%;
    }

    .navigation {
        display: flex;
        justify-content: end;
        padding: 1.5rem 0;

        .next,
        .prev {
            border-radius: 50%;
            border: 1px solid var(--color_dark);
            aspect-ratio: 1/1;
            width: 3rem;
            padding: 0.5rem;
            color: var(--bnb-lighter);
            background-color: var(--bnb-main);
            border: none;

        }

        .prev {
            margin-right: 1rem;
        }
    }

}
</style>
