const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const generateUserToken = (email, id, role) => {
    const token = jwt.sign({
      email,
      user_id: id,
      role,
    },
    "8b36836bd2f9f95ecbf8ce4f22f20bd91ac3dda7",{ expiresIn: '2d' });
    return token;
};


function verifyToken(req, res, next){

    const { token } = req.headers;
    // const { token } = req.cookies;
    // console.log(token);
    if (!token) {
      var responseErr = {
          status : 401,
          message:'Token not provided'
        };
        return res.status(401).send(responseErr);
    }
    try {
      // const decoded =  jwt.verify(token, process.env.JWT_SECRET);
      const decoded =  jwt.verify(token, "8b36836bd2f9f95ecbf8ce4f22f20bd91ac3dda7");
      if (decoded) {
  
         if (decoded.type === 'logged') {
            req['user_id'] = decoded.user_id;
            req['email'] = decoded.email;
            req['role'] = decoded.role;   
            next();
        }else{
          
           req.user = {
              email: decoded.email,
              user_id: decoded.user_id,
              role: decoded.role,
            };
            next();
        }
      }
        
     
    } catch (error) {
      var responseErr = {
          status : 400,
          message:'Authentication Failed'
        };
        return res.status(400).send(responseErr);
    }
};

  
const hashPassword = (password)=>{
    const saltRounds = 10;
    const salt =  bcrypt.genSaltSync(saltRounds);

    // now we set user password to hashed password
    const data= bcrypt.hashSync(password, salt);
    return data

}


const comparePassword = (hashedPassword, password) =>{
    //const data = bcrypt.compareSync("123456","$2a$10$6ju/gamEJjfMJsx06IkNB.ZiuqXXawfHK7Gaeb6xFINffwJBqsUYi");
    const data = bcrypt.compareSync(password, hashedPassword)
    return data;
}


module.exports ={
    generateUserToken,
    verifyToken,
    hashPassword,
    comparePassword
}