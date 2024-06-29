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
            tot_results: 0,
            currentPage: 1,
            totalPages: 0,
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
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.fetchResults(this.researchedAddress, this.researchedRange);
            }
        },

        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.fetchResults(this.researchedAddress, this.researchedRange);
            }
        },

        getPage(pageNumber) {
            this.currentPage = pageNumber;
            this.fetchResults(this.researchedAddress, this.researchedRange);
        },
        /* when refreshing page, do another api call using passed params to get back results */
        fetchResults(address, range) {
            let url = state.base_api + '/api/apartments/search';
            axios
                .get(url, { params: { address: address, range: range, services: this.chosenServices, page: this.currentPage } })
                .then(response => {
                    console.log(response);
                    this.results = response.data.response.data;
                    this.tot_results = response.data.response.total;
                    this.perPage = response.data.response.per_page;
                    this.totalPages = Math.ceil(this.tot_results / this.perPage);
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
                    this.tot_results = response.data.response.total;
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
            let query = { address: this.researchedAddress, range: this.researchedRange, rooms: this.rooms, beds: this.beds, page: this.currentPage }
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
                        this.tot_results = response.data.response.total;
                        console.log(this.tot_results);
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
            console.log(serviceId, this.chosenServices);
            return this.chosenServices.includes(serviceId.toString());
        },

        toggleService(serviceId) {
            if (this.chosenServices.includes(serviceId)) {
                return this.chosenServices.includes(serviceId);
            }
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
        console.log(this.chosenServices);
        this.fetchResults(this.researchedAddress, this.researchedRange);

    },

    mounted() {
        console.log(state.searchResults);
        let services_url = state.base_api + '/api/services';
        this.getServices(services_url);

        /* take results back */
        this.fetchResults(this.researchedAddress, this.researchedRange);
        //console.log(this.$route.query.results);
    },
};
</script>

<template>

    <section id="search-results">
        <div class="container">

            <!-- Search and filter -->
            <div class="top-bar d-flex">

                <div class="advance_search d-flex">

                    <div class="d-flex search-filters-container">
                        <!-- Range Input -->
                        <div class="range-wrap d-flex">
                            <div class="bubble">
                                <output>{{ range_distance }} </output>
                                <span> km</span>
                            </div>
                            <input type="range" id="rangeDistance" name="rangeDistance" value="20" min="1" max="80"
                                oninput="this.nextElementSibling.value = this.value" v-model="range_distance"
                                class="range" @change="filterApartments">
                        </div>


                        <!-- Room and beds -->

                        <div class="number-filter d-flex">
                            <div class="rooms">
                                <label for="rooms">Rooms</label>
                                <input type="number" id="rooms" name="rooms" v-model.number="rooms" min="1"
                                    placeholder="1" @input="verifyBedsRooms">
                            </div>

                            <div class="beds">
                                <label for="beds">Beds</label>
                                <input type="number" id="beds" name="beds" v-model.number="beds" min="1" placeholder="1"
                                    @input="verifyBedsRooms">
                            </div>
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

                    <!-- suggestions -->
                    <div class="suggestions" v-if="suggestions.length != 0">
                        <ul>
                            <li v-for="suggestion in suggestions"
                                @click="fillSearch(suggestion.address.freeformAddress)">
                                {{ suggestion.address.freeformAddress }}
                            </li>
                        </ul>
                    </div>


                </div>

            </div>

            <!-- suggestions -->
            <div class="suggestions" v-if="suggestions.length != 0">
                <ul>
                    <li v-for="suggestion in suggestions" @click="fillSearch(suggestion.address.freeformAddress)">
                        {{ suggestion.address.freeformAddress }}
                    </li>
                </ul>
            </div>
        </div>

        <div class="container-large">

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

            <!-- research title -->
            <div class="researched-address d-flex">
                <div class="title d-flex">
                    <h2>Your research:</h2>
                    <div class="address">{{ researchedAddress }}</div>
                </div>

                <div class="tot-results">
                    Results: {{ tot_results }}
                </div>
            </div>

            <!-- Results -->

            <div class="row" v-if="results.length != 0">
                <div v-for="result in results" class="col">
                    <router-link :to="{ name: 'SingleApartment', params: { slug: result.slug } }"
                        style="text-decoration: none;">
                        <!-- Card results -->
                        <div class="card" :class="{ sponsorship_highlight: result.is_sponsorship_active !== 0 }">
                            <div class="image" :class="{ sponsorship_highlight: result.is_sponsorship_active !== 0 }">
                                <img v-if="result.image"
                                    :src="result.image.startsWith('apartments') ? state.base_api + '/' + result.image : state.base_api + '/storage/' + result.image"
                                    alt="result Image" class="card-img-top w-100" style="height: 350px;">
                                <img v-else
                                    src="https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png"
                                    alt="not-available" style="height: 350px; object-fit: contain;">
                            </div>
                            <div class="card-body">
                                <h3>{{ result.title }}</h3>
                                <p class="card-text address">
                                    <i class="fa-solid fa-location-dot"></i>
                                    {{ result.address }}
                                </p>
                                <p class="card-text distance">
                                    <strong> Distance:</strong>
                                    {{ result.distance.toFixed(1) }}
                                    <strong>Km</strong>
                                </p>
                                <p class="card-text rooms-beds d-flex">
                                <div class="beds">
                                    <strong>{{ result.beds }}
                                        <i class="fa-solid fa-bed"></i>
                                        Beds
                                    </strong>
                                </div>
                                <div class="rooms">
                                    <strong>
                                        {{ result.rooms }}
                                        <i class="fa-solid fa-person-booth"></i>
                                        Rooms
                                    </strong>
                                </div>

                                </p>

                                <p class="card-text crown" v-if="result.is_sponsorship_active !== 0">
                                    <i class="fa-solid fa-crown"></i>
                                </p>

                                <div class="service-list">
                                    <ul class="d-flex">
                                        <li v-for="(service, index) in result.services.sort((a, b) => a.id - b.id)"
                                            class="d-flex"
                                            :class="{ 'badge-selected': isSelected(service.pivot.service_id) || toggleService(service.pivot.service_id) }"
                                            @change="toggleService(service.id)">
                                            <!-- {{ service.pivot.service_id }}  -->
                                            <i :class="state.serviceIcons[service.service_name]"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </router-link>

                </div>
            </div>
            <div class="navigation" v-if="totalPages > 1">
                <button type="button" class="prev" v-if="currentPage > 1" @click="previousPage">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <ul class="pagination">
                    <li v-for="pageNumber in totalPages" :key="pageNumber"
                        :class="{ active: pageNumber === currentPage }">
                        <button type="button" class="btn_pagination" @click="getPage(pageNumber)">{{ pageNumber
                            }}</button>
                    </li>
                </ul>
                <button type="button" class="next" v-if="currentPage < totalPages" @click="nextPage">
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
            <div class="navigation" v-else>
                <button type="button" class="btn_pagination" disabled>1</button>
            </div>

        </div>

    </section>




</template>

<style scoped>
/* #region common */
.container {
    display: flex;
    flex-direction: column;
}

.container-large {
    width: 95%;
    max-width: 1740px;
    margin: auto;

    @media(max-width: 768px) {
        width: 90% !important;
    }
}

.row {
    padding-bottom: 2rem;
    gap: 20px;
    justify-content: center;

    .col {
        flex: 0 0 calc(((100% / 12) * 3) - 20px);

        @media(max-width: 1176px) {
            flex: 0 0 calc(((100% / 12) * 6) - 20px);
        }

        @media(max-width: 768px) {
            flex: 0 0 calc(((100% / 12) * 12) - 20px) !important;
        }
    }
}

/* #endregion common */

/* #region searchbar */

.top-bar {
    .advance_search {
        width: 80%;
        padding: 1rem 0 1.5rem;
        justify-content: space-between;
        margin: auto;
        align-items: center;
        padding: 0.1rem;
        border: 2px solid var(--color_grey_shadow);
        border-radius: 60px;

        @media (max-width:1176px) {
            order: 0;
            border: none;
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

                @media(max-width:1176px) {
                    order: 1;
                    text-align: center;
                }
            }

            @media(max-width:1176px) {
                border: none;
                order: 1;
                justify-content: end;
                padding: 1rem 0;
                align-items: center;
            }

            @media (max-width:768px) {
                justify-content: space-between;
                padding: 0;

                input {
                    width: 80%;
                }

                .bubble {
                    width: 20%;
                }
            }
        }

        .number-filter {
            @media (max-width:768px) {
                justify-content: center;
                gap: 1rem;
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

            @media(max-width:1176px) {
                border: none;
                padding: 1rem 0.5rem 1rem 0;
            }

            @media (max-width:768px) {
                flex-grow: 0;

                input {
                    width: 2.5rem;
                    padding: 0.5rem;
                }
            }
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
                    width: 100%;
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

            @media(max-width:1176px) {
                order: 0;
                width: 100%;
                border-radius: 60px;
                border: 2px solid var(--color_grey_shadow);
            }
        }

        @media (max-width:1176px) {
            flex-direction: column;

            .search-filters-container {
                width: 100%;
                justify-content: space-between;
                order: 1;

                @media (max-width:768px) {
                    flex-direction: column;
                }
            }
        }

        .suggestions {
            display: none;

            @media(max-width: 1176px) {
                display: block;
                width: 100%;
            }
        }


    }



}

/* #endregion searchbar*/

/* #region suggestions */
.suggestions {
    display: flex;
    justify-content: end;
    width: 80%;
    margin: auto;
    padding: 0.5rem;

    ul {
        list-style: none;
        border: 2px solid var(--color_grey_shadow);
        border-radius: 20px;
        position: absolute;
        background-color: var(--bnb-lighter);
        padding: 0.5rem;

        &>li {
            font-size: 1rem;
            border: 1px solid var(--color_grey_shadow);
            border-left: none;
            border-right: none;
            padding: 1rem;

            &:hover {
                background: linear-gradient(to right, var(--bnb-lighter), var(--bnb-li-hover), var(--bnb-lighter));
                cursor: pointer;
            }
        }

        &>li:first-child {
            border-top: none;
        }

        &>li:last-child {
            border-bottom: none;
        }
    }

    @media(max-width: 1176px) {
        display: none;
    }
}

/* #endregion suggestions */

/* #region services */

.services {
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
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

        @media(max-width:768px) {
            width: 5rem;
            height: 5rem;
            margin: 0.5rem;
            font-size: 0.8rem;
        }
    }

    .selected-service {
        background-color: var(--bnb-main);
        color: var(--bnb-lighter);
        box-shadow: 0 0 20px var(--color_grey_shadow);
    }

    input[type='checkbox'] {
        display: none;
    }

    .single-service:has(input[type='checkbox']:checked).single-service {
        background-color: var(--bnb-main);
        color: var(--bnb-lighter);
        box-shadow: 0 0 20px var(--color_grey_shadow);
    }
}

/* #endregion services */

/* #region title */

.researched-address {
    padding-bottom: 2rem;
    justify-content: space-between;
    align-items: center;

    @media(max-width: 1176px) {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
    }

    .title {
        display: flex;
        gap: 1rem;
        align-items: center;

        h2 {
            color: var(--bnb-main);
        }

        .address {
            font-weight: bold;
        }
    }

    .tot-results {
        color: var(--color_grey_shadow);
    }

}

/* #endregion title */

/* #region cards */

.card {
    border-radius: 20px;
    position: relative;
    overflow: hidden;

    &:hover img {
        transform: scale(1.2);
        transition: all 0.8s ease-in-out;
    }

    .image {
        border-radius: 20px;
        width: 100%;
        overflow: hidden;
        height: 350px;
        border-bottom: 2px solid var(--color_grey_shadow);
        border-top: none;
        border-left: none;
        border-right: none;

        img {
            border-radius: 20px;
            width: 100%;
            object-fit: cover;
            transition: all 1s ease-in-out;
        }
    }


    .address {
        display: flex;
        gap: 0.5rem;
        align-items: center;

        i {
            color: var(--bnb-main);
        }
    }

    .distance {
        color: var(--color_grey_shadow);
    }

    .rooms-beds {
        gap: 1rem;

        .rooms,
        .beds {
            border: 1px solid black;
            padding: 0.7rem;
            border-radius: 10px;
        }
    }

    .crown {
        position: absolute;
        top: 1rem;
        right: 1rem;

        .fa-crown {
            color: var(--bnb-crown);
            font-size: 1.2rem;
            width: 3rem;
            height: 3rem;
            background-color: var(--bnb-crown-bg);
            border: 1px solid var(--bnb-crown-border);
            border-radius: 50%;
            box-shadow: 0 0 10px inset var(--bnb-crown-shadow);
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .service-list {
        padding: 0.5rem 0;

        ul {
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        li {
            align-items: center;
            text-align: center;
            list-style: none;
            padding: 0.7rem;
            border: 1px solid var(--color_grey_shadow);
            border-radius: 1rem;
        }
    }

    .badge-selected {
        background-color: var(--bnb-main);
        color: var(--bnb-lighter);
        box-shadow: 0 0 5px var(--color_grey_shadow);
    }
}

.sponsorship_highlight {
    box-shadow: 0 0 15px 2px inset #809ef1;
    outline: 1.7px solid #8499ff;

    & .image {
        border: 2px solid #344172;
        box-shadow: 0 0 10px 3px #8091f1;
        border-top: none;
        border-left: none;
        border-right: none;
    }

}

/* #endregion cards */

/* #region navigation */
.navigation {
    display: flex;
    justify-content: center;
    padding: 1.5rem 0;
    align-items: center;

    .next,
    .prev {
        border-radius: 50%;
        border: 1px solid var(--color_dark);
        height: 3rem;
        width: 3rem;
        padding: 0.5rem;
        color: var(--bnb-lighter);
        background-color: var(--bnb-main);
        border: none;

    }

    .prev {
        margin-right: 0.5rem;
    }
}

.pagination {
    display: flex;
    list-style: none;
    padding: 0;
}

.pagination li {
    margin-right: 0.5rem;
}

.btn_pagination {
    color: var(--bnb-main);
    font-weight: bold;
    cursor: pointer;
    transition: color 0.3s ease;
    padding: 0.3rem 0.6rem;
    border: 2px solid var(--bnb-main);
    color: var(--bnb-main);
    border-radius: 50%;
    width: 2.5rem;
    aspect-ratio: 1 / 1;
}

.pagination li button:hover,
.pagination li.active button {
    background-color: var(--bnb-main);
    color: var(--bnb-lighter);
}

/* #endregion navigation */
</style>
