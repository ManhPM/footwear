const express = require('express');
const { authRouter } = require('./auth');
const { cartRouter } = require('./cart');
const { staffRouter } = require('./staff');
const { importRouter } = require('./import');
const { importDetailRouter } = require('./importDetail');
const { invoiceRouter } = require('./invoice');
const { itemRouter } = require('./item');
const { uploadRouter } = require('./upload');
const { wishlistRouter } = require('./wishlist');
const { providerRouter } = require('./provider');
const { vnpayRouter } = require('./vnpay');
const { typeRouter } = require('./type');
const { sizeRouter } = require('./size');
const { materialRouter } = require('./material');
const { brandRouter } = require('./brand');
const { originRouter } = require('./origin');
const { paymentMethodRouter } = require('./payment_method');
const rootRouter = express.Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/upload', uploadRouter);
rootRouter.use('/cart', cartRouter);
rootRouter.use('/staff', staffRouter);
rootRouter.use('/import', importRouter);
rootRouter.use('/importdetail', importDetailRouter);
rootRouter.use('/invoice', invoiceRouter);
rootRouter.use('/item', itemRouter);
rootRouter.use('/wishlist', wishlistRouter);
rootRouter.use('/provider', providerRouter);
rootRouter.use('/type', typeRouter);
rootRouter.use('/size', sizeRouter);
rootRouter.use('/origin', originRouter);
rootRouter.use('/material', materialRouter);
rootRouter.use('/brand', brandRouter);
rootRouter.use('/payment_method', paymentMethodRouter);
rootRouter.use('/vnpay', vnpayRouter);

module.exports = {
  rootRouter,
};
