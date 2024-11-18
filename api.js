const path = require('path');
const Products = require('./products');
const autoCatch = require('./lib/auto-catch');

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
 */
function handleRoot(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
    const { offset = 0, limit = 25, tag } = req.query;

    try {
        res.json(
            await Products.list({
                offset: Number(offset),
                limit: Number(limit),
                tag,
            })
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/**
 * Get a specific product by ID
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
async function getProduct(req, res, next) {
    const { id } = req.params;

    try {
        const product = await Products.get(id);
        if (!product) {
            return res.status(404).json({ error: `Product with ID ${id} not found` });
        }
        res.json(product);
    } catch (err) {
        next(err);
    }
}

/**
 * Create a new product
 * @param {object} req
 * @param {object} res
 */
async function createProduct(req, res) {
    const productSchema = Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        tags: Joi.array().items(Joi.string()).optional(),
    });

    const { error } = productSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        // Logic to add the product
        res.status(201).json(req.body); // Placeholder response
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/**
 * Delete a product by ID
 * @param {object} req
 * @param {object} res
 */
async function deleteProduct(req, res) {
    const { id } = req.params;

    try {
        await Products.delete(id);
        res.status(202).json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/**
 * Update a product by ID
 * @param {object} req
 * @param {object} res
 */
async function updateProduct(req, res) {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedProduct = await Products.update(id, updatedData);
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = autoCatch({
    handleRoot,
    listProducts,
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct,
});
