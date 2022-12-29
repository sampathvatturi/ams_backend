const db = require("../config/connection");
const currdateTime = require('../middleware/currdate');

exports.getSurveyreports = async (req, res) => {
  db.query("select * from survey_report", (err, result, fiels) => {
    if (!err) {
      if (result.length > 0) res.status(200).send(result);
      else res.json({ message: "Report not found" });
    } else res.status(401).json({ status: "failed" });
  });
};

exports.createSurveyreport = async (req, res) => {
  data = req.body;
  db.query(
    "INSERT INTO `survey_report` SET ? ",
    [
      {
        name: data.name,
        description : data.description,
        start_date : data.start_date,
        end_date : data.end_date,
        attachments: data.attachments,
        status : data.status,
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
            message: "Report added successfully",
          });
      } else res.status(401).json({ status: "failed" });
    }
  );
};

exports.updateSurveyreport = async (req, res) => {
  data = req.body;
  db.query(
    "update survey_report set ? where id = ? ",
    [
      {
        name: data.name,
        description : data.description,
        start_date : data.start_date,
        end_date : data.end_date,
        attachments: data.attachments,
        status : data.status,
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
            message: "Report updated successfully",
          });
      else res.status(401).json({ status: "failed" });
    }
  );
};

exports.deleteSurveyreport = async (req, res) => {
  db.query(
    "delete from survey_report where id = ?",
    [req.params.id],
    (err, result, fields) => {
      if (!err)
        res
          .status(200)
          .json({
            status: "success",
            message: "Report deleted successfully",
          });
      else res.status(401).json({ status: "failed" });
    }
  );
};

exports.getSurveyreport = async (req, res) => {
  db.query(
    "select * from survey_report where id = ?",
    [req.params.id],
    (err, result, fiels) => {
      if (!err) {
        if (result.length === 1) res.status(200).send(result);
        else res.status(500).json({ message: "Report not found" });
      } else res.status(401).json({ status: "failed" });
    }
  );
};
