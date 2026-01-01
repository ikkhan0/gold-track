// Vercel Serverless Function Wrapper
const app = require('../server/index');

module.exports = async (req, res) => {
    return app(req, res);
};
