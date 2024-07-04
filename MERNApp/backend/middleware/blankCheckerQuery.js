//for making sure query is not blank

function validateNotBlankQuery(req, res, next) {
    const { query } = req.query;

    if (typeof query === 'string') {
        req.query.query = query.trim();

        if (req.query.query === '') {
            return res.status(400).json({ error: true, message: "Query cannot be blank" });
        }
    }

    next();
}

module.exports = validateNotBlankQuery;
