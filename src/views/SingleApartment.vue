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
            sender_email: '',
            content: '',
            modName: '',
            modLastName: '',
            apartmentId: null, // variabile per l ID dell apartment
            submittedForm: false, // stato per l invio del form 
            confirmSubmitForm: false, // variabile per mostrare il banner di conferma
            submittedName: '', // il nome inviato per farlo vedere nel banner
            submittedLastname: '', // il cognome inviato per farlo vedere nel banner
            nameError: '',
            lastnameError: '',
            emailError: '',
            contentError: '',
            isValidForm: true,//impostiamo il form su true
            nameTouched: false,
            loading: false, // variabile per gestire lo stato di caricamento
            lastnameTouched: false,
            emailTouched: false,
            contentTouched: false,

            ip_address: ''
        }

    },
    methods: {
        callApartment() {
            const apartmentSlug = this.$route.params.slug
            const fullUrl = this.base_api + this.url_apartment + apartmentSlug
            axios.get(fullUrl).then(response => {
                if (response.data.success) {
                    this.apartment = response.data.response;
                    this.apartmentId = this.apartment.id; // memorizzo ID dell apartment
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
            if (!this.validateForm()) {
                return;
            }
            // Attivo lo stato di caricamento
            this.loading = true;

            const formData = {
                apartment_id: this.apartmentId,
                name: this.name,
                lastname: this.lastname,
                sender_email: this.sender_email,
                content: this.content,
            };

            axios.post('http://127.0.0.1:8000/api/messages', formData)
                .then(response => {
                    console.log('ok', response.data);

                    // Disattivo lo stato di caricamento
                    this.loading = false;
                    // set submittedForm to true to disable button
                    this.submittedForm = true;

                    // store sent data for display in banner
                    this.submittedName = this.name;
                    this.submittedLastname = this.lastname;

                    this.showAlert = false; // nascondo l avviso dopo l invio

                    // show confirmation banner
                    this.confirmSubmitForm = true;

                    // clear form fields
                    this.name = '';
                    this.lastname = '';
                    this.sender_email = '';
                    this.content = '';
                })
                .catch(error => {
                    console.error('error!', error);
                    // in caso di errore disattivo loading
                    this.loading = false;
                });
        },

        validateInput(nameInput) {
            let inputValue = this[nameInput];
            let inputErrorDiv = `${nameInput}Error`;
            //switch case per controllare ogni input e mostrare il errore 
            switch (nameInput) {
                case 'name':
                case 'lastname':
                    if (!inputValue || inputValue.length < 3) {
                        this[inputErrorDiv] = `${nameInput.charAt(0).toUpperCase() + nameInput.slice(1)} must be at least 3 characters.`;
                    } else {
                        this[inputErrorDiv] = '';
                    }
                    break;
                case 'sender_email':
                    if (!inputValue || !this.validateEmail(inputValue)) {
                        this[inputErrorDiv] = 'Invalid email address.';
                    } else {
                        this[inputErrorDiv] = '';
                    }
                    break;
                case 'content':
                    if (!inputValue || inputValue.length < 10) {
                        this[inputErrorDiv] = 'Message must be at least 10 characters.';
                    } else {
                        this[inputErrorDiv] = '';
                    }
                    break;
                default:
                    break;
            }

            // imposto il campo touched solo se il campo ha un valore(touched e per tenere traccia in quale input è entrato il user)
            if (inputValue) {
                this[`${nameInput}Touched`] = true;
            }

            this.updateIsValidForm();
        },



        validateForm() {
            this.validateInput('name');
            this.validateInput('lastname');
            this.validateInput('email');
            this.validateInput('content');
            return this.isValidForm;
        },

        validateEmail(email) {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailPattern.test(email);

        },
        updateIsValidForm() {
            this.isValidForm = !this.nameError && !this.lastnameError && !this.emailError && !this.contentError;
            console.log('form ok:', this.isValidForm);
        },
        goBack() {
            this.$router.go(-1); // funzione per  tornare alla pagina precedente
        },


        getIp() {
            return axios
                .get('https://api.ipify.org/?format=json')
                .then(response => {
                    console.log(response);
                    this.ip_address = response.data.ip;
                    console.log(this.ip_address);
                })
                .catch(err => console.log(err))
        },

        sendIp() {
            const dataToSend = { apartment_id: this.apartment.id, ip_address: this.ip_address };
            return axios
                .post(state.base_api + '/api/statistics', dataToSend)
                .then(response => {
                    console.log('fatto');
                    console.log(response);
                })
                .catch(error => console.log(error))
        }
    },

    created() {
        this.getIp().then(() => {
            return this.sendIp();
        });
    },
    mounted() {
        console.log(this.ip_address);
        //this.getIp();
        this.callApartment();
        this.showAlert = true; // mostra l avviso
    }
};
</script>

<template>
    <div class="container">

        <div class="actions">

            <button @click="goBack" class="button_back">
                <i class="fa fa-circle-left"></i> Back
            </button>
        </div>

        <div class="title">
            <i class="fa-solid fa-house"></i>
            <h2>{{ apartment.title }}</h2>
        </div>

        <div class="row">

            <!-- presentation -->
            <div class="col-8">

                <!-- image -->
                <div class="image">
                    <img v-if="apartment.image"
                        :src="apartment.image.startsWith('http') ? apartment.image : state.base_api + '/storage/' + apartment.image"
                        alt="Apartment Image" class="img w-100">
                    <img v-else src="https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png"
                        alt="Image not available" class="img w-100" style="border: 1px solid var(--color_grey_shadow);">
                </div>

                <!-- owner + description -->
                <div class="owner-general">

                    <!-- owner -->
                    <div class="owner">
                        <span><strong>Owner: </strong></span>
                        <span class="credit_apartment" v-if="modName !== '' && modLastName !== ''">{{ modName }} {{
                            modLastName }}</span>
                        <span v-else class="credit_apartment">Not available</span>
                    </div>

                    <!-- details about rooms -->
                    <div class="rooms-detail d-flex">

                        <div class="badge">
                            <i class="fa-solid fa-ruler-combined"></i>
                            <span>{{ apartment.square_meters }} m²</span>
                        </div>

                        <div class="badge">
                            <strong><i class="fa-solid fa-person-booth"></i></strong>
                            <span>{{ apartment.rooms }} rooms</span>
                        </div>

                        <div class="badge">
                            <strong><i class="fa-solid fa-bed"></i></strong>
                            <span>{{ apartment.beds }} beds</span>
                        </div>

                        <div class="badge">
                            <strong><i class="fa-solid fa-toilet"></i></strong>
                            <span>{{ apartment.bathrooms }} bathrooms</span>
                        </div>

                    </div>

                </div>

                <div class="description" v-if="apartment.description !== null">
                    <p>{{ apartment.description }}</p>
                </div>
            </div>

            <!-- details -->
            <div class="col-4">
                <div class="details box_shadow">
                    <h3 class="details-title">Details</h3>

                    <div class="details-bottom">
                        <div class="services-card">
                            <div class="detail-item address-container">

                                <h4>
                                    <i class="fa-solid fa-map-pin"></i>
                                    Address
                                </h4>
                                <div class="address">
                                    {{ apartment.address }}
                                </div>

                            </div>
                            <div class="services">

                                <div class="services-title">
                                    <h4>
                                        <i class="fa-solid fa-bell-concierge"></i>
                                        <span>Services</span>
                                    </h4>

                                </div>

                                <ul>
                                    <li v-for="service in apartment.services" :key="service.id">
                                        <i :class="state.serviceIcons[service.service_name]"></i>
                                        {{ service.service_name }}
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>

        <!-- map -->
        <div class="map-container">
            <div id="map" class="map box_shadow"></div>
        </div>

        <!-- contact form -->
        <div class="form-container">
            <div class="form-header">
                <h2>Contact Owner: {{ modName }} {{ modLastName }} </h2>
            </div>

            <div class="form-bottom">
                <form @submit.prevent="handleForm" class="form-body">

                    <!-- name -->
                    <div class="form-tag">
                        <label for="name" class="form-label">Name</label>
                        <input type="text" class="form-control" :class="{ 'is-invalid': nameError && nameTouched }"
                            id="name" v-model="name" required name="name" placeholder="Type your name"
                            @input="validateInput('name')">
                        <div class="error-message" v-if="nameError && nameTouched">{{ nameError }}</div>
                    </div>

                    <!-- lastname -->
                    <div class="form-tag">
                        <label for="lastname" class="form-label">Lastname</label>
                        <input type="text" class="form-control"
                            :class="{ 'is-invalid': lastnameError && lastnameTouched }" id="lastname" v-model="lastname"
                            required name="lastname" placeholder="Type your lastname"
                            @input="validateInput('lastname')">
                        <div class="error-message" v-if="lastnameError && lastnameTouched">{{ lastnameError }}
                        </div>
                    </div>

                    <!-- email -->
                    <div class="form-tag">
                        <label for="email" class="form-label">Your Email</label>
                        <input type="email" class="form-control" :class="{ 'is-invalid': emailError && emailTouched }"
                            id="sender_email" v-model="sender_email" required name="sender_email"
                            placeholder="Type your e-mail" @input="validateInput('sender_email')">
                        <div class="error-message" v-if="emailError && emailTouched">{{ emailError }}</div>

                    </div>

                    <!-- message -->
                    <div class="form-tag">
                        <label for="message" class="form-label">Message</label>
                        <textarea class="form-control" :class="{ 'is-invalid': contentError && contentTouched }"
                            id="content" rows="5" v-model="content" required name="content"
                            placeholder="Type your message" @input="validateInput('content')"></textarea>
                        <div class="error-message" v-if="contentError && contentTouched">{{ contentError }}
                        </div>
                    </div>

                    <!-- disclaimer -->
                    <div class="" v-if="showAlert">
                        <span class="alert">* </span><span>All fields are required!</span>
                    </div>

                    <!-- btn -->
                    <button type="submit"
                        :class="[{ 'btn btn-dark submit': true }, { 'disabled_button': !isValidForm || submittedForm || loading }]"
                        :disabled="!isValidForm || submittedForm || loading">
                        <span v-if="loading">Loading...</span>
                        <span v-else>Send Message</span>
                    </button>
                </form>

                <div v-if="confirmSubmitForm" class="banner_form">
                    The message has been successfully sent! Thanks {{ submittedName }} {{ submittedLastname }}
                    for your
                    contact.
                </div>
            </div>
        </div>




    </div>
</template>

<style scoped>
.container {
    .title {
        display: flex;
        gap: 1rem;
        font-size: 1.5rem;
        align-items: center;
        margin-bottom: 1rem;
    }

    .actions {
        margin-bottom: 2rem;
    }

    .row {
        gap: 1rem;
    }

    .col-4 {
        width: calc(((100% / 12) *4) - 1 rem);
    }

    .col-8 {
        width: calc(((100% / 12) * 8) - 1rem);
    }

    .image,
    img {
        width: 100%;
    }

    .img {
        border-radius: 30px;
        object-fit: cover;
        height: 400px;
    }

    .owner-general {
        padding: 1.5rem;
        border-bottom: 1px solid rgba(124, 124, 124, 0.5);
    }

    .rooms-detail {
        margin-top: 1rem;

        .badge {
            border: 1px solid var(--color_grey_shadow);
            border-top: none;
            border-bottom: none;
            padding: 0.8rem 2.5rem;
            display: flex;
            gap: 0.3rem;
            align-items: center;
            transition: transform 0.3s ease, background-color 0.3s ease;

            i {
                color: var(--bnb-main);
            }
        }
    }

    .description {
        padding: 1.5rem;
    }


    .credit_apartment {
        color: #6c6c6c;
        font-size: 0.9rem;
        font-style: italic;
    }



    .details {
        background: #f0f0f0;
        border-radius: 30px;
        display: flex;
        flex-direction: column;
        border: 1px solid var(--color_grey_shadow);

        .details-title {
            font-size: 1.5rem;
            padding: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--bnb-lighter);
            background-color: black;
            border-radius: 60px;
        }

        .details-bottom {
            padding: 2rem;
        }

        .address-container {
            margin-bottom: 1rem;
        }

        .address-container,
        .services-title {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;

            h4 {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 1.2rem;
            }
        }

        .services {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .address {
            font-size: 1.1rem;
        }

        .box_shadow {
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .badge:hover {
            transform: scale(1.05);
            background-color: var(--color_grey_shadow);
        }

        .services ul {
            list-style: none;
            padding: 0;
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;

            li {
                background-color: var(--bnb-main);
                color: #fff;
                padding: 0.5rem 1rem;
                border-radius: 30px;
                transition: background-color 0.3s ease;
                display: flex;
                align-items: center;
                gap: 0.5rem;

                &:hover {
                    background-color: #1a6f65;
                }
            }
        }


    }

    .map-container {
        width: 100%;
        padding: 1.5rem 0;

        .map {
            border-radius: 2rem;
            height: 400px;
        }
    }

}


.button_back {
    text-decoration: none;
    padding: 1rem 2rem;
    margin: 0;
    font-size: 1rem;
    border-radius: 2rem;
    color: #f8f9fa;
    background-color: var(--bnb-main);
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: background-color 0.3s ease;
}

.button_back:hover {
    background-color: #1a6f65;
    color: #fff;
}


.submit {
    align-self: center;
    padding: 0.5rem;
    background-color: var(--bnb-main);
    border-color: var(--bnb-main);
    border: none;
    border-radius: 5px;
    color: var(--bnb-lighter);
    cursor: pointer;

}

.form-container {
    background-color: #f0f0f0;
    border-radius: 30px;
    width: 80%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    margin: 2rem auto;

    .form-header {
        font-size: 1.2rem;
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--bnb-lighter);
        background-color: black;
        border-radius: 60px;
    }

    .form-body {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding: 2rem;
    }

    .form-tag {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .form-label {
        font-weight: bold;
        color: #228e80;
    }

    .form-control {
        padding: 0.75rem;
        border: 1px solid #ced4da;
        border-radius: 30px;
        font-size: 1rem;
    }

    .is-invalid {
        border-color: red;
    }

    .error-message {
        color: red;
        font-size: 0.875rem;
    }

    .alert {
        font-style: italic;
        color: red;
    }

    .submit {
        background-color: #228e80;
        color: white;
        padding: 1rem 2rem;
        border: none;
        border-radius: 30px;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.3s ease;
    }


    .submit:hover {
        background-color: #1a6f65;
    }

    .banner_form {
        margin-top: 1rem;
        padding: 1rem;
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
        border-radius: 30px;
        text-align: center;
    }

    .disabled_button {
        background-color: #d3d3d3 !important;
        border-color: #d3d3d3 !important;
        color: #ffffff !important;

    }

    .button_back {
        text-decoration: none;
        padding: 0.8rem;
        font-size: 0.8rem;
        border-radius: 2rem;
        color: var(--bnb-lighter);
        background-color: #343a40;
        border-color: #343a40;
    }

    .button_back:hover {
        background-color: #47494b;
        border-color: #3c4043;
        color: white;
    }
}


@media (max-width: 1176px) {
    .main {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-flow: column;
        width: 100%;
    }

    .col-8,
    .col-4 {
        flex: 0 0 100%;
        width: 100%;
    }

    .form-header,
    .banner-header {
        text-align: center;
    }

    .rooms-detail {
        justify-content: center;
    }

    .map {
        height: 200px;
    }
}

@media (max-width: 768px) {
    .badge {
        display: flex !important;
        flex-direction: column;
        gap: 0.3rem;
        justify-content: center;
        align-items: center;
    }
}

@media (max-width: 576px) {
    .main {
        flex-flow: column;
    }

    .container {
        padding: 0.5em;
    }

    .form-header,
    .banner-header {
        font-size: 1em;
    }

    .box_shadow {
        padding: 0.5em;
    }
}
</style>
