import request from 'superagent';
import { HOST } from './../contants/index';

class MarkApi {

    static getAll(data) {
        return request.post(`${HOST}frontend/mark/getlist`).send({ data });
    }
}

export default MarkApi;