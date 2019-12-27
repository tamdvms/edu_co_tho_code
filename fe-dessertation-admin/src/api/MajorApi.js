import request from 'superagent';
import { HOST } from './../contants/index';

class MajorApi {
    static add(data) {
        return request.post(`${HOST}major/add`).send({ data });
    }

    static update(data) {
        return request.post(`${HOST}major/update`).send({ data });
    }

    static delete(data) {
        return request.post(`${HOST}major/delete`).send({ data });
    }

    static getAll(data) {
        return request.post(`${HOST}major/getall`).send({ data });
    }

    static getOne(data) {
        return request.post(`${HOST}major/getone`).send({ data });
    }

    static getAllInSchool(data) {
        return request.post(`${HOST}major/getallinschool`).send({ data });
    }

    static updateStatus(data) {
        return request.post(`${HOST}major/updatestatus`).send({ data });
    }
}

export default MajorApi;