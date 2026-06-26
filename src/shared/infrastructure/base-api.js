import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export class BaseApi {
    #http;
    constructor() {
        this.#http = axios.create({ baseURL: BASE_URL });
    }
    get http() { return this.#http; }
}
