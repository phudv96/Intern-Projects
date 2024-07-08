// used for RBAC

const checkAdminRole = (req, res, next) => {
    const { user } = req.user;

    if (user.role !== 'admin') {
        return res.status(403).json({ error: true, message: "Access denied" });
    }
    
    next();
};

module.exports = checkAdminRole;

