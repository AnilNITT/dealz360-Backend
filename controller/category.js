var {Category,Subcategory} = require("../models/Category")
const cloudinary = require("cloudinary");


async function AddCategory(req,res){
    try{
        const {name} = req.body;
        
        if(name == "" || req.files == ""){
            var response = {
                status: 201,
                message: "name and image can not be empty !!",
            };
            return res.status(201).send(response);
        }
        const cname= await Category.findOne({name:name});

        if(cname){
            var response = {
                status: 201,
                success:false,
                message: 'Category already exit',
            };
            return res.status(201).send(response);
        }

        // const myCloud =await cloudinary.v2.uploader.upload(req.files[0].path,
        //     {folder: "/CATEGORY"});
        
        const data ={
            name:req.body.name,
            image:req.files[0].filename,
        }

        const category = await Category(data);
        await category.save()
        .then(() => {
            var response = {
                status: 200,
                data: category,
                message: "Category Added Successfully",
            };
            return res.status(200).send(response);
            })
        .catch(error => {
            res.status(400).json(error)
            return;
        })
    } catch (error) {
        response = {
          errors:error,
          status: 400,
          message: "Operation was not successful",
        };
    
        return res.status(400).send(response);
    }
}


async function GetAllCategory(req,res){
    try{

        const category = await Category.find(req.query).populate({path:"subcategory",select: ['name', 'image']});
        
        if(category){
            var response = {
                status: 200,
                data: category,
                message: 'successfull',
              };
              return res.status(200).send(response);
        } else{
            var response = {
                status: 201,
                message: "No Category Found",
              };
            return res.status(201).send(response);
        }

    } catch (error) {
        response = {
          errors:error,
          status: 400,
          message: "Operation was not successful",
        };
    
        return res.status(400).send(response);
    }
}


async function GetCategory(req,res){
    try{

        const category = await Category.findById(req.params.id).populate({path:"subcategory",select: ['name', 'image']});
        
        if(category){
            var response = {
                status: 200,
                data: category,
                message: 'successfull',
              };
              return res.status(200).send(response);
        } else{
            var response = {
                status: 201,
                message: "No Category Found",
              };
            return res.status(201).send(response);
        }

    } catch (error) {
        response = {
          errors:error,
          status: 400,
          message: "Operation was not successful",
        };
    
        return res.status(400).send(response);
    }
}


async function DeleteCategory(req,res){
    try{

        const category = await Category.findById(req.params.id)
        
        if(category){
            //await category.remove()

            // console.log(category.subcategory.length)
            if(category.subcategory.length>0){
                category.subcategory.forEach(async(data)=>{
                    //console.log(data);
                    await Subcategory.findByIdAndDelete(data,{new:true});
                })
            }
            //return res.status(201).send(category);
            Category.findByIdAndDelete(req.params.id,(err, docs)=> {
                if (err) {
                  var response = {
                    status: 201,
                    message: err,
                    messages: "Category delete failed",
                  };
                  return res.status(201).send(response);
                } else {
                    var response = {
                        status: 200,
                        message:"Category removed successfully",
                        data:docs,
                    };
                  return res.status(200).send(response);
                }
            });
        } else{
            var response = {
                status: 201,
                message: "No Category Found",
              };
            return res.status(201).send(response);
        }

    } catch (error) {
        response = {
          errors:error,
          status: 400,
          message: "Operation was not successful",
        };
    
        return res.status(400).send(response);
    }
}


async function UpdateCategory(req,res){
    try{
        if(req.params.id != ""){
            const {name} = req.body;
            const category = await Category.findById(req.params.id)
            
            if(category){

                if(req.files.length>0){
                    // const myCloud =await cloudinary.v2.uploader.upload(req.files[0].path,
                    //     {folder: "/CATEGORY"});
                    const data = {
                        name: name,
                        image:req.files[0].filename,
                    }
                    Category.findByIdAndUpdate(req.params.id,{$set:data},{new:true},(err, docs)=> {
                        if (err) {
                          var response = {
                            status: 201,
                            message: err,
                          };
                          return res.status(201).send(response);
                        } else {
                            var response = {
                                status: 200,
                                message:"Category Updated successfully",
                                data:docs,
                              };
                              return res.status(200).send(response);
                        }
                      });
                }
                else {
                    const data = {
                        name: name,
                    }
                    Category.findByIdAndUpdate(req.params.id,{$set:data},{new:true},(err, docs)=> {
                        if (err) {
                          var response = {
                            status: 201,
                            message: err,
                          };
                          return res.status(201).send(response);
                        } else {
                            var response = {
                                status: 200,
                                message:"Category Updated successfully",
                                data:docs,
                              };
                              return res.status(200).send(response);
                        }
                      });
                }
            } else{
                var response = {
                    status: 201,
                    message: "No Category Found",
                  };
                return res.status(201).send(response);
            }
        } else {
            var response = {
                status: 201,
                message: "Enter Category id",
              };
            return res.status(201).send(response);
        }   
    }catch (error) {
        response = {
          errors:error,
          status: 400,
          message: "Operation was not successful",
        };
    
        return res.status(400).send(response);
    }
}


module.exports = {
    AddCategory,
    GetAllCategory,
    GetCategory,
    DeleteCategory,
    UpdateCategory
}