import request from 'superagent';
import { HOST } from './../contants/index';

class NewApi {
    static getAll(data) {
        return request.post(`${HOST}frontend/new/getall`).send({ data });
    }

    static getOne(data) {
        return request.post(`${HOST}frontend/new/getone`).send({ data });
    }
}

export default NewApi;