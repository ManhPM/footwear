const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const token = req.cookies.access_token;
    if(req.headers.access_token){
      return res.status(400).json({message: "Vui lòng đăng nhập!"});
    }
    else{
      if (!token) {
        return res.status(400).render("account/signin");
      }
    }
      try {
        const data = jwt.verify(token, "manhpham2k1");
        req.username = data.username;
        req.id_role = data.id_role;
        return next();
      } catch {
        if(req.headers.access_token){
          return res.status(401).json({message: "Token đã hết hạn!" });
        }
        else{
          return res.status(400).render("account/signin");
        }
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
      return res.status(401).json({message: "Token đã hết hạn!" });
    }
}

module.exports = {
    authenticate,
    authenticateRefreshToken
}