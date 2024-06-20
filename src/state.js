import { reactive } from "vue";

export const state = reactive({

    base_api: 'http://127.0.0.1:8000',
    apartment_url: '/api/apartments',
    searchResults: [],
    updateResults(results) {
        this.searchResults = results
    }
})