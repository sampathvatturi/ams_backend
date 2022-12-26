const db = require("../config/connection");
const currdateTime = require('../middleware/currdate');



exports.createTransaction = async (req, res) => {
  data = req.body;
  trsxcn_date = currdateTime;
  //acc_head = to,ref_acc_head = from
  credit_query = "insert into transactions set acc_head = "+data.acc_head+",type='credit',remarks='"+data.remarks+"',mode='"+data.mode+"',trsxcn_date='"+trsxcn_date+"',amount="+data.amount+",created_by="+data.created_by+",ref_acc_head="+data.ref_acc_head+" ";

  debit_query = "insert into transactions set acc_head = "+data.ref_acc_head+",type='debit',remarks='"+data.remarks+"',mode='"+data.mode+"',trsxcn_date='"+trsxcn_date+"',amount='"+data.amount+"',created_by="+data.created_by+",ref_acc_head="+data.acc_head+" ";

  // console.log(debit_query);

    db.query(debit_query,(err,result)=>{
      if(!err){
        db.query(credit_query,(err,result)=>{
          if(!err) res.status(200).json({status:"success",message:"Transaction added successfully"});
          else res.status(500).json({status:"failed",message:"Debit Entry Failed"});
        })
      }else res.status(500).json({status:"failed",message:"Transaction adding failed"});
    })
  
};

exports.getTransactions = async (req, res) => {
  data = req.body;
  start_date = data.start_date.toString().replace(/T/, ' ').replace(/\..+/, '');
  end_date = data.end_date.toString().replace(/T/, ' ').replace(/\..+/, '');

  if(data.type==="%" && data.acc_head !="%"){
    query = "select * from transactions where (trsxcn_date between '"+start_date+"' and '"+end_date+"') and (ref_acc_head = "+data.acc_head+") order by trsxcn_date DESC";
  }else if(data.type !="%" && data.acc_head !="%"){
    query = "select * from transactions where (trsxcn_date between '"+start_date+"' and '"+end_date+"') and (ref_acc_head = "+data.acc_head+") and type IN('"+data.type+"') order by trsxcn_date DESC";
  }else if(data.type==="%" && data.acc_head !="%"){
    query = "select * from transactions where (trsxcn_date between '"+start_date+"' and '"+end_date+"') and (ref_acc_head = "+data.acc_head+") order by trsxcn_date DESC" ;
  }else if(data.type !="%" && data.acc_head ==="%"){
    query = "select * from transactions where (trsxcn_date between '"+start_date+"' and '"+end_date+"') and type IN('"+data.type+"') order by trsxcn_date DESC";
  }else{
    query = "select * from transactions where (trsxcn_date between '"+start_date+"' and '"+end_date+"') order by trsxcn_date DESC";
  }

  db.query (query,(err, result) => {
    if (!err) {
      if (result.length > 0){
        var finaldata = [];
        result.forEach(res => {
          let tempdata = {
            type: '',
            particulars: '',
            trsxcn_date: '',
            debit: '',
            credit: '',
            ref_acc_head: ''
          }
          tempdata.trsxcn_date = res.trsxcn_date;
          tempdata.ref_acc_head = res.ref_acc_head;

          if(res.type == 'debit'){
            tempdata.debit = res.amount;
          }
          if(res.type == 'credit'){
            tempdata.credit = res.amount;
          }

          tempdata.particulars = {
            ref_acc_head : res.ref_acc_head,
            remarks : res.remarks
          }
          finaldata.push(tempdata);
        });
        res.status(200).send(finaldata);
      } 
      else res.status(204).json({ message: "Transactions not found" });
    } else res.status(401).json({ status: "failed" });
  });
};