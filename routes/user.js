const { Router } = require("express");
const User = require("../models/user");
const GoogleUser = require("../models/usergoogle");

const router = Router();
const { validateToken } = require("../services/authentication");


router.get("/signin", (req, res) => {
  return res.render("login");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);

    // Send the token in the response
    return res
      .cookie("token", token)
      .status(200)
      .json({ message: "Signin successful", token }); // Include the token in the response

  } catch (error) {
    // Assuming you want to send an error status and a JSON response
    return res.status(401).json({ error: "Incorrect Email or Password" });
  }
});

router.post("/googlesignin", async (req, res) => {
  const { fullname, email } = req.body;
  console.log(req.body)
  try {
    const newgoogleUser = await GoogleUser.create({
      email,
      fullname
    });
    const token = await GoogleUser.GenerateToken(fullname, email);
    // console.log(token)
    // Send the token in the response
    return res
      .status(200)
      .json({ message: "Signin successful", token }); // Include the token in the response

  } catch (error) {
    // Assuming you want to send an error status and a JSON response
    return res.status(401).json({ error: "Incorrect Email or Password" });
  }
});

router.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;

  // Check if required fields are present
  if (!fullname || !email || !password) {
    return res.status(400).json({ error: "Please provide all required fields" });
  }

  try {
    const newUser = await User.create({
      fullname,
      email,
      password,
    });

    // Assuming you want to send a success status and a JSON response
    return res.status(201).json({ message: "Thank you for signing up" });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Signup failed" });
  }
});

router.get('/getuserdetail', (req, res) => {
  const { token } = req.query;
  // Extract the 'token' parameter from the URL query string

  try {
    const userPayload = validateToken(token);
    // Send the user information as a JSON response
    res.json(userPayload);
  } catch (error) {
  
    // Set the HTTP response status to 400 (Bad Request)
    res.status(400);
    res.json({ error: 'Invalid token' });
  }
});




module.exports = router;
