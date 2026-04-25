import { Router } from "express";
import {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
} from "../controllers/budget.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const router = Router();

router.use(passportAuthenticateJwt);

router.post("/", createBudget);
router.get("/", getBudgets);
router.get("/:id", getBudgetById);
router.put("/:id", updateBudget);
router.delete("/:id", deleteBudget);

export default router;