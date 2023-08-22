const { Order } = require("../models");
const { QueryTypes } = require("sequelize");

const getAllReport = async (req, res) => {
  const {flag} = req.params
  try {
    const staff = await Order.sequelize.query(
      "SELECT S.* FROM staffs as S, accounts as A WHERE A.username = :username AND A.id_account = S.id_account",
      {
        replacements: { username: `${req.username}` },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
      const itemList = await Order.sequelize.query(
        "SELECT R.*, DATE_FORMAT(R.date,'%d-%m-%Y') as date, S.name as name_store FROM reports as R, stores as S WHERE R.id_store = S.id_store AND S.id_store = :id_store ORDER BY R.date DESC",
        {
          replacements: { id_store: staff[0].id_store },
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      if(flag){
        res.status(201).render("report/report-print", { itemList, id_role: req.id_role });
      }
      else{
        res.status(201).render("report/report", { itemList, id_role: req.id_role });
      }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const getReportDetail = async (req, res) => {
  const {id_report} = req.params
  try {
    const report = await Order.sequelize.query(
      "SELECT R.countOrder, CONCAT(FORMAT(SUM(R.revenue), 0)) as revenue, DATE_FORMAT(R.date,'%d-%m-%Y') as date, S.name as name_store FROM reports as R, stores as S WHERE R.id_store = S.id_store AND R.id_report = :id_report",
      {
        replacements: { id_report: id_report},
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    const itemList = await Order.sequelize.query(
      "SELECT RD.sold, CONCAT(FORMAT(RD.total, 0)) as total, I.name as name_item, I.price FROM report_details as RD, items as I WHERE I.id_item = RD.id_item AND RD.id_report = :id_report",
      {
        replacements: { id_report: id_report},
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(201).render("report/report-detail", { itemList, report: report[0], id_role: req.id_role });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

module.exports = {
    getAllReport,
    getReportDetail,
};