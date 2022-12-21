const db = require("../config/connection");
const currdateTime = require('../middleware/currdate');

exports.getInventory = async (req, res) => {
  db.query("select i.*,u.uom_code,u.uom_name from inventory i, uom u where i.uom_id=u.uom_id", (err, result) => {
    if (!err) {
      if (result.length > 0) res.status(200).send(result);
      else res.status(404).json({ message: "Inventory data not found" });
    } else res.status(401).json({ status: "failed" });
  });
};

exports.createInventory = async (req, res) => {
  data = req.body;
  db.query(
    "INSERT INTO `inventory` SET ? ",
    [
      {
        item_name: data.item_name,
        uom_id: data.uom_id,
        price: data.price,
        tax: data.tax,
        created_by: data.created_by,
        updated_by: data.updated_by,
      },
    ],
    (err, result, fields) => {
      if (!err) {
        res.status(200).json({
            status: "success",
            message: data.item_name+" added successfully",
          });
      } else res.status(404).json({ status: "failed" });
    }
  );
};

exports.updateInventory = async (req, res) => {
  data = req.body;
  db.query(
    "update inventory set ? where item_id = ? ",
    [
      {
        item_name: data.item_name,
        uom_id: data.uom_id,
        price: data.price,
        tax: data.tax,
        updated_date: currdateTime,
        updated_by: data.updated_by,
      },
      req.params.id,
    ],
    (err, result) => {
      if (!err)
        res.status(200).json({
            status: "success",
            message: data.item_name+" updated successfully",
        });
      else res.status(404).json({ status: "failed" });
    }
  );
};

exports.deleteInventory = async (req, res) => {
  db.query(
    "delete from inventory where item_id = ?",
    [req.params.id],
    (err, result, fields) => {
      if (!err)
        res
          .status(200)
          .json({
            status: "success",
            message: "Inventory item deleted successfully",
          });
      else res.status(401).json({ status: "failed" });
    }
  );
};

exports.getInventoryitem = async (req, res) => {
  db.query("select * from inventory where item_id = ?",
    [req.params.id], (err, result) => {
      if (!err) {
        if (result.length === 1) 
          res.status(200).send(result);
        else res.status(404).json({ message: "Invoice details not found" });
      } else res.status(404).json({ status: "failed" });
    }
  );
};
