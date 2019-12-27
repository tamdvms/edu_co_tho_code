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

    // /subjectGroup/getall/:page
    getAll: async (req, res) => {
        res.status(200);
        let code = 200, message = 'success', data = undefined;
        let list = await SubjectGroup.find().sort([{ code: 'ASC' }]);
        return res.json({ code, message, data: { list, next: false } });
    }
};
