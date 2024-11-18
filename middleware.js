/**
 * Set the CORS headers on the response object
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
function cors(req, res, next) {
    const origin = req.headers.origin || '*';

    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
}

/**
 * Handle errors
 * @param {object} err
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
function handleError(err, req, res, next) {
    console.error(err);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({ error: 'Internal Server Error' });
}

/**
 * Handle 404 errors
 * @param {object} req
 * @param {object} res
 */
function notFound(req, res) {
    res.status(404).json({ error: 'Not Found' });
}

module.exports = {
    cors,
    handleError,
    notFound,
};
