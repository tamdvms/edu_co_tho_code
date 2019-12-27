import request from 'superagent';
import { HOST } from '../contants';

class StateApi {
    static add(data) {
        return request.post(`${HOST}status/add`).send({ data });
    }

    static update(data) {
        return request.post(`${HOST}status/update`).send({ data });
    }

    static delete(data) {
        return request.post(`${HOST}status/delete`).send({ data });
    }

    static getAll(data) {
        return request.post(`${HOST}status/getall`).send({ data });
    }

    static getOne(data) {
        return request.post(`${HOST}status/getone`).send({ data });
    }
}

export default StateApi;