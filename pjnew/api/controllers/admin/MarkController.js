/**
 * MarkController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    // 101 dữ liệu gửi lên không hợp lệ
    // 102 có lỗi xảy ra, không có gì được thay đổi
    // 103 không tìm thấy dữ liệu trong database

    // t
    add: async (req, res) => {
        res.status(200);
        let code = 103, message = 'error';
        try {
            let { mark } = req.param('data');
            for (let i = 0; i < mark.subjectGroups.length; i++) {
                try {
                    let sg = await SubjectGroup.findOne({ id: mark.subjectGroups[i] });
                    if (!sg) {
                        return res.json({ code, message });
                    }
                } catch (error) {
                    code = 101;
                    return res.json({ code, message });
                }
            }
            mark.subjectGroups = JSON.stringify(mark.subjectGroups);
            let s = await Mark.create(mark).fetch();
            if (s) {
                let { session } = req.param('data');
                let tmp = await Login.findOne({ session: session });
                let iduser = JSON.parse(tmp.user).id;
                Logtime.create({ iduser: iduser, action: "add", collection: "mark" })
                code = 200;
                message = 'success';
            } else {
                code = 102;
            }
        } catch (error) {
            console.log(error);
            code = 101;
        }
        return res.json({ code, message });
    },

    delete: async (req, res) => {
        res.status(200);
        let code = 101, message = 'error', { id = '' } = req.param('data');
        if (id) {
            let rs = await Mark.destroy({ id: id }).fetch();
            if (rs && rs.length !== 0) {
                let { session } = req.param('data');
                let tmp = await Login.findOne({ session: session });
                let iduser = JSON.parse(tmp.user).id;
                let log = await Logtime.create({ iduser: iduser, action: "delete", collection: "mark" });
                code = 200;
                message = 'success';
            } else {
                code = 102;
            }
        }
        return res.json({ code, message });
    },

    // t
    update: async (req, res) => {
        res.status(200);
        let code = 103, message = 'error';
        try {
            let { mark } = req.param('data');
            for (let i = 0; i < mark.subjectGroups.length; i++) {
                try {
                    let sg = await SubjectGroup.findOne({ id: mark.subjectGroups[i] });
                    if (!sg) {
                        return res.json({ code, message });
                    }
                } catch (error) {
                    code = 101;
                    return res.json({ code, message });
                }
            }
            mark.subjectGroups = JSON.stringify(mark.subjectGroups);
            let major = await Major.findOne({ id: mark.major });
            let school = await School.findOne({ id: mark.school });
            if (major && school) {
                let s = await Mark.update({ id: mark.id }, mark).fetch();
                if (s) {
                    let { session } = req.param('data');
                    let tmp = await Login.findOne({ session: session });
                    let iduser = JSON.parse(tmp.user).id;
                    let log = await Logtime.create({ iduser: iduser, action: "update", collection: "mark" });
                    code = 200;
                    message = 'success';
                } else {
                    code = 102;
                }
            }
        } catch (error) {
            code = 101;
        }
        return res.json({ code, message });
    },

    // /mark/getall/:page
    getAll: async (req, res) => {
        res.status(200);
        let code = 200, message = 'success', data = undefined, { page, status, school, major, year } = req.param('data');
        if (!page || page < 0) {
            page = 1;
        }
        let list = await Mark.find({ status: status, school: school, major: major, year: year }).sort([{ mark: 'DESC' }]).limit(11).skip((page - 1) * 10).populate('major').populate('school').populate('status');
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
            tmp = await SubjectGroup.find({
                id: {
                    in: JSON.parse(data.list[i].subjectGroups)
                }
            });
            data.list[i].subjectGroups = tmp;
        }
        return res.json({ code, message, data });
    },

    // /mark/getone/:id
    getOne: async (req, res) => {
        res.status(200);
        let code = 103, message = 'error', data = undefined, { id = '' } = req.param('data');
        data = await Mark.findOne({ id: id }).populate('school').populate('major');
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
            let s = await Mark.update({ id }).set({ status }).fetch();
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

