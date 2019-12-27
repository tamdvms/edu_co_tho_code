import request from 'superagent';
import { HOST } from './../contants/index';

class UserApi {
    static login(data) {
        return request.post(`${HOST}user/login`).send({ data });
    }

    static logout(data) {
        return request.post(`${HOST}user/logout`).send({ data });
    }

    static register(data) {
        return request.post(`${HOST}user/register`).send({ data });
    }

    static forgotPassword(data) {
        return request.post(`${HOST}user/getkey`).send({ data });
    }

    static changePassword(data) {
        return request.post(`${HOST}user/resetpass`).send({ data });
    }

    static updateUser(data) {
        return request.post(`${HOST}user/updateprofile`).send({ data });
    }

    static loginSession(data) {
        return request.post(`${HOST}user/loginsession`).send({ data });
    }

    static loginFacebook(data) {
        return request.post(`${HOST}user/loginfacebook`).send({ data });
    }
}

export default UserApi;