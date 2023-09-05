const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.cookies.access_token;
  try {
    if (token) {
      const data = jwt.verify(req.headers.access_token, "manhpham2k1");
      req.user = data;
      return next();
    } else {
      return res.status(400).json({ message: "Vui lòng đăng nhập" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const authorize = (arrType) => async (req, res, next) => {
  if (arrType.findIndex((ele) => ele === req.user.role) > -1) {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Bạn không có quyền sử dụng chức năng này!" });
  }
};

module.exports = {
  authenticate,
  authorize,
};
