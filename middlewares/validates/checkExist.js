const checkExistAccount = (Model) => {
  try {
    return async (req, res, next) => {
      const { username } = req.body;
      const account = await Model.findOne({
        where: {
          username,
        },
      });
      if (account) {
        next();
      } else {
        res.status(404).send({ message: "Không tìm thấy tài khoản!" });
      }
    };
  } catch (error) {
    res.status(504).send({ message: "Check Exist Error!" });
  }
};

const checkExistAccountAdmin = (Model) => {
  try {
    return async (req, res, next) => {
      const { username } = req.body;
      const account = await Model.findOne({
        where: {
          username,
        },
      });
      if (account) {
        next();
      } else {
        res.status(404).render("account/signin",{ message: "Không tìm thấy tài khoản!" });
      }
    };
  } catch (error) {
    res.status(504).send({ message: "Check Exist Error!" });
    
  }
};


module.exports = {
  checkExistAccount,
  checkExistAccountAdmin
};
