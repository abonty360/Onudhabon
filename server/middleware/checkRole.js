function checkRole(requiredRole) {
  return (req, res, next) => {
    const { roles, isVerified } = req.user;
    if (roles !== requiredRole) {
      return res.status(403).json({ error: `Access denied: ${requiredRole}s only.` });
    }
    if (roles!=="Admin" && !isVerified)
    {
      return res.status(403).json({ error: "Access denied: Unverified account." });
    }
    next();
  };
}

export default checkRole;
