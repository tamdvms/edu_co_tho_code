import request from 'superagent';
import { HOST } from './../contants/index';

class ProvinceApi {
    static add(data) {
        return request.post(`${HOST}province/add`).send({ data });
    }

    static update(data) {
        return request.post(`${HOST}province/update`).send({ data });
    }

    static delete(data) {
        return request.post(`${HOST}province/delete`).send({ data});
    }

    static getAll(data) {
        return request.post(`${HOST}province/getall`).send({ data });
    }

    static getOne(data) {
        return request.post(`${HOST}province/getone`).send({ data});
    }

    static updateStatus(data) {
        return request.post(`${HOST}province/updatestatus`).send({ data });
    }
}

export default ProvinceApi;