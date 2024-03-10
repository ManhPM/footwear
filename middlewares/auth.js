const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.cookies.accessToken;
  try {
    if (token) {
      const data = jwt.verify(token, 'BOOKSTOREP2M');
      req.user = data;
      console.log(data);
      return next();
    } else {
      return res.status(400).json({ message: 'Bạn chưa đăng nhập' });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Authenticate Error: ${error.message}` });
  }
};

const authorize = (arrType) => async (req, res, next) => {
  if (arrType.findIndex((ele) => ele === req.user.role) > -1) {
    next();
  } else {
    res
      .status(403)
      .json({ message: 'Bạn không có quyền sử dụng chức năng này!' });
  }
};

module.exports = {
  authenticate,
  authorize,
};
