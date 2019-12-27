import request from 'superagent';
import { HOST } from './../contants/index';

class RoleApi {
    static add(data) {
        return request.post(`${HOST}role/add`).send({ data });
    }

    static update(data) {
        return request.post(`${HOST}role/update`).send({ data });
    }

    static delete(data) {
        return request.post(`${HOST}role/delete`).send({ data });
    }

    static getAll(data) {
        return request.post(`${HOST}role/getall`).send({ data });
    }

    static getOne(data) {
        return request.post(`${HOST}role/getone`).send({ data });
    }

    static updateStatus(data) {
        return request.post(`${HOST}role/updatestatus`).send({ data });
    }
}

export default RoleApi;