const db = require("../config/connection");
const currdateTime = require('../middleware/currdate');
const { createTransaction } = require("./transactions");

//funds
exports.getFunds = async (req, res) => {
  db.query("select * from funds", (err, result) => {
    if (!err) {
      if (result.length > 0) res.status(200).send(result);
      else res.status(404).json({ message: "Funds not found" });
    } else res.status(401).json({ status: "failed" });
  });
};

exports.createFund = async (req, res) => {
  data = req.body;
  db.query(
    "INSERT INTO `funds` SET ? ",
    [
      {
        fund_type: data.fund_type,
        fund_description: data.fund_description,
        transaction_mode: data.transaction_mode,
        fund_value: data.fund_value,
        fund_released_date: data.fund_released_date,
        created_by: data.created_by,
        updated_by: data.updated_by,
      },
    ],
    (err, result) => {
      // console.log("Fund Res:", result.affectedRows, result.insertId);
      if (!err) {
        if(result.insertId > 0) {
          const fundId = result.insertId;
          db.query("INSERT INTO `transactions` SET ? ",
          [
            {
              trsxcn_from: 'Funds',
              trsxcn_to: data.fund_description,
              category: 'Funds',
              remarks: data.fund_description,
              mode: data.transaction_mode,
              trsxcn_date: data.fund_released_date,
              amount: data.fund_value,
              fund_id: fundId,
              created_by: data.created_by,
              updated_by: data.updated_by,
            },
          ],
          (err, result) => {
            if (!err) {
              const bAmount = data.transaction_mode === 'banking' ? data.fund_value : 0;
              const chkAmount =  data.transaction_mode === 'cheque' ? data.fund_value : 0;
              const cardAmount =  data.transaction_mode === 'card' ? data.fund_value : 0;
              const cashAmount =  data.transaction_mode === 'cash' ? data.fund_value : 0;
              const upiAmount =  data.transaction_mode === 'upi' ? data.fund_value : 0;
              let qry = "update `account_details` SET banking = banking + "+  bAmount + ",";
              qry = qry + " cheque = cheque + " + chkAmount  + ",";
              qry = qry + " card = card + " + cardAmount + ",";
              qry = qry + " cash = cash + " + cashAmount + ",";
              qry = qry + " upi = upi + " + upiAmount + ",";
              qry = qry + " upi = upi + " + upiAmount + ",";
              qry = qry + "updated_date = '" + currdateTime + "',";
              qry = qry + "updated_by = " + data.updated_by + ",";
              qry = qry + "total = banking + cheque + card + cash + upi";
              qry = qry + " where id=1";
              console.log("Account Qry", qry);
              db.query(qry,(err, result) => { 
              console.log(err,result);
                if(!err){
                  res.status(200).json({status: "success", message: "Fund and Transaction added successfully"});
                } else {
                    res.status(404).json({ status: "failed" });
                }
              });
              // res.status(200).json({status: "success", message: "Fund and Transaction added successfully"});
            } else { 
              db.query("delete from funds where fund_id=" + fundId, (err, result) => {
                if(err){
                  res.status(404).json({ status: "failed" });
                } else {
                  res.status(404).json({ status: "failed" });
                }
              })  
              res.status(404).json({ status: "failed" });
            }
          }
        );
        }        
        // res.status(200).json({status: "success", message: "Fund added successfully",});
      } else res.status(401).json({ status: "failed" });
    }
  );
};

exports.updateFund = async (req, res) => {
  data = req.body;  
  const diffAmount = data.diffAmount;
  db.query(
    "update funds set ? where fund_id = ? ",
    [
      {       
        fund_type: data.fund_type,
        fund_description: data.fund_description,
        transaction_mode: data.transaction_mode,
        fund_value: data.fund_value,
        fund_released_date: data.fund_released_date,
        updated_date: currdateTime,
        updated_by: data.updated_by,
      },
      req.params.id,
    ],
    (err, result) => {
      if (!err) {
        db.query(
          "update transactions set ? where fund_id = ? ",
          [
            {
              trsxcn_to: data.fund_description,
              remarks: data.fund_description,
              mode: data.transaction_mode,
              trsxcn_date: data.fund_released_date,
              amount: data.fund_value,
              updated_date: currdateTime,
              updated_by: data.updated_by,
            },
            req.params.id,
          ], (err, result) => { 
            if(!err){
              const bAmount = data.transaction_mode === 'banking' ? (diffAmount) ? diffAmount : data.fund_value : 0;
              const chkAmount =  data.transaction_mode === 'cheque' ? (diffAmount) ? diffAmount : data.fund_value : 0;
              const cardAmount =  data.transaction_mode === 'card' ? (diffAmount) ? diffAmount : data.fund_value : 0;
              const cashAmount =  data.transaction_mode === 'cash' ? (diffAmount) ? diffAmount : data.fund_value : 0;
              const upiAmount =  data.transaction_mode === 'upi' ? (diffAmount) ? diffAmount : data.fund_value : 0;
              let qry = "update `account_details` SET banking = banking + "+  bAmount + ",";
              qry = qry + " cheque = cheque + " + chkAmount  + ",";
              qry = qry + " card = card + " + cardAmount + ",";
              qry = qry + " cash = cash + " + cashAmount + ",";
              qry = qry + " upi = upi + " + upiAmount + ",";
              qry = qry + " upi = upi + " + upiAmount + ",";
              qry = qry + "updated_date = '" + currdateTime + "',";
              qry = qry + "updated_by = " + data.updated_by + ",";
              qry = qry + "total = banking + cheque + card + cash + upi";
              qry = qry + " where id=1";
              console.log("Account Qry", qry);
              db.query(qry,(err, result) => { 
              console.log(err,result);
                if(!err){
                  res.status(200).json({status: "success", message: "Fund and Transaction updated successfully"});
                } else {
                    res.status(404).json({ status: "failed" });
                }
              });
              // res.status(200).json({status: "success", message: "Fund updated successfully"});
            } else {
              res.status(404).json({ status: "failed" }); 
            }
          })        
      } else {        
        res.status(404).json({ status: "failed" }); 
      }
    }
  );
};

exports.getFund = async (req, res) => {
  db.query(
    "select * from funds where fund_id = ?",
    [req.params.id],
    (err, result) => {
      if (!err) {
        if (result.length === 1) res.status(200).send(result);
        else res.status(401).json({ message: "Fund not found" });
      } else res.status(401).json({ status: "failed" });
    }
  );
};
