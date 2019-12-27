/**
 * SubjectGroupController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    // 601 dữ liệu gửi lên không hợp lệ
    // 602 có lỗi xảy ra, không có gì được thay đổi
    // 603 không tìm thấy dữ liệu trong database

    add: async (req, res) => {
        res.status(200);
        let code = 603, message = 'error';
        try {
            let { subjectGroup } = req.param('data');
            for (let i = 0; i < subjectGroup.subjects.length; i++) {
                try {
                    let sub = await Subject.findOne({ id: subjectGroup.subjects[i] });
                    if (!sub) {
                        return res.json({ code, message });
                    }
                } catch (error) {
                    return res.json({ code, message });
                }
            }
            subjectGroup.subjects = JSON.stringify(subjectGroup.subjects);
            let s = await SubjectGroup.create(subjectGroup).fetch();
            if (s) {
                let { session } = req.param('data');
                let tmp = await Login.findOne({ session: session });
                let iduser = JSON.parse(tmp.user).id;
                let log = await Logtime.create({ iduser: iduser, action: "add", collection: "subjectgroup" });
                code = 200;
                message = 'success';
            } else {
                code = 602;
            }
        } catch (error) {
            code = 601;
        }
        return res.json({ code, message });
    },

    delete: async (req, res) => {
        res.status(200);
        let code = 601, message = 'error', { id } = req.param('data');
        if (id) {
            let rs = await SubjectGroup.destroy({ id: id }).fetch();
            if (rs && rs.length !== 0) {
                let { session } = req.param('data');
                let tmp = await Login.findOne({ session: session });
                let iduser = JSON.parse(tmp.user).id;
                let log = await Logtime.create({ iduser: iduser, action: "delete", collection: "subjectgroup" });
                code = 200;
                message = 'success';
            } else {
                code = 602;
            }
        }
        return res.json({ code, message });
    },

    // t
    update: async (req, res) => {
        res.status(200);
        let code = 603, message = 'error';
        try {
            let { subjectGroup } = req.param('data');
            for (let i = 0; i < subjectGroup.subjects.length; i++) {
                try {
                    let sub = await Subject.findOne({ id: subjectGroup.subjects[i] });
                    if (!sub) {
                        return res.json({ code, message });
                    }
                } catch (error) {
                    return res.json({ code, message });
                }
            }
            subjectGroup.subjects = JSON.stringify(subjectGroup.subjects);
            let s = await SubjectGroup.update({ id: subjectGroup.id }, subjectGroup).fetch();
            if (s) {
                let { session } = req.param('data');
                let tmp = await Login.findOne({ session: session });
                let iduser = JSON.parse(tmp.user).id;
                let log = await Logtime.create({ iduser: iduser, action: "update", collection: "subjectgroup" });
                code = 200;
                message = 'success';
            } else {
                code = 602;
            }
        } catch (error) {
            code = 601;
        }
        return res.json({ code, message });
    },

    // /subjectGroup/getall/:page
    getAll: async (req, res) => {
        res.status(200);
        let code = 200, message = 'success', data = undefined, { page, status } = req.param('data');
        if (!page || page < 0) {
            page = 1;
        }
        let list = await SubjectGroup.find({ status: status }).sort([{ code: 'ASC' }]).limit(11).skip((page - 1) * 10).populate('status');
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
        let tmp;
        for (let i = 0; i < data.list.length; i++) {
            tmp = await Subject.find({
                id: {
                    in: JSON.parse(data.list[i].subjects)
                }
            });
            data.list[i].subjects = tmp;
        }
        return res.json({ code, message, data });
    },

    // /subjectGroup/getone/:id
    getOne: async (req, res) => {
        res.status(200);
        let code = 603, message = 'error', data = undefined, { id = '' } = req.param('data');
        data = await SubjectGroup.findOne({ id: id });
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
            let s = await SubjectGroup.update({ id }).set({ status }).fetch();
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
