import express from "express";
import fs from "fs";
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ parse: true }));

const FILE = "./data/products.json";
const FACULTY_FILE = "./data/faculty.json";

const readProducts = () => {
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
};

const writeProducts = (products) => {
  fs.writeFileSync(FILE, JSON.stringify(products, null, 2), "utf-8");
};

const readFaculty = () => {
  if (!fs.existsSync(FACULTY_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(FACULTY_FILE, "utf-8"));
};

const writeFaculty = (faculty) => {
  fs.writeFileSync(FACULTY_FILE, JSON.stringify(faculty, null, 2), "utf-8");
};

app.get("/", (req, res) => {
  res.json({
    message: "File Persistence API server running",
    endpoints: ["/products", "/api/v1/faculty"]
  });
});

// Faculty routes (Lab Experiment 1)
app.get("/api/v1/faculty", (req, res) => {
  const { dept } = req.query;
  let faculty = readFaculty();
  if (dept) {
    faculty = faculty.filter((f) => (f.dept || f.department) === dept);
  }
  res.status(200).json({
    message: "Faculty fetched successfully",
    data: faculty
  });
});

app.post("/api/v1/faculty", (req, res) => {
  const allFaculty = readFaculty();
  const newFaculty = {
    id: allFaculty.length > 0 ? Math.max(...allFaculty.map((f) => f.id)) + 1 : 1,
    ...req.body
  };
  allFaculty.push(newFaculty);
  writeFaculty(allFaculty);
  res.status(201).json({
    message: "Faculty created successfully",
    data: newFaculty
  });
});
//Create
app.post("/products", (req, res) => {
  const products = readProducts();
  const newProduct = {
    id: products.length === 0 ? 1 : products[products.length - 1].id + 1,
    ...req.body,
  };
  products.push(newProduct);
  writeProducts(products);
  res
    .status(201)
    .json({ message: "Product added successfully", data: newProduct });
});
//Read
app.get("/products", (req, res) => {
  let products = readProducts();
  const category = req.query.category;
  if (category) {
    products = products.filter((prod) => prod.category === category);
  }
  res
    .status(200)
    .json({ message: "All Products feteched successfully", data: products });
});
//Read by ID
app.get("/products/:id", (req, res) => {
  const products = readProducts();
  const product = products.find((prod) => prod.id === Number(req.params.id));
  if (product) {
    res.status(200).json({
      message: "Products details feteched successfully",
      data: product,
    });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});
//Update a product
app.put("/products/:id", (req, res) => {
  const products = readProducts();
  const index = products.findIndex((prod) => prod.id === Number(req.params.id));
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    writeProducts(products);
    res.status(200).json({
      message: "Products updated successfully",
      data: products[index],
    });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});
//Delete
app.delete("/products/:id", (req, res) => {
  const products = readProducts();
  const index = products.findIndex((prod) => prod.id === Number(req.params.id));
  if (index !== -1) {
    const product = products.splice(index, 1)[0];
    writeProducts(products);
    res.status(200).json({
      message: "Products deleted successfully",
      data: product,
    });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});
//404 Not found
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
