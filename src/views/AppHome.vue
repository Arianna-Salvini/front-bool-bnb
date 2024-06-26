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
                        console.log(response);
                        console.log(response.data.response.data);
                        this.results = response.data.response.data;
                        //must use query object
                        //query objects are strings -> must convert them to json
                        state.updateResults(response.data.response.data);
                        this.$router.push({ name: 'research', query: { address: this.search_address, range: this.range_distance } });
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
        getPage(pageNumber) {
            if (pageNumber !== this.currentPage) {
                let url = `${state.base_api}${state.apartment_url}?page=${pageNumber}`;
                this.getApartments(url);
            }
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
                <div v-for="apartment in this.apartments" class="col">

                    <router-link :to="{ name: 'SingleApartment', params: { slug: apartment.slug } }"
                        style="text-decoration: none;">
                        <div class="card" :class="{ sponsorship_highlight: apartment.sponsorships.length > 0 }">

                            <img v-if="apartment.image"
                                :src="apartment.image.startsWith('http') ? apartment.image : state.base_api + '/storage/' + apartment.image"
                                alt="Apartment Image" class="card-img-top w-100 " style="height: 200px;">
                            <img v-else
                                src="https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png"
                                alt="not-available" style="height: 200px;">
                            <div class="card-body">
                                <h3>{{ apartment.title }}</h3>
                                <p class="card-text">
                                    <i class="fa-solid fa-location-dot"></i>
                                    {{ apartment.address }}
                                </p>
                                <p class="card-text"><strong><i class="fa-solid fa-bed"></i> Beds</strong>
                                    {{ apartment.beds }} <strong><i class="fa-solid fa-person-booth"></i> Rooms</strong>
                                    {{ apartment.rooms }}
                                </p>
                                <p class="card-text crown" v-if="apartment.sponsorships.length > 0">
                                    <i class="fa-solid fa-crown"></i>
                                </p>

                                <div class="services">
                                    <strong>Services:</strong>
                                    <ul class="d-flex">
                                        <li v-for="service in apartment.services" :key="service.id">
                                            <i :class="state.serviceIcons[service.service_name]"></i>
                                        </li>
                                    </ul>
                                </div>

                            </div>
                        </div>
                    </router-link>

                </div>
            </div>
            <div class="navigation">
                <button type="button" class="prev" v-if="currentPage > 1" @click="showPrev">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <ul class="pagination">
                    <li v-for="pageNumber in lastPage" :key="pageNumber"
                        :class="{ active: pageNumber === currentPage }">
                        <button type="button" class="btn_pagination" @click="getPage(pageNumber)">{{ pageNumber
                            }}</button>
                    </li>
                </ul>
                <button type="button" class="next" v-if="currentPage < lastPage" @click="showNext">
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>



        </div>


    </section>

</template>

<style scoped>
.services {
    margin-top: 10px;

    & ul {
        list-style: none;
    }
}

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

    .card {
        position: relative;
    }

    .sponsorship_highlight {
        box-shadow: 0 0 15px 2px inset #809ef1;
        outline: 1.7px solid #8499ff;

        & img {
            border: 2px solid #344172;
            box-shadow: 0 0 10px 3px #8091f1;
            border-top: none;
            border-left: none;
            border-right: none;
        }

    }

    .card,
    img {
        border-radius: 20px;
        width: 100%;
        object-fit: cover;

    }

    .card-body {
        max-height: 250px;


        & .fa-crown {
            color: gold;
            font-size: 1.2rem;
            width: 3rem;
            height: 3rem;
            background-color: #6282f4b9;
            border: 1px solid #4c6b9f;
            border-radius: 50%;
            box-shadow: 0 0 10px inset #24224a;
            display: flex;
            justify-content: center;
            align-items: center;
        }


        .crown {
            position: absolute;
            top: 1rem;
            right: 1rem;
        }
    }


    .navigation {
        display: flex;
        justify-content: end;
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

}



.services {
    overflow-y: auto;
    margin-top: 0 !important;


    ul {
        flex-wrap: wrap;

    }

    li {
        align-items: center;
        text-align: center;
        margin: 0.3rem;
        list-style: none;
        padding: 0.3rem;
        font-size: 1.1rem;
        border: 1px solid var(--color_grey_shadow);
        border-radius: 50%;

        & i {
            width: 25px;
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.8rem;

        }
    }
}

@media (max-width: 425px) {
    .top-bar {
        flex-direction: column;
        margin-top: 3rem;
    }

    .search-form {
        flex-direction: column;
        gap: 1rem;
    }

    .range-wrap {
        flex-direction: column;
    }

    .pagination {
        justify-content: center;
    }

    .prev,
    .next {
        margin: 1rem;
    }

}

@media (max-width: 768px) {
    .row {
        flex-wrap: wrap;
        gap: 20px;
        justify-content: center;
    }

    .card {
        width: 100%;
        max-width: 100%;
        height: auto;
    }
}
</style>
