const jwt = require('jsonwebtoken');

let generateToken = (obj) => {
    const token = jwt.sign(obj, process.env.SECRET);
    return token
}

let verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        return decoded
    } catch(err) {
        throw {
            status: 401,
            message: `Please Login First`
        }
    }
}

module.exports = { generateToken, verifyToken }