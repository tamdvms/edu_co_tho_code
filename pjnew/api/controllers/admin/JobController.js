/**
 * JobController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

/**
 * StatusController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    // 1001 dữ liệu gửi lên không hợp lệ
    // 1002 có lỗi xảy ra, không có gì được thay đổi
    // 1003 không tìm thấy dữ liệu trong database

    add: async (req, res) => {
        res.status(200);
        let code = 1003, message = 'error';
        try {
            let { myJob } = req.param('data');
            let n = await Job.create(myJob).fetch();
            if (n) {
                let { session } = req.param('data');
                let tmp = await Login.findOne({ session: session });
                let iduser = JSON.parse(tmp.user).id;
                let log = await Logtime.create({ iduser: iduser, action: "add", collection: "Job" });
                code = 200;
                message = 'success';
            } else {
                code = 1002;
            }
        } catch (error) {
            code = 1001;
        }
        return res.json({ code, message });
    },

    delete: async (req, res) => {
        res.status(200);
        let code = 1001, message = 'error', { id } = req.param('data');
        if (id) {
            let rs = await Job.destroy({ id }).fetch();
            if (rs && rs.length !== 0) {
                let { session } = req.param('data');
                let tmp = await Login.findOne({ session });
                let iduser = JSON.parse(tmp.user).id;
                let log = await Logtime.create({ iduser: iduser, action: "delete", collection: "Job" });
                code = 200;
                message = 'success';
            } else {
                code = 1002;
            }
        }
        return res.json({ code, message });
    },

    // t
    update: async (req, res) => {
        res.status(200);
        let code = 903, message = 'error';
        try {
            let { myJob } = req.param('data');
            // myJob.createdAt = Job Date(myJob.createdAt);
            // myJob.updatedAt = Job Date();
            let s = await Job.update({ id: myJob.id }, myJob).fetch();
            if (s) {
                let { session } = req.param('data');
                let tmp = await Login.findOne({ session: session });
                let iduser = JSON.parse(tmp.user).id;
                let log = await Logtime.create({ iduser: iduser, action: "update", collection: "Job" });
                code = 200;
                message = 'success';
            } else {
                code = 1002;
            }
        } catch (error) {
            code = 1001;
        }
        return res.json({ code, message });
    },

    getAll: async (req, res) => {
        res.status(200);
        let code = 200, message = 'success', data = undefined, { page, status } = req.param('data');
        if (!page || page < 0) {
            page = 1;
        }
        let list = await Job.find({ status }).sort([{ title: 'ASC' }]).limit(11).skip((page - 1) * 10).populate('status');
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

    getOne: async (req, res) => {
        res.status(200);
        let code = 903, message = 'error', data = undefined, { id = '' } = req.param('data');
        data = await Job.findOne({ id }).populate('status');
        if (data) {
            code = 200;
            message = 'success';
        }
        return res.json({ code, message, data });
    },

    updateStatus: async (req, res) => {
        res.status(200);
        let code = 1003, message = 'error';
        try {
            let { id, status } = req.param('data');
            let s = await Job.update({ id }).set({ status }).fetch();
            if (s) {
                code = 200;
                message = 'success';
            } else {
                code = 1002;
            }
        } catch (error) {
            code = 1001;
        }
        return res.json({ code, message });
    }

};


