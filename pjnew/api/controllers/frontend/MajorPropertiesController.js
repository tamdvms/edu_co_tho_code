

module.exports = {

    // 1101 dữ liệu gửi lên không hợp lệ
    // 1102 có lỗi xảy ra, không có gì được thay đổi
    // 1103 không tìm thấy dữ liệu trong database

    

    getAll: async (req, res) => {
        res.status(200);
        let code = 200, message = 'success', data = undefined;
        let list = await GroupMajor.find().sort([{ name: 'DESC' }]).populate('groupmajoritem');
        if (list) {
            data ={
                list
            }
            code = 200;
            message = 'success';
        }
        return res.json({ code, message, data });
    },

    getOne: async (req, res) => {
        res.status(200);
        let code = 903, message = 'error', data = undefined, { id = '' } = req.param('data');
        data = await GroupMajorItemDetail.findOne({ groupmajoritem : id });
        if (data) {
            code = 200;
            message = 'success';
        }
        return res.json({ code, message, data });
    },
    
  };


