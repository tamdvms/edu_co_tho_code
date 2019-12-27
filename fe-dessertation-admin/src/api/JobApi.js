import request from 'superagent';
import { HOST } from './../contants/index';

class JobApi {
    static add(data) {
        return request.post(`${HOST}job/add`).send({ data });
    }

    static update(data) {
        return request.post(`${HOST}job/update`).send({ data });
    }

    static delete(data) {
        return request.post(`${HOST}job/delete`).send({ data });
    }

    static getAll(data) {
        return request.post(`${HOST}job/getall`).send({ data });
    }

    static getOne(data) {
        return request.post(`${HOST}job/getone`).send({ data });
    }

    static updateStatus(data) {
        return request.post(`${HOST}job/updatestatus`).send({ data });
    }
}

export default JobApi;