const db = require("../config/connection");
const currdateTime = require('../middleware/currdate');

exports.getMenu = async (req, res) => {
  db.query("select * from mainmenu", (err, result, fiels) => {
    if (!err) {
      if (result.length > 0) res.status(200).send(result);
      else res.json({ message: "Menu not found" });
    } else res.status(401).json({ status: "failed" });
  });
};

