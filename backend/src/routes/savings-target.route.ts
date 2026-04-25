import { Router } from "express";
import {
  createSavingsTarget,
  getSavingsTarget,
  updateSavingsTarget,
  deleteSavingsTarget,
} from "../controllers/savings-target.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const router = Router();

router.use(passportAuthenticateJwt);

router.post("/", createSavingsTarget);
router.get("/", getSavingsTarget);
router.put("/", updateSavingsTarget);
router.delete("/", deleteSavingsTarget);

export default router;