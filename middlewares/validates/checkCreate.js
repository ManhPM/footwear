const {
  Shipper,
  Customer,
  Staff,
  Store,
  Discount,
  Import_invoice_detail,
  Export_invoice_detail,
  Recipe,
  Recipe_ingredient
} = require("../../models");
const { QueryTypes } = require("sequelize");

const checkCreateAccount = (Model) => {
  try {
    return async (req, res, next) => {
      const { username } = req.body;
      const item = await Model.findOne({
        raw: true,
        where: {
          username,
        },
      });
      if (!item) {
        next();
      } else {
        res.status(400).render("account/signup",{item, message: "Tài khoản đã tồn tại!"});
      }
    };
  } catch (error) {
    res
          .status(501)
          .json({
            message:
              "Middleware Error!",
            error: error
          });
  }
};

const checkCreateAccountCustomer = (Model) => {
  try {
    return async (req, res, next) => {
      const { username } = req.body;
      const item = await Model.findOne({
        raw: true,
        where: {
          username,
        },
      });
      if (!item) {
        next();
      } else {
        res.status(400).json({ message: "Tài khoản đã tồn tại!"});
      }
    };
  } catch (error) {
    res
          .status(501)
          .json({
            message:
              "Middleware Error!",
            error: error
          });
  }
};

const checkCreateAccountShipper = (Model) => {
  try {
    return async (req, res, next) => {
      const { username } = req.body;
      const item = await Model.findOne({
        raw: true,
        where: {
          username,
        },
      });
      if (!item) {
        next();
      } else {
        res.status(400).render("shipper/shipper-create",{id_shipping_partner: item.id_shipping_partner, message: "Tài khoản đã tồn tại!", flag: 2});
      }
    };
  } catch (error) {
    res
          .status(501)
          .json({
            message:
              "Middleware Error!",
            error: error
          });
  }
};

const checkCreateAccountStaff = (Model) => {
  try {
    return async (req, res, next) => {
      const { username } = req.body;
      const item = await Model.findOne({
        raw: true,
        where: {
          username,
        },
      });
      if (!item) {
        next();
      } else {
        const storeList = await Store.findAll({
          raw: true,
        });
        const roleList = await Staff.sequelize.query(
          "SELECT * FROM roles WHERE id_role != 1 AND id_role != 4",
          {
            type: QueryTypes.SELECT,
            raw: true,
          })
        res.status(400).render("staff/staff-create",{storeList,roleList,item, message: "Tài khoản đã tồn tại!"});
      }
    };
  } catch (error) {
    res
          .status(501)
          .json({
            message:
              "Middleware Error!",
            error: error
          });
  }
};

const checkCreateItem = (Model) => {
  try {
    return async (req, res, next) => {
      const { name, price } = req.body;
      const item = await Model.findOne({
        raw: true,
        where: {
          name,
          price,
        },
      });
      if(!item){
        next();
      }
      else{
        if(!req.params.id_item){
          res.status(400).render("item/item-create",{item, message: "Sản phẩm đã tồn tại!", flag: 1});
        }
        else{
          res.status(400).render("item/item-create",{item, message: "Sản phẩm đã tồn tại!", flag: 2});
        }
      }
    };
  } catch (error) {
    res
          .status(501)
          .json({
            message:
              "Middleware Error!",
            error: error
          });
  }
};

const checkCreateType = (Model) => {
  try {
    return async (req, res, next) => {
      const { name } = req.body;
      const item = await Model.findOne({
        raw: true,
        where: {
          name,
        },
      });
      if (!item) {
        next();
      } else {
        if(!req.params.id_type){
          res.status(400).render("type/type-create",{item, message: "Loại hàng đã tồn tại!", flag: 1});
        }
        else{
          res.status(400).render("type/type-create",{item, message: "Loại hàng đã tồn tại!", flag: 2});
        }
      }
    };
  } catch (error) {
    res
          .status(501)
          .json({
            message:
              "Middleware Error!",
            error: error
          });
  }
};

const checkCreateReview = (Model) => {
  try {
    return async (req, res, next) => {
      const { id_order } = req.query;
      const order = await Model.findOne({
        where: {
          id_order,
        },
      });
      if (order.status == 4) {
        next();
      } else {
        res
          .status(400)
          .json({
            message:
              "Đơn hàng đã bị huỷ hoặc chưa được xác nhận. Không thể đánh giá!",
          });
      }
    };
  } catch (error) {
    res
          .status(501)
          .json({
            message:
              "Middleware Error!",
            error: error
          });
  }
};

const checkCreateProvider = (Model) => {
  try {
    return async (req, res, next) => {
      const { name, phone } = req.body;
      const item = await Model.findOne({
        raw: true,
        where: {
          name,
          phone,
        },
      });
      if (!item) {
        next();
      } else {
        if(!req.params.id_provider){
          res.status(400).render("provider/provider-create",{item, message: "Nhà cung cấp đã tồn tại!", flag: 1});
        }
        else{
          res.status(400).render("provider/provider-create",{item, message: "Nhà cung cấp đã tồn tại!", flag: 2});
        }
      }
    };
  } catch (error) {
    res
          .status(501)
          .json({
            message:
              "Middleware Error!",
            error: error
          });
  }
};
const checkCreateStore = (Model) => {
  try {
    return async (req, res, next) => {
      const { name, phone, address, storeLat, storeLng } = req.body;
      const item = await Model.findOne({
        raw: true,
        where: {
          name,
          address,
          phone,
          storeLng,
          storeLat
        },
      });
      if (!item) {
        next();
      } else {
        if(!req.params.id_store){
          res.status(400).render("store/store-create",{item, message: "Cửa hàng đã tồn tại!", flag: 1});
        }
        else{
          res.status(400).render("store/store-create",{item, message: "Cửa hàng đã tồn tại!", flag: 2});
        }
      }
    };
  } catch (error) {
    res
          .status(501)
          .json({
            message:
              "Middleware Error!",
            error: error
          });
  }
};
const checkCreatePayment = (Model) => {
  try {
    return async (req, res, next) => {
      const { name } = req.body;
      const item = await Model.findOne({
        raw: true,
        where: {
          name,
        },
      });
      if (!item) {
        next();
      } else {
        if(!req.params.id_payment){
          res.status(400).render("payment/payment-create",{item, message: "Phương thức thanh toán đã tồn tại!", flag: 1});
        }
        else{
          res.status(400).render("payment/payment-create",{item, message: "Phương thức thanh toán đã tồn tại!", flag: 2});
        }
      }
    };
  } catch (error) {
    res
          .status(501)
          .json({
            message:
              "Middleware Error!",
            error: error
          });
  }
};
const checkCreateUnprocessedIngredient = (Model) => {
  try {
    return async (req, res, next) => {
      const { name, unit } = req.body;
      const item = await Model.findOne({
        raw: true,
        where: {
          name,
          unit
        },
      });
      if (!item) {
        next();
      } else {
        if(!req.params.id_u_ingredient){
          res.status(400).render("unprocessed-ingredient/unprocessed-ingredient-create",{item, message: "Nguyên liệu thô đã tồn tại!", flag: 1});
        }
        else{
          res.status(400).render("unprocessed-ingredient/unprocessed-ingredient-create",{item, message: "Nguyên liệu thô đã tồn tại!", flag: 2});
        }
      }
    };
  } catch (error) {
    res
          .status(501)
          .json({
            message:
              "Middleware Error!",
            error: error
          });
  }
};
const checkCreateIngredient = (Model) => {
  try {
    return async (req, res, next) => {
      const item = await Model.findOne({
        raw: true,
        where: {
          name: req.body.name,
          unit: req.body.unit,
        },
      });
      if (!item) {
        next();
      } else {
        if(!req.params.id_ingredient){
          res.status(400).render("ingredient/ingredient-create",{item, message: "Nguyên liệu đã tồn tại!", flag: 1});
        }
        else{
          res.status(400).render("ingredient/ingredient-create",{item, message: "Nguyên liệu đã tồn tại!", flag: 2});
        }
      }
    };
  } catch (error) {
    res
          .status(501)
          .json({
            message:
              "Middleware Error!",
            error: error
          });
  }
};

const checkItemValue = (Model) => {
  try {
    return async (req, res, next) => {
      const { price, name } = req.body;
      
      if (price > 0) {
        next();
      } else {
        const item = await Model.findOne({
          where: {
            name,
          },
        });
        if(!req.params.id_item){
          res.status(400).render("item/item-create",{item, message: "Số lượng sản phẩm phải lớn hơn 0!", flag: 1});
        }
        else{
          res.status(400).render("item/item-create",{item, message: "Số lượng sản phẩm phải lớn hơn 0!", flag: 2});
        }
      }
    };
  } catch (error) {
    res
          .status(501)
          .json({
            message:
              "Middleware Error!",
            error: error
          });
  }
};

const checkCreateEmail = async (req, res, next) => {
  const { email } = req.body
  try {
    const customer = await Customer.findOne({
      where: {
        email,
      },
    });
    const shipper = await Shipper.findOne({
      where: {
        email,
      },
    });
    const staff = await Staff.findOne({
      where: {
        email,
      },
    });
    if(customer || shipper || staff){
      const storeList = await Store.findAll({
        raw: true,
      });
      const roleList = await Staff.sequelize.query(
        "SELECT * FROM roles WHERE id_role != 1 AND id_role != 4",
        {
          type: QueryTypes.SELECT,
          raw: true,
        })
      if(customer){
        res.status(400).render("staff/staff-create",{storeList, roleList, message: "Email đã tồn tại!", flag: 1});
      }
      if(shipper){
        res.status(400).render("staff/staff-create",{storeList, roleList, message: "Email đã tồn tại!", flag: 1});
      }
      if(staff){
        res.status(400).render("staff/staff-create",{storeList, roleList, message: "Email đã tồn tại!", flag: 1});
      }
    }
    else {
      next();
    }
  } catch (error) {
    res
          .status(501)
          .json({
            message:
              "Middleware Error!",
            error: error
          });
  }
}

const checkCreateEmailCustomer = async (req, res, next) => {
  const { email } = req.body
  try {
    const customer = await Customer.findOne({
      where: {
        email,
      },
    });
    const shipper = await Shipper.findOne({
      where: {
        email,
      },
    });
    const staff = await Staff.findOne({
      where: {
        email,
      },
    });
    if(customer || shipper || staff){
        res.status(400).json({ message: "Email đã tồn tại!"});
    }
    else {
      next();
    }
  } catch (error) {
    res
          .status(501)
          .json({
            message:
              "Middleware Error!",
            error: error
          });
  }
}

const checkCreateDiscount = async (req, res, next) => {
  const { code } = req.body
  try {
    const item = await Discount.findOne({
      raw: true,
      where: {
        code,
      },
    });
    if(item){
        res.status(400).render("discount/discount-create",{item, message: "Mã giảm giá đã tồn tại!", flag: 1});
    }
    else {
      next();
    }
  } catch (error) {
    res
          .status(501)
          .json({
            message:
              "Middleware Error!",
            error: error
          });
  }
}

const checkPhoneCheckout = async (req, res, next) => {
  try {
    const info = await Customer.sequelize.query(
      "SELECT C.*, CU.phone FROM carts as C, customers as CU, accounts as A WHERE A.username = :username AND CU.id_account = A.id_account AND CU.id_customer = C.id_customer",
      {
        replacements: { username: `${req.username}` },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    if(info[0].phone){
      next();
    }
    else {
      res.status(400).json({ message: "Vui lòng cập nhật số điện thoại trước khi đặt hàng!" });
    }
  } catch (error) {
    res
          .status(501)
          .json({
            message:
              "Middleware Error!",
            error: error
          });
  }
}


const checkDiscountCode = async (req, res, next) => {
  const {code} = req.body
  try {
    if(code){
      const discount = await Discount.findOne({
        where: {
          code,
        },
      });
      if(discount){
        if(discount.quantity > 0){
          const date = new Date();
          date.setHours(date.getHours() + 7);
          if(discount.end_date >= date){
            next();
          }
          else {
            res.status(400).json({ message: "Mã giảm giá đã hết hạn sử dụng!" });
          }
        }
        else {
          res.status(400).json({ message: "Mã giảm giá đã hết lượt sử dụng!"});
        }
      }
      else{
        res.status(400).json({ message: "Mã giảm giá không tồn tại!"});
      }
    }
    else {
      next();
    }
  } catch (error) {
    res
          .status(501)
          .json({
            message:
              "Middleware Error!",
            error: error
          });
  }
}

const checkCreateRecipeItem = async (req, res, next) => {
  const {id_ingredient} = req.body
  const {id_item} = req.params
  try {
      const item = await Recipe.findOne({
        where: {
          id_item,
          id_ingredient
        },
      });
      if(item){
        if(req.params.id_item && req.params.id_ingredient){
          res.status(400).render("recipe/recipe-create",{item, message: "Công thức đã tồn tại!", flag: 2});
        }
        else{
          res.status(400).render("recipe/recipe-create",{message: "Công thức đã tồn tại!", flag: 1});
        }
      }
      else {
        next();
      }
  } catch (error) {
    res
          .status(501)
          .json({
            message:
              "Middleware Error!",
            error: error
          });
  }
}

const checkCreateRecipeIngredient = async (req, res, next) => {
  const {id_u_ingredient} = req.body
  const {id_ingredient} = req.params
  try {
      const item = await Recipe_ingredient.findOne({
        where: {
          id_u_ingredient,
          id_ingredient
        },
      });
      if(item){
        if(req.params.id_u_ingredient && req.params.id_ingredient){
          res.status(400).render("recipe/recipe-create",{item, message: "Công thức đã tồn tại!", flag: 2});
        }
        else{
          res.status(400).render("recipe/recipe-create",{ message: "Công thức đã tồn tại!", flag: 1});
        }
      }
      else {
        next();
      }
  } catch (error) {
    res
          .status(501)
          .json({
            message:
              "Middleware Error!",
            error: error
          });
  }
}

const checkCreateShippingPartner = (Model) => {
  return async (req, res, next) => {
    try {
      const { name, unit_price } = req.body;
    const item = await Model.findOne({
      raw: true,
      where: {
        name,
        unit_price
      },
    });
    if (!item) {
      next();
    } else {
      if(req.params.id_shipping_partner){
        res.status(400).render("shipping-partner/shipping-partner-create",{item, message: "Đơn vị vận chuyển đã tồn tại!", flag: 2});
      }
      else{
        res.status(400).render("shipping-partner/shipping-partner-create",{item, message: "Đơn vị vận chuyển đã tồn tại!", flag: 1});
      }
    }
    } catch (error) {
      res
          .status(501)
          .json({
            message:
              "Middleware Error!",
            error: error
          });
    }
  };
};


const checkUnConfirmedOrder = (Model) => {
  try {
    return async (req, res, next) => {
      const info = await Customer.sequelize.query(
        "SELECT C.*, CU.phone FROM carts as C, customers as CU, accounts as A WHERE A.username = :username AND CU.id_account = A.id_account AND CU.id_customer = C.id_customer",
        {
          replacements: { username: `${req.username}` },
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      const item = await Model.findOne({
        raw: true,
        where: {
          id_customer: info[0].id_customer,
          status: 0,
        },
      });
      if (!item) {
        next();
      } else {
        res.status(400).json({ message: "Đang có đơn hàng chưa xác nhận, không thể đặt thêm!" });
      }
    };
  } catch (error) {
    res
          .status(501)
          .json({
            message:
              "Middleware Error!",
            error: error
          });
  }
};

const checkCreateImportInvoiceDetail = async (req, res, next) => {
  const {id_u_ingredient} = req.body
  const {id_i_invoice} = req.params
    try {
      const item = await Import_invoice_detail.sequelize.query(
        "SELECT * FROM import_invoice_details WHERE id_i_invoice = :id_i_invoice AND id_u_ingredient = :id_u_ingredient",
        {
          replacements: { id_i_invoice, id_u_ingredient },
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      if (!item[0]) {
        next();
      } else {
        if(req.params.id_u_ingredient && req.params.id_ingredient){
          res.status(400).render("shipping_partner/shipping_partner-create",{item, message: "Đã có sản phẩm này trong hoá đơn!", flag: 2});
        }
        else{
          res.status(400).render("shipping_partner/shipping_partner-create",{item, message: "Đã có sản phẩm này trong hoá đơn!", flag: 1});
        }
      }
    } catch (error) {
      res
          .status(501)
          .json({
            message:
              "Middleware Error!",
            error: error
          });
    }
}

const checkCreateExportInvoiceDetail = async (req, res, next) => {
  const {id_u_ingredient, id_e_invoice} = req.body
    try {
      const item = await Export_invoice_detail.sequelize.query(
        "SELECT * FROM export_invoice_details WHERE id_e_invoice = :id_e_invoice AND id_u_ingredient = :id_u_ingredient",
        {
          replacements: { id_e_invoice, id_u_ingredient },
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      if (!item[0]) {
        next();
      } else {
        res.status(400).json({ message: "Đã có sản phẩm này trong hoá đơn!" });
      }
    } catch (error) {
      res
          .status(501)
          .json({
            message:
              "Middleware Error!",
            error: error
          });
    }
}

module.exports = {
  checkCreateAccount,
  checkCreateItem,
  checkItemValue,
  checkCreateReview,
  checkCreateType,
  checkCreateProvider,
  checkCreateStore,
  checkCreatePayment,
  checkCreateUnprocessedIngredient,
  checkCreateIngredient,
  checkCreateEmail,
  checkPhoneCheckout,
  checkDiscountCode,
  checkCreateShippingPartner,
  checkUnConfirmedOrder,
  checkCreateExportInvoiceDetail,
  checkCreateImportInvoiceDetail,
  checkCreateRecipeItem,
  checkCreateRecipeIngredient,
  checkCreateDiscount,
  checkCreateAccountStaff,
  checkCreateAccountShipper,
  checkCreateAccountCustomer,
  checkCreateEmailCustomer
};
