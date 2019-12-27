module.exports = {

    // 1301 dữ liệu gửi lên không hợp lệ
    // 1302 có lỗi xảy ra, không có gì được thay đổi
    // 1303 không tìm thấy dữ liệu trong database

    

    getAll: async (req, res) => {
        res.status(200);
        let code = 200, message = 'success', data = undefined;
        let list = await P2.find().sort([{ name: 'DESC' }]);
         if (list) {
            data = {
                list
            }
            code = 200;
            message = 'success';
        }
        return res.json({ code, message, data });
    },
}