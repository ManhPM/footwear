const express = require('express');
const { authRouter } = require('./auth');
const { cartRouter } = require('./cart');
const { staffRouter } = require('./staff');
const { importRouter } = require('./import');
const { importDetailRouter } = require('./importDetail');
const { exportRouter } = require('./export');
const { exportDetailRouter } = require('./exportDetail');
const { invoiceRouter } = require('./invoice');
const { itemRouter } = require('./item');
const { reviewRouter } = require('./review');
const { uploadRouter } = require('./upload');
const { wishlistRouter } = require('./wishlist');
const { vnpayRouter } = require('./vnpay');
const rootRouter = express.Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/upload', uploadRouter);
rootRouter.use('/cart', cartRouter);
rootRouter.use('/staff', staffRouter);
rootRouter.use('/import', importRouter);
rootRouter.use('/importdetail', importDetailRouter);
rootRouter.use('/export', exportRouter);
rootRouter.use('/exportdetail', exportDetailRouter);
rootRouter.use('/invoice', invoiceRouter);
rootRouter.use('/item', itemRouter);
rootRouter.use('/review', reviewRouter);
rootRouter.use('/wishlist', wishlistRouter);
rootRouter.use('/vnpay', vnpayRouter);

module.exports = {
  rootRouter,
};
