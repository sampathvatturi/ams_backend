const db = require("../config/connection");
const currdateTime = require('../middleware/currdate');
const { createTransaction } = require("./transactions");

exports.getInvoices = async (req, res) => {
  db.query("select i.*, v.vendor_name from invoices i, vendors v where i.vendor_id=v.vendor_id", (err, result) => {
    if (!err) {
      if (result.length > 0) res.status(200).send(result);
      else res.status(200).json({ message: "No Invoices Data"});
    } else res.status(401).json({ status: "failed" });
  });
}

exports.createInvoice = async (req, res) => {
  data = req.body;
  inventory_details = JSON.stringify(data.inventory_details);
  let user_status_list = [
    { "reason": "", "status": "Pending", "department_id": 15 },
    { "reason": "", "status": "Pending", "department_id": 23 }
  ];
  user_status_list = JSON.stringify(user_status_list);
  var invoice_number;
  var date_ob = new Date();
  var curr_year = date_ob.getFullYear();
  var year;
  db.query("select invoice_number from invoices order by invoice_number desc limit 1", (err, result) => {
    if (!err) {
      if (result !=''){
        invoice_number = result[0]['invoice_number'];
        year = invoice_number.substring(3, 7);
        if(year<curr_year && (parseInt(curr_year)-parseInt(year)===1)){
          year = parseInt(year)+1;
        }
        
        invoice_number = invoice_number.substring(0, 3) +year+ (parseInt(invoice_number.substring(7)) + 1).toString().padStart(4, "0");
        db.query(
          "INSERT INTO `invoices` SET ? ",
          [
            {
              vendor_id: data.vendor_id,
              tender_id: data.tender_id,
              title: data.title,
              remarks: data.remarks,
              invoice_number: invoice_number,
              inventory_details: inventory_details,
              status: data.status,
              amount: data.amount,
              tax: data.tax,
              grand_total: data.grand_total,
              attachments: data.attachments,
              created_by: data.created_by,
              updated_by: data.updated_by,
              invoice_user_status: user_status_list
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
        }else{
          invoice_number = 'INV'+curr_year+'00001';
          db.query(
            "INSERT INTO `invoices` SET ? ",
            [
              {
                vendor_id: data.vendor_id,
                tender_id: data.tender_id,
                title: data.title,
                remarks: data.remarks,
                invoice_number: invoice_number,
                inventory_details: inventory_details,
                status: data.status,
                amount: data.amount,
                tax: data.tax,
                grand_total: data.grand_total,
                attachments: data.attachments,
                created_by: data.created_by,
                updated_by: data.updated_by,
                invoice_user_status: user_status_list
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
      } 
    } else res.status(401).json({ status: "failed" });
  });
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
      if (!err){
        res.status(200).json({ status: "success", message: "Invoice details updated successfully" });
      } else {
        res.status(401).json({ status: "failed" });
      }
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

exports.getVendorInvoices = async (req, res) => {
  db.query(
    "select i.*, v.vendor_name from invoices i, vendors v where i.vendor_id=v.vendor_id",
    (err, result) => {
      if (!err) {
        if (result.length > 0) res.status(200).send(result);
        else res.status(200).json({ message: "Invoices are not found" });
      } else res.status(404).json({ status: "failed" });
    }
  );
};

exports.updateInvoiceUserStatus = async (req, res) => {
  data = req.body;
  db.query(
    "update invoices set ? where invoice_id = ? ",
    [
      {
        invoice_user_status: JSON.stringify(data.invoice_user_status),
        status:data.status,
        updated_date: currdateTime,
        updated_by: data.updated_by
      },
      req.params.id,
    ],
    (err, result) => {
      if (!err) {
        if(data.status === 'paid') {
            let details = {
              acc_head : data.main_acct_id,
              type: 'invoices',
              remarks: 'Invoice Bill Paid for ' + data.vendor_name,
              mode: 'banking',
              trsxcn_date: currdateTime,
              amount: data.amount,
              created_by: data.updated_by,
              ref_acc_head: data.vendor_acct_id
             }
            if(createTransaction(details))
              res.status(200).json({status: "success", message: "Successfully done!"});
            else
              res.status(500).json({status: "failed", message: "Failed"});     
        } else {
          res.status(200).json({status: "success", message: "Successfully done!"});
        }
      } else {
        res.status(404).json({ status: "failed" });
      }
    });
  };