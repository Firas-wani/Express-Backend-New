const jwt = require("jsonwebtoken");
const { messageHandler } = require("../../utils/utils");
const {config} = require("dotenv")
config("/.env")


// const verifyUser = (req, res) => {
//   try {
//     const secretKey = process.env.SECRET_KEY;
//     const { token } = req.cookies;

//     jwt.verify(token, secretKey, (error, decode) => {
//       if (error) {
//         res.json({ message: "not verified" });
//       } else {
//         res.json({ message: "verified", decode });
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
const verifyUser = (req, res) => {
    try {
      const secretKey = process.env.SECRET_KEY;
      const { token } = req.cookies;
  
      jwt.verify(token, secretKey, (error, decode) => {
        if (error) {
          res.json({ message: "not verified" });
        } else {
          res.json({ message: "Token verified", decode });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  
 

module.exports = verifyUser;

