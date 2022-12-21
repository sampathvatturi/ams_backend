const db = require("../config/connection");
const currdateTime = require('../middleware/currdate');

exports.getInvoices = async (req, res) => {
  db.query("select * from invoices", (err, result) => {
    if (!err) {
      if (result.length > 0) res.status(200).send(result);
      else res.status(404).json({ message: "Invoice details not found" });
    } else res.status(401).json({ status: "failed" });
  });
};

exports.createInvoice = async (req, res) => {
  data = req.body;
  inventory_details = JSON.stringify(data.inventory_details);
  db.query(
    "INSERT INTO `invoices` SET ? ",
    [
      {
        vendor_id: data.vendor_id,
        tender_id: data.tender_id,
        title: data.title,
        remarks: data.remarks,
        invoice_number: data.invoice_number,
        inventory_details: inventory_details,
        status: data.status,
        amount: data.amount,
        tax: data.tax,
        grand_total: data.grand_total,
        attachments: data.attachments,
        created_by: data.created_by,
        updated_by: data.updated_by
      },
    ],
    (err, result) => {
      if (!err) {
        res
          .status(200)
          .json({
            status: "success",
            message: "Invoice added successfully",
          });
      } else res.status(401).json({ status: "failed" });
    }
  );
};

exports.updateInvoice = async (req, res) => {
  data = req.body;
  inventory_details = JSON.stringify(data.inventory_details);
  db.query(
    "update invoices set ? where invoice_id = ? ",
    [
      {
        vendor_id: data.vendor_id,
        tender_id: data.tender_id,
        title: data.title,
        remarks: data.remarks,
        invoice_number: data.invoice_number,
        inventory_details: inventory_details,
        status: data.status,
        amount: data.amount,
        tax: data.tax,
        grand_total: data.grand_total,
        attachments: data.attachments,
        updated_date: currdateTime,
        updated_by: data.updated_by
      },
      req.params.id,
    ],
    (err, result) => {
      if (!err)
        res
          .status(200)
          .json({
            status: "success",
            message: "Invoice details updated successfully",
          });
      else res.status(401).json({ status: "failed" });
    }
  );
};

exports.deleteInvoice = async (req, res) => {
  db.query(
    "delete from invoice where invoice_id = ?",
    [req.params.id],
    (err, result) => {
      if (!err)
        res
          .status(200)
          .json({
            status: "success",
            message: "Invoice details deleted successfully",
          });
      else res.status(401).json({ status: "failed" });
    }
  );
};

exports.getInvoice = async (req, res) => {
  db.query(
    "select * from invoice where invoice_id = ?",
    [req.params.id],
    (err, result) => {
      if (!err) {
        if (result.length === 1) res.status(200).send(result);
        else res.status(401).json({ message: "Invoice details not found" });
      } else res.status(401).json({ status: "failed" });
    }
  );
};
