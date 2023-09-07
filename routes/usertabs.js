const { Router } = require("express");
const Usertabs = require("../models/usertabs");

const router = Router();




// Get all tabs for a specific user and folder
router.get("/gettabs/:userId/:folderId", async (req, res) => {
  try {
    const { userId, folderId } = req.params;

    // Find the user by userId
    const user = await Usertabs.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the folder by folderId
    const folder = user.folders.find((f) => f.folderId === folderId);

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    // Send the tabs in the folder as a JSON response
    res.status(200).json({ tabs: folder.tabs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new tab for a user
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

// Add a new tab to an existing user's tabs
router.post("/addtab/:userId/:folderId", async (req, res) => {
  try {
    const { userId, folderId } = req.params;
    const newTabData = req.body;

    // Find the user by userId
    const user = await Usertabs.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the folder by folderId
    const folder = user.folders.find((f) => f.folderId === folderId);

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    // Ensure the new tab data includes the folderId
    newTabData.folderId = folderId;

    // Add the new tab data to the folder's tabs array
    folder.tabs.push(newTabData);

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Tab added successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a tab from an existing user's tabs
router.delete("/deletetab/:userId/:folderId/:tabId", async (req, res) => {
  try {
    const { userId, folderId, tabId } = req.params;

    // Find the user by userId
    const user = await Usertabs.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the folder by folderId
    const folder = user.folders.find((f) => f.folderId === folderId);

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    // Find the index of the tab to be deleted
    const tabIndex = folder.tabs.findIndex((tab) => tab.tabId === tabId);

    if (tabIndex === -1) {
      return res.status(404).json({ error: "Tab not found" });
    }

    // Remove the tab from the folder's tabs array
    folder.tabs.splice(tabIndex, 1);

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Tab deleted successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});



router.post("/addfolder/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const newFolder = req.body; // Assuming the request body contains folder data

    // Find the user by userId
    const user = await Usertabs.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add the new folder to the user's folders array
    user.folders.push(newFolder);

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Folder added successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Delete a folder for a specific user

router.delete("/deletefolder/:userId/:folderId", async (req, res) => {
  try {
    const { userId, folderId } = req.params;

    // Find the user by userId
    const user = await Usertabs.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the folder index by folderId
    const folderIndex = user.folders.findIndex((f) => f.folderId === folderId);

    if (folderIndex === -1) {
      return res.status(404).json({ error: "Folder not found" });
    }

    // Remove the folder from the user's folders array
    user.folders.splice(folderIndex, 1);

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Folder deleted successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
