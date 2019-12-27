import request from 'superagent';
import { HOST } from './../contants/index';

class SubjectApi {
    static add(data) {
        return request.post(`${HOST}subject/add`).send({ data });
    }

    static update(data) {
        return request.post(`${HOST}subject/update`).send({ data });
    }

    static delete(data) {
        return request.post(`${HOST}subject/delete`).send({ data });
    }

    static getAll(data) {
        return request.post(`${HOST}subject/getall`).send({ data });
    }

    static getOne(data) {
        return request.post(`${HOST}subject/getone`).send({ data });
    }

    static updateStatus(data) {
        return request.post(`${HOST}subject/updatestatus`).send({ data });
    }
}

export default SubjectApi;