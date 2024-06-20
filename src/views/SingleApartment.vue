<script>

import axios from 'axios';
import { state } from '../state.js';


export default {
    name: 'SingleApartment',
    components: {

    },
    data() {
        return {
            state: state,
            apartment: {},
            base_api: 'http://127.0.0.1:8000/api/',
            url_apartment: 'apartments/',
            //form contact 
            name: '',
            lastname: '',
            email: '',
            message: ''
        }

    },
    methods: {
        callApartment() {
            const apartmentSlug = this.$route.params.slug
            const fullUrl = this.base_api + this.url_apartment + apartmentSlug
            axios.get(fullUrl).then(response => {
                if (response.data.success) {
                    this.apartment = response.data.response;

                    console.log(this.$route.name === 'SingleApartment');
                    //console.log(this.apartment)
                    if (this.$route.name === 'SingleApartment') {

                        this.renderMap(this.apartment.longitude, this.apartment.latitude);
                    } else {
                        console.error('Error of render', error);
                    }
                }
                else {
                    this.$router.push({ name: 'not-found' });
                }
            })
        },

        renderMap(longitude, latitude) {
            let center = [longitude, latitude];
            let map = tt.map({
                key: "TrYgVvdPtH2r9lgdwauiuXnkm2LGst1A",
                container: "map",
                center: center,
                zoom: 15
            });

            map.on('load', () => {
                new tt.Marker().setLngLat(center).addTo(map);
            });
        },
        handleForm() {
            console.log('Form ok!');
            console.log(this.name_lastname, this.email, this.message);
        }
    },
    mounted() {
        this.callApartment()

    }
};
</script>

<template>

    <div class="container">
        <div class="row d-flex">
            <div class="col-8">
                <div class="cards box_shadow ">
                    <div class="card_top">
                        <div class="title_card">
                            <h2 class="">{{ apartment.title }}</h2>
                        </div>
                    </div>
                    <div class="card_body">
                        <img v-if="apartment.image"
                            :src="apartment.image.startsWith('http') ? apartment.image : state.base_api + '/storage/' + apartment.image"
                            alt="Apartment Image" class="img-fluid w-100" style="object-fit: cover; height: 400px;">
                    </div>
                </div>
                <div class="description">
                    <strong>Description:</strong>
                    <p>{{ apartment.description }}</p>
                </div>

                <!--    Add Map  -->
                <div id="map" class="box_shadow"></div>
            </div>
            <div class="col-4">
                <div class="cards box_shadow">
                    <div
                        class="card-header bg-dark text-white rounded-5 d-flex align-items-center justify-content-center">
                        <h2>Details:</h2>
                    </div>
                    <div class="card-body">
                        <div class="d-flex flex-wrap gap-1">
                            <div class="mb-3">
                                <span class="badge bg-dark rounded-5 p-2">
                                    <strong><i class="fa-solid fa-map-pin"></i></strong>
                                    {{ apartment.address }}, {{ apartment.street_number }}, {{ apartment.zip_code }}
                                </span>
                            </div>
                            <div class="mb-3">
                                <span class="badge bg-dark rounded-5 p-2">
                                    <strong><i class="fa-solid fa-ruler-combined"></i></strong>
                                    {{ apartment.square_meters }} m²
                                </span>
                            </div>
                            <div class="mb-3">
                                <span class="badge bg-dark rounded-5 p-2">
                                    <strong><i class="fa-solid fa-person-booth"></i></strong>
                                    {{ apartment.rooms }} rooms
                                </span>
                            </div>
                            <div class="mb-3">
                                <span class="badge bg-dark rounded-5 p-2">
                                    <strong><i class="fa-solid fa-bed"></i></strong>
                                    {{ apartment.beds }} beds
                                </span>
                            </div>
                            <div class="mb-3">
                                <span class="badge bg-dark rounded-5 p-2">
                                    <strong><i class="fa-solid fa-toilet"></i></strong>
                                    {{ apartment.bathrooms }} bathrooms
                                </span>
                            </div>
                            <!-- Services -->
                            <div class="mb-3">
                                <strong>Services:</strong>
                                <ul>
                                    <li v-for="service in apartment.services" :key="service.id">{{
                                        service.service_name }}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!--  -->
        <div class="cards box_shadow my-5 rounded-5">
            <div class="card-header bg-dark text-white rounded-5 d-flex align-items-center justify-content-center py-2">
                <h2>Contact Owner</h2>
            </div>
            <div class="card-body p-3">
                <form @submit.prevent="handleForm">
                    <div class="mb-3">
                        <label for="name" class="form-label">Name</label>
                        <input type="text" class="form-control" id="name" v-model="name" required
                            placeholder="Type your name">
                    </div>
                    <div class="mb-3">
                        <label for="name" class="form-label">Lastname</label>
                        <input type="text" class="form-control" id="lastname" v-model="lastname" required
                            placeholder="Type your lastname">
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Your Email</label>
                        <input type="email" class="form-control" id="email" v-model="email" required
                            placeholder="Type your e-mail">
                    </div>
                    <div class="mb-3">
                        <label for="message" class="form-label">Message</label>
                        <textarea class="form-control" id="message" rows="5" v-model="message" required
                            placeholder="Type your message"></textarea>
                    </div>
                    <button type="submit" class="btn btn-dark">Send Message</button>
                </form>
            </div>
        </div>

    </div>
</template>

<style scoped>
.container {
    padding: 1rem 0;
}

.cards {
    border-radius: 1rem;
    border: none;

    .card_top {
        background-color: var(--color_dark);
        border-radius: 1rem 1rem 0 0;

        .title_card {
            padding: 1rem;
            color: white;
        }
    }
}

.description {
    margin: 1rem 0.8rem;
}

#map {
    border-radius: 1rem;
    height: 400px;
    width: 100%;
    margin-left: 1rem 0 2rem -0.8rem;
    padding: 3rem 0;
}

img {
    border-radius: 0 0 1rem 1rem;
}
</style>
