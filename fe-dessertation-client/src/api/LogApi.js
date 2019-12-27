// Lưu lại thao tác người dùng
import request from 'superagent';
import { HOST } from './../contants/index';

class MajorApi {

    static logView(data) {
        return request.post(`${HOST}frontend/suggest/log`).send({ data });
    }
}

export default MajorApi;