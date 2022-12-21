const db = require("../config/connection");
const currdateTime = require('../middleware/currdate');

exports.getUoms = async (req, res) => {
  db.query("select * from uom", (err, result) => {
    if (!err) {
      if (result.length > 0) res.status(200).send(result);
      else res.status(404).json({ message: "Uom data not found" });
    } else res.status(404).json({ status: "failed" });
  });
};

exports.createUom = async (req, res) => {
  data = req.body;
  db.query(
    "INSERT INTO `uom` SET ? ",
    [
      {        
        uom_code: data.uom_code,
        uom_name: data.uom_name,
        created_by: data.created_by,
        updated_by: data.updated_by,
      },
    ],
    (err, result) => {
      if (!err) {
        res.status(200).json({ status: "success", message: data.uom_name + " added successfully"});
      } else res.status(404).json({ status: "failed" });
    }
  );
};

exports.updateUom = async (req, res) => {
  data = req.body;
  db.query(
    "update uom set ? where uom_id = ? ",
    [
      {
        uom_code: data.uom_code,
        uom_name: data.uom_name,
        updated_date: currdateTime,
        updated_by: data.updated_by,
      },
      req.params.id,
    ],
    (err, result) => {
      if (!err)
        res.status(200).json({
            status: "success",
            message: data.uom_name + " updated successfully",
        });
      else res.status(404).json({ status: "failed" });
    }
  );
};

exports.deleteUom = async (req, res) => {
  db.query(
    "delete from uom where uom_id = ?",
    [req.params.id],
    (err, result) => {
      if (!err)
        res
          .status(200)
          .json({
            status: "success",
            message: "UOM deleted successfully",
          });
      else res.status(401).json({ status: "failed" });
    }
  );
};