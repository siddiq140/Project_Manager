import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Signup function
export const signup = async (req, res) => {
   const { name, email, password } = req.body;

   try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = new User({
         name,
         email,
         password: hashedPassword,
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

      res.status(201).json({ message: "User Created", token, user: newUser });
   } catch (error) {
      res.status(500).json({ message: "Error occurred during signup" });
   }
};

// Login function
export const login = async (req, res) => {
   const { email, password } = req.body;

   try {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
         return res.status(404).json({ message: "User not found" });
      }

      const isPasswordCorrect = await bcrypt.compare(
         password,
         existingUser.password
      );
      if (!isPasswordCorrect) {
         return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);

      res.status(200).json({ user: existingUser, token });
   } catch (error) {
      res.status(500).json({ message: "Error occurred during login" });
   }
};

// Function to get all user emails
export const getAllUserEmails = async (req, res) => {
   try {
      const users = await User.find({}, { email: 1, _id: 0 });

      const userEmails = users.map((user) => user.email);

      res.status(200).json(userEmails);
   } catch (error) {
      res.status(500).json({ message: "Error fetching user emails" });
   }
};

// Function to update user information (name, email, or password one at a time)
export const updateUser = async (req, res) => {
   const { oldPassword, ...updateData } = req.body;

   const userId = req.user.id;

   if (Object.keys(updateData).length !== 1) {
      return res
         .status(400)
         .json({ error: "You can only update one field at a time." });
   }

   try {
      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({ error: "User not found." });
      }

      const fieldToUpdate = Object.keys(updateData)[0];

      if (fieldToUpdate === "password") {
         if (!oldPassword) {
            return res.status(400).json({
               error: "Old password is required to update the password.",
            });
         }

         const isMatch = await bcrypt.compare(oldPassword, user.password);
         if (!isMatch) {
            return res
               .status(400)
               .json({ error: "Old password is incorrect." });
         }

         updateData.password = await bcrypt.hash(updateData.password, 12);
      }

      user[fieldToUpdate] = updateData[fieldToUpdate];
      await user.save();

      res.status(200).json({
         message: `${fieldToUpdate} updated successfully.`,
      });
   } catch (error) {
      res.status(500).json({
         error: "An error occurred while updating the user.",
      });
   }
};

// Function to get user
export const getUser = async (req, res) => {
   try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
         return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ user });
   } catch (error) {
      res.status(500).json({ message: "Error fetching user", error });
   }
};
