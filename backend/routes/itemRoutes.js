const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// GET all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new item
router.post("/", async (req, res) => {
  try {
    const { name, price, quantity, category } = req.body;

    const newItem = new Item({
      name,
      price,
      quantity,
      category,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update item
router.put("/:id", async (req, res) => {
  try {
    const { name, price, quantity, category } = req.body;

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { name, price, quantity, category },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE item
router.delete("/:id", async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;