import request from 'superagent';
import { HOST } from './../contants/index';

class SchoolApi {
    static add(data) {
        return request.post(`${HOST}school/add`).send({ data });
    }

    static update(data) {
        return request.post(`${HOST}school/update`).send({ data });
    }

    static delete(data) {
        return request.post(`${HOST}school/delete`).send({ data });
    }

    static getAll(data) {
        return request.post(`${HOST}school/getall`).send({ data });
    }

    static getOne(data) {
        return request.post(`${HOST}school/getone`).send({ data });
    }

    static updateStatus(data) {
        return request.post(`${HOST}school/updatestatus`).send({ data });
    }
}

export default SchoolApi;