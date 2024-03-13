let express = require('express');
const { Invoice } = require('../models');
const vnpayRouter = express.Router();
const moment = require('moment');

vnpayRouter.post('/create_payment_url', async function (req, res, next) {
  let id_invoice = req.body.id_invoice;
  try {
    const invoice = await Invoice.findOne({
      where: {
        id_invoice,
      },
    });
    if (invoice) {
      if (invoice.total == 0) {
        res.status(400).json({
          message: 'Hoá đơn của bạn đã được thanh toán.',
        });
      } else {
        process.env.TZ = 'Asia/Ho_Chi_Minh';

        let date = new Date();
        let createDate = moment(date).format('YYYYMMDDHHmmss');

        let ipAddr =
          req.headers['x-forwarded-for'] ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress ||
          req.connection.socket.remoteAddress;

        let config = require('config');

        let tmnCode = config.get('vnp_TmnCode');
        let secretKey = config.get('vnp_HashSecret');
        let vnpUrl = config.get('vnp_Url');
        let returnUrl = config.get('vnp_ReturnUrl');
        let bankCode = 'NCB';

        let locale = req.body.language;
        if (locale === null || locale === '' || locale === undefined) {
          locale = 'vn';
        }
        let currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = id_invoice;
        vnp_Params['vnp_OrderInfo'] =
          'Thanh toán cho mã đơn hàng:' + id_invoice;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = Number(invoice.total) * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
          vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        let querystring = require('qs');
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require('crypto');
        let hmac = crypto.createHmac('sha512', secretKey);
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        res.status(200).json({ url: vnpUrl });
      }
    } else {
      res.status(400).json({
        message: 'Hoá đơn không tồn tại',
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

vnpayRouter.get('/vnpay_return', async function (req, res, next) {
  try {
    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    let id_invoice = vnp_Params.vnp_TxnRef;

    let config = require('config');
    let secretKey = config.get('vnp_HashSecret');

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require('crypto');
    let hmac = crypto.createHmac('sha512', secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
    const invoice = await Invoice.findOne({
      where: {
        id_invoice,
      },
      raw: false,
    });
    invoice.total = 0;
    await invoice.save();
    res.status(200).json({ message: 'GIAO DỊCH THÀNH CÔNG' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

vnpayRouter.post('/refund', function (req, res, next) {
  process.env.TZ = 'Asia/Ho_Chi_Minh';
  let date = new Date();

  let config = require('config');
  let crypto = require('crypto');

  let vnp_TmnCode = config.get('vnp_TmnCode');
  let secretKey = config.get('vnp_HashSecret');
  let vnp_Api = config.get('vnp_Api');

  let vnp_TxnRef = req.body.orderId;
  let vnp_TransactionDate = req.body.transDate;
  let vnp_Amount = req.body.amount * 100;
  let vnp_TransactionType = req.body.transType;
  let vnp_CreateBy = req.body.user;

  let currCode = 'VND';

  let vnp_RequestId = moment(date).format('HHmmss');
  let vnp_Version = '2.1.0';
  let vnp_Command = 'refund';
  let vnp_OrderInfo = 'Hoan tien GD ma:' + vnp_TxnRef;

  let vnp_IpAddr =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');

  let vnp_TransactionNo = '0';

  let data =
    vnp_RequestId +
    '|' +
    vnp_Version +
    '|' +
    vnp_Command +
    '|' +
    vnp_TmnCode +
    '|' +
    vnp_TransactionType +
    '|' +
    vnp_TxnRef +
    '|' +
    vnp_Amount +
    '|' +
    vnp_TransactionNo +
    '|' +
    vnp_TransactionDate +
    '|' +
    vnp_CreateBy +
    '|' +
    vnp_CreateDate +
    '|' +
    vnp_IpAddr +
    '|' +
    vnp_OrderInfo;
  let hmac = crypto.createHmac('sha512', secretKey);
  let vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest('hex');

  let dataObj = {
    vnp_RequestId: vnp_RequestId,
    vnp_Version: vnp_Version,
    vnp_Command: vnp_Command,
    vnp_TmnCode: vnp_TmnCode,
    vnp_TransactionType: vnp_TransactionType,
    vnp_TxnRef: vnp_TxnRef,
    vnp_Amount: vnp_Amount,
    vnp_TransactionNo: vnp_TransactionNo,
    vnp_CreateBy: vnp_CreateBy,
    vnp_OrderInfo: vnp_OrderInfo,
    vnp_TransactionDate: vnp_TransactionDate,
    vnp_CreateDate: vnp_CreateDate,
    vnp_IpAddr: vnp_IpAddr,
    vnp_SecureHash: vnp_SecureHash,
  };

  request(
    {
      url: vnp_Api,
      method: 'POST',
      json: true,
      body: dataObj,
    },
    function (error, response, body) {
      console.log(response);
    },
  );
});

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}

module.exports = {
  vnpayRouter,
};
