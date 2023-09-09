require("dotenv").config();
const express =require("express")
const app= express()
const userRoute = require("./routes/user");
const usertabsRoute = require("./routes/usertabs");
const mongoose = require("mongoose");
const path= require("path")

const cookieParser = require("cookie-parser");
const {
    checkForAuthenticationCookie,
  } = require("./middlewares/authentication");

  const PORT = 8000;
  mongoose.set('strictQuery', true);
mongoose
.connect(process.env.MONGODB)
.then((e)=>{
    console.log("Mongodb Connected")
})
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500'); // Replace with the actual origin of your frontend
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow any origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.set("view engine", "ejs")
app.set("views", path.resolve("./views")) 

app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.use(express.urlencoded({ extended: false }));
app.use("/user", userRoute);
app.use("/usertabs", usertabsRoute);
app.listen(PORT, ()=> console.log(`server has started at PORT ${PORT}`)) 

