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
            beds: 1,
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
        verifyBedsRooms() {
            let rooms = document.getElementById("rooms");
            let beds = document.getElementById("beds");
            console.log(rooms, beds);

            this.removeErrorMessages();

            if (beds.value === "" || rooms.value === "") {
                beds.insertAdjacentHTML("afterend", '<div class="error-message" style="color: red;">Fill this filed please</div>');
                rooms.insertAdjacentHTML("afterend", '<div class="error-message" style="color: red;">Fill this filed please</div>');
            } else if (beds.value <= 0 || rooms.value <= 0) {
                console.log("numero di letti non valido");
                beds.insertAdjacentHTML("afterend", '<div class="error-message" style="color: red;">Invalid number</div>');
                rooms.insertAdjacentHTML("afterend", '<div class="error-message" style="color: red;">Invalid number</div>');
            } else {
                this.filterApartments();
            }

            // if (beds.value === "") {
            //     beds.insertAdjacentHTML("afterend", '<div class="error-message" style="color: red;">Fill this filed please</div>');

            // } else if (rooms.value === "") {
            //     rooms.insertAdjacentHTML("afterend", '<div class="error-message" style="color: red;">Fill this filed please</div>');
            // }
            // else if (beds.value <= 0) {
            //     console.log("numero di letti non valido");
            //     beds.insertAdjacentHTML("afterend", '<div class="error-message" style="color: red;">Invalid number</div>');
            // } else if (rooms.value <= 0) {
            //     rooms.insertAdjacentHTML("afterend", '<div class="error-message" style="color: red;">Invalid number</div>');
            // }
            // else {
            //     this.filterApartments();
            // }  
            // alternative version 
        },
        removeErrorMessages() {
            let errorMessages = document.querySelectorAll('.error-message');
            errorMessages.forEach(function (errorMessage) {
                errorMessage.remove(); // remove the node if exist so we haven't too many messages
            });
        },

        isSelected(serviceId) {
            return this.chosenServices.includes(serviceId);
        }
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

            <!-- research title -->
            <div class="reseach_title d-flex">
                <h2>Search Apartments:</h2>
                <h3>{{ researchedAddress }}</h3>
            </div>


            <!-- Search and filter -->
            <div class="top-bar d-flex">

                <div class="advance_search d-flex">

                    <!-- Range Input -->
                    <div class="range-wrap d-flex">
                        <div class="bubble">
                            <output>{{ range_distance }} </output>
                            <span> km</span>
                        </div>
                        <input type="range" id="rangeDistance" name="rangeDistance" value="20" min="1" max="80"
                            oninput="this.nextElementSibling.value = this.value" v-model="range_distance" class="range"
                            @change="filterApartments">
                    </div>


                    <!-- Room and beds -->

                    <div class="number-filter d-flex">
                        <div class="rooms">
                            <label for="rooms">Rooms</label>
                            <input type="number" id="rooms" name="rooms" v-model.number="rooms" min="1" placeholder="1"
                                @input="verifyBedsRooms">
                        </div>

                        <div class="beds">
                            <label for="beds">Beds</label>
                            <input type="number" id="beds" name="beds" v-model.number="beds" min="1" placeholder="1"
                                @input="verifyBedsRooms">
                        </div>
                    </div>

                    <!-- searchbar -->
                    <div class="search d-flex">

                        <form @submit.prevent="searchApartments()" class="search-form d-flex">

                            <!-- search input -->
                            <input type="search" name="search" id="search" v-model="search_address"
                                @input="getSuggestions" placeholder="Via dei cipressi">

                            <!-- submit btn -->
                            <button type="submit" class="btn search-btn" :disabled="!searchButton()">
                                <i class="fa-solid fa-magnifying-glass"></i>
                            </button>

                        </form>
                    </div>


                </div>

            </div>
            <div class="suggestions" v-if="suggestions.length != 0">
                <ul>
                    <li v-for="suggestion in suggestions" @click="fillSearch(suggestion.address.freeformAddress)">
                        {{ suggestion.address.freeformAddress }}
                    </li>
                </ul>
            </div>

            <!-- Services -->
            <div class="services d-flex" v-if="services.length != 0">

                <label :for="`service-${service.id}`" class="single-service" v-for="service in services"
                    :class="{ 'selected-service': chosenServices.includes(service.id) }">{{
                        service.service_name }}
                    <i :class="state.serviceIcons[service.service_name]"></i>
                    <input type="checkbox" :name="`service-${service.id}`" :id="`service-${service.id}`"
                        :value="service.id" v-model="chosenServices" @change="selectServices">
                </label>

            </div>

            <!-- Results -->
            <div class="row" v-if="results.length != 0">
                <div v-for="result in results" class="col-6">

                    <router-link :to="{ name: 'SingleApartment', params: { slug: result.slug } }"
                        style="text-decoration: none;">

                        <!-- Card results -->
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
                                <p class="card-text">
                                    <strong> Distance:</strong>
                                    {{ result.distance }}
                                    <strong>Km</strong>
                                </p>
                                <p class="card-text" v-if="result.description">
                                    {{ result.description }}
                                </p>

                                <div class="service-list">
                                    <ul class="d-flex">
                                        <li v-for="service in result.services" class="d-flex">
                                            {{ service.service_name }}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </router-link>

                </div>
            </div>

        </div>

    </section>




</template>

<style scoped>
.reseach_title {
    align-items: baseline;
    padding-bottom: 2rem;

    &>h2 {
        padding-right: 1rem;
        color: var(--bnb-main);
    }
}

.advance_search {
    width: 80%;
    padding: 1rem 0 1.5rem;
    justify-content: space-between;
    margin: auto;
    align-items: center;
    padding: 0.1rem;
    border: 2px solid var(--color_grey_shadow);
    border-radius: 60px;

}

.search {
    align-items: center;
    justify-content: space-between;
    flex-grow: 1;

    .search-form {
        padding: 0.5rem;
        border: 1px solid var(--color_grey_shadow);
        border-radius: 0 60px 60px 0;
        align-items: center;
        width: 100%;
        justify-content: space-between;
        border: none;


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

.suggestions {
    display: flex;
    justify-content: end;

    ul {
        list-style: none;
        padding: 0;
        padding: 0 1rem;
        border: 2px solid var(--color_grey_shadow);
        border-radius: 20px;

        &>li {
            font-size: 1rem;
            padding: 0.7rem 0;
            border: 1px solid var(--color_grey_shadow);
            border-left: none;
            border-right: none;
        }

        &>li:first-child {
            border-top: none;
        }

        &>li:last-child {
            border-bottom: none;
        }
    }
}

.beds,
.rooms {
    color: var(--bnb-main);
    padding: 0.6rem 1rem;
    padding-left: -20px;
    border: 2px solid var(--color_grey_shadow);
    border-radius: 0 60px 60px 0;
    border-left: none;
    border-top: none;
    border-bottom: none;
    flex-grow: 1;


    & input {
        width: 4.5rem;
        text-align: center;
        padding: 0.9rem;
        border: 1px solid var(--color_grey_shadow);
        border-radius: 60px;
    }

    & label {
        margin-right: 0.5rem;

    }
}

.range-wrap {
    padding: 0 1rem;
    gap: 0.5rem;
    flex-grow: 1;
    justify-content: center;
    padding: 0.9rem 1rem;
    border: 2px solid var(--color_grey_shadow);
    border-radius: 0 60px 60px 0;
    border-left: none;
    border-top: none;
    border-bottom: none;


    .bubble {
        color: var(--bnb-lighter);
        background-color: var(--bnb-main);
        border-radius: 20px;
        padding: 0.5rem;
    }
}

.services {
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-evenly;
    padding: 1rem;

    .single-service {
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 1.2rem;
        width: 5.8rem;
        height: 5.8rem;
        text-align: center;
        margin: 1rem;
        padding: 1rem;
        justify-content: center;
        border: 1px solid var(--color_grey_shadow);

        & i {
            padding: 0.3rem;
        }

        .checkbox-style i {
            display: none;
        }
    }

    .selected-service {
        background-color: var(--bnb-main);
        color: var(--bnb-lighter);
        box-shadow: 0 0 20px var(--color_grey_shadow);
    }
}

.service-list {
    padding: 0.5rem;

    ul {
        flex-wrap: wrap;

    }

    li {
        align-items: center;
        text-align: center;
        margin: 0.3rem;
        list-style: none;
        padding: 0.7rem;
        border: 1px solid var(--color_grey_shadow);
        border-radius: 1rem;
    }
}

.row {
    display: flex;
    justify-content: space-around;
    padding-bottom: 2rem;

    .col-6 {
        flex: 0 0 calc((100% / 2) - 20px);
    }
}

.card,
img {
    border-radius: 20px;
    width: 100%;
}
</style>
