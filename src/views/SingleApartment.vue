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
            message: '',
            modName: '',
            modLastName: '',
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
                    console.log(this.apartment)
                    let renterName = this.apartment.user.name
                    let renterLastName = this.apartment.user.lastname
                    this.modName = renterName[0].toUpperCase() + renterName.slice(1);
                    this.modLastName = renterLastName[0].toUpperCase() + renterLastName.slice(1);

                    //console.log(modName, modLastName)
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
                <div class="cards box_shadow">
                    <div class="card_top">
                        <div class="title_card">
                            <h2 class="">{{ apartment.title }}</h2>
                        </div>
                    </div>
                    <div class="card_body">
                        <img v-if="apartment.image"
                            :src="apartment.image.startsWith('http') ? apartment.image : state.base_api + '/storage/' + apartment.image"
                            alt="Apartment Image" class=" card-img img-fluid w-100"
                            style="object-fit: cover; height: 400px;">
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
                    <div class="title_card bg_dark">
                        <h2>Details:</h2>
                    </div>
                    <div class="card_body">
                        <div class="d-flex services-card flex-wrap gap-1">
                            <div class="">
                                <span class="bg-dark rounded-5 p-2">
                                    <strong><i class="fa-solid fa-map-pin"></i></strong>
                                    {{ apartment.address }}, {{ apartment.street_number }}, {{ apartment.zip_code }}
                                </span>
                            </div>
                            <div class="mb-3">
                                <span class="badges bg-dark rounded-5 p-2">
                                    <i class="fa-solid fa-ruler-combined"></i>
                                    {{ apartment.square_meters }} m²
                                </span>
                            </div>
                            <div class="mb-3">
                                <span class="badges bg-dark rounded-5 p-2">
                                    <strong><i class="fa-solid fa-person-booth"></i></strong>
                                    {{ apartment.rooms }} rooms
                                </span>
                            </div>
                            <div class="mb-3">
                                <span class="badges bg-dark rounded-5 p-2">
                                    <strong><i class="fa-solid fa-bed"></i></strong>
                                    {{ apartment.beds }} beds
                                </span>
                            </div>
                            <div class="mb-3">
                                <span class="badges bg-dark rounded-5 p-2">
                                    <strong><i class="fa-solid fa-toilet"></i></strong>
                                    {{ apartment.bathrooms }} bathrooms
                                </span>
                            </div>
                            <!-- Services -->
                            <div class="services mb-3">
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

        <!-- Form -->
        <div class="box_shadow my-5 rounded-5 form-container">
            <div class="form-header bg-dark text-white rounded-5 d-flex align-items-center justify-content-center py-2">
                <h2>Contact Owner: {{ modName }}
                    {{ modLastName }} </h2>
            </div>
            <div class="card_body p-3 ">
                <form @submit.prevent="handleForm" class="form-body d-flex">
                    <div class="mb-3 form-tag">
                        <label for="name" class="form-label">Name</label>
                        <input type="text" class="form-control" id="name" v-model="name" required
                            placeholder="Type your name">
                    </div>
                    <div class="mb-3 form-tag">
                        <label for="name" class="form-label">Lastname</label>
                        <input type="text" class="form-control" id="lastname" v-model="lastname" required
                            placeholder="Type your lastname">
                    </div>
                    <div class="mb-3 form-tag">
                        <label for="email" class="form-label">Your Email</label>
                        <input type="email" class="form-control" id="email" v-model="email" required
                            placeholder="Type your e-mail">
                    </div>
                    <div class="mb-3 form-tag">
                        <label for="message" class="form-label">Message</label>
                        <textarea class="form-control" id="message" rows="5" v-model="message" required
                            placeholder="Type your message"></textarea>
                    </div>
                    <button type="submit" class="btn btn-dark submit">Send Message</button>
                </form>
            </div>
        </div>

    </div>
</template>

<style scoped>
.container {
    padding: 1rem 0;


    .row {
        gap: 1rem;

        .col-6 {
            flex: 0 0 calc((100% / 2) - 1rem);
        }

        .col-4 {
            flex: 0 0 calc((100% / 3) - 1rem);
        }

        .description {
            margin: 1rem 0.8rem;
        }

        #map {
            border-radius: 2rem;
            height: 400px;
            width: 100%;
            margin-left: 1rem 0 2rem -0.8rem;
            padding: 3rem 0;
        }

        img {
            border-radius: 0 0 3rem 3rem;
            width: 100%;
        }
    }


    /* Card-section */
    .cards {
        border-radius: 3rem;
        border: none;
        box-shadow: 0 0 20px var(--color_grey_shadow);

        .card_top {
            background-color: var(--color_dark);
            border-radius: 2rem 2rem 0 0;

        }

        .title_card {
            padding: 1.5rem 1.5rem 1rem;
            color: white;
            border-radius: 2rem 2rem 0 0;
        }

        .card_body {
            border-radius: 3rem;
            flex-direction: column;

            .services-card {
                flex-direction: column;
                gap: 1rem;
                padding: 1.5rem;

                .services {
                    margin-top: 10px;

                    & ul {
                        list-style: none;
                    }
                }

                .badges {
                    padding: 0.3rem;
                    color: white;
                    background-color: var(--color_dark);
                }
            }
        }
    }

    /* form-section */
    .form-container {
        border-radius: 3rem;
        border: none;
        box-shadow: 0 0 20px var(--color_grey_shadow);
        margin: 1rem 0 2rem -0.8rem;

        .form-header {
            align-items: center;
            justify-content: center;
            border-radius: 2rem 2rem 0 0;
            color: white;
            padding: 0.8rem 1.5rem 0.5rem;
            background-color: var(--color_dark);
            margin-top: 1rem;
        }

        .form-body {
            padding: 0.5rem 1rem;
            flex-direction: column;
            gap: 0.3rem;

            .form-control {
                min-height: 30px;
                border-radius: 0.3rem;
                border: 1px solid #ced4da;
                padding: 0.5rem;
            }

            .form-tag {
                display: flex;
                flex-direction: column;
            }

            .submit {
                align-self: center;
                padding: 0.5rem;
                background-color: var(--bnb-main);
                border-color: var(--bnb-main);
                border: none;
                border-radius: 5px;
                color: var(--bnb-lighter);
            }
        }
    }
}
</style>
