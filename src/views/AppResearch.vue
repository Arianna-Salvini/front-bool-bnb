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
            researchedRange: ''
        }
    },
    methods: {
        getServices(url) {
            axios
                .get(url)
                .then(response => {
                    console.log(response);
                    this.services = response.data.results;
                })
                .catch(err => console.log(err));
        },

        /* when refreshing page, do another api call using passed params to get back results */
        fetchResults(address, range) {
            let url = state.base_api + '/api/apartments/search';
            axios
                .get(url, { params: { address: address, range: range } })
                .then(response => {
                    console.log(response);
                    this.results = response.data.response.data;
                    state.updateResults(response.data.response.data);
                })
        },

        filterApartments() {
            console.log(this.chosenServices);
            let filter_url = state.base_api + '/api/apartments/search'
            axios
                .get(filter_url, { params: { address: this.researchedAddress, range_distance: this.researchedRange, services: this.chosenServices } })
                .then(response => {
                    console.log(response);
                    this.results = response.data.response.data;
                    state.updateResults(response.data.response.data);
                })
                .catch(err => console.log(err));
        },

        selectServices() {
            if (this.chosenServices.length > 0) {
                this.filterApartments();
            }
            else {
                this.fetchResults();
            }
        },

    },
    created() {
        this.researchedAddress = this.$route.query.address;
        this.researchedRange = this.$route.query.range;
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

            <form v-if="services.length != 0">
                <div class="services">
                    <div class="single-service" v-for="service in services">
                        <input type="checkbox" :name="`service-${service.id}`" :id="`service-${service.id}`"
                            :value="service.id" v-model="chosenServices" @change="selectServices">
                        <label :for="`service-${service.id}`">{{ service.service_name }}</label>
                    </div>
                </div>

                <button type="submit">Cerca</button>
            </form>

            <!-- <ul class="services" v-if="services.length != 0">
                <li v-for="service in services">{{ service.service_name }}</li>
            </ul> -->

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
