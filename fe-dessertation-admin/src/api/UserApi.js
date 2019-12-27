import request from 'superagent';
import { HOST } from './../contants/index';

class UserApi {
    static add(data) {
        return request.post(`${HOST.substring(0, HOST.indexOf('admin/'))}user/add`).send({ data });
    }

    static update(data) {
        return request.post(`${HOST.substring(0, HOST.indexOf('admin/'))}user/update`).send({ data });
    }

    static delete(data) {
        return request.post(`${HOST.substring(0, HOST.indexOf('admin/'))}user/delete`).send({ data });
    }

    static getAll(data) {
        return request.post(`${HOST.substring(0, HOST.indexOf('admin/'))}user/getall`).send({ data });
    }

    static getOne(data) {
        return request.post(`${HOST.substring(0, HOST.indexOf('admin/'))}user/getone`).send({ data });
    }

    static updateStatus(data) {
        return request.post(`${HOST.substring(0, HOST.indexOf('admin/'))}user/updatestatus`).send({ data });
    }
    
    static login(data) {
        return request.post(`${HOST.substring(0, HOST.indexOf('admin/'))}user/loginadmin`).send({ data });
    }

    static logout(data) {
        return request.post(`${HOST.substring(0, HOST.indexOf('admin/'))}user/logout`).send({ data });
    }

    static checkSession(data) {
        return request.post(`${HOST.substring(0, HOST.indexOf('admin/'))}user/checksession`).send({ data });
    }
}

export default UserApi;