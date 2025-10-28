const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");
const productModel = require("../models/product-model");
const multer = require("multer");


const storage = multer.memoryStorage();
const upload = multer({ storage });


if (process.env.NODE_ENV === "development") {
  router.post("/create", async (req, res) => {
    try {
      const owners = await ownerModel.find();
      if (owners.length > 0) {
        return res
          .status(403)
          .send("You don't have permission to create a new owner");
      }

      const { fullname, email, password } = req.body;
      const createdOwner = await ownerModel.create({
        fullname,
        email,
        password,
      });

      res.status(201).send(createdOwner);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while creating a new owner");
    }
  });
}


router.get("/admin", (req, res) => {
  let success = req.flash("success") || "";
  let error = req.flash("error") || "";
  res.render("createproducts", { success, error });
});


router.post("/admin/create", upload.single("image"), async (req, res) => {
  try {
    const { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

    await productModel.create({
      name,
      price,
      discount,
      bgcolor,
      panelcolor,
      textcolor,
      image: req.file ? req.file.buffer : null, 
    });

    req.flash("success", "✅ Product created successfully!");
    res.redirect("/owners/admin"); // 
  } catch (err) {
    console.error(err);
    req.flash("error", "❌ Error creating product.");
    res.redirect("/owners/admin"); 
  }
});

module.exports = router;
