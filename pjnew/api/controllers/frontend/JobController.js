

module.exports = {

    // 1001 dữ liệu gửi lên không hợp lệ
    // 1002 có lỗi xảy ra, không có gì được thay đổi
    // 1003 không tìm thấy dữ liệu trong database



    getOne: async (req, res) => {
        res.status(200);
        let code = 903, message = 'error', data = undefined, { id = '' } = req.param('data');
        data = await Content.findOne({ job: id }).populate('job');

        if (data) {
            code = 200;
            message = 'success';
        }
        return res.json({ code, message, data });
    },
    search: async (req, res) => {
        res.status(200);
        let code = 1003, message = 'error', data = undefined, { p1, p2, p3, p4, page } = req.param('data'), list = undefined;
        if (!page || page < 0) {
            page = 1;
        }
        try {
            // let db = Job.getDatastore().manager;
            // list = await db.collection('job').aggregate([
            //     {
            //         $match: {
            //             name: { $regex: keyword, $options: "i" }
            //         }
            //     },
            //     { $skip: (page - 1) * 20 },
            //     { $limit: 21 }
            // ]).toArray((error, rs) => {
            //     if (!error) {
            //         list = rs;
            //         if (list.length > 20) {
            //             data = {
            //                 list: list.slice(0, 20),
            //                 next: true
            //             }
            //         } else {
            //             data = {
            //                 list,
            //                 next: false
            //             }
            //         }
            //         code = 200;
            //         message = 'success';
            //     }
            //     return res.json({ code, message, data });
            // });
            console.log(p1, p2, p3, p4);
            let tmp = await Job.find({
                or: [
                    { p1 },
                    { p2 },
                    { p3 },
                    { p4 },
                ]
            });
            console.log(tmp.length);
        } catch (error) {
            code = 1001;
            return res.json({ code, message, data });
        }
    },
    getlist: async (req, res) => {
        res.status(200);
        let code = 200, message = 'Error', data = undefined, rs = undefined, list = undefined, { page, p1, p2, p3, p4, keyword } = req.param('data');
        if (!page || page < 0) {
            page = 1;
        }

        let logdata = await DataJob.create({ p1, p2, p3, p4, keyword });
        try {
            if (!p1 && !p2 && !p3 && !p4 && !keyword) {
                list = await Job.find().limit(21).skip((page - 1) * 20);
                if (list.length > 20) {
                    data = {
                        list: list.slice(0, 20),
                        next: true
                    }
                } else {
                    data = {
                        list,
                        next: false
                    }
                }
                code = 200;
                message = 'success';
                return res.json({ code, message, data });
            } else {
                ObjectID = require('sails-mongo/node_modules/mongodb').ObjectID;
                let ar = [];
                if (keyword) ar.push({ name: { $regex: keyword, $options: "i" } });
                if (p1) ar.push({ p1: new ObjectID(p1) });
                if (p2) ar.push({ p2: new ObjectID(p2) });
                if (p3) ar.push({ p3: new ObjectID(p3) });
                if (p4) ar.push({ p4: new ObjectID(p4) });
                let db = Job.getDatastore().manager;
                rs = await db.collection('job').aggregate([
                    {
                        $match: {
                            $or: ar
                        }
                    },
                    { $skip: (page - 1) * 20 },
                    { $limit: 21 }
                ]).toArray((error, list) => {
                    if (!error) {
                        if (list.length > 20) {
                            data = {
                                list: list.slice(0, 20),
                                next: true
                            }
                        } else {
                            data = {
                                list,
                                next: false
                            }
                        }
                        code = 200;
                        message = 'success';
                    }
                    return res.json({ code, message, data });

                });
            }
        } catch (error) {
            code = 301;
            return res.json({ code, message, data });
        }
    },


};


