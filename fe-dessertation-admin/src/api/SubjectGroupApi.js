import request from 'superagent';
import { HOST } from './../contants/index';

class SubjectGroupApi {
    static add(data) {
        return request.post(`${HOST}subjectgroup/add`).send({ data });
    }

    static update(data) {
        return request.post(`${HOST}subjectgroup/update`).send({ data });
    }

    static delete(data) {
        return request.post(`${HOST}subjectgroup/delete`).send({ data });
    }

    static getAll(data) {
        return request.post(`${HOST}subjectgroup/getall`).send({ data });
    }

    static getOne(data) {
        return request.post(`${HOST}subjectgroup/getone`).send({ data });
    }

    static updateStatus(data) {
        return request.post(`${HOST}subjectgroup/updatestatus`).send({ data });
    }
}

export default SubjectGroupApi;