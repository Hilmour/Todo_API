var jwt = require('jsonwebtoken')

const isAuth = function (req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) {
        res.status(400).json({success:false, message: "Error! Token was not provided."});
        return;
    }
    try {
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decodedToken.id; 
        next(); 
    } catch(err) {
        res.status(400).json({success:false, message: err});
        return;
    }
}

module.exports = isAuth;