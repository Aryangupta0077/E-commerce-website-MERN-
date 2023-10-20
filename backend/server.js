const express = require("express");
require("./models/database/db");
const loginSchema = require("./models/database/loginSchema");
const inventorySchema = require("./models/database/inventorySchema");
const userSchema = require("./models/database/userSchema");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
dotenv.config();
const jwtkey = "Myprivatkey";
const port = process.env.PORT || 80;

app.post("/login", async (req, res) => {
  try {
    const phoneNumToCheck = req.body.phNumber;
    const passEntered = req.body.password;
    const check = await loginSchema.findOne({ phoneNumber: phoneNumToCheck });
    if (check) {
      if (passEntered === check.password) {
        jwt.sign({ check }, jwtkey, (err, token) => {
          if (err) {
            res.send("Something went wrong");
          } else {
            res.json({ check, auth: token });
          }
        });
      } else {
        res.send("Wrong credentials");
      }
    }
  } catch (error) {
    res.send("something is fishy");
  }
});

//adding new data to inventory
app.post("/addItem", verifyToken, async (req, res) => {
  const itemName = req.body.itemNameVal;
  const brand = req.body.brandVal;
  const category = req.body.categoryVal;
  const itemId = req.body.itemIdVal;
  const price = req.body.priceVal;
  const quantity = req.body.quantityVal;
  const imageLink = req.body.imageLink;
  const dateAdded = req.body.dateAdded;
  try {
    const data = await inventorySchema.findOne({ itemID: itemId });
    if (!data) {
      await inventorySchema.insertMany({
        itemName: itemName,
        brand: brand,
        category: category,
        itemID: itemId,
        price: price,
        quantity: quantity,
        imageLink: imageLink,
        dateAdded: dateAdded,
      });
      res.status(200).send({ status: "Success" });
    } else {
      res.status(200).send({ status: "Item already exist" });
    }
  } catch (error) {
    res.status(404).send({ error: "Some error occured" });
  }
});

// API to delete element from the database
app.delete("/deleteData", verifyToken, async (req, res) => {
  const itemId = req.body.id.itemId;
  try {
    const deleteData = await inventorySchema.deleteOne({ itemID: itemId });
    if (deleteData.acknowledged) {
      res.status(200).send({ status: true });
    } else {
      res.status(401).send({ status: false });
    }
  } catch (err) {
    res.status(403).send({ error: "An error occured" });
  }
});

app.put("/updateData", async (req, res) => {
  const itemName = req.body.data.itemName;
  const brand = req.body.data.brand;
  const category = req.body.data.category;
  const itemID = req.body.data.id;
  const price = req.body.data.price;
  const quantity = req.body.data.quantity;
  const imageLink = req.body.data.imageLink;
  const condition = req.body.data.condition;
  const dateModified = req.body.data.dateModified;
  try {
    const stat = await inventorySchema.findOneAndUpdate(
      { itemID: condition },
      {
        itemName: itemName,
        brand: brand,
        category: category,
        itemID: itemID,
        price: price,
        quantity: quantity,
        imageLink: imageLink,
        dateModified: dateModified,
      },
      { new: true }
    );
    if (stat === null) {
      res.send({ status: false });
    } else {
      res.send({ status: true });
    }
  } catch (error) {}
});

// API to get data from the database for CRUD operations.
app.get("/inventoryData", verifyToken, async (req, res) => {
  try {
    const data = await inventorySchema.find();
    if (data) {
      const dataArray = data.map((data) => data.toObject());
      res.status(200).json({ data: dataArray });
    } else {
      res.status(401).send("Data not found");
    }
  } catch (error) {
    res.status(401).send({ error: "An error occured!" });
  }
});

// API to get data from the database without authentication key.
app.get("/products", async (req, res) => {
  try {
    const data = await inventorySchema.find();
    if (data) {
      const dataArray = data.map((data) => data.toObject());
      res.status(200).json({ data: dataArray });
    } else {
      res.status(401).send("Data not found");
    }
  } catch (error) {
    res.status(401).send({ error: "An error occured!" });
  }
});

app.get("/category", async (req, res) => {
  try {
    const category = req.query.category;
    const data = await inventorySchema.find({ category: category });
    // console.log(data)
    if (data) {
      res.send({ response: data });
    }
  } catch (error) {}
});

app.post("/findOne", async (req, res) => {
  const fetchID = req.body.editIdVal;
  try {
    const findOne = await inventorySchema.findOne({ itemID: fetchID });
    if (findOne) {
      res.status(200).send({ data: findOne });
    }
  } catch (error) {}
});

app.post("/validateKey", (req, res) => {
  let token = req.data.key;
  if (token) {
    jwt.verify(token, jwtkey, (err, valid) => {
      if (valid) {
        res.status(200).send({ status: true });
      } else {
        res.status(401).send({ error: "Invalid key" });
      }
    });
  } else {
    res.status(401).send({ error: "Key not found" });
  }
});

// user APIs endpoints


function verifyToken(req, res, next) {
  let token = req.headers.authorization;
  if (token) {
    jwt.verify(token, jwtkey, (err, valid) => {
      if (valid) {
        next();
      } else {
        res.status(401).send({ error: "Invalid key" });
      }
    });
  } else {
    res.status(401).send({ error: "Key not found" });
  }
}
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
