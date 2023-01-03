const db = require("../config/connection");
const currdateTime = require('../middleware/currdate');
const { createTransaction } = require("./transactions");

exports.getExpenses = async (req, res) => {
  db.query("select * from expenditures", (err, result) => {
    if (!err) {
      if (result.length > 0) res.status(200).send(result);
      else res.status(200).json({ message: "No expenditures Data"});
    } else res.status(401).json({ status: "failed" });
  });
}

exports.createExpense = async (req, res) => {
  data = req.body;
  let approval_user_status = [
    { "reason": "", "status": "Pending", "department_id": 15 },
    { "reason": "", "status": "Pending", "department_id": 23 }
  ];
  approval_user_status = JSON.stringify(approval_user_status);
  var exp_number;
  var date_ob = new Date();
  var curr_year = date_ob.getFullYear();
  var year;
  db.query("select exp_inv_number from expenditures order by exp_inv_number desc limit 1", (err, result) => {
    if (!err) {
      if (result !=''){
        exp_inv_number = result[0]['exp_inv_number'];
        year = exp_inv_number.substring(3, 7);
        if(year<curr_year && (parseInt(curr_year)-parseInt(year)===1)){
          year = parseInt(year)+1;
        }
        exp_inv_number = exp_inv_number.substring(0, 3) +year+ (parseInt(exp_inv_number.substring(7)) + 1).toString().padStart(4, "0");
        db.query(
          "INSERT INTO `expenditures` SET ? ",
          [
            {
              description: data.description,
              category: data.category,
              exp_inv_number: exp_inv_number,
              status: data.status,
              amount: data.amount,
              tax: data.tax,
              total: data.total,
              attachments: data.attachments,
              created_by: data.created_by,
              updated_by: data.updated_by,
              approval_user_status: approval_user_status
            },
          ],
          (err, result) => {
            if (!err) {
              res
                .status(200)
                .json({
                  status: "success",
                  message: "Expenses added successfully",
                });
            } else res.status(401).json({ status: "failed" });
          }
        );
        }else{
          exp_inv_number = 'EXP'+curr_year+'00001';
          db.query(
            "INSERT INTO `invoices` SET ? ",
            [
              {
                description: data.description,
                category: data.category,
                exp_inv_number: exp_inv_number,
                status: data.status,
                amount: data.amount,
                tax: data.tax,
                total: data.total,
                attachments: data.attachments,
                created_by: data.created_by,
                updated_by: data.updated_by,
                approval_user_status: approval_user_status
              },
            ],
            (err, result) => {
              if (!err) {
                res
                  .status(200)
                  .json({
                    status: "success",
                    message: "Expenses added successfully",
                  });
              } else res.status(401).json({ status: "failed" });
            }
          );
      } 
    } else res.status(401).json({ status: "failed" });
  });
};

exports.updateExpense = async (req, res) => {
  data = req.body;
  db.query(
    "update invoices set ? where invoice_id = ? ",
    [
      {
        description: data.description,
        category: data.category,
        exp_number: exp_number,
        status: data.status,
        amount: data.amount,
        tax: data.tax,
        total: data.total,
        attachments: data.attachments,
        updated_date: currdateTime,
        updated_by: data.updated_by
      },
      req.params.id,
    ],
    (err, result) => {
      if (!err){
        res.status(200).json({ status: "success", message: "Expenses updated successfully" });
      } else {
        res.status(401).json({ status: "failed" });
      }
    }
  );
};

exports.deleteExpense = async (req, res) => {
  db.query(
    "delete from expenditures where id = ?",
    [req.params.id],
    (err, result) => {
      if (!err)
        res
          .status(200)
          .json({
            status: "success",
            message: "Expense details deleted successfully",
          });
      else res.status(401).json({ status: "failed" });
    }
  );
};

exports.getExpense = async (req, res) => {
  db.query(
    "select * from expenditures where id = ?",
    [req.params.id],
    (err, result) => {
      if (!err) {
        if (result.length === 1) res.status(200).send(result);
        else res.status(401).json({ message: "Expense details not found" });
      } else res.status(401).json({ status: "failed" });
    }
  );
};


exports.expenseApproval = async (req, res) => {
  data = req.body;
  db.query(
    "update expenditures set ? where id = ? ",
    [
      {
        approval_user_status: JSON.stringify(data.approval_user_status),
        status:data.status,
        updated_date: currdateTime,
        updated_by: data.updated_by
      },
      req.params.id,
    ],
    (err, result) => {
      if (!err) {
        if(data.status === 'paid') {
            let details = {
              acc_head : 1,
              type: 'expenses',
              remarks: 'Expense Bill Paid for ' + data.category,
              mode: 'banking',
              trsxcn_date: currdateTime,
              amount: data.amount,
              created_by: data.updated_by,
              ref_acc_head: 5,
              invoice_id: data.exp_inv_number
             }
             console.log(details)
            if(createTransaction(details))
              res.status(200).json({status: "success", message: "Successfully done!"});
            else{
              db.query('ROLLBACK');
              res.status(500).json({status: "failed", message: "Failed"});
            }
        } else {
          res.status(200).json({status: "success", message: "Successfully done!"});
        }
      } else {
        res.status(404).json({ status: "failed" });
      }
    });
  }

  exports.cancelExpense = async (req, res) => {
    console.log(req)
    db.query(
      "update expenditures set ? where id = ?", 
      [
        {
        cancel_reason: req.body.cancel_reason,
        status:'cancel'
        },
        req.params.id
      ],
      (err, result) => {
        if (!err) res.status(200).json({ status: "success",message: "Expense Cancelled Successfully" });
        else res.status(404).json({ status: "failed" });
      }
    );
  };

  exports.getExpensesbyDate = async (req, res) => {
    data = req.body;
    start_date = data.start_date.toString().replace(/T/, ' ').replace(/\..+/, '');
    end_date = data.end_date.toString().replace(/T/, ' ').replace(/\..+/, '');
    if(data.status==='%'){
      query = "select * from expenditures where (created_date between '"+start_date+"' and '"+end_date+"') "
    }else{
      query = "select * from expenditures where (created_date between '"+start_date+"' and '"+end_date+"') and status='"+data.status+"'"
    }
    
    db.query(query, (err, result) => {
      if (!err) {
        if (result.length > 0) res.status(200).send(result);
        else res.status(200).json({ message: "No expenditures Data"});
      } else res.status(401).json({ status: "failed" });
    });
  }