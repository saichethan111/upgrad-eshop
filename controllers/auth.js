// ... (other imports)

async function signIn(req, res) {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    return res.status(401).send("This email has not been registered!");
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(401).send("Invalid Credentials!");
  }

  const token = jwt.sign(
    {
      _id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      isAdmin: user.role === ADMIN,
    },
    process.env.JWT_SECRET, // Use a secure secret stored in an environment variable
    { expiresIn: '1h' } // Set token expiration (e.g., 1 hour)
  );

  res.header(AUTH_TOKEN, token).send({
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    isAuthenticated: true,
  });
}

// ... (other functions)

module.exports = {
  signUp,
  signIn,
};
