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
        <div class="row d-flex">
            <div class="col-8">
                <div class="cards box_shadow">
                    <div class="card_top">
                        <div class="title_card">
                            <h2>{{ apartment.title }}</h2>
                        </div>
                    </div>
                    <div class="card_body">
                        <img v-if="apartment.image"
                            :src="apartment.image.startsWith('http') ? apartment.image : state.base_api + '/storage/' + apartment.image"
                            alt="Apartment Image" class="card-img img-fluid w-100"
                            style="object-fit: cover; height: 400px;">
                    </div>
                </div>
                <div class="description">
                    <strong>Description:</strong>
                    <p>{{ apartment.description }}</p>
                </div>

                <!-- Add Map -->
                <div id="map" class="box_shadow"></div>
            </div>
            <div class="col-4">
                <div class="cards box_shadow">
                    <div class="title_card bg_dark">
                        <h2>Details:</h2>
                    </div>
                    <div class="card_body">
                        <div class="d-flex services-card flex-wrap gap-1">
                            <div class="mb-4">
                                <h3 class="text-dark"><i class="fa-solid fa-map-pin me-2"></i>Address</h3>
                                <span class="badge bg-dark rounded-5 p-2 d-block">
                                    {{ apartment.address }}, {{ apartment.street_number }}, {{ apartment.zip_code }}
                                </span>

                                <div class="apartment-details mb-4">
                                    <h5 class="details-title"><i class="fa-solid fa-building details-icon"></i>Apartment
                                        Details</h5>
                                    <div class="row g-2">
                                        <div class="col-6">
                                            <span class="badge">
                                                <strong class="details-strong"><i
                                                        class="fa-solid fa-ruler-combined details-icon"></i></strong>
                                                {{ apartment.square_meters }} m²
                                            </span>
                                        </div>
                                        <div class="col-6">
                                            <span class="badge">
                                                <strong class="details-strong"><i
                                                        class="fa-solid fa-person-booth details-icon"></i></strong>
                                                {{ apartment.rooms }} rooms
                                            </span>
                                        </div>
                                        <div class="col-6">
                                            <span class="badge">
                                                <strong class="details-strong"><i
                                                        class="fa-solid fa-bed details-icon"></i></strong>
                                                {{ apartment.beds }} beds
                                            </span>
                                        </div>
                                        <div class="col-6">
                                            <span class="badge">
                                                <strong class="details-strong"><i
                                                        class="fa-solid fa-toilet details-icon"></i></strong>
                                                {{ apartment.bathrooms }} bathrooms
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <!-- Services -->
                                <div class="services">
                                    <strong>Services:</strong>
                                    <ul>
                                        <li v-for="service in apartment.services" :key="service.id">{{
                                            service.service_name
                                            }}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Form -->
            <div class="box_shadow my-5 rounded-5 form-container">
                <div class="form-header bg-dark text-white rounded-5 d-flex align-items-center justify-content-center">
                    <h2>Contact Owner: {{ modName }} {{ modLastName }} </h2>
                </div>

                <div class="card_body p-3">
                    <form @submit.prevent="handleForm" class="form-body d-flex">
                        <div class="form-tag">
                            <label for="name" class="form-label">Name</label>
                            <input type="text" class="form-control" :class="{ 'is-invalid': nameError && nameTouched }"
                                id="name" v-model="name" required name="name" placeholder="Type your name"
                                @input="validateInput('name')">
                            <div class="error-message" v-if="nameError && nameTouched">{{ nameError }}</div>
                        </div>
                        <div class="form-tag">
                            <label for="lastname" class="form-label">Lastname</label>
                            <input type="text" class="form-control"
                                :class="{ 'is-invalid': lastnameError && lastnameTouched }" id="lastname"
                                v-model="lastname" required name="lastname" placeholder="Type your lastname"
                                @input="validateInput('lastname')">
                            <div class="error-message" v-if="lastnameError && lastnameTouched">{{ lastnameError }}</div>
                        </div>
                        <div class="form-tag">
                            <label for="email" class="form-label">Your Email</label>
                            <input type="email" class="form-control"
                                :class="{ 'is-invalid': emailError && emailTouched }" id="sender_email"
                                v-model="sender_email" required name="sender_email" placeholder="Type your e-mail"
                                @input="validateInput('sender_email')">
                            <div class="error-message" v-if="emailError && emailTouched">{{ emailError }}</div>
                        </div>
                        <div class="form-tag">
                            <label for="text" class="form-label">Your Message</label>
                            <textarea type="text" class="form-control"
                                :class="{ 'is-invalid': textError && textTouched }" id="text" v-model="text" required
                                name="text" placeholder="Write your message" @input="validateInput('text')"></textarea>
                            <div class="error-message" v-if="textError && textTouched">{{ textError }}</div>
                        </div>
                        <button type="submit" class="btn btn-primary align-self-center submit">Send Message</button>
                    </form>
                    <div class="alert alert-success banner_form mt-3 mb-0" v-if="showBanner" role="alert">
                        <h4 class="alert-heading">Your message has been sent successfully</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
.container {
    padding: 1rem 0;
}

.row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.col-8 {
    flex: 0 0 calc(66.66% - 1rem);
}

.col-4 {
    flex: 0 0 calc(33.33% - 1rem);
}

.description {
    margin: 1rem 0.8rem;
}

#map {
    border-radius: 2rem;
    height: 400px;
    width: 100%;
    margin: 1rem 0 2rem -0.8rem;
    padding: 3rem 0;
}

img {
    border-radius: 0 0 3rem 3rem;
    width: 100%;
    object-fit: cover;
    height: 400px;
}

/* Card-section */
.cards {
    border-radius: 3rem;
    border: none;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    background-color: white;
    margin-bottom: 1rem;
}

.card_top {
    background-color: #343a40;
    border-radius: 2rem 2rem 0 0;
    color: white;
    padding: 1.5rem 1.5rem 1rem;
}

.title_card {
    padding: 1.5rem 1.5rem 1rem;
    color: white;
    border-radius: 2rem 2rem 0 0;
}

.card_body {
    padding: 1.5rem;
    border-radius: 0 0 3rem 3rem;
    flex-direction: column;
}

.services-card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
}

.badges {
    padding: 0.3rem;
    color: white;
    background-color: #343a40;
    border-radius: 0.5rem;
}

.services ul {
    list-style: none;
    padding: 0;
}

.form-container {
    border-radius: 3rem;
    border: none;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    margin: 1rem 0 2rem -0.8rem;
    background-color: white;
}

.form-header {
    align-items: center;
    justify-content: center;
    border-radius: 2rem 2rem 0 0;
    color: white;
    padding: 0.8rem 1.5rem 0.5rem;
    background-color: #343a40;
    margin-top: 1rem;
}

.form-body {
    padding: 0.5rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}

.form-control {
    min-height: 30px;
    border-radius: 0.3rem;
    border: 1px solid #ced4da;
    padding: 0.5rem;
}

.form-tag {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
}

.submit {
    align-self: center;
    padding: 0.5rem;
    background-color: #ff5a5f;
    border-color: #ff5a5f;
    border: none;
    border-radius: 5px;
    color: white;
}

.banner_form {
    padding: 1rem;
    margin-bottom: 1rem;
    margin-top: 0.5rem;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    color: #155724;
    background-color: #d4edda;
    border-color: #c3e6cb;
}

.error-message {
    border: 1px solid #FF0000;
    padding: 5px;
    color: #FF0000;
    font-size: 12px;
    font-weight: bold;
}

.is-invalid {
    border-color: #FF0000;
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
}

.services-card {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}


.mb-4 {
    margin-bottom: 1rem;
}

.text-dark {
    color: #343a40;
}


.me-2 {
    margin-right: 0.5rem;
}


.badge {
    display: block;
    padding: 0.5rem;
    color: white;
    background-color: #343a40;
    border-radius: 0.5rem;
    width: fit-content;
}

.apartment-details {
    margin-bottom: 1rem;
}


.details-title {
    font-size: 1.25rem;
    color: #343a40;
    margin-bottom: 0.5rem;
}


.details-icon {
    margin-right: 0.5rem;
    color: #343a40;
}


.badge {
    display: block;
    padding: 0.5rem;
    background-color: #343a40;
    color: white;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
}


.details-strong {
    font-weight: bold;
}
</style>
