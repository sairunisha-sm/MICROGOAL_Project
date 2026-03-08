const mongoose = require("mongoose");
const goalSchema = require("../Schema/GoalSchema");

const Goal = mongoose.model("Goal", goalSchema);

module.exports = Goal;