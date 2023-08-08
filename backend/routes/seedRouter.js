import express from "express";
import Pack from "../models/packModel.js";
import User from "../models/userModel.js";
import data from "../data.js";

const seedRouter = express.Router();

seedRouter.get("/", async (req, res) => {
  try {
    await Pack.deleteMany({});
    const createdPacks = await Pack.insertMany(data.packs);

    await User.deleteMany({});
    const createdUsers = await User.insertMany(data.users);

    res.send({
      message: "Database reset and seeded successfully",
      packs: createdPacks,
      users: createdUsers,
    });
  } catch (error) {
    res.status(500).send({
      message: "Failed to reset and seed the database",
      error: error.message,
    });
  }
});

export default seedRouter;
