/**
 * MarkController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    // 1101 dữ liệu gửi lên không hợp lệ
    // 1102 có lỗi xảy ra, không có gì được thay đổi
    // 1103 không tìm thấy dữ liệu trong database

    
    getList: async (req, res) => {
        res.status(200);
        let code = 1101, message = 'error', data = undefined;
        let { school, year } = req.param('data');
        let list = await Mark.find({ year: year, school: school }).populate('major');
        if (list) {
            data ={
                list
            }
            code = 200;
            message = 'success';
        }
        return res.json({ code, message, data });

    },


};

