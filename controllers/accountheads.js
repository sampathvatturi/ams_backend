const db = require("../config/connection");
const currdateTime = require('../middleware/currdate');

//funds
exports.getAccountHeads = async (req, res) => {
  db.query("select * from account_heads", (err, result) => {
    if (!err) {
      if (result.length > 0) res.status(200).send(result);
      else res.status(204).json({ message: "Account Heads not found" });
    } else res.status(401).json({ status: "failed" });
  });
};

exports.createAccountHead = async (req, res) => {
  data = req.body;
  db.query(
    "INSERT INTO `account_heads` SET ? ",
    [
      {
        name: data.name,
        active: 1,
        created_by: data.created_by,
        updated_by: data.updated_by
      },
    ],
    (err, result) => {
        if (!err) {
            res.status(200).json({status: "success" , message: "Account Heads added successfully" });
        } else res.status(401).json({ status: "failed" });
    }
  );
};

exports.updateAccountHead = async (req, res) => {
  data = req.body;
  db.query(
    "update account_heads set ? where id = ? ",
    [
      {       
        name: data.name,
        active: data.active,
        updated_date: currdateTime,
        updated_by: data.updated_by,
      },
      req.params.id,
    ],
    (err, result) => {
        if (!err) {
            res.status(200).json({status: "success" , message: "Account Heads updated successfully" });
        } else res.status(401).json({ status: "failed" });
    }
  );
};

