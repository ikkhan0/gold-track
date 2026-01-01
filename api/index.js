// Vercel Serverless Function Wrapper
const app = require('../server/index');

module.exports = async (req, res) => {
    try {
        // Ensure database connection before handling request
        const connectDB = app.get('connectDB');
        if (connectDB) {
            await connectDB();
        }
        return app(req, res);
    } catch (error) {
        console.error('❌ Serverless function error:', error);
        return res.status(500).json({
            message: 'Server initialization failed',
            error: error.message
        });
    }
};
