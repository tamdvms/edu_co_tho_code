import request from 'superagent';
import { HOST } from './../contants/index';

class ProvinceApi {

    static getAll(data) {
        return request.post(`${HOST}frontend/province/getall`).send({ data });
    }
}

export default ProvinceApi;