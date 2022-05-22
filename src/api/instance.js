import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://help.golden.net.ua',
    headers: {

        accept: "application/json"
    }
})

export default instance