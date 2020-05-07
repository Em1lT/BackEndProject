'use strict';

module.exports = (app,port) => {
    app.use((req, res, next) => {
        next();
    })
    app.listen(port)
}