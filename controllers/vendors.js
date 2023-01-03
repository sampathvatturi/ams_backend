const db = require("../config/connection");
const currdateTime = require('../middleware/currdate');

exports.getVendors = async (req, res) => {
  db.query("select * from vendors", (err, result) => {
    if (!err) {
      if (result.length > 0) res.status(200).send(result);
      else res.status(200).json({ message: "Vendors not found" });
    } else res.status(401).json({ status: "failed" });
  });
};

exports.createVendor = async (req, res) => {
  data = req.body;
  db.query("select * from users where user_name = ?", data.user_name, (err, result) => {
    if (!err) {
      if (result.length > 0) {
        return res.status(200).json({ status: 'warning', message: 'username already exists' });
      } else {
        db.query("select * from users where email = ?", data.email, (err, result) => {
          if (!err) {
            if (result.length > 0) {
              return res.status(200).json({ status: 'warning', message: 'email already exists' });
            } else {
              db.query(
                "INSERT INTO `vendors` SET ? ",
                [
                  {
                    vendor_name: data.vendor_name,
                    phone_number: data.phone_number,
                    email: data.email,
                    address: data.address,
                    city: data.city,
                    state: data.state,
                    district: data.district,
                    gst_num: data.gst_num,
                    status: data.status,
                    created_by: data.created_by,
                    updated_by: data.updated_by,
                  },
                ],
                (err, result) => {      
                  // console.log("Error in Vendor Creation", err, result);
                  if (!err) {
                    db.query("insert into account_heads set name = '"+data.vendor_name+"',ref_id="+result.insertId+",active='1' ");
                    // res.status(200).json({status: "success", message: "Vendor added successfully",});
                    db.query("INSERT INTO `users` SET ? ", 
                    [{
                      first_name: data.vendor_name,
                      user_name: data.user_name,
                      password_md5: data.password_md5,
                      phone_number: data.phone_number,
                      address: data.address,
                      email: data.email,
                      role: 'vendor',
                      status: data.status,
                      created_by: data.created_by,
                      updated_by: data.updated_by
                    }], 
                    (err, result) => {
                      // console.log(err, result);
                      if (!err) {
                        res.status(200).json({ status: "success", message: "Vendor added successfully and created vendor logins." });
                      } else { 
                        res.status(404).json({ status: "failed" }); 
                      }
                    });
            
                  } else {
                    res.status(401).json({ status: "failed" });
                  }
                }
              );
            }
          } else{
            return res.status(404).json({ status: 'failed' });
          }
        })

      }
    } else {
      return res.status(404).json({ status: "failed" });
    }
  })

};

exports.updateVendor = async (req, res) => {
  data = req.body;
  db.query(
    "update vendors set ? where vendor_id = ? ",
    [
      {
        vendor_name: data.vendor_name,
        phone_number: data.phone_number,
        address: data.address,
        city: data.city,
        state: data.state,
        district: data.district,
        gst_num: data.gst_num,
        status: data.status,
        updated_by: data.updated_by,
        updated_date: currdateTime
      },
      req.params.id,
    ],
    (err, result) => {
      console.log(err, result);
      if (!err) {
        res.status(200).json({ status: "success", message: "Vendor updated successfully" });
      } else {
        res.status(401).json({ status: "failed" });
      }
    }
  );
};

exports.deleteVendor = async (req, res) => {
  db.query(
    "delete from vendors where vendor_id = ?",
    [req.params.id],
    (err, result) => {
      if (!err)
        res
          .status(200)
          .json({
            status: "success",
            message: "Vendor deleted successfully",
          });
      else res.status(401).json({ status: "failed" });
    }
  );
};

exports.getVendorById = async (req, res) => {
  db.query(
    "select * from vendors where vendor_id = ?",
    [req.params.id],
    (err, result) => {
      if (!err) {
        if (result.length === 1) res.status(200).send(result);
        else res.status(200).json({ message: "Vendor not found" });
      } else res.status(401).json({ status: "failed" });
    }
  );
};
