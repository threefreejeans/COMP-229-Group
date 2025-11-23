import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

// These routes are placeholders for MVC usage
router.get("/", async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const user = await getUserById(req.params.id);
  res.json(user);
});

router.post("/", async (req, res) => {
  const user = await createUser(req.body);
  res.json(user);
});

router.put("/:id", async (req, res) => {
  const user = await updateUser(req.params.id, req.body);
  res.json(user);
});

router.delete("/:id", async (req, res) => {
  await deleteUser(req.params.id);
  res.json({ message: "User deleted" });
});

export default router;
