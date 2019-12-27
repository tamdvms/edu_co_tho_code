import request from 'superagent';
import { HOST } from './../contants/index';

class MajorApi {

    static getAll() {
        return request.post(`${HOST}frontend/majormain/getall`);
    }
}

export default MajorApi;