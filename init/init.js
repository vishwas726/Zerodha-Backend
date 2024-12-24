require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const { holdings, positions } = require("./data");

const { HoldingsModel } = require("../model/HoldingsModel");
const { PositionsModel } = require("../model/PositionsModel");
const MONGO_URL = process.env.MONGO_URL || "mongodb+srv://vishwaslandge2004:eBlN28Ryd5zo4JQ2@zerodhacluster.koybv.mongodb.net/zerodha?retryWrites=true&w=majority&appName=ZerodhaCluster";

console.log("this is url", MONGO_URL);
mongoose
  .connect(MONGO_URL)
  .then((result) => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

const Start = () => {
  // holdings.forEach(async (item) => {

  //     let newData = new HoldingsModel({

  //         name: item.name,
  //         qty: item.qty,
  //         avg: item.avg,
  //         price: item.price,
  //         net: item.net,
  //         day: item.day,
  //     })

  //     await newData.save()

  // })

  positions.forEach(async(element) => {
    let newData = new PositionsModel({
        product: element.product,
        name: element.name,
        qty: element.qty,
        avg: element.avg,
        price:element.price,
        net: element.day,
        day: element.day,
        isLoss: element.isLoss,
    });

    await newData.save()
  });

  

  console.log("data initialised");
};

Start();
