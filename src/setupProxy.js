 const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = function (app) {
    app.use(
        ["/api/*", "/auth/google", "/tasks/*"], 
        createProxyMiddleware({
            target: "http://localhost:5000"
        })
    )
}
