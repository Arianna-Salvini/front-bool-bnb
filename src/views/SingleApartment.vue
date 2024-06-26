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
            lastnameTouched: false,
            emailTouched: false,
            contentTouched: false,
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
                    // set submittedForm to true to disable button
                    this.submittedForm = true;

                    // store sent data for display in banner
                    this.submittedName = this.name;
                    this.submittedLastname = this.lastname;

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
        }
    },


    mounted() {
        this.callApartment()

    }
};
</script>

<template>
    <div class="container">
        <div class="actions">
            <router-link :to="{ name: 'research' }" class="button_back">
                <i class="fa fa-circle-left" aria-hidden="true"></i> Back
            </router-link>
        </div>
        <h2>{{ apartment.title }}</h2>
        <div class="row main">
            <div class="col-8 d-flex">
                <div class="apartment_heading">
                    <img v-if="apartment.image"
                        :src="apartment.image.startsWith('http') ? apartment.image : state.base_api + '/storage/' + apartment.image"
                        alt="Apartment Image" class="img w-100">
                    <img v-else src="https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png" alt="Image not available" class="img w-100">
                </div>

                <div class="description">
                    <strong>Description:</strong>
                    <p>{{ apartment.description }}</p>
                    <span class="credit_apartment">by {{ modName }} {{ modLastName }}</span>
                </div>

                <div id="map" class="map box_shadow"></div>
            </div>

            <div class="col-4">
                <div class="details box_shadow">
                    <h3>Details</h3>
                    <div class="services-card">
                        <div class="detail-item address">
                            <span class="badge bg-dark">
                                <strong><i class="fa-solid fa-map-pin"></i> Address:</strong>
                                {{ apartment.address }}, {{ apartment.street_number }}, {{ apartment.zip_code }}
                            </span>
                        </div>
                        <h4>Apartment Details</h4>
                        <div class="detail-pairs">
                            <div class="detail-item">
                                <span class="badge bg-dark">
                                    <i class="fa-solid fa-ruler-combined"></i>
                                    {{ apartment.square_meters }} m²
                                </span>
                            </div>
                            <div class="detail-item">
                                <span class="badge bg-dark">
                                    <strong><i class="fa-solid fa-person-booth"></i></strong>
                                    {{ apartment.rooms }} rooms
                                </span>
                            </div>
                            <div class="detail-item">
                                <span class="badge bg-dark">
                                    <strong><i class="fa-solid fa-bed"></i></strong>
                                    {{ apartment.beds }} beds
                                </span>
                            </div>
                            <div class="detail-item">
                                <span class="badge bg-dark">
                                    <strong><i class="fa-solid fa-toilet"></i></strong>
                                    {{ apartment.bathrooms }} bathrooms
                                </span>
                            </div>
                        </div>
                        <h4>Services</h4>
                        <div class="services">
                            <ul>
                                <li v-for="service in apartment.services" :key="service.id">{{ service.service_name }}</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="box_shadow my-5 rounded-5 form-container">
        <div class="form-header bg-dark text-white rounded-5 d-flex align-items-center justify-content-center">
            <h2>Contact Owner: {{ modName }} {{ modLastName }} </h2>
        </div>

        <div class="card_body p-3">
            <form @submit.prevent="handleForm" class="form-body">
                <div class="form-tag">
                    <label for="name" class="form-label">Name</label>
                    <input type="text" class="form-control" :class="{ 'is-invalid': nameError && nameTouched }"
                        id="name" v-model="name" required name="name" placeholder="Type your name"
                        @input="validateInput('name')">
                    <div class="error-message" v-if="nameError && nameTouched">{{ nameError }}</div>
                </div>
                <div class="form-tag">
                    <label for="lastname" class="form-label">Lastname</label>
                    <input type="text" class="form-control" :class="{ 'is-invalid': lastnameError && lastnameTouched }"
                        id="lastname" v-model="lastname" required name="lastname" placeholder="Type your lastname"
                        @input="validateInput('lastname')">
                    <div class="error-message" v-if="lastnameError && lastnameTouched">{{ lastnameError }}</div>
                </div>
                <div class="form-tag">
                    <label for="email" class="form-label">Your Email</label>
                    <input type="email" class="form-control" :class="{ 'is-invalid': emailError && emailTouched }"
                        id="sender_email" v-model="sender_email" required name="sender_email"
                        placeholder="Type your e-mail" @input="validateInput('sender_email')">
                    <div class="error-message" v-if="emailError && emailTouched">{{ emailError }}</div>
                </div>
                <div class="form-tag">
                    <label for="message" class="form-label">Message</label>
                    <textarea class="form-control" :class="{ 'is-invalid': contentError && contentTouched }" id="content"
                        rows="5" v-model="content" required name="content" placeholder="Type your message"
                        @input="validateInput('content')"></textarea>
                    <div class="error-message" v-if="contentError && contentTouched">{{ contentError }}</div>
                </div>
                <div class="alert" v-if="showAlert">
                    <span class="alert-message">* All fields are required!</span>
                </div>
                <button type="submit"
                    :class="[{ 'submit': true }, { 'disabled_button': !isValidForm || submittedForm || loading }]"
                    :disabled="!isValidForm || submittedForm || loading">
                    <span v-if="loading">Loading...</span>
                    <span v-else>Send Message</span>
                </button>
            </form>
            <div v-if="confirmSubmitForm" class="banner_form">
                The message has been successfully sent! Thanks {{ submittedName }} {{ submittedLastname }} for your
                contact.
            </div>
        </div>
    </div>
            </div>
        </div>
    </div>
</template>





<style scoped>
.container {
    padding: 2rem;
}

.actions {
    margin-bottom: 2rem;
}
.w-100 {
    width: 100%;
}
.row {
    display: flex;
    flex-wrap: nowrap;
    gap: 2rem;
}

.col-8,
.col-4 {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.img {
    border-radius: 30px;
    object-fit: cover;
    height: 400px;
    transition: transform 0.3s ease;
}


.description {
    padding: 2rem;
    background-color: white;
    border-radius: 30px;
    box-shadow: 0 0 10px rgba(124, 124, 124, 0.5);
    text-align: justify;
}

.credit_apartment {
    display: block;
    margin-top: 1rem;
    font-weight: 100;
    color: #6c6c6c;
    font-size: 0.9rem;
    font-style: italic;
}

.button_back {
    text-decoration: none;
    padding: 1rem 2rem;
    margin: 0;
    font-size: 1rem;
    border-radius: 2rem;
    color: #f8f9fa;
    background-color: #228e80;
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

.map {
    border-radius: 2rem;
    height: 400px;
}

.details {
    background: #f0f0f0;
    border-radius: 30px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.box_shadow {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.services-card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.detail-item {
    margin-top: 1rem;
}

.address {
    margin-bottom: 1.5rem;
}

.detail-pairs {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.detail-pairs .detail-item {
    flex: 1 1 45%; /* Adjust to control the width of each pair item */
}

.badge {
    background-color: #228e80;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 30px;
    display: inline-block;
    transition: transform 0.3s ease, background-color 0.3s ease;
}

.badge:hover {
    transform: scale(1.05);
    background-color: #1a6f65;
}

.services {
    margin-top: 1rem;
}

.services ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.services li {
    background-color: #228e80;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 30px;
    transition: background-color 0.3s ease;
}

.services li:hover {
    background-color: #1a6f65;
}

.form-container {
    background-color: #f0f0f0;
    border-radius: 30px;
    padding: 2rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 0 auto;
}

.form-header {
    background-color: #228e80;
    color: white;
    border-radius: 30px;
    padding: 1rem;
    text-align: center;
}

.form-body {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
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

.disabled_button {
    background-color: grey;
    cursor: not-allowed;
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


@media (max-width: 768px) {
    .main {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-flow: column;
        width: 100%;
    }
    .col-8, .col-4 {
        flex: 0 0 100%;
        width: 100%;
    }

    .form-header, .banner-header {
        text-align: center;
    }

    .map {
        height: 200px;
    }
}

@media (max-width: 576px) {
    .main {
        flex-flow: column;
    }
    .container {
        padding: 0.5em;
    }

    .form-header, .banner-header {
        font-size: 1em;
    }

    .box_shadow {
        padding: 0.5em;
    }
}

</style>



