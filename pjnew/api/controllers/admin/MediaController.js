/**
 * MediaController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

// 1201 upload thất bại
// 1202 lỗi trong quá trình thêm vào database, có thể hình ảnh vẫn được upload
// 1203 lỗi không xác định

module.exports = {

    upload: async (req, res) => {
        res.status(200);
        let uploadFile, message, code, data;
        message = 'error';
        code = 1203;
        data = undefined;
        uploadFile = req.file('upload');
        try {
            uploadFile.upload({ maxBytes: 10000000, dirname: '../../assets/images' }, async (error, file) => {
                if (error) {
                    code = 1201;
                } else {
                    let p, link, status, media;
                    p = file[0].fd;
                    link = 'http://localhost:1337/images/' + p.substring(p.lastIndexOf('\\') + 1, p.length);
                    status = await Status.findOne({ status: sails.config.myconf.status.ACTIVE });
                    media = await Media.create({ link, status: status.id, kind: 'image' }).fetch();
                    if (media) {
                        code = 200;
                        message = 'success';
                        data = {
                            link
                        }
                    } else {
                        code = 1202;
                    }
                }
                return res.json({ message, code, data });
            });
        } catch (error) {
            return res.json({ message, code, data });
        }
    },

    getList: async (req, res) => {
        res.status(200);

        let data, list, message, code, { page, status, extensions } = req.param('data');
        code = 200;
        message = 'success';

        if (!page || page < 0) {
            page = 1;
        }

        list = await Media.find({ status, extensions }).sort([{ createdAt: 'DESC' }])
            .skip((page - 1) * 10).limit(11).populate('status');
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

        // list = await Media.find({ status }).sort([{ createdAt: 'DESC' }]);
        // data = { list, next: false };
        return res.json({ code, message, data });
    },

    updateStatus: async (req, res) => {
        res.status(200);
        let code = 1203, message = 'error';
        try {
            let { id, status } = req.param('data');
            let s = await Media.update({ id }).set({ status }).fetch();
            if (s) {
                code = 200;
                message = 'success';
            } else {
                code = 1202;
            }
        } catch (error) {
            code = 1201;
        }
        return res.json({ code, message });
    }

};

