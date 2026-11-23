import Product from "../models/productModel.js";
import mongoose from "mongoose";

const fallbackProducts = [
  { _id: "1", name: "Laptop", description: "High performance laptop", category: "Electronics", price: 75000 },
  { _id: "2", name: "Wireless Headphones", description: "Noise cancelling headphones", category: "Accessories", price: 4500 },
  { _id: "3", name: "Smartphone", description: "5G Android Smartphone", category: "Electronics", price: 25000 }
];

const createProductForm = (req, res) => {
  res.render("product-form", { product: null });
};

const createProduct = async (req, res) => {
  try {
    const { name, description, category, price } = req.body;
    if (mongoose.connection.readyState !== 1) {
      fallbackProducts.push({ _id: String(fallbackProducts.length + 1), name, description, category, price });
      return res.redirect("/");
    }
    const product = new Product({ name, description, category, price });
    await product.save();
    res.redirect("/");
  } catch (error) {
    res.redirect("/");
  }
};

const readProducts = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.render("products", { products: fallbackProducts });
    }
    const products = await Product.find({});
    res.render("products", { products });
  } catch (error) {
    res.render("products", { products: fallbackProducts });
  }
};

const readProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("product", { product });
  } catch (error) {
    res.render("error", { error: error.message });
  }
};

const updateProductForm = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("product-form", { product });
  } catch (error) {
    res.render("error", { error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price } = req.body;
    await Product.findByIdAndUpdate(id, { name, description, category, price });
    res.redirect("/");
  } catch (error) {
    res.render("error", { error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect("/");
  } catch (error) {
    res.render("error", { error: error.message });
  }
};

export {
  createProductForm,
  createProduct,
  readProducts,
  readProductById,
  updateProductForm,
  updateProduct,
  deleteProduct,
};