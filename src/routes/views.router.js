import { Router } from "express";
const router = Router();

router.get("/", async (req, res) => {
    const manager = req.app.get("manager");
    const products = await manager.getAll();
    res.render("home", { title: "Home", products });
});

router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts", { title: "Productos en tiempo real" });
});

export default router;
