import express from "express";
import { register_user } from "../controllers/user.controller.js";

const router =express.Router()

router.route("/register").post(register_user)

export default router