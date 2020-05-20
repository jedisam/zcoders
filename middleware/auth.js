const jwt = require ('jsonwebtoken');
require ('dotenv/config');

module.exports = (req, res, next) => {
  // get token from header
  const token = req.header ('x-auth-token');
  //check if no token
  if (!token) {
    return res.status (401).json ({msg: 'No token, Authorization Denied!'});
  }

  // verify token
  try {
    const decoded = jwt.verify (token, process.env.jwtSecret);
    req.user = decoded.user;
    next ();
  } catch (err) {
      res.status(401).json({ msg: 'Token not valid!'})
  }
};
