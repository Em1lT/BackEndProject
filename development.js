'use strict';

module.exports = (app,port) => {
    app.use((req, res, next) => {
        next();
    })
    app.listen(port, () => {  
        logger.info(`App has started and is running on port:  ${port}!`)
    })
}