import mongoose from "mongoose";
const { Schema } = mongoose;

const projectSchema = new Schema({
   createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
   },
   title: {
      type: String,
      required: true,
      unique: true,
   },
   checkList: [
      {
         description: { type: String, required: true },
         done: { type: Boolean, default: false },
      },
   ],
   priority: {
      type: String,
      required: true,
      enum: ["High", "Moderate", "Low"],
   },
   status: {
      type: String,
      enum: ["TODO", "PROGRESS", "BACKLOG", "DONE"],
      default: "TODO",
   },
   assignTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
   },
   dueDate: {
      type: Date,
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
});

export default mongoose.model("Project", projectSchema);
