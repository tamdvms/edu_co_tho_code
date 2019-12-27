/**
 * ImageController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

// 1103 có lỗi xảy ra
module.exports = {

    upload: async (req, res) => {
        res.status(200);
        let uploadFile, message, code;
        message = 'error';
        code = 1203;
        uploadFile = req.file('upload');
        try {
            uploadFile.upload({ maxBytes: 10000000, dirname: '../../assets/images' }, async (error, file) => {
                if (error) {
                    code = 1201;
                    return res.json({ message, code });
                } else {
                    let p, link, status, media;
                    p = file[0].fd;
                    link = 'http://localhost:1337/images/' + p.substring(p.lastIndexOf('\\') + 1, p.length);
                    status = await Status.findOne({ status: sails.config.myconf.status.ACTIVE });
                    media = await Media.create({ link, status: status.id, kind: 'image' }).fetch();
                    if (media) {
                        let funcNum = req.query.CKEditorFuncNum;
                        let message = 'The uploaded file has been renamed';
                        return res.send(`<script type='text/javascript'>window.parent.CKEDITOR.tools.callFunction(${funcNum}, '${link}', '${message}');</script>`);
                    } else {
                        code = 1202;
                        return res.json({ message, code });
                    }
                }
            });
        } catch (error) {
            return res.json({ message, code });
        }
    },

};

