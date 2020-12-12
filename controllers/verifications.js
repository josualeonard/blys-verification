const test = (req, res, next) => {
    res.status(200).json({
        body: 'Test get method!'
    });
};

const getVerification = (req, res, next) => {
    res.status(200).json({
        body: 'Please use POST method with body {code: 123456}'
    });
};

const verify = (req, res) => {
    const { code } = req.body;
    if(code.length==6 && parseInt(code[code.length-1])!=7) {
        res.status(200).json({
            body: {'status': 'success', 'message': 'Verification success'}
        });
    } else {
        res.status(200).json({
            body: {'status': 'failed', 'message': 'Verification error'}
        });
    }
};

module.exports.test = test;
module.exports.getVerification = getVerification;
module.exports.verify = verify;