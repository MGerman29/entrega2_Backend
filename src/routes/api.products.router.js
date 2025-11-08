const { Router } = require('express');
const router = Router();

router.post('/', async (req, res) => {
    const manager = req.app.get('manager');
    const io = req.app.get('io');
    try {
        const created = await manager.add(req.body);
        const updated = await manager.getAll();
        io.emit('products', updated);
        res.status(201).json({ status: 'success', payload: created });
    } catch (err) {
        res.status(400).json({ status: 'error', error: err.message });
    }
});

router.delete('/:pid', async (req, res) => {
    const manager = req.app.get('manager');
    const io = req.app.get('io');
    try {
        await manager.deleteById(Number(req.params.pid));
        const updated = await manager.getAll();
        io.emit('products', updated);
        res.json({ status: 'success' });
    } catch (err) {
        res.status(404).json({ status: 'error', error: err.message });
    }
});

module.exports = router;
