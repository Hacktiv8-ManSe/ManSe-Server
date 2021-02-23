const jwt = require('jsonwebtoken');

let generateToken = (obj) => {
    const token = jwt.sign(obj, process.env.SECRET);
    return token
}

let verifyToken = (token) => {
    const decoded = jwt.verify(token, process.env.SECRET);
    return decoded
    // try {
    //     const decoded = jwt.verify(token, process.env.SECRET);
    //     return decoded
    // } catch(err) {
        // throw {
        //     status: 401,
        //     message: `Please Login First`
        // }
        // next({name: 'InvalidToken'})
    // }
}

module.exports = { generateToken, verifyToken }