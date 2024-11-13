//src/app/api/axios.ts

import axios from "axios";

export const instance  = axios.create ({
    baseURL : "http://localhost:8080"
}); 

export const instance1  = axios.create ({
    baseURL : "http://localhost:8081"
}); 

export default instance;