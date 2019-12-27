import request from 'superagent';
import { HOST } from './../contants/index';

class SubjectGroupApi {

    static getAll(data) {
        return request.post(`${HOST}frontend/subjectgroup/getall`).send({ data });
    }

}

export default SubjectGroupApi;