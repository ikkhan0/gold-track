// Import the Express app
const app = require('./index');

// Start server for local development
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
