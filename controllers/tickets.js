const db = require("../config/connection");
const currdateTime = require("../middleware/currdate");

//tickets
exports.getTickets = async (req, res) => {
  db.query(
    "select t.ticket_id,t.ticket_description,t.location,t.status,t.created_date,t.work_id,t.tender_cost,t.vendor_id,v.vendor_name,t.json_status from tickets t,vendors v where t.vendor_id = v.vendor_id",
    (err, result, fields) => {
      if (!err) {
        if (result.length > 0) res.status(200).send(result);
        else res.status(200).json({ message: "No Tickets found" });
      } else res.status(404).json({ status: "failed" });
    }
  );
};

exports.createTicket = async (req, res) => {
  data = req.body;
  work_id = data.work_id.toString();
  json_data=[];
  data.assign_to.forEach(element => {
    let temp = {
      "user_id" : element,
      "status" : false
    };
    json_data.push(temp)
  });
  
  db.query(
    "INSERT INTO `tickets` SET ? ",
    [
      {
        ticket_description: data.ticket_description,
        vendor_id: data.vendor_id,
        work_id: work_id,
        location: data.location,
        tender_cost: data.tender_cost,
        status: data.status,
        json_status: JSON.stringify(json_data),
        department_id: data.department_id,
        created_by: data.created_by,
        updated_by: data.updated_by,
      },
    ],
    (err, result, fields) => {
      if (!err) {
        res
          .status(200)
          .json({ status: "success", message: "Ticket added successfully" });
      } else res.status(404).json({ status: "failed" });
    }
  );
};

exports.updateTicket = async (req, res) => {
  data = req.body;
  work_id = data.work_id.toString();
  json_data=[];
  data.assign_to.forEach(element => {
    let temp = {
      "user_id" : element,
      "status" : false
    };
    json_data.push(temp)
  });
  db.query(
    "update tickets set ? where ticket_id = ? ",
    [
      {
        ticket_description: data.ticket_description,
        vendor_id: data.vendor_id,
        work_id: work_id,
        location: data.location,
        tender_cost: data.tender_cost,
        status: data.status,
        json_status: JSON.stringify(json_data),
        department_id: data.department_id,
        updated_date: currdateTime,
        updated_by: data.updated_by,
      },
      req.params.id,
    ],
    (err, result, fields) => {
      console.log(result);
      if (!err)
        res
          .status(200)
          .json({ status: "success", message: "Ticket updated successfully" });
      else res.status(404).json({ status: "failed" });
    }
  );
};

exports.deleteTicket = async (req, res) => {
  db.query(
    "delete from tickets where ticket_id = ?",
    [req.params.id],
    (err, result, fields) => {
      if (!err)
        res
          .status(200)
          .json({ status: "success", message: "Ticket deleted successfully" });
      else res.status(404).json({ status: "failed" });
    }
  );
};

exports.getTicket = async (req, res) => {
  db.query(
    "select * from ticketswhere ticket_id = ?",
    [req.params.id],
    (err, result, fields) => {
      if (!err) {
        if (result.lenght === 1) res.status(200).send(result);
        else res.status(200).json({ message: "No Ticket found" });
      } else res.status(404).json({ status: "failed" });
    }
  );
};
