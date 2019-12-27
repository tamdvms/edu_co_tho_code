/**
 * MajorController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    // 01 dữ liệu gửi lên không hợp lệ
    // 02 có lỗi xảy ra, không có gì được thay đổi
    // 03 không tìm thấy dữ liệu trong database

    add: async (req, res) => {
        res.status(200);
        let code = 03, message = 'error';
        try {
            let { major } = req.param('data');
            let school = await School.findOne({ id: major.school });
            if (school) {
                let s = await Major.create(major).fetch();
                if (s) {
                    let { session } = req.param('data');
                    let tmp = await Login.findOne({ session: session });
                    let iduser = JSON.parse(tmp.user).id;
                    let log = await Logtime.create({ iduser: iduser, action: "add", collection: "major" });
                    code = 200;
                    message = 'success';

                } else {
                    code = 02;
                }
            }
        } catch (error) {
            code = 01;
        }
        res.json({ code: code, message: message });
    },

    delete: async (req, res) => {
        res.status(200);
        let code = 03, message = 'error';
        let { id } = req.param('data');
        if (id) {
            let rs = await Major.destroy({ id: id }).fetch();
            if (rs && rs.length !== 0) {
                let { session } = req.param('data');
                let tmp = await Login.findOne({ session: session });
                let iduser = JSON.parse(tmp.user).id;
                let log = await Logtime.create({ iduser: iduser, action: "delete", collection: "major" });
                code = 200;
                message = 'success';

            } else {
                code = 02;
            }
        }
        res.json({ code: code, message: message });
    },

    // t
    update: async (req, res) => {
        res.status(200);
        let code = 03, message = 'error';
        try {
            let { major } = req.param('data');
            let school = await School.findOne({ id: major.school });
            if (school) {
                let s = await Major.update({ id: major.id }, major).fetch();
                if (s) {
                    let { session } = req.param('data');
                    let tmp = await Login.findOne({ session: session });
                    let iduser = JSON.parse(tmp.user).id;
                    let log = await Logtime.create({ iduser: iduser, action: "update", collection: "major" });
                    code = 200;
                    message = 'success';

                } else {
                    code = 02;
                }
            }
        } catch (error) {
            code = 01;
        }
        res.json({ code: code, message: message });
    },

    //major/getall/:page
    getAll: async (req, res) => {
        res.status(200);
        let code = 200, data = null, message = 'success', { page, school, status } = req.param('data');
        if (!page || page < 0) {
            page = 1;
        }
        let list = await Major.find({ status: status, school: school }).sort([{ name: 'ASC' }]).limit(11).skip((page - 1) * 10).populate('school').populate('status');
        if (list.length > 10) {
            data = {
                list: list.splice(0, 10),
                next: true
            }
        } else {
            data = {
                list,
                next: false
            }
        }
        res.json({ code, message, data });
    },

    // /major/getone/:id
    getOne: async (req, res) => {
        res.status(200);
        let rs = {
            code: 03,
            message: 'error'
        }
        let { id = '-1' } = req.param('data');;
        let major = await Major.findOne({ id: id }).populate('school');
        if (major) {
            rs.code = 200;
            rs.message = 'success';
            rs.data = major
        }
        return res.json(rs);
    },

    // get all major with id school
    getAllInSchool: async (req, res) => {
        res.status(200);
        let code = 200, data = null, message = 'success', { school = '' } = req.param('data');
        let list = await Major.find({ school: school });
        data = {
            list,
            next: false
        }
        return res.json({ code, message, data });
    },

    updateStatus: async (req, res) => {
        res.status(200);
        let code = 403, message = 'error';
        try {
            let { id, status } = req.param('data');
            let s = await Major.update({ id }).set({ status }).fetch();
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

