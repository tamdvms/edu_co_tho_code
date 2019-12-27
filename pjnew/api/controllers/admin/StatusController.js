/**
 * StatusController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    // 901 dữ liệu gửi lên không hợp lệ
    // 902 có lỗi xảy ra, không có gì được thay đổi
    // 903 không tìm thấy dữ liệu trong database

    add: async (req, res) => {
        res.status(200);
        let code = 903, message = 'error';
        try {
            let { status } = req.param('data');
            let s = await Status.create(status).fetch();
            if (s) {
                let { session } = req.param('data');
                let tmp = await Login.findOne({ session: session });
                let iduser = JSON.parse(tmp.user).id;
                let log = await Logtime.create({ iduser: iduser, action: "add", collection: "status" });
                code = 200;
                message = 'success';
            } else {
                code = 902;
            }
        } catch (error) {
            code = 901;
        }
        return res.json({ code, message });
    },

    delete: async (req, res) => {
        res.status(200);
        let code = 901, message = 'error', { id } = req.param('data');
        if (id) {
            let rs = await Status.destroy({ id: id }).fetch();
            if (rs && rs.length !== 0) {
                let { session } = req.param('data');
                let tmp = await Login.findOne({ session: session });
                let iduser = JSON.parse(tmp.user).id;
                let log = await Logtime.create({ iduser: iduser, action: "delete", collection: "status" });
                code = 200;
                message = 'success';
            } else {
                code = 902;
            }
        }
        return res.json({ code, message });
    },

    // t
    update: async (req, res) => {
        res.status(200);
        let code = 903, message = 'error';
        try {
            let { status } = req.param('data');
            let s = await Status.update({ id: status.id }, status).fetch();
            if (s) {
                let { session } = req.param('data');
                let tmp = await Login.findOne({ session: session });
                let iduser = JSON.parse(tmp.user).id;
                let log = await Logtime.create({ iduser: iduser, action: "update", collection: "status" });
                code = 200;
                message = 'success';
            } else {
                code = 902;
            }
        } catch (error) {
            code = 901;
        }
        return res.json({ code, message });
    },

    // /status/getall/:page
    getAll: async (req, res) => {
        res.status(200);
        let code = 200, message = 'success', data = undefined, { page, status } = req.param('data');
        if (!page || page < 0) {
            page = 1;
        }
        let list = await Status.find({ status: status }).sort([{ name: 'ASC' }]).limit(11).skip((page - 1) * 10);
        if (list.length > 10) {
            data = {
                list: list.slice(0, 10),
                next: true
            }
        } else {
            data = {
                list,
                next: false
            }
        }
        return res.json({ code, message, data });
    },

    // /status/getone/:id
    getOne: async (req, res) => {
        res.status(200);
        let code = 903, message = 'error', data = undefined, { id = '' } = req.param('data');
        data = await Status.findOne({ id: id });
        if (data) {
            code = 200;
            message = 'success';
        }
        return res.json({ code, message, data });
    }

};

