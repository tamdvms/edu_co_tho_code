
module.exports = async function (req, res, proceed) {

    let { session } = req.param('data');
    let valid = false;
    if (session) {
        let log = await Login.findOne({
            session: session
        });
        if (log) {
            let roles = JSON.parse(JSON.parse(log.user).role.roles);
            if (roles.find(r => r === sails.config.myconf.roles.ROOT)) {
                valid = true;
            }
        }
    }

    if (valid) {
        proceed();
    } else {
        res.status(200);
        return res.json({
            code: 999,
            message: 'forbidden'
        });
    }
}
