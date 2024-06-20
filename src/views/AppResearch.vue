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
            results: state.searchResults
        }
    },
    methods: {

    },
    mounted() {
        console.log(state.searchResults);
        //console.log(this.$route.query.results);
        //initialize results as empty array and reassign results -> results are in json -> must convert back to object

    }
};
</script>

<template>

    <section id="search-results">

    </section>
    <ul v-if="results.length != 0">
        <li v-for="result in results">{{ result.title }}</li>
    </ul>


</template>

<style></style>
