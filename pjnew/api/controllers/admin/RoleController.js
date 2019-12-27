/**
 * RoleController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    // 701 dữ liệu gửi lên không hợp lệ
    // 702 có lỗi xảy ra, không có gì được thay đổi
    // 703 không tìm thấy dữ liệu trong database

    add: async (req, res) => {
        res.status(200);
        let code = 703, message = 'error';
        try {
            let { role } = req.param('data');
            role.roles = JSON.stringify(role.roles);
            let s = await Role.create(role).fetch();
            if (s) {
                let { session } = req.param('data');
                let tmp = await Login.findOne({ session: session });
                let iduser = JSON.parse(tmp.user).id;
                let log = await Logtime.create({ iduser: iduser, action: "add", collection: "role" });
                code = 200;
                message = 'success';
            } else {
                code = 702;
            }
        } catch (error) {
            code = 701;
        }
        return res.json({ code, message });
    },

    delete: async (req, res) => {
        res.status(200);
        let code = 701, message = 'error', { id } = req.param('data');
        if (id) {
            let rs = await Role.destroy({ id: id }).fetch();
            if (rs && rs.length !== 0) {
                let { session } = req.param('data');
                let tmp = await Login.findOne({ session: session });
                let iduser = JSON.parse(tmp.user).id;
                let log = await Logtime.create({ iduser: iduser, action: "delete", collection: "role" });
                code = 200;
                message = 'success';
            } else {
                code = 702;
            }
        }
        return res.json({ code, message });
    },

    // t
    update: async (req, res) => {
        res.status(200);
        let code = 703, message = 'error';
        try {
            let { role } = req.param('data');
            role.roles = JSON.stringify(role.roles);
            let r = await Role.update({ id: role.id }, role).fetch();
            if (r) {
                let { session } = req.param('data');
                let tmp = await Login.findOne({ session: session });
                let iduser = JSON.parse(tmp.user).id;
                let log = await Logtime.create({ iduser: iduser, action: "update", collection: "role" });
                code = 200;
                message = 'success';
            } else {
                code = 702;
            }
        } catch (error) {
            code = 701;
        }
        return res.json({ code, message });
    },

    // /major/getall/:page
    getAll: async (req, res) => {
        res.status(200);
        let code = 200, message = 'success', data = undefined, { page, status } = req.param('data');
        if (!page || page < 0) {
            page = 1;
        }
        let list = await Role.find({ status: status }).sort([{ name: 'ASC' }]).limit(11).skip((page - 1) * 10).populate('status');
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

    // /major/getone/:id
    getOne: async (req, res) => {
        res.status(200);
        let code = 703, message = 'error', data = undefined, { id = '' } = req.param('data');
        data = await Role.findOne({ id: id });
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
            let s = await Role.update({ id }).set({ status }).fetch();
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

