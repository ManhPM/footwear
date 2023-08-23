const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const token = req.cookies.access_token;
    try {
      if(req.headers.access_token){
        try {
          const data = jwt.verify(req.headers.access_token, "manhpham2k1");
          req.username = data.username;
          req.id_role = data.id_role;
          return next();
        } catch {
            return res.status(400).json({message: "Vui lòng đăng nhập!"});
        }
      }
      else{
        if (!token) {
          return res.status(400).render("account/signin");
        }
        else{
          try {
            const data = jwt.verify(token, "manhpham2k1");
            req.username = data.username;
            req.id_role = data.id_role;
            return next();
          } catch {
              return res.status(400).render("account/signin");
          }
        }
      }
    } catch (error) {
      return res.status(502).json({message: "Authenticate Error!", error: error});
    }
}

const authenticateRefreshToken = (req, res, next) => {
  const token = req.headers.refresh_token;
  if (!token) {
      return res.status(400).json({message: "Vui lòng đăng nhập!" });
    }
    try {
      const data = jwt.verify(token, "manhpham2k1");
      req.username = data.username;
      return next();
    } catch {
      return res.status(502).json({message: "Authenticate Error!", error: error});
    }
}

module.exports = {
    authenticate,
    authenticateRefreshToken
}