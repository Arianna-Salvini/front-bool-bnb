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
            url_apartment: 'apartments/'

        }

    },
    methods: {
        callApartment() {
            const apartmentSlug = this.$route.params.slug
            const fullUrl = this.base_api + this.url_apartment + apartmentSlug
            axios.get(fullUrl).then(response => {
                if (response.data.success) {
                    this.apartment = response.data.response;
                    //console.log(this.apartment)
                    if (this.$route.params.slug === apartamentSlug) {
                        this.renderMap(this.apartment.longitude, this.apartment.latitude);
                        console.log(this.renderMap)
                    } else {
                        console.error('Error of render', error);
                    }
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
            <div class="col">
                <div class="card">
                    <div v-if="apartment.image" class="card_top">
                        <div class="w-100 h-100 bg-dark bg-opacity-25 p-4">
                            <h2 class="text-white">{{ apartment.title }}</h2>
                        </div>
                    </div>
                    <img v-if="apartment.image" :src="apartment.image" alt="Apartment Image" class="img-fluid w-100"
                        style="object-fit: cover; height: 400px;">
                    <img v-else :src="state.base_api + '/storage/' + apartment.image" alt="Apartment Image"
                        class="img-fluid w-100" style="object-fit: cover; height: 400px;">
                </div>
                <div class="mt-3">
                    <strong>Description:</strong>
                    <p>{{ apartment.description }}</p>
                    <!--    Add Map  -->
                    <div id="map" style="height: 400px; width: 100%;" class="mt-4 rounded-5">
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card shadow mb-4 rounded-5">
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
                                    <li v-for="service in apartment.services" :key="service.id">{{ service.service_name
                                        }}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
