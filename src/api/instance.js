import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://help.golden.net.ua',
    headers: {

        accept: "application/json"
    }
})

export default instance