import express, { Router } from "express";

import whatsappRouter from "./whatsapp.ts";

const router: Router = express.Router();

// mount whatsapp routes
router.use("/connect-whatsapp", whatsappRouter);
export default router;
