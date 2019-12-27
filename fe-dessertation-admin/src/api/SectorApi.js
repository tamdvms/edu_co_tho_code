import request from 'superagent';
import { HOST } from './../contants/index';

class SectorApi {
    static add(data) {
        return request.post(`${HOST}sector/add`).send({ data });
    }

    static update(data) {
        return request.post(`${HOST}sector/update`).send({ data });
    }

    static delete(data) {
        return request.post(`${HOST}sector/delete`).send({ data });
    }

    static getAll(data) {
        return request.post(`${HOST}sector/getall`).send({ data });
    }

    static getOne(data) {
        return request.post(`${HOST}sector/getone`).send({ data });
    }

    static updateStatus(data) {
        return request.post(`${HOST}sector/updatestatus`).send({ data });
    }
}

export default SectorApi;