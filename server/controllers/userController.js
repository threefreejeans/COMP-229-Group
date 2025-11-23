import User from "../models/User.js";

// Display all users
export const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

// Get user by ID
export const getUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

// Create new user
export const createUser = async (data) => {
  const newUser = new User(data);
  await newUser.save();
  return newUser;
};

// Update user by ID
export const updateUser = async (id, data) => {
  const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
  return updatedUser;
};

// Delete user by ID
export const deleteUser = async (id) => {
  await User.findByIdAndDelete(id);
  return;
};
