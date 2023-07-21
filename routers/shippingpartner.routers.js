const express = require("express");
const {Shipping_partner} = require("../models")
const { getAllShippingPartner, createShippingPartner, updateShippingPartner, getDetailShippingPartner, getAllShippingPartnerAdmin, createForm, getAllShipper, getDetailShipper, updateShipper, createFormShipper } = require("../controllers/shippingpartner.controllers.js");
const {authenticate} = require("../middlewares/auth/authenticate.js")
const {authorize} = require("../middlewares/auth/authorize.js");
const { checkCreateShippingPartner } = require("../middlewares/validates/checkCreate.js");
const shippingPartnerRouter = express.Router();

shippingPartnerRouter.get("/", getAllShippingPartner);
shippingPartnerRouter.get("/shipper/:id_shipping_partner", authenticate, authorize(["Admin"]), getAllShipper);
shippingPartnerRouter.get("/shipper/detail/:id_shipper", authenticate, authorize(["Admin"]), getDetailShipper);
shippingPartnerRouter.put("/shipper/update/:id_shipper", authenticate, authorize(["Admin"]), updateShipper);
shippingPartnerRouter.get("/shipper/createform/:id_shipping_partner", authenticate, authorize(["Admin"]), createFormShipper);
shippingPartnerRouter.get("/admin", authenticate, authorize(["Admin"]), getAllShippingPartnerAdmin);
shippingPartnerRouter.get("/detail/:id_shipping_partner", authenticate, authorize(["Admin"]), getDetailShippingPartner);
shippingPartnerRouter.get("/createform", authenticate, authorize(["Admin"]), createForm);
shippingPartnerRouter.post("/create", authenticate, authorize(["Admin"]), checkCreateShippingPartner(Shipping_partner), createShippingPartner);
shippingPartnerRouter.put("/update/:id_shipping_partner", authenticate, authorize(["Admin"]), checkCreateShippingPartner(Shipping_partner), updateShippingPartner);

module.exports = {
    shippingPartnerRouter,
}