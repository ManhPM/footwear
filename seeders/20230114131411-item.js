"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Items", [
      {
        type: "Sneakers",
        name: "Nike Air Max 90",
        image:
          "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9f684ace-3163-4227-8f85-2d2a067dd4f5/air-max-90-gore-tex-shoes-K3mBRb.png",
        quantity: 50,
        size: 42,
        price: 2500000,
        description:
          "Giày thể thao phong cách, màu đen trắng.",
        brand: "Nike",
        origin: "Việt Nam",
        material: "Da và vải",
        status: 1,
      },
      {
        type: "Sandals",
        name: "Havaianas Slim",
        image:
          "https://img.lazcdn.com/g/p/5593e19c1850e7ee8d73852a2afc58d8.jpg_720x720q80.jpg",
        quantity: 50,
        size: 37,
        price: 350000,
        description:
          "Sandals đơn giản, màu hồng pastel",
        brand: "Havaianas",
        origin: "Brazil",
        material: "Cao su",
        status: 1,
      },
      {
        type: "Boots",
        name: "Timberland Classic 6-Inch",
        image:
          "https://images.timberland.com/is/image/timberland/18094231-ALT4?hei=650&wid=650&qlt=50&resMode=sharp2&op_usm=0.9,1.0,8,0",
        quantity: 50,
        size: 40,
        price: 3200000,
        description:
          " Boots chất lượng cao, màu nâu",
        brand: "Timberland",
        origin: "Việt Nam",
        material: "Da",
        status: 1,
      },
      {
        type: "Flats",
        name: "Melissa Ultragirl Sweet",
        image:
          "https://www.melissashoes.vn/cdn/shop/files/Thi_tk_ch_acoten_13_1360x.png?v=1698633343",
        quantity: 50,
        size: 38,
        price: 1000000,
        description:
          "Giày bệt dễ thương, màu hồng",
        brand: "Melissa",
        origin: "Brazil",
        material: "Nhựa PVC",
        status: 1,
      },
      {
        type: "Running Shoes",
        name: "Asics Gel-Kayano 28",
        image:
          "https://storage.sg.content-cdn.io/cdn-cgi/image/%7Bwidth%7D,%7Bheight%7D,quality=75,format=auto,fit=cover,g=top/in-resources/92ab8ec8-2216-4f1c-8333-c10c5e7d01c9/Images/ProductImages/Source/1011B189_005_0020031644_RT.jpg",
        quantity: 50,
        size: 39,
        price: 2800000,
        description:
          "Giày chạy bộ thoải mái, màu xanh dương",
        brand: "Asics",
        origin: "Việt Nam",
        material: "Vải và cao su",
        status: 1,
      },
      {
        type: "High Heels",
        name: "Christian Louboutin So Kate",
        image:
          "https://news.harvard.edu/wp-content/uploads/2022/02/20220218_dresscode.jpg",
        quantity: 50,
        size: 36,
        price: 12000000,
        description:
          "Giày cao gót sang trọng, màu đỏ",
        brand: "Christian Louboutin",
        origin: "Ý",
        material: "Da",
        status: 1,
      },
      {
        type: "Espadrilles",
        name: "TOMS Alpargata",
        image:
          "https://product.hstatic.net/1000376021/product/10017831_1_a92ee7951dac4464ba294814d5b0264a_6b3938c8f44c428a8ad4463ccbe3b74e_master.jpg",
        quantity: 50,
        size: 41,
        price: 600000,
        description:
          "Giày lười thoải mái, màu xám",
        brand: "TOMS",
        origin: "Argentina",
        material: "Vải",
        status: 1,
      },
      {
        type: "Flip Flops",
        name: "Reef Fanning",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA6XLi633cPqkH05azfzL5BIc1n3GUoWM23qt8jD7xcA&s",
        quantity: 50,
        size: 43,
        price: 1200000,
        description:
          "Đôi dép quai hậu thể thao, màu xanh dương",
        brand: "Reef",
        origin: "Brazil",
        material: "Cao su",
        status: 1,
      },
      {
        type: "Sandals",
        name: "Birkenstock Arizona",
        image:
          "https://cdn.authentic-shoes.com/wp-content/uploads/2023/04/151213_61b873f3c7624e0994db6201da5e3241.png",
        quantity: 50,
        size: 42,
        price: 1800000,
        description:
          "Sandals chất lượng, màu nâu",
        brand: "Birkenstock",
        origin: "Đức",
        material: "Da và cao su",
        status: 1,
      },
      {
        type: "Running Shoes",
        name: "New Balance Fresh Foam 1080",
        image:
          "https://bizweb.dktcdn.net/100/455/705/products/nbnam2.jpg?v=1703005071660",
        quantity: 50,
        size: 41,
        price: 2300000,
        description:
          "Giày chạy bộ êm ái, màu xám đen",
        brand: "New Balance",
        origin: "Trung Quốc",
        material: "Vải và cao su",
        status: 1,
      },
      {
        type: "High Heels",
        name: "Jimmy Choo Romy",
        image:
          "https://cdn-images.farfetch-contents.com/11/44/67/88/11446788_6857896_600.jpg",
        quantity: 50,
        size: 37,
        price: 8500000,
        description:
          "Giày cao gót sang trọng, màu đen",
        brand: "Jimmy Choo",
        origin: "Ý",
        material: "Da",
        status: 1,
      },
      {
        type: "Boots",
        name: "Dr. Martens 1460",
        image:
          "https://lh5.googleusercontent.com/proxy/mIjwPWNT7q5TBFt5XmPHvUXx36gXIoMiCvmK-5kLhM9Aa7ExLqkSDVQ7eWKRD0IAdhimLyBAN8U5PnMeB_nV28nCR4IHqyG7KWSxZYvhiA",
        quantity: 50,
        size: 42,
        price: 3500000,
        description:
          "Boots da thời trang, màu đen",
        brand: "Dr. Martens",
        origin: "Anh",
        material: "Da",
        status: 1,
      },
      {
        type: "Loafers",
        name: "Gucci Princetown",
        image:
          "https://media.gucci.com/style/DarkGray_Center_0_0_490x490/1449789307/423513_BLM00_1000_001_094_0000_Light.jpg",
        quantity: 50,
        size: 37,
        price: 8500000,
        description:
          "Giày cao gót sang trọng, màu đen",
        brand: "Gucci",
        origin: "Ý",
        material: "Da",
        status: 1,
      },{
        type: "Ballet Flats",
        name: "Chanel Ballerina",
        image:
          "https://bizweb.dktcdn.net/100/106/923/products/3-3f682079-9cae-44ad-ab22-de8d5b8bc110.jpg?v=1684685861720",
        quantity: 50,
        size: 38,
        price: 10200000,
        description:
          "Giày búp bê đẳng cấp, màu trắng đen",
        brand: "Chanel",
        origin: "Pháp",
        material: "Da",
        status: 1,
      },
      {
        type: "Ankle Boots",
        name: "Saint Laurent Loulou",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSya4hk3TszNgpqyOozHrU9jqc2dwJ6WHGlKOBc6SVUgg&s",
        quantity: 50,
        size: 39,
        price: 9000000,
        description:
          "Boots mắt cáo thanh lịch, màu đen",
        brand: "Saint Laurent",
        origin: "Ý",
        material: "Da",
        status: 1,
      },{
        type: "Sneakers",
        name: "Adidas Superstar",
        image:
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/7ed0855435194229a525aad6009a0497_9366/Giay_Superstar_trang_EG4958_01_standard.jpg",
        quantity: 50,
        size: 40,
        price: 1800000,
        description:
          "Giày thể thao phong cách, màu trắng đen",
        brand: "Adidas",
        origin: "Việt Nam",
        material: "Da và cao su",
        status: 1,
      },{
        type: "Wedge Sandals",
        name: "Stuart Weitzman Nudistsong",
        image:
          "https://www.cln.com.ph/cdn/shop/files/Sunset_Beige_1_1024x1024.jpg?v=1701820779",
        quantity: 50,
        size: 36,
        price: 6500000,
        description:
          "Sandals gót vuông, màu nude",
        brand: "Stuart Weitzman",
        origin: "Tây Ban Nha",
        material: "Da",
        status: 1,
      },{
        type: "Platform Sandals",
        name: "Prada Logo",
        image:
          "https://www.pedroshoes.com/dw/image/v2/BCWJ_PRD/on/demandware.static/-/Sites-pd_vn-products/default/dwc1c1f299/images/hi-res/2023-L3-PW1-46680006-01-1.jpg?sw=1152&sh=1536",
        quantity: 50,
        size: 38,
        price: 15000000,
        description:
          "Sandals cao gót, có logo Prada",
        brand: "Prada",
        origin: "Ý",
        material: "Da",
        status: 1,
      },{
        type: "Oxford Shoes",
        name: "Church’s Shannon",
        image:
          "https://assets.herringshoes.co.uk/_shop/imagelib/4/25/166/church_shannon_in_black_polished_binder_1.jpg",
        quantity: 50,
        size: 42,
        price: 12500000,
        description:
          "Giày lịch lãm, màu nâu",
        brand: "Church’s",
        origin: "Anh",
        material: "Da",
        status: 1,
      },{
        type: "Espadrilles",
        name: "Castañer Carina",
        image:
          "https://img01.ztat.net/article/spp-media-p1/80105d79859541e4b7cd48e3f631f2bf/27fc6e8b329b4e2fb65ef33f6ca7cf0e.jpg?imwidth=1800&filter=packshot",
        quantity: 50,
        size: 42,
        price: 1200000,
        description:
          "Giày lười thoải mái, màu xám",
        brand: "Castañer",
        origin: "Tây Ban Nha",
        material: "Da",
        status: 1,
      },{
        type: "Wedge Sandals",
        name: "Stuart Weitzman Nudistsong",
        image:
          "https://eu.stuartweitzman.com/dw/image/v2/AAGA_PRD/on/demandware.static/-/Sites-04/default/dw8a52a805/images/zoom/NUDISTSOANI_ADO_1.JPG?sw=320&sh=364&sm=fit",
        quantity: 50,
        size: 36,
        price: 6500000,
        description:
          "Sandals gót vuông, màu nude",
        brand: "Stuart Weitzman",
        origin: "Tây Ban Nha",
        material: "Da",
        status: 1,
      },{
        type: "Platform Sandals",
        name: "Prada Logo",
        image:
          "https://cdn.saksfifthavenue.com/is/image/saks/0400016927069_NERO?wid=600&hei=800&qlt=90&resMode=sharp2&op_usm=0.9%2C1.0%2C8%2C0",
        quantity: 50,
        size: 38,
        price: 15000000,
        description:
          "Sandals cao gót, có logo Prada",
        brand: "Prada",
        origin: "Ý",
        material: "Da",
        status: 1,
      }
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
