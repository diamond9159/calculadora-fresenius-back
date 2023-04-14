const {getDate} = require('../mainFunctions');

module.exports = async function (req, res) {
return res.send(getDate());
}