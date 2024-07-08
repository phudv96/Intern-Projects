////for making sure body is not blank

function validateNotBlankBody(req, res, next) {
    const { content } = req.body;

    if (typeof content === 'string' && content.trim() === '') {
        return res.status(400).json({ error: true, message: "Body cannot be blank" });
    }

    next();
}

module.exports = validateNotBlankBody;
