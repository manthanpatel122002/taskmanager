const db = require("../models");
const jwtVerify = require("../middleware/checklogin").jwtVerify;
customer = db.customer;
session = db.session;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {signupSchema,loginSchema,forgotPasswordSchema,createPasswordSchema} = require("../validations/auth");
let jwtSec = "manthanpatel122002";
var salt = bcrypt.genSaltSync(10);

async function loginHandler(req, res) {
  
  try {
    await loginSchema.validateAsync(req.body);
    let { email, password } = req.body;

    //check user exist or not in database
    let isAvailable = await customer.findOne({
      where: {
        email: email,
      },
      raw:true,
    });

    if (!isAvailable) {
      return res.status(400).send({ message: "User not exist" });
    }

    //check password in database or not.
    let passMatch = bcrypt.compareSync(password, isAvailable.password);
    console.log("passMatch", passMatch);

    if (!passMatch) {
      return res.status(400).send({ message: "Password does not match" });
    }

    //genrate jwt token
    let token = jwt.sign({ ...isAvailable }, jwtSec, { expiresIn: 60*60 });
    console.log("token", token);

    await session.create({
      customerId: isAvailable.id,
      jwt: token,
      status: "validUser",
    });

    return res.status(200).send({ message: "User succesfully login",token:token });
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }
}

async function signupHandler(req, res) {
  try {
    await signupSchema.validateAsync(req.body);

    let { email, password, Cpassword, fname, lname } = req.body;

    if (password !== Cpassword) {
      return res.status(400).send({ message: "Pasword Not Match" });
    }

    //encrypt the password
    var passwordHash = bcrypt.hashSync(password, salt);

    //checkuser is there are not
    let isAvailable = await customer.findOne({
      where: {
        email: email,
      },
    });

    if (isAvailable) {
      return res.status(400).send({ message: "User already exist" });
    }

    let newUser = await customer.create({
      email: email,
      password: passwordHash,
      fname: fname,
      lname: lname,
    });

    return res.status(200).send({ message: "User created successfully" });
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }
}

async function forgotPasswordHandler(req, res) {
  try {
    await forgotPasswordSchema.validateAsync(req.body);
    let { email } = req.body;

    let isAvailable = await customer.findOne({
      where: {
        email: email,
      },
    });

    if (!isAvailable) {
      return res.status(400).send({ mesage: "User not found " });
    }

    let resetToken = jwt.sign({ email: email }, jwtSec, { expiresIn: 120 });

    let URL = `http://localhost:3000/createPassword/${resetToken}`;
    return res
      .status(200)
      .send({ message: "Forgotton password successfully", URL: URL });
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }
}

async function createPassword(req, res) {
  let finalData = { ...req.body, ...req.params };
  try {
    await createPasswordSchema.validateAsync(finalData);
    let { token } = req.params;
    let { password, Cpassword } = req.body;

    let tokenIsvalid = await jwtVerify(token);
    console.log("tokenIsvalid", tokenIsvalid);
    if (tokenIsvalid.email) {
      let isAvailable = await customer.findOne({
        where: {
          email: tokenIsvalid.email,
        },
      });
      if (!isAvailable) {
        return res.status(400).send({ mesage: "User not found " });
      }
      if (password !== Cpassword) {
        return res.status(400).send({ mesage: "Password is incorrect " });
      }
      let passwordHash = bcrypt.hashSync(password, salt);

      await customer.update(
        {
          password: passwordHash,
        },
        {
          where: {
            email: isAvailable.email,
          },
        }
      );
      return res.status(200).send({ message: "Your password is updated." });
    }
  } catch (err) {
    res.status(400).send({ mesage: "Token is expired... " });
  }
}

module.exports = {
  loginHandler,
  forgotPasswordHandler,
  signupHandler,
  createPassword,
};
