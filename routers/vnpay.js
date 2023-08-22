let express = require('express');
const {Order} = require("../models");
let router = express.Router();
const moment = require('moment');


router.get('/create_payment_url', function (req, res, next) {
    res.render('vnpay/order', {title: 'Tạo mới đơn hàng', amount: 10000, id_order: 15})
});

router.post('/create_payment_url', async function (req, res, next) {
    let id_order = req.body.id_order;
    try {
        const order = await Order.findOne({
            raw: true,
            where: {
            id_order,
            }
        });
        
        if(id_order <= 0){
            res.render('vnpay/success', {flag: 2, message: "Mã đơn hàng phải lớn hơn 0."})
        }
        else if(order){
            if(order.total == 0){
                res.render('vnpay/success', {flag: 2, message: "Hoá đơn của bạn đã được thanh toán."})
            }
            else if(order.id_payment != 1){
                res.render('vnpay/success', {flag: 2, message: "Hoá đơn này phải thanh toán khi nhận hàng."})
            }
            else{
            process.env.TZ = 'Asia/Ho_Chi_Minh';
            
            let date = new Date();
            let createDate = moment(date).format('YYYYMMDDHHmmss');
            
            let ipAddr = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            let config = require('config');
            
            let tmnCode = config.get('vnp_TmnCode');
            let secretKey = config.get('vnp_HashSecret');
            let vnpUrl = config.get('vnp_Url');
            let returnUrl = config.get('vnp_ReturnUrl');
            let bankCode = req.body.bankCode;
            
            let locale = req.body.language;
            if(locale === null || locale === ''){
                locale = 'vn';
            }
            let currCode = 'VND';
            let vnp_Params = {};
            vnp_Params['vnp_Version'] = '2.1.0';
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = tmnCode;
            vnp_Params['vnp_Locale'] = locale;
            vnp_Params['vnp_CurrCode'] = currCode;
            vnp_Params['vnp_TxnRef'] = id_order;
            vnp_Params['vnp_OrderInfo'] = 'Thanh toán cho mã đơn hàng:' + id_order;
            vnp_Params['vnp_OrderType'] = 'other';
            vnp_Params['vnp_Amount'] = order.total * 100;
            vnp_Params['vnp_ReturnUrl'] = returnUrl;
            vnp_Params['vnp_IpAddr'] = ipAddr;
            vnp_Params['vnp_CreateDate'] = createDate;
            if(bankCode !== null && bankCode !== ''){
                vnp_Params['vnp_BankCode'] = bankCode;
            }

            vnp_Params = sortObject(vnp_Params);

            let querystring = require('qs');
            let signData = querystring.stringify(vnp_Params, { encode: false });
            let crypto = require("crypto");     
            let hmac = crypto.createHmac("sha512", secretKey);
            let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
            vnp_Params['vnp_SecureHash'] = signed;
            vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
            res.redirect(vnpUrl)
            }
        }
    } catch (error) {
        res.render('vnpay/success', {flag: 2, message: error})
    }
});

router.get('/vnpay_return', async function (req, res, next) {
    try {
        let vnp_Params = req.query;

        let secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        let id_order = vnp_Params.vnp_TxnRef;

        let config = require('config');
        let secretKey = config.get('vnp_HashSecret');

        let querystring = require('qs');
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");     
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     
        // if(secureHash === signed){
            console.log(amount, id_order)
            const order = await Order.findOne({
                where: {
                id_order,
                }
            });
            order.total = 0;
            await order.save();
            res.render('vnpay/success', {flag: 1})
    } catch (error) {
        res.render('vnpay/success', {flag: 2, message: error})
    }
});

router.post('/refund', function (req, res, next) {
    
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    let date = new Date();

    let config = require('config');
    let crypto = require("crypto");
   
    let vnp_TmnCode = config.get('vnp_TmnCode');
    let secretKey = config.get('vnp_HashSecret');
    let vnp_Api = config.get('vnp_Api');
    
    let vnp_TxnRef = req.body.orderId;
    let vnp_TransactionDate = req.body.transDate;
    let vnp_Amount = req.body.amount *100;
    let vnp_TransactionType = req.body.transType;
    let vnp_CreateBy = req.body.user;
            
    let currCode = 'VND';
    
    let vnp_RequestId = moment(date).format('HHmmss');
    let vnp_Version = '2.1.0';
    let vnp_Command = 'refund';
    let vnp_OrderInfo = 'Hoan tien GD ma:' + vnp_TxnRef;
            
    let vnp_IpAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    
    let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');
    
    let vnp_TransactionNo = '0';
    
    let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TransactionType + "|" + vnp_TxnRef + "|" + vnp_Amount + "|" + vnp_TransactionNo + "|" + vnp_TransactionDate + "|" + vnp_CreateBy + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;
    let hmac = crypto.createHmac("sha512", secretKey);
    let vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest("hex");
    
     let dataObj = {
        'vnp_RequestId': vnp_RequestId,
        'vnp_Version': vnp_Version,
        'vnp_Command': vnp_Command,
        'vnp_TmnCode': vnp_TmnCode,
        'vnp_TransactionType': vnp_TransactionType,
        'vnp_TxnRef': vnp_TxnRef,
        'vnp_Amount': vnp_Amount,
        'vnp_TransactionNo': vnp_TransactionNo,
        'vnp_CreateBy': vnp_CreateBy,
        'vnp_OrderInfo': vnp_OrderInfo,
        'vnp_TransactionDate': vnp_TransactionDate,
        'vnp_CreateDate': vnp_CreateDate,
        'vnp_IpAddr': vnp_IpAddr,
        'vnp_SecureHash': vnp_SecureHash
    };
    
    request({
        url: vnp_Api,
        method: "POST",
        json: true,   
        body: dataObj
            }, function (error, response, body){
                console.log(response);
            });
    
});

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = router;