const db = require("../config/connection");
const currdateTime = require('../middleware/currdate');

exports.getDepartments = async (req, res) => {
  db.query("select * from departments", (err, result, fiels) => {
    if (!err) {
      if (result.length > 0) res.status(200).send(result);
      else res.status(404).json({ message: "Departments not found" });
    } else res.status(401).json({ status: "failed" });
  });
};

exports.createdepartment = async (req, res) => {
  data = req.body;
  db.query(
    "INSERT INTO `departments` SET ? ",
    [
      {
        department_name: data.department_name,
        ranking: data.ranking,
        status: data.status,
        created_by: data.created_by,
        updated_by: data.updated_by,
      },
    ],
    (err, result) => {
      if (!err) {
        res
          .status(200)
          .json({
            status: "success",
            message: "Department added successfully",
          });
      } else res.status(401).json({ status: "failed" });
    }
  );
};

exports.updateDepartment = async (req, res) => {
  data = req.body;
  db.query(
    "update departments set ? where department_id = ? ",
    [
      {
        department_name: data.department_name,
        ranking: data.ranking,
        status: data.status,
        updated_date: currdateTime,
        updated_by: data.updated_by,
      },
      req.params.id,
    ],
    (err, result) => {
      if (!err)
        res
          .status(200)
          .json({
            status: "success",
            message: "Department updated successfully",
          });
      else res.status(401).json({ status: "failed" });
    }
  );
};

exports.deleteDepartment = async (req, res) => {
  db.query(
    "delete from departments where department_id = ?",
    [req.params.id],
    (err, result) => {
      if (!err)
        res
          .status(200)
          .json({
            status: "success",
            message: "Department deleted successfully",
          });
      else res.status(401).json({ status: "failed" });
    }
  );
};

exports.getDepartment = async (req, res) => {
  db.query(
    "select * from departments where department_id = ?",
    [req.params.id],
    (err, result) => {
      if (!err) {
        if (result.length === 1) res.status(200).send(result);
        else res.status(401).json({ message: "Department not found" });
      } else res.status(401).json({ status: "failed" });
    }
  );
};
