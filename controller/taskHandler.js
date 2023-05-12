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

async function getHandler(req, res) {

  let taskData = await task.findAll({})
  return res.status(200).send({message:"data found",data:taskData})
}

async function putHandler(req, res) {

  let {uId} = req.params;
  let { title, details, status, userData } = req.body;

  let updatedData = await task.update(
    {
      title: title,
      details: details,
      status: status,
    },
    {
      where:{
        id:uId,
      }
    }
  );
  return res.status(200).send({message:"task updated successfully.."})
}

async function deleteHandler(req, res) {
  
  let {dId} = req.params

  deleteData = await task.destroy({
    where:{
      customerId:dId
    }
  })
  return res.status(200).send({message:"task deleted successfully"})
}

module.exports = { postHandler, getHandler, putHandler, deleteHandler };
