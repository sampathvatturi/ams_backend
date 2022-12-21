const db = require("../config/connection");
const currdateTime = require('../middleware/currdate');

exports.getWorks = async (req, res) => {
  db.query("select * from works", (err, result, fiels) => {
    if (!err) {
      if (result.length > 0) res.status(200).send(result);
      else res.json({ message: "Works not found" });
    } else res.status(401).json({ status: "failed" });
  });
};

exports.createWork = async (req, res) => {
  data = req.body;
  db.query(
    "INSERT INTO `works` SET ? ",
    [
      {
        work_name: data.work_name,
        created_by: data.created_by,
        updated_by: data.updated_by,
      },
    ],
    (err, result, fields) => {
      if (!err) {
        res
          .status(200)
          .json({
            status: "success",
            message: "Work added successfully",
          });
      } else res.status(401).json({ status: "failed" });
    }
  );
};

exports.updateWork = async (req, res) => {
  data = req.body;
  db.query(
    "update works set ? where work_id = ? ",
    [
      {
        work_name: data.work_name,
        updated_date: currdateTime,
        updated_by: data.updated_by,
      },
      req.params.id,
    ],
    (err, result, fiels) => {
      if (!err)
        res
          .status(200)
          .json({
            status: "success",
            message: "Work updated successfully",
          });
      else res.status(401).json({ status: "failed" });
    }
  );
};

exports.deleteWork = async (req, res) => {
  db.query(
    "delete from works where work_id = ?",
    [req.params.id],
    (err, result, fields) => {
      if (!err)
        res
          .status(200)
          .json({
            status: "success",
            message: "Work deleted successfully",
          });
      else res.status(401).json({ status: "failed" });
    }
  );
};

exports.getWork = async (req, res) => {
  db.query(
    "select * from works where work_id = ?",
    [req.params.id],
    (err, result, fiels) => {
      if (!err) {
        if (result.length === 1) res.status(200).send(result);
        else res.status(401).json({ message: "Work not found" });
      } else res.status(401).json({ status: "failed" });
    }
  );
};
