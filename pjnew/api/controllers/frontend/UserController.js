/**
 * SessionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

// 1401 thiếu tham số gửi lên
// 1403 có lỗi xảy ra

// 1411 not found
// 1412 wrong param
// 1414 error undefine
// 1415 lost param
// 1416 dulicate data


const jwt = require('jsonwebtoken');
const crypto = require('crypto');

module.exports = {

    loginSession: async (req, res) => {
        res.status(200);
        let code, message, data;
        code = 1414;
        message = 'error';

        let { session } = req.param('data');
        if (session) {
            jwt.verify(session, sails.config.custom.secretKey, async (error, result) => {
                if (!error) {
                    let { email, password } = result;
                    let user = await User.findOne({ email, password }).populate('province').populate('purpose');
                    if (user) {
                        // login success
                        code = 200;
                        message = 'success';
                        data = {
                            user
                        }
                    } else {
                        code = 1411;
                    }
                } else {
                    code = 1412;
                }
                return res.json({ code, message, data });
            });
        } else {
            code = 1415;
            return res.json({ code, message, data });
        }
    },

    login: async (req, res) => {
        res.status(200);
        let code, message, data;
        code = 1414;
        message = 'error';
        data = undefined;
        try {
            let { email, password } = req.param('data');
            if (email && password) {
                let user = await User.findOne({ email, password }).populate('province').populate('purpose');
                if (user) {
                    let session = jwt.sign({ email, password, createdAt: new Date() }, sails.config.custom.secretKey);
                    await Session.create({ user: user.id, session });
                    code = 200;
                    message = 'success';
                    data = { user, session };
                } else {
                    code = 1411;
                }
            } else {
                code = 1415;
            }
        } catch (error) {
            code = 1414;
        }
        return res.json({ code, message, data });
    },

    logout: async (req, res) => {
        res.status(200);
        let code, message;
        code = 1414;
        message = 'error';

        try {
            let { session } = req.param('data');
            await Session.destroy({ session }).fetch();
            code = 200;
            message = 'success';
        } catch (error) {
            code = 1414;
        }
        return res.json({ code, message });
    },

    updateprofile: async (req, res) => {
        res.status(200);
        let code = 1414, message = 'error', data = undefined;
        try {
            let { session, user } = req.param('data');
            console.log(session, user);
            let { id, fullName, sex, birthday, province, purpose } = user;
            let check = checkName(fullName) && sex !== '';
            if (check) {
                birthday = new Date(birthday);
                let tmp = await Session.findOne({ session });
                if (tmp) {
                    let u = await User.updateOne({ id }).set({ fullName: fullName, sex: sex, birthday: birthday, purpose: purpose, province: province });
                    code = 200;
                    message = 'success';
                    data = { user: u };
                } else {
                    code = 1411;
                }
            } else {
                code = 1412;
            }
        } catch (error) {
            code = 1414;
            console.log(error);
        }
        return res.json({ code, message, data });
    },

    loginFacebook: async (req, res) => {
        res.status(200);
        let code, message, data;
        code = 1403;
        message = 'error';
        data = undefined;

        try {
            let { token } = req.param('data');
            const request = require('request');
            request('https://graph.facebook.com/me?fields=id,name,email&access_token=' + token, { json: true }, async (err, response) => {
                if (err) {
                    code = 1403;
                    message = 'error';
                }
                let { id, name, email } = response.body;
                let user = await User.findOne({ username: id });
                if (!user) {
                    user = await User.create({ username: id, fullName: name, email: email, password: id }).fetch();

                }
                let session = jwt.sign({ email, id, createdAt: new Date() }, sails.config.custom.secretKey);
                await Session.create({ user: user.id, session });
                code = 200;
                message = 'success';
                data = { user, session }
                return res.json({ code, message, data });
            });
        } catch (error) {
            code = 1401;
            return res.json({ code, message, data });
        }
    },

    register: async (req, res) => {
        res.status(200);
        let code = 1414, message = 'error';
        try {
            let { user } = req.param('data'), { email } = user;
            let tmp = await User.findOne({ email: email });
            if (!tmp) {
                // check valid data
                let { fullName, email, sex, password } = user;
                let check = checkName(fullName) && checkEmail(email)
                    && checkPassword(password) && sex !== '';
                if (!check) {
                    code = 1412;
                    return res.json({ code, message });;
                }
                user.birthday = new Date(user.birthday);
                let status = await Status.findOne({ status: 1 });
                user.status = status.id;
                let s = await User.create(user).fetch();
                if (s) {
                    let log = await Logtime.create({ iduser: "No ID", action: "register", collection: "user" }).fetch();
                    code = 200;
                    message = 'success';
                } else {
                    code = 1414;
                }
            } else {
                code = 1416;
            }
        } catch (error) {
            console.log(error);
            code = 1414;
        }
        return res.json({ code, message });
    },

    updatePassword: async (req, res) => {
        res.status(200);
        let code = 1414, message = 'error';
        try {
            let { password, passwordOld, user } = req.param('data');
            console.log(password, passwordOld, user);
            let u = await User.findOne({ id: user });
            if (u) {
                if (u.password === passwordOld) {
                    await User.update({ id: user }).set({ password });
                    code = 200;
                    message = 'success';
                } else {
                    code = 1412;
                }
            } else {
                code = 1411;
            }
        } catch (error) {
            console.log(error);
            code = 1414;
        }
        return res.json({ code, message });
    },

    getKey: async (req, res) => {
        res.status(200);
        let code = 1414, message = 'error';
        try {
            let { email } = req.param('data');
            let tmp = await User.findOne({ email: email });
            if (tmp) {
                let token = crypto.randomBytes(3).toString('hex');
                let uID = await Token.create({ email: email, token: token }).fetch();
                if (uID) {
                    sails.hooks.email.send(
                        "welcomeEmail",
                        {
                            Name: email,
                            Token: token
                        },
                        {
                            to: email,
                            subject: "Mã Khôi Phục Tài Khoản ",
                        },
                        () => {

                        }
                    )
                    code = 200;
                    message = 'success';
                }
                else {
                    code = 1414;
                }
            } else {
                code = 200;
            }
        } catch (error) {
            code = 1414;
        }
        return res.json({ code, message });
    },

    resetPassword: async (req, res) => {
        res.status(200);
        let code = 1414, message = 'error';
        try {
            let { token, password } = req.param('data');
            let tmp = await Token.findOne({ token: token });
            if (tmp) {
                let email = tmp.email, s = await User.findOne({ email: email });
                if (s) {
                    let update = await User.update({ id: s.id }).set({ password: password }).fetch();
                    if (update) {
                        code = 200;
                        message = 'success';
                        let check = await Token.find({ email: email });
                        if (check) {
                            let ar = check.map(el => el.email);
                            await Token.destroy({ email: { in: ar } });
                        }
                    }
                }
            } else {
                code = 1411;
            }
        } catch (error) {
            console.log(error);
            code = 1414;
        }
        return res.json({ code, message });
    },
};

checkSG = subjectGroup => subjectGroup !== '';

checkName = name => name !== '';

checkPassword = password => password && password.length >= 6;

checkBirthday = birthday => {
    if (!birthday || birthday === '') {
        return false;
    } else {
        return true;
    }
}

checkEmail = email => {
    let check;
    if (email === '') {
        check = false;
    } else {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        check = re.test(String(email).toLowerCase());
    }
    return check;
}

checkPhone = phone => {
    let check = true;
    const PHONES = ['086', '096', '097', '098', '032', '033', '034', '035', '036', '037', '038', '039',
        '090', '093', '070', '079', '077', '076', '078', '091', '094', '083', '084', '085', '081', '082',
        '092', '056', '058', '099', '059'];
    if (phone !== '' && (phone.length !== 10 || !PHONES.find(el => el === phone.substr(0, 3)))) {
        check = false;
    }
    return check;
}
