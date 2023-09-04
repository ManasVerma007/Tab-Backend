const { Router } = require("express");
const Usertabs = require("../models/usertabs");

const router = Router();

router.post("/savetabs", async (req, res) => {
    try {
      const userData = req.body; // Assuming the request body contains user data
      console.log(userData);
  
      // Use Usertabs.create to create a new Usertabs document
      const usertabs = await Usertabs.create(userData);
  
      res
        .status(201)
        .json({ message: "User tabs created successfully", usertabs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
module.exports = router;
