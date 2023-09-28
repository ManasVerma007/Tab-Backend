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
    console.log(userId, folderId, tabId);

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

// Endpoint to record time spent on a tab
router.post('/track-time/:userId/:folderId/:tabId', async (req, res) => {
  try {
    const { userId, folderId, tabId } = req.params;
    const { startTime, endTime } = req.body;
    
    // Calculate time spent on the tab
    const timeSpent = endTime - startTime;

    // Find the user document that matches the userId
    const user = await Usertabs.findOne({ userId });

    // Find the folder within the user's folders array that matches folderId
    const folder = user.folders.find((folder) => folder.folderId === folderId);

    // Find the tab within the folder's tabs array that matches tabId
    const tab = folder.tabs.find((tab) => tab.tabId === tabId);

    // Increment the tab's timeSpent field
    tab.timeSpent += timeSpent;

    // Save the updated user document
    await user.save();

    res.json({ message: 'Time tracked successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Endpoint to track user clicks on a tab
router.post('/track-click/:userId/:folderId/:tabId', async (req, res) => {
  try {
    const { userId, folderId, tabId } = req.params;

    // Find the user document that matches the userId
    const user = await Usertabs.findOne({ userId });

    // Find the folder within the user's folders array that matches folderId
    const folder = user.folders.find((folder) => folder.folderId === folderId);

    // Find the tab within the folder's tabs array that matches tabId
    const tab = folder.tabs.find((tab) => tab.tabId === tabId);

    // Increment the tab's clickCount field
    tab.clickCount += 1;

    // Save the updated user document
    await user.save();

    res.json({ message: 'Click tracked successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get time spent on each folder for a user
router.get('/time-spent/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user document that matches the userId
    const user = await Usertabs.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Initialize an array to store folder time data for the Pie chart
    const folderTimeData = [];

    // Iterate through folders and calculate total time spent
    for (const folder of user.folders) {
      let totalFolderTime = 0;

      for (const tab of folder.tabs) {
        totalFolderTime += tab.timeSpent;
      }

      // Add folder time data to the array
      folderTimeData.push({
        folderName: folder.folderName,
        timeSpent: totalFolderTime,
      });
    }

    res.json(folderTimeData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/tabsclick/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user document that matches the userId
    const user = await Usertabs.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Initialize an array to store tab information
    const tabsInfo = [];

    // Iterate through folders and tabs to collect tab information
    for (const folder of user.folders) {
      for (const tab of folder.tabs) {
        tabsInfo.push({
          tabId: tab.tabId,
          title: tab.title,
          url: tab.url,
          clickCount: tab.clickCount,
        });
      }
    }

    // Sort the tabs in ascending order based on clickCount
    tabsInfo.sort((a, b) => a.clickCount - b.clickCount);

    res.json(tabsInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get("/getalltabsdata/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by userId
    const user = await Usertabs.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract the desired data from all folders and tabs
    const allTabsData = [];

    user.folders.forEach((folder) => {
      folder.tabs.forEach((tab) => {
        allTabsData.push({
          userId: user.userId,
          folderId: folder.folderId,
          tabId: tab.tabId,
          tabTitle: tab.title,
        });
      });
    });

    res.status(200).json(allTabsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
