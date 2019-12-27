import request from 'superagent';
import { HOST } from './../contants/index';

class NewApi {
    static add(data) {
        return request.post(`${HOST}new/add`).send({ data });
    }

    static update(data) {
        return request.post(`${HOST}new/update`).send({ data });
    }

    static delete(data) {
        return request.post(`${HOST}new/delete`).send({ data });
    }

    static getAll(data) {
        return request.post(`${HOST}new/getall`).send({ data });
    }

    static getOne(data) {
        return request.post(`${HOST}new/getone`).send({ data });
    }

    static updateStatus(data) {
        return request.post(`${HOST}new/updatestatus`).send({ data });
    }
}

export default NewApi;