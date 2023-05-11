const db = require("../models");
task = db.task;

async function postHandler(req, res) {

    let { title, details, status, userData } = req.body;
    console.log("sfdasfdasfdasf",userData.dataValues.id)

    //check task there in database
    
    let isAvailable = await task.findOne({
        where:{
            title:title
        }
    })

    if(isAvailable){
        return res.status(200).send({message:"Task is already exits"})
    }

    let newTask = await task.create({
      customerId: userData.dataValues.id,
      title: title,
      details: details,
      status: status,
    });

  return res.status(200).send({message:"Task created successfully."})
}

function getHandler(req, res) {
  return res.send({ name: getHandler });
}

function putHandler(req, res) {
  return res.send({ name: putHandler });
}

function deleteHandler(req, res) {
  return res.send({ name: deleteHandler });
}

module.exports = { postHandler, getHandler, putHandler, deleteHandler };
