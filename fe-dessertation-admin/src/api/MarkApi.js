import request from 'superagent';
import { HOST } from './../contants/index';

class MarkApi {
    static add(data) {
        return request.post(`${HOST}mark/add`).send({ data });
    }

    static update(data) {
        return request.post(`${HOST}mark/update`).send({ data });
    }

    static delete(data) {
        return request.post(`${HOST}mark/delete`).send({ data });
    }

    static getAll(data) {
        return request.post(`${HOST}mark/getall`).send({ data });
    }

    static getOne(data) {
        return request.post(`${HOST}mark/getone`).send({ data});
    }

    static updateStatus(data) {
        return request.post(`${HOST}mark/updatestatus`).send({ data });
    }
}

export default MarkApi;