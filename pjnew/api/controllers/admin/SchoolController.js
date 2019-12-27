/**
 * SchoolController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    // 301 dữ liệu gửi lên không hợp lệ
    // 302 có lỗi xảy ra, không có gì được thay đổi
    // 303 không tìm thấy dữ liệu trong database

    add: async (req, res) => {
        res.status(200);
        let code = 303, message = 'error';
        try {
            let { school } = req.param('data');
            let province = await Province.findOne({ id: school.province });
            if (province) {
                let s = await School.create(school).fetch();
                if (s) {
                    let { session } = req.param('data');
                    let tmp = await Login.findOne({ session: session });
                    let iduser = JSON.parse(tmp.user).id;
                    let log = await Logtime.create({ iduser: iduser, action: "add", collection: "school" });
                    code = 200;
                    message = 'success';
                } else {
                    code = 302;
                }
            }
        } catch (error) {
            code = 301;
        }
        return res.json({ code, message });
    },

    delete: async (req, res) => {
        res.status(200);
        let code = 301, message = 'error';
        let { id } = req.param('data');
        if (id) {
            let rs = await School.destroy({ id: id }).fetch();
            if (rs && rs.length !== 0) {
                let { session } = req.param('data');
                let tmp = await Login.findOne({ session: session });
                let iduser = JSON.parse(tmp.user).id;
                let log = await Logtime.create({ iduser: iduser, action: "delete", collection: "school" });
                code = 200;
                message = 'success';
            } else {
                code = 302;
            }
        }
        return res.json({ code, message });
    },

    // t
    update: async (req, res) => {
        res.status(200);
        let code = 303, message = 'error';
        try {
            let { school } = req.param('data');
            let province = await Province.findOne({ id: school.province });
            if (province) {
                let s = await School.update({ id: school.id }, school).fetch();
                if (s) {
                    let { session } = req.param('data');
                    let tmp = await Login.findOne({ session: session });
                    let iduser = JSON.parse(tmp.user).id;
                    let log = await Logtime.create({ iduser: iduser, action: "update", collection: "school" });
                    code = 200;
                    message = 'success';
                } else {
                    code = 302;
                }
            }
        } catch (error) {
            code = 301;
        }
        return res.json({ code, message });
    },

    // /school/getall/:page
    getAll: async (req, res) => {
        res.status(200);
        let code = 200, message = 'success', data = undefined, { page, province, status } = req.param('data');
        if (!page || page < 0) {
            page = 1;
        }
        let list = await School.find({ province: province, status: status }).sort([{ name: 'ASC' }]).limit(11).skip((page - 1) * 10).populate('province').populate('status');
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

    // /school/getone/:id
    getOne: async (req, res) => {
        res.status(200);
        let code = 303, message = 'error', data = undefined, { id = '' } = req.param('data');
        data = await School.findOne({ id: id }).populate('province');
        if (data) {
            code = 200;
            message = 'success';
        }
        return res.json({ code, message, data });
    },

    updateStatus: async (req, res) => {
        res.status(200);
        let code = 403, message = 'error';
        try {
            let { id, status } = req.param('data');
            let s = await School.update({ id }).set({ status }).fetch();
            if (s) {
                code = 200;
                message = 'success';
            } else {
                code = 402;
            }
        } catch (error) {
            code = 401;
        }
        return res.json({ code, message });
    }

};

