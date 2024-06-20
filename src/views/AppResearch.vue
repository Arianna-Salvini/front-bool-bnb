<script>

import axios from 'axios';
import { state } from '../state.js';


export default {
    name: 'AppResearch',
    components: {

    },
    data() {
        return {
            state: state,
            results: []
        }
    },
    methods: {

    },
    mounted() {
        console.log(this.$route.query.results);
        //initialize results as empty array and reassign results -> results are in json -> must convert back to object
        this.results = JSON.parse(this.$route.query.results);
    }
};
</script>

<template>

    <!-- <p>{{ results }}</p> -->
    <ul v-if="results.length != 0">
        <li v-for="result in results">{{ result.title }}</li>
    </ul>


</template>

<style></style>
