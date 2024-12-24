require("dotenv").config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const PORT = process.env.PORT || 3002;
const MONGO_URL = process.env.MONGO_URL;
const { HoldingsModel } = require("./model/HoldingsModel");
const {PositionsModel}=require("./model/PositionsModel")
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// const authRoute = require("./Routes/AuthRoute");
const OrdersModel =require("./model/OrdersModel")
const user =require("./Routes/user");
const { auth } = require("./Middlewares/auth");

mongoose
  .connect(MONGO_URL)
  .then((result) => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("err in DB Connection", err);
  });

  
app.use(cors());
app.use(bodyParser.json());

app.use(cookieParser());

app.use(express.json());


app.get("/", (req, res) => {

  res.send("welcome to the stock market app");

})
app.get("/holdings",auth,  async (req, res) => {
  try {
    let holdings = await HoldingsModel.find({});
    res.json(holdings);
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success:false,
      message:"APi problem"
    })
  }
  
});


app.get("/positions" ,auth, async(req, res)=>{


  let positions=await PositionsModel.find({})
  res.json(positions)

})

app.post("/newOrder",auth, async (req, res) => {
  try {
    const order= new OrdersModel({

      name:req.body.name,
      qty:req.body.qty,
      price:req.body.price,
      mode:"BUY"
    })

    await order.save()
  console.log("Order Placed")
    res.json({
      success: true,
      message: "Order Placed",
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "API Problem",
    });
  }});
app.use("/" , user) //auth ,

app.get('/me', auth, (req, res) => {
  const user = req.user;
  if (!user) return res.sendStatus(404);
  res.json({ user });
});

app.listen(PORT, () => {
  console.log("App Started", PORT);
});
