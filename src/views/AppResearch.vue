<script>

import axios from 'axios';
import { state } from '../state.js';


export default {
    name: 'AppResearch',
    components: {

    },
    props: {
        /* results: {
            type: Array,
            default: () => []
        } */
    },
    data() {
        return {
            state: state,
            results: state.searchResults,

            services: [],
            chosenServices: [],
            researchedAddress: '',
            researchedRange: '',

            search_address: '',
            suggestions: [],
            search_url: '/api/apartments/search',
            range_distance: 20,
            api_key: 'TubXmNyzFnYoGMpgu1RAnYEHnVO24pfI',

            rooms: 1,
            beds: 1
        }
    },
    methods: {
        getServices(url) {
            axios
                .get(url)
                .then(response => {
                    console.log(response);
                    this.services = response.data.results;

                    if (this.$route.query.services) {
                        if (Array.isArray(this.$route.query.services)) {
                            this.chosenServices = [...this.$route.query.services];
                        }
                        else {
                            this.chosenServices = this.$route.query.services.split(',');
                        }
                    }

                    console.log(this.chosenServices);
                })
                .catch(err => console.log(err));
        },

        /* when refreshing page, do another api call using passed params to get back results */
        fetchResults(address, range) {
            let url = state.base_api + '/api/apartments/search';
            axios
                .get(url, { params: { address: address, range: range, services: this.chosenServices } })
                .then(response => {
                    console.log(response);
                    this.results = response.data.response.data;
                    state.updateResults(response.data.response.data);
                    this.updateQueryString();
                })
        },

        filterApartments() {
            console.log(this.chosenServices);
            let filter_url = state.base_api + '/api/apartments/search';
            this.researchedRange = this.range_distance;
            //console.log(this.range_distance);
            axios
                .get(filter_url, {
                    params: {
                        address: this.researchedAddress,
                        range_distance: this.researchedRange,
                        services: this.chosenServices,
                        rooms: this.rooms,
                        beds: this.beds
                    }
                })
                .then(response => {
                    console.log(this.chosenServices);
                    console.log(response);
                    this.results = response.data.response.data;
                    state.updateResults(response.data.response.data);
                    this.updateQueryString();

                })
                .catch(err => console.log(err));
        },

        selectServices() {
            console.log(this.chosenServices);
            if (this.chosenServices.length > 0 || this.bedrooms || this.beds) {
                this.filterApartments();
            }
            else {
                this.fetchResults(this.researchedAddress, this.researchedRange);
            }
        },

        updateQueryString() {
            console.log(this.chosenServices);
            let query = { address: this.researchedAddress, range: this.researchedRange, rooms: this.rooms, beds: this.beds }
            /* if there are services selected, push services id in query string separated by ,*/
            if (Array.isArray(this.chosenServices) && this.chosenServices.length > 0) {
                query.services = this.chosenServices.join(',');
            }
            /* if no services are selected, remove services from query */
            else {
                delete query.services;
            }
            console.log(query);
            this.$router.replace({ path: 'research', query: query })
        },

        searchApartments() {
            this.suggestions = [];
            let url = state.base_api + this.search_url;
            axios
                .get(url, { params: { address: this.search_address, range_distance: this.range_distance, services: this.chosenServices } })
                .then(response => {
                    console.log(response);
                    if (response.data.success) {
                        console.log(response);
                        console.log(response.data.response.data);
                        this.results = response.data.response.data;
                        this.researchedAddress = this.search_address;
                        this.researchedRange = this.range_distance;

                        state.updateResults(response.data.response.data);
                        this.updateQueryString();
                        //this.$router.push({ name: 'research', query: { address: this.search_address, range: this.range_distance, services: this.chosenServices.join(',') } });
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
            return /^[a-zA-Z0-9]+['a-zA-Z0-9 ,\/]*$/.test(this.search_address.trim());
        },
        getSuggestions() {
            /* if search field isn't empty */
            if (this.search_address.trim() != '') {
                let addressValue = this.search_address.replace(' ', '%20');
                let tomtom_url = `https://api.tomtom.com/search/2/search/${addressValue}.json?countrySet=IT&view=Unified&relatedPois=off&key=${this.api_key}`;

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

    },
    created() {
        this.researchedAddress = this.$route.query.address;
        this.researchedRange = this.$route.query.range;

        /* when I refresh the page, I must do typecheck on services in query string */
        this.chosenServices = [];
        if (this.$route.query.services) {
            if (typeof this.$route.query.services === 'string') {
                this.chosenServices = this.$route.query.services.split(',');
            }
            else if (Array.isArray(this.$route.query.services)) {
                this.chosenServices = [...this.$route.query.services];
            }
        }
        this.updateQueryString();
    },

    mounted() {
        console.log(state.searchResults);
        let services_url = state.base_api + '/api/services';
        this.getServices(services_url);

        /* take results back */
        this.fetchResults(this.researchedAddress, this.researchedRange);
        //console.log(this.$route.query.results);
        //initialize results as empty array and reassign results -> results are in json -> must convert back to object

    }
};
</script>

<template>

    <section id="search-results">
        <div class="container">

            <div class="top-bar d-flex">

                <!-- title -->
                <h2>All Apartments</h2>

                <!-- search -->
                <div class="search d-flex">

                    <form @submit.prevent="searchApartments()" class="search-form d-flex">

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

            <!-- range input -->
            <div class="range-wrap d-flex">

                <input type="range" id="rangeDistance" name="rangeDistance" value="20" min="1" max="80"
                    oninput="this.nextElementSibling.value = this.value" v-model="range_distance" class="range"
                    @change="filterApartments">
                <div class="bubble">
                    <output>{{ range_distance }} </output>
                    <span> km</span>
                </div>

            </div>


            <div class="services" v-if="services.length != 0">
                <div class="single-service" v-for="service in services">
                    <input type="checkbox" :name="`service-${service.id}`" :id="`service-${service.id}`"
                        :value="service.id" v-model="chosenServices" @change="selectServices">
                    <label :for="`service-${service.id}`">{{ service.service_name }}</label>
                    <i :class="state.serviceIcons[service.service_name]"></i>
                </div>
            </div>

            <div class="number-filter">
                <label for="rooms">rooms</label>
                <input type="number" id="rooms" name="rooms" v-model.number="rooms" min="1" placeholder="1"
                    @input="filterApartments">

                <label for="beds">beds</label>
                <input type="number" id="beds" name="beds" v-model.number="beds" min="1" placeholder="1"
                    @input="filterApartments">
            </div>

            <div>I tuoi risultati per {{ researchedAddress }}</div>
            <div class="row g-4" v-if="results.length != 0">
                <div v-for="result in results" class="col-6">

                    <router-link :to="{ name: 'SingleApartment', params: { slug: result.slug } }"
                        style="text-decoration: none;">
                        <div class="card">
                            <img v-if="result.image"
                                :src="result.image.startsWith('http') ? result.image : state.base_api + '/storage/' + result.image"
                                alt="result Image" class="card-img-top w-100" style="height: 350px;">
                            <img v-else
                                src="https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png"
                                alt="not-available" style="height: 350px;">
                            <div class="card-body">
                                <h3>{{ result.title }}</h3>
                                <p class="card-text">
                                    <i class="fa-solid fa-location-dot"></i>
                                    {{ result.address }}
                                </p>
                                <p class="card-text" v-if="result.description">
                                    {{ result.description }}
                                </p>

                            </div>
                        </div>
                    </router-link>

                </div>
            </div>

            <p v-else>No apartments found within the given range.</p>

        </div>

    </section>




</template>

<style scoped>
.search {
    gap: 0.5rem;
    align-items: center;

    .search-form {
        padding: 0.5rem;
        border: 1px solid var(--color_grey_shadow);
        border-radius: 60px;
        gap: 1rem;
        align-items: center;



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

#search-results {
    padding: 2rem 0;
}

.card,
img {
    border-radius: 20px;
    width: 100%;
}

.card {
    box-shadow: 0 0 12px 1px var(--color_grey_shadow);
    height: 100%;

    .card-body {
        padding: 1rem;
        color: black;
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
    }
}
</style>
