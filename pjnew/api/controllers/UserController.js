/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var md5 = require('md5');

const ACTIVE = 1;
const crypto = require('crypto');

module.exports = {
    // 801 dữ liệu gửi lên không hợp lệ
    // 802 có lỗi xảy ra, không có gì được thay đổi
    // 803 không tìm thấy dữ liệu trong database
    // 804 Tài khoản chưa kích hoạt
    checkSession: async (req, res) => {
        res.status(200);
        let code = 803, message = 'error';
        try {
            let { session } = req.param('data');
            let s = await Login.findOne({ session: session });
            if (s) {
                code = 200;
                message = 'success';
            } else {
                code = 802;
            }
        } catch (error) {
            code = 801;
        }
        return res.json({ code, message });
    },

    add: async (req, res) => {
        res.status(200);
        let code = 803, message = 'error';
        try {
            let { user } = req.param('data');
            let username = user.username;
            let tmp = await User.findOne({ username: username });
            if (!tmp) {
                let s = await User.create(user).fetch();
                if (s) {
                    let { session } = req.param('data');
                    let tmp = await Login.findOne({ session: session });
                    let iduser = JSON.parse(tmp.user).id;
                    let log = await Logtime.create({ iduser: iduser, action: "add", collection: "user" });
                    code = 200;
                    message = 'success';
                } else {
                    code = 802;
                }
            }

        } catch (error) {
            console.log(error);
            code = 801;
        }
        return res.json({ code, message });
    },

    delete: async (req, res) => {
        res.status(200);
        let code = 801, message = 'error', { id = '' } = req.param('data');
        if (id) {
            let rs = await User.destroy({ id: id }).fetch();
            if (rs && rs.length !== 0) {
                let { session } = req.param('data');
                let tmp = await Login.findOne({ session: session });
                let iduser = JSON.parse(tmp.user).id;
                let log = await Logtime.create({ iduser: iduser, action: "delete", collection: "user" });
                code = 200;
                message = 'success';
            } else {
                code = 802;
            }
        }
        return res.json({ code, message });
    },

    // user/update
    update: async (req, res) => {
        res.status(200);
        let code = 803, message = 'error';
        try {
            let { user } = req.param('data');
            user.createdAt = new Date(user.createdAt);
            user.updatedAt = new Date();
            let u = await User.update({ id: user.id }, user).fetch();
            if (u) {
                let { session } = req.param('data');
                let tmp = await Login.findOne({ session: session });
                let iduser = JSON.parse(tmp.user).id;
                let log = await Logtime.create({ iduser: iduser, action: "update", collection: "user" });
                code = 200;
                message = 'success';
            } else {
                code = 802;
            }
        } catch (error) {
            code = 801;
        }
        return res.json({ code, message });
    },

    // /user/getall/:page
    getAll: async (req, res) => {
        res.status(200);
        let code = 200, message = 'success', data = undefined, { page, status, role, date } = req.param('data'), list;
        if (!page || page < 0) {
            page = 1;
        }
        list = await User.find({ status: status, role: role, createdAt: { '>=': new Date(date.start), '<=': new Date(date.end) } }).sort([{ fullName: 'ASC' }]).limit(11).skip((page - 1) * 10).populate('role').populate('status');
        if (list.length > 10) {
            data = {
                list: list.slice(0, 10),
                next: true,
            }
        } else {
            data = {
                list,
                next: false
            }
        }
        return res.json({ code, message, data });
    },

    // /user/getone/:id
    getOne: async (req, res) => {
        res.status(200);
        let code = 803, message = 'error', data = undefined, { id = '' } = req.param('data');
        data = await User.findOne({ id: id });
        if (data) {
            code = 200;
            message = 'success';
        }
        return res.json({ code, message, data });
    },

    // user/login : for admin
    loginAdmin: async (req, res) => {
        res.status(200);
        let code = 803, message = 'error', data = undefined, user = undefined, session = undefined, role;
        try {
            let { username, password } = req.param('data');
            user = await User.findOne({ username: username, password: password }).populate('status').populate('role');
            if (user) {
                if (user.status.status === ACTIVE) {
                    // create session
                    let time = (new Date).getTime();
                    session = md5(user.id + time);
                    await Login.create({ session, time, user: JSON.stringify(user) });
                    code = 200;
                    message = 'success';
                } else {
                    code = 804;
                    message = 'user not active';
                }
            }
        } catch (error) {
            code = 801;
        }
        if (user && session) {
            data = { user, session };
        }
        return res.json({ code, message, data });
    },

    //user/login : login for user
    loginUser: async (req, res) => {
        res.status(200);
        let code = 803, message = 'error', data = undefined, user = undefined, session = undefined;
        try {
            let { email, password } = req.param('data');
            user = await User.findOne({ email: email, password: password }).populate('province').populate('purpose');
            if (user) {
                let time = (new Date).getTime();
                session = md5(user.id + time);
                await Login.create({ session, time, user: JSON.stringify(user) });
                code = 200;
                message = 'success';
            }
        } catch (error) {
            console.log(error);
            code = 801;
        }
        if (user && session) {
            data = { user, session };
        }
        return res.json({ code, message, data });
    },

    // user/logout
    logout: async (req, res) => {
        res.status(200);
        let code = 803, message = 'error';
        try {
            let { session } = req.param('data');
            let rs = await Login.destroy({ session: session }).fetch();
            if (rs && rs.length !== 0) {
                code = 200;
                message = 'success';
            }
        } catch (error) {
            code = 801;
        }
        return res.json({ code, message });
    },

    updateStatus: async (req, res) => {
        res.status(200);
        let code = 403, message = 'error';
        try {
            let { id, status } = req.param('data');
            let s = await User.update({ id }).set({ status }).fetch();
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
    },

    getKey: async (req, res) => {
        res.status(200);
        let code = 803, message = 'error';
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
                    code = 802;
                }
            }
        } catch (error) {
            code = 801;
        }
        return res.json({ code, message });
    },

    resetPass: async (req, res) => {
        res.status(200);
        let code = 803, message = 'error';
        try {
            let { data } = req.param('data');
            let { token } = req.param('data');
            let { password } = req.param('data');
            let tmp = await Token.findOne({ token: token });
            let email = tmp.email;
            if (tmp) {
                let s = await User.findOne({ email: email });
                if (s) {
                    let update = await User.update({ id: s.id }).set({ password: password }).fetch();
                    if (update) {
                        let check = await Token.find({ email: email });
                        for (let i = 0; i < check.length; i++) {
                            let tmp = check[i];
                            let mail = tmp.email;
                            let clear = await Token.destroy({ email: { in: [mail] } }).fetch();
                            if (clear) {
                                code = 200;
                                message = 'success';
                            } else {
                                code = 802;
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
            code = 801;
        }
        return res.json({ code, message });
    },

    // user/profile
    updateprofile: async (req, res) => {
        res.status(200);
        let code = 803, message = 'error';
        try {
            let { session, user } = req.param('data');
            let { fullName, sex, birthday, province, purpose } = user;
            let check = checkName(fullName) && checkBirthday(birthday) && checkSG(purpose) && sex !== '';
            if (!check) {
                return res.json({ code, message });;
            }
            user.birthday = new Date(user.birthday);
            let tmp = await Login.findOne({ session: session });
            if (tmp) {
                let u = await User.update({ id: user.id }).set({ fullName: fullName, sex: sex, birthday: birthday, purpose: purpose, province: province }).fetch();
                let iduser = JSON.parse(tmp.user).id;
                let log = await Logtime.create({ iduser: iduser, action: "update-profile", collection: "user" });
                code = 200;
                message = 'success';
            } else {
                code = 802;
            }
        } catch (error) {
            code = 801;
        }
        return res.json({ code, message });
    }

};

// validdate input

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

checkSG = subjectGroup => subjectGroup !== '';

checkName = name => name !== '';

