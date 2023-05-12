const express = require("express");
const {loginHandler,signupHandler,forgotPasswordHandler,createPassword} = require("../controller/authHandler");
const {postHandler,getHandler,putHandler,deleteHandler} = require("../controller/taskHandler");
const checkLogin = require("../middleware/checklogin").checkLogin

let route = express.Router();

route.post("/login", loginHandler);
route.post("/signup", signupHandler);
route.post("/forgotPassword", forgotPasswordHandler);
route.post("/createPassword/:token", createPassword);

route.post("/",checkLogin,postHandler)
route.get("/list",checkLogin,getHandler)
route.put("/:uId", checkLogin, putHandler);
route.delete("/:dId",checkLogin,deleteHandler);

module.exports =  route ;
