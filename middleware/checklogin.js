const jwt = require("jsonwebtoken");
let jwtSec = "manthanpatel122002";

function checkLogin(req, res, next) {
  //check header
  let authHeader = req.header("Authorization");

  //verify the token
  jwt.verify(authHeader, jwtSec, (err, decoded) => {
    console.log("decoded",decoded)
    if (err) {
      return res.status(401).send({ message: "Session is expired Login again." });
    }
    req.body.userData = decoded;
    next();
  });
  console.log(authHeader);
}

function jwtVerify(jwtToken){
    return new Promise((resolve,reject)=>{
         jwt.verify(jwtToken, jwtSec, (err, decoded) => {
           console.log("decoded", decoded);
           if (err) {
             reject(err);
           }
           resolve(decoded);
         });
    })
}
module.exports = { checkLogin, jwtVerify };
