var express = require('express');
var path = require('path');
var open = require('open');
var compression = require('compression');


/*eslint-disable no-console */

const port = 5000;
const app = express();

app.use(compression());
app.use(express.static('dist'));

app.use('/static', express.static(path.join(__dirname, './dist/styles')));
app.get('*', function (req, res) {
    console.log("request: ===> " + req._parsedUrl.pathname);
    res.sendFile(path.join(__dirname, './dist/index.html'));
});

app.listen(port, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('server start success');
        //open(`http://localhost:${port}`);
    }
});
