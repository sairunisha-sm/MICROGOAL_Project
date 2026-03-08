const express = require("express");
const router = express.Router();
const goalModel = require("../Model/GoalModel");
const authmiddleware = require("../Middlewares/authMiddleware");

router.post("/create", authmiddleware, async (req, res, next) => {
  try {
    const { title } = req.body;

    const goal = new goalModel({
      title: title,
      user: req.user,
    });

    await goal.save();

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (err) {
    next(err);
  }
});

// GET all goals for the logged-in user
router.get("/all", authmiddleware, async (req, res, next) => {
  try {
    const goals = await goalModel.find({ user: req.user }); // fetch all goals

    res.status(200).json({
      success: true,
      data: goals,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", authmiddleware, async (req, res, next) => {
  try {
    const id = req.params.id;

    const goal = await goalModel.findOne({
      _id: id,
      user: req.user,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found or you are not authorized",
      });
    }

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    next(error);
  }
});


router.put("/:id", authmiddleware, async (req, res, next) => {
  try {
    const goal = await goalModel.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { completed: req.body.completed },
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found or you are not authorized",
      });
    }

    res.status(200).json({
      success: true,
      message: "Goal updated successfully",
      data: goal,
    });
  } catch (error) {
    next(error);
  }
});


router.delete("/:id", authmiddleware, async (req, res, next) => {
  try {
    const deletedGoal = await goalModel.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!deletedGoal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found or you are not authorized",
      });
    }

    res.status(200).json({
      success: true,
      message: "Goal deleted",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

