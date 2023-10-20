const mongoose = require("mongoose");



const inventorySchema = new mongoose.Schema({
  itemName: String,
  brand: String,
  category: String,
  itemID: String,
  price: Number,
  quantity: Number,
  dateAdded: {
    type: String,
    default: "-",
  },
  dateModified:{
    type:String,
    default:"Not modified yet"
  },
  imageLink:{
    type:String,
    default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLZAsapx4-nMl4YB_K4iTjcLwPbbAJu8Duyw&usqp=CAU"
  }
});

const inventoryModel = mongoose.model("Inventory", inventorySchema);

module.exports = inventoryModel;
