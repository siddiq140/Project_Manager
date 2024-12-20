import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
   name: {
      type: String,
      required: [true, "User Name is required"],
      trim: true,
   },
   email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"],
   },
   password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
   },
   projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
   createdAt: {
      type: Date,
      default: Date.now,
   },
});

export default mongoose.model("User", userSchema);
