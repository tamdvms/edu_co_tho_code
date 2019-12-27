
module.exports = async function (req, res, proceed) {

    let { session } = req.param('data');
    let valid = false;
    if (session) {
        let log = await Login.findOne({
            session: session
        });
        if (log) {
            valid = true;
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
