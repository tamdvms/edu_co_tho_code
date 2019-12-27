

module.exports = {

    // 1001 dữ liệu gửi lên không hợp lệ
    // 1002 có lỗi xảy ra, không có gì được thay đổi
    // 1003 không tìm thấy dữ liệu trong database

    

    getAll: async (req, res) => {
        res.status(200);
        let code = 200, message = 'success', data = undefined, { page, status } = req.param('data');
        if (!page || page < 0) {
            page = 1;
        }
        let list = await New.find({ status }).sort([{ createdAt: 'DESC' }]).limit(11).skip((page - 1) * 10).populate('status');
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
        data = await New.findOne({ id }).populate('status');
        if (data) {
            code = 200;
            message = 'success';
        }
        return res.json({ code, message, data });
    },
    search: async (req, res) => {
        res.status(200);
        let code = 1003, message = 'error', data = undefined, { keyword, page } = req.param('data'), list = undefined;
        if (!page || page < 0) {
            page = 1;
        }
        try {
            let db = New.getDatastore().manager;
            list = await db.collection('new').aggregate([
                {
                    $match: {
                        $or: [
                            {
                                $or: [
                                    { title: { $regex: keyword, $options: "i" } },
                                    { content: { $regex: keyword, $options: "i" } }
                                ]
                            }
                        ]
                    }
                },
                { $skip: (page - 1) * 20 },
                { $limit: 21 }
            ]).toArray((error, rs) => {
                if (!error) {
                    list = rs;
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
        } catch (error) {
            code = 1001;
            return res.json({ code, message, data });
        }
    },



  };


