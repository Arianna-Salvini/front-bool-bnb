import { reactive } from "vue";
import { serviceIcons } from "../public/js/serviceIcons";

export const state = reactive({

    base_api: 'http://127.0.0.1:8000',
    apartment_url: '/api/apartments',
    serviceIcons: serviceIcons,
    searchResults: [],
    updateResults(results) {
        this.searchResults = results
    }
})