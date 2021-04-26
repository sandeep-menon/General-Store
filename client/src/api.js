import axios from 'axios';
const url = '/api';

export default class API {
    static async getAllProducts() {
        const res = await axios.get(url + "/products");
        return res.data;
    }

    static async createProduct(data) {
        const res = await axios.post(url + "/newProduct", data);
        return res.data;
    }

    static async updateProduct(data) {
        const res = await axios.patch(`${url}/product/${data.id}`, data);
        return res.data;
    }

    static async deleteProduct(data) {
        const res = await axios.delete(`${url}/product/${data.id}`, data);
        return res.data;
    }

    static async fetchAllOrders() {
        const res = await axios.get(`${url}/orders`);
        return res.data;
    }

    static async createOrder(data) {
        const res = await axios.post(`${url}/newOrder`, data);
        return res.data;
    }
}