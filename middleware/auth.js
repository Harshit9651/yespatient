exports. isAuthenticate = (req, res, next)=> {
   if (req.session.user) {
      next();
    } else {
      res.redirect('/user/sinin');
    }
  };