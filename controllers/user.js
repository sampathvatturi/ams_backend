const db = require("../config/connection");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const auth = require("../services/authentication");
const roleCheck = require("../services/checkrole");
const dateTime = require("../middleware/currdate");

//User Login Authentication//
exports.loginUser = async (req, res) => {
  let data = req.body;
  user_name = data.email;
  password = data.password;
  const query = "select * from users where (user_name = '" + user_name + "' and password_md5 = '"
  + password  + "') or (email = '" + user_name + "' and password_md5 = '" + password + "')";
  console.log(query);
  db.query(query, (err, result) => {
    console.log(err, result);
    if (!err) {
      if (result.length === 1) {
        if (result[0].status == "inactive") {
          res.status(401).json({ message: "User is in-active, Please contact admin" });
        } else if (result[0].password_md5 == password) {
          const response = {
            user_name: result[0].user_name,
            email: result[0].email,
            role: "admin",
          };
          const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
            expiresIn: "3h",
          });
          session_user_data = {
            user_id: result[0].user_id,
            first_name: result[0].first_name,
            last_name: result[0].last_name,
            email: result[0].email,
            role: result[0].role,
            status: result[0].status,
            department_id: result[0].department_id,
          };
          res.status(200).json({ token: accessToken, user_data: session_user_data });
          db.query("update users set login_time= '" + dateTime + "' where user_id = '" + result[0].user_id + "'");
        } else {
          res.status(400).json({ message: "Somthing went wrong, Please try again later." });
        }
      } else {
        res.status(401).json({ message: "Incorrect Username or Password." });
      }
    } else {
      res.status(404).json({ status: "failed" });
    }
  });
};

exports.getUsers = async (req, res) => {
  let query = "select u.user_id, u.user_name,u.phone_number,u.email, u.status, d.department_id, d.department_name,u.first_name,";
  query = query + "u.last_name,u.address,u.city,u.district, u.role from users u ";
  query = query + "LEFT JOIN  departments d ON d.department_id=u.department_id";
  db.query(query, (err, result) => {
    if (!err) {
      if (result.length <= 0) {
        res.status(401).json({ message: "No users found" });
      } else {
        res.status(200).json(result);
      }
    } else {
      res.status(404).json({ status: "failed" });
    }
  });
};

exports.createUser = async (req, res) => {
  params = req.body;
  db.query("INSERT INTO `users` SET ? ", params, (err, result) => {
    // console.log("Error:", err);
    if (!err) {
      res.status(200).json({ status: "success", message: "User added successfully" });
    } else res.status(404).json({ status: "failed" });
  });
};

exports.updateUser = async (req, res) => {
  data = req.body;
  db.query(
    "update users set ? where user_id = ? ",
    [
      {
        first_name: data.first_name,
        last_name: data.last_name,
        // user_name: data.user_name,
        phone_number: data.phone_number,
        department_id: data.department_id,
        role: data.role,
        status: data.status,
        address: data.address,
        district: data.district,
        city: data.city,
        updated_date: dateTime,
        updated_by: data.updated_by
      },
      req.params.id,
    ],
    (err, result) => {
      if (!err)
        res.status(200).json({ status: "success", message: "User updated successfully" });
      else res.status(401).json({ status: "failed" });
    }
  );
};

exports.deleteUser = async (req, res) => {
  db.query(
    "delete from users where user_id = ?",
    [req.params.id],
    (err, result, fiels) => {
      if (!err)
        res
          .status(200)
          .json({ status: "success", message: "User deleted successfully" });
      else res.status(401).json({ status: "failed" });
    }
  );
};

exports.getUserById = async (req, res) => {
  let query = "select u.user_id, u.user_name,u.password_md5,u.phone_number,u.email, u.status, d.department_id, d.department_name,u.first_name,";
  query = query + "u.last_name,u.address,u.city,u.district, u.role from users u ";
  query = query + "LEFT JOIN  departments d ON d.department_id=u.department_id where u.user_id=" + req.params.id;
  console.log(query);
  db.query(query,(err, result) => {
      if (!err) {
        console.log(result.length)
        if (result.length === 1)
          res.status(200).json(result);
        else res.status(401).json({ message: "User not found" });
      } else res.status(401).json({ status: "failed" });
    }
  );
};

exports.checkToken = async (req, res) => {
  res.status(200).json({ message: "true" });
};

exports.getUserByDepartmentId = async (req, res) => {
  id = req.body;
  id = id.toString();
  db.query(
    "select u.first_name,u.last_name,u.user_id,d.department_id,d.department_name,d.ranking from users u,departments d where d.department_id= u.department_id and d.department_id = '" +
    id +
    "' and d.status='active' ",
    (err, result) => {
      if (!err) {
        if (result.length > 0) res.status(200).json(result);
        else res.status(401).json({ message: "No Users found" });
      } else res.status(401).json({ status: "failed" });
    }
  );
};

exports.getUsersByDepartment = async (req, res) => {
  db.query(
    "select u.first_name,u.last_name,u.user_id,d.department_id,d.department_name,d.ranking from users u,departments d where d.department_id= u.department_id and d.status='active' ",
    (err, result) => {
      if (!err) {
        console.log(result);
        if (result.length > 0) res.status(200).json(result);
        else res.status(401).json({ message: "No Users found" });
      } else res.status(401).json({ status: "failed" });
    }
  );
};
