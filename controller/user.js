const User = require('../models/users');

function isStringInvalid(string) {
  return string === undefined || string.length === 0;
}

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)) {
      return res.status(400).json({ err: "Bad parameters. Something is missing" });
    }
    await User.create({ name, email, password });
    res.status(201).json({ message: 'Successfully create new user' });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  signup
};
