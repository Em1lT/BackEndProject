'use strict';

module.exports = (app, port) => {

app.enable('trust proxy');

app.use ((req, res, next) => {
    if (req.secure) {
      next();
    } else {
      res.redirect('https://' + req.headers.host + req.url);
    }
  });
  console.log(port);
  app.listen(port);
}