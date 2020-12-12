var path = require('path');
const success = (req, res) => {
    res.sendFile(path.join(__dirname + '/../html/success.html'));
};

module.exports.success = success;