import instance from './instance'
import getAPI from './auth'

export default {
    auth: getAPI(instance)
}