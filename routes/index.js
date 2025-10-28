const express = require("express");
const router = express.Router();
const isloggedin = require("../middlewares/isLoggedin");
const Product = require('../models/product-model');
const userModel = require("../models/user-model");


router.get("/", function (req, res) {
    let error = req.flash("error");
    res.render("index", { error, loggedin: false });
});

router.get("/shop", isloggedin, async function (req, res) {
    const sortBy = req.query.sortby || 'popular';
    const availability = req.query.availability || '';  // Empty string if not provided
    const discount = req.query.discount || '';  // Empty string if not provided
    let query = {};

    // If availability is set, filter based on that
    if (availability) {
        query.isAvailable = availability === 'true'; // availability: 'true' => true, otherwise false
    }
    
    // If discount is set, filter based on that
    if (discount) {
        query.discount = { $gt: 0 }; // Filters products with discount > 0
    }

    try {
        let products;
        // Sorting logic
        if (sortBy === 'newest') {
            products = await Product.find(query).sort({ createdAt: -1 });
        } else if (sortBy === 'popular') {
            products = await Product.find(query).sort({ popularity: -1 });
        } else {
            products = await Product.find(query);
        }

        let success = req.flash("success");
        // Ensure availability, discount, and sortby are passed to the view
        res.render("shop", { 
            products: products, 
            success: success, 
            sortby: sortBy, 
            availability: availability, 
            discount: discount  // Pass these values to EJS
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching products.");
    }
});

router.get("/shop/popular", isloggedin, async function (req, res) {
    const availability = req.query.availability || '';
    const discount = req.query.discount || '';
    let query = {};

    // Check availability and discount filters
    if (availability) {
        query.isAvailable = availability === 'true';
    }
    if (discount) {
        query.discount = { $gt: 0 };
    }

    try {
        const products = await Product.find(query).sort({ popularity: -1 });
        let success = req.flash("success");
        res.render("shop", { 
            products: products, 
            success: success, 
            sortby: 'popular', 
            availability: availability, 
            discount: discount // Ensure discount is passed
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching popular products.");
    }
});


router.get("/shop/newest", isloggedin, async function (req, res) {
    const availability = req.query.availability || '';
    const discount = req.query.discount || '';
    let query = {};

    if (availability) {
        query.isAvailable = availability === 'true';
    }
    if (discount) {
        query.discount = { $gt: 0 };
    }

    try {
        const products = await Product.find(query).sort({ createdAt: -1 });
        let success = req.flash("success");
        res.render("shop", { 
            products: products, 
            success: success, 
            sortby: 'newest', 
            availability: availability, 
            discount: discount 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching newest products.");
    }
});



router.get("/availability", isloggedin, async function (req, res) {
    try {
        const products = await Product.find({ isAvailable: true }); 
        let success = req.flash("success");
        res.redirect("/allproducts");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching available products.");
    }
});

router.get("/newcollection", isloggedin, async function (req, res) {
    try {
        const products = await Product.find().sort({ createdAt: -1 }); 
        let success = req.flash("success");
        res.render("shop", { products, success });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching new collection.");
    }
});


router.get("/allproducts", isloggedin, async function (req, res) {
    try {
        const products = await Product.find();
        let success = req.flash("success");
        res.render("shop", { products, success });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching all products.");
    }
});


router.get("/discountedproducts", isloggedin, async function (req, res) {
    try {
        const products = await Product.find({ discount: { $gt: 0 } }); // Assuming discount is a percentage or amount
        let success = req.flash("success");
        res.render("shop", { products, success });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching discounted products.");
    }
});


router.get("/cart", isloggedin, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email }).populate("cart");

    if (!user || user.cart.length === 0) {
        return res.render("cart", { user, bill: 0 });
    }

    let bill = user.cart.reduce((sum, item) => {
        return sum + (Number(item.price) + 20 - Number(item.discount));
    }, 0);

    res.render("cart", { user, bill });
});


router.get("/addtocart/:id", isloggedin, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart.push(req.params.id);
    await user.save();
    
    req.flash("success", "Added to cart");
    res.redirect("/shop");
});

//update cart
router.post("/cart/update", isloggedin, async (req, res) => {
    try {
        const { itemId, action } = req.body;
        let user = await userModel.findOne({ email: req.user.email }).populate("cart");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Find the product
        let product = await productModel.findById(itemId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Check if the item is in the cart
        let cartItemIndex = user.cart.findIndex(item => item._id.toString() === itemId);

        if (cartItemIndex === -1 && action === "remove") {
            return res.status(400).json({ success: false, message: "Item not in cart" });
        }

        if (action === "add") {
            user.cart.push(product._id); // Add item to cart
        } else if (action === "remove") {
            user.cart.splice(cartItemIndex, 1); // Remove item from cart
        }

        await user.save(); // Save the updated cart

        // Recalculate the bill
        let totalMRP = user.cart.reduce((sum, item) => sum + Number(item.price), 0);
        let totalDiscount = user.cart.reduce((sum, item) => sum + Number(item.discount), 0);
        let platformFee = user.cart.length * 20;
        let totalAmount = totalMRP + platformFee - totalDiscount;

        let quantity = user.cart.filter(item => item._id.toString() === itemId).length;
        let newBill = (Number(product.price) + 20) - Number(product.discount);

        res.json({
            success: true,
            quantity,
            newBill,
            totalAmount,
            totalMRP,
            totalDiscount,
            platformFee
        });
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = router;
