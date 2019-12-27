import request from 'superagent';
import { HOST } from '../contants';

class MediaApi {
    static upload(upload) {
        return request.post(`${HOST}media/upload`)
            // .set("Content-Type", "application/octet-stream")
            // .send(upload);
            .attach('upload', upload);
    }

    static getList(data) {
        return request.post(`${HOST}media/getlist`).send({ data });
    }

    static updateStatus(data) {
        return request.post(`${HOST}media/updatestatus`).send({ data });
    }
}

export default MediaApi;