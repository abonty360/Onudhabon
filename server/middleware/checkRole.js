function checkRole(requiredRole) {
  return (req, res, next) => {
    if (req.user.roles !== requiredRole || !req.user.isVerified) {
      return res.status(403).json({ error: "Access denied: Insufficient role or unverified account." });
    }
    next();
  };
}

export default checkRole;
