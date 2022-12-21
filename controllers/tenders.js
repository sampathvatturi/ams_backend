const db = require("../config/connection");
const currdateTime = require("../middleware/currdate");

exports.getTenders = async (req, res) => {
  db.query(
    "select * from tenders",
    (err, result) => {
      if (!err) {
        if (result.length > 0) res.status(200).send(result);
        else res.status(200).json({ message: "Tenders Not found" });
      } else res.status(404).json({ status: "failed" });
    }
  );
};

exports.createTender = async (req, res) => {
  data = req.body;
  work_id = data.work_id.toString();
  start_date = data.start_date.toString().replace(/T/, ' ').replace(/\..+/, '');
  end_date = data.end_date.toString().replace(/T/, ' ').replace(/\..+/, '');
  db.query(
    "INSERT INTO `tenders` SET ? ",
    [
      {
        title: data.title,
        description: data.description,
        work_id: work_id,
        location: data.location,
        tender_cost: data.tender_cost,
        status: data.status,
        start_date: start_date,
        end_date: end_date,
        attachments: data.attachments,
        created_by: data.created_by,
        updated_by: data.updated_by
      },
    ],
    (err, result) => {
      if (!err) {
        res
          .status(200)
          .json({ status: "success", message: "Tendor added successfully" });
      } else res.status(404).json({ status: "failed" });
    }
  );
};

exports.updateTender = async (req, res) => {
  data = req.body;
  work_id = data.work_id.toString();
  start_date = data.start_date.toString().replace(/T/, ' ').replace(/\..+/, '');
  end_date = data.end_date.toString().replace(/T/, ' ').replace(/\..+/, '');
  db.query(
    "update tenders set ? where id = ? ",
    [
      {
        title: data.title,
        description: data.description,
        work_id: work_id,
        location: data.location,
        tender_cost: data.tender_cost,
        status: data.status,
        start_date: start_date,
        end_date: end_date,
        attachments: data.attachments,
        updated_by: data.updated_by
      },
      req.params.id,
    ],
    (err, result) => {
      console.log(result);
      if (!err)
        res
          .status(200)
          .json({ status: "success", message: "Tender updated successfully" });
      else res.status(404).json({ status: "failed" });
    }
  );
};

exports.deleteTender = async (req, res) => {
  db.query(
    "delete from tenders where id = ?",
    [req.params.id],
    (err, result) => {
      if (!err)
        res
          .status(200)
          .json({ status: "success", message: "Tender deleted successfully" });
      else res.status(404).json({ status: "failed" });
    }
  );
};

exports.getTender= async (req, res) => {
  db.query(
    "select * from tenders where id = ?",
    [req.params.id],
    (err, result) => {
      if (!err) {
        if (result.lenght === 1) res.status(200).send(result);
        else res.status(200).json({ message: "No Tenders found" });
      } else res.status(404).json({ status: "failed" });
    }
  );
};

exports.updateTenderUserStatus = async (req, res) => {
  data = req.body;
  db.query(
    "update tenders set ? where id = ? ",
    [
      {
        tender_user_status: JSON.stringify(data.tender_user_status),
        status:data.status,
        updated_date: currdateTime,
        updated_by: data.updated_by
      },
      req.params.id,
    ],
    (err, result) => {
      console.log(result, err);
      if (!err)
        res.status(200).json({ status: "success", message: "Updated successfully" });
      else 
        res.status(404).json({ status: "failed" });
    }
  );
};

exports.assignTender = async (req, res) => {
  data = req.body;
  tender_user_status=[];
  data.tender_user_status.forEach(element => {
    let temp = {
      "user_id" : element,
      "status" : "pending",
      "remarks":""
    };
    tender_user_status.push(temp)
  });
  
  db.query(
    "update `tenders` SET ? where tender_id = ? ",
    [
      {
        vendor_id: data.vendor_id,
        status: data.status,
        tender_user_status: JSON.stringify(tender_user_status),
        updated_by: data.updated_by
      },
    ],
    (err, result, fields) => {
      if (!err) {
        res
          .status(200)
          .json({ status: "success", message: "Tendor Assigned successfully" });
      } else res.status(404).json({ status: "failed" });
    }
  );
};

exports.getVendorTenders = async (req, res) => {
  db.query(
    "select t.*, v.vendor_name from tenders t, vendors v where t.vendor_id=v.vendor_id",
    (err, result) => {
      if (!err) {
        if (result.length > 0) res.status(200).send(result);
        else res.status(200).json({ message: "Tenders Not found" });
      } else res.status(404).json({ status: "failed" });
    }
  );
};
