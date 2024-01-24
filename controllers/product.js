const { Product } = require("./../models/product");
const { isAuthenticated } = require('./../middleware/authMiddleware');

async function searchProducts(req, res) {
  const { category, direction = "desc", sortBy = "_id", name = "" } = req.query;

  const searchObj = {};

  if (category) searchObj.category = category;
  searchObj.name = { $regex: name, $options: "i" };

  const sortOptions = {};
  sortOptions[sortBy] = direction;

  try {
    const products = await Product.find(searchObj).sort(sortOptions);
    res.send(products);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).send('Internal Server Error');
  }
}

async function getProductCategories(req, res) {
  try {
    const categories = await Product.find().select("category").distinct("category");
    res.send(categories);
  } catch (ex) {
    console.log(ex.message);
    res.status(500).send('Internal Server Error');
  }
}

async function getProductById(req, res) {
  let product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404).send(`Product with id ${req.params.id} not found`);
    return;
  }

  res.send(product);
}

async function saveProduct(req, res) {
  const requestBody = req.body;

  const product = new Product(requestBody);
  try {
    const savedProduct = await product.save();
    res.send(savedProduct);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
}

async function updateProductDetails(req, res) {
  let product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404).send(`Product with id ${req.params.id} not found`);
    return;
  }

  const requestBody = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, requestBody);
    res.send(updatedProduct);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
}

async function deleteProduct(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).send(`Product with id ${req.params.mentorId} not found`);
      return;
    }

    res.send(product);
  } catch (ex) {
    return res.send(ex.message);
  }
}

module.exports = {
  searchProducts,
  getProductCategories,
  getProductById,
  saveProduct,
  updateProductDetails,
  deleteProduct
};

router.get('/products', isAuthenticated, searchProducts);
router.get('/products/categories', isAuthenticated, getProductCategories);
