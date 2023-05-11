const express = require("express")
const cors = require("cors")
const bcrypt = require("bcryptjs")

let app = express()

//middleware
app.use(cors())

app.use((req,res,next)=>{
    next();
})
app.use(express.json());
app.use(express.urlencoded({extended:true}))

const indexRoute = require("./routes/index.js");
app.use(indexRoute)

app.listen(3000, () => {
  console.log("App Is Listen Successfully!!!!");
});