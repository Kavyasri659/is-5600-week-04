const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, 'data/full-products.json');

async function list(options = {}) {
    const { offset = 0, limit = 25, tag } = options;

    const data = await fs.readFile(productsFile);
    return JSON.parse(data)
        .filter(product => !tag || product.tags.some(({ title }) => title === tag))
        .slice(offset, offset + limit);
}

async function get(id) {
    const products = JSON.parse(await fs.readFile(productsFile));
    return products.find(product => product.id === id) || null;
}

async function update(id, data) {
    const products = JSON.parse(await fs.readFile(productsFile));
    const index = products.findIndex(product => product.id === id);
    if (index === -1) throw new Error('Product not found');

    products[index] = { ...products[index], ...data };
    await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
    return products[index];
}

async function deleteProduct(id) {
    const products = JSON.parse(await fs.readFile(productsFile));
    const updatedProducts = products.filter(product => product.id !== id);
    if (updatedProducts.length === products.length) throw new Error('Product not found');

    await fs.writeFile(productsFile, JSON.stringify(updatedProducts, null, 2));
}

module.exports = {
    list,
    get,
    update,
    delete: deleteProduct,
};
