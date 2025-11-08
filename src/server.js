// ── Importaciones
const path = require('path');
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');
const ProductManager = require('./ProductManager');

// ── Instancias
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// ── Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// ── Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '..', 'views'));

// ── ProductManager y compartir en app
const manager = new ProductManager(path.join(__dirname, 'data', 'products.json'));
app.set('manager', manager);
app.set('io', io);

// ── Routers
const viewsRouter = require('./routes/views.router');
const apiProductsRouter = require('./routes/api.products.router');
app.use('/', viewsRouter);
app.use('/api/products', apiProductsRouter); // ← AHORA sí, después de crear app

// ── Socket.IO
io.on('connection', async (socket) => {
    console.log('Cliente conectado:', socket.id);

    // Enviar lista inicial
    const products = await manager.getAll();
    socket.emit('products', products);

    // Crear producto via WS
    socket.on('createProduct', async (data, cb) => {
        try {
            const created = await manager.add({
                title: data.title,
                description: data.description,
                price: Number(data.price),
                thumbnail: data.thumbnail || '',
                code: data.code,
                stock: Number(data.stock ?? 0)
            });
            const updated = await manager.getAll();
            io.emit('products', updated);
            cb && cb({ ok: true, created });
        } catch (err) {
            cb && cb({ ok: false, error: err.message });
        }
    });

    // Eliminar producto via WS
    socket.on('deleteProduct', async (id, cb) => {
        try {
            await manager.deleteById(Number(id));
            const updated = await manager.getAll();
            io.emit('products', updated);
            cb && cb({ ok: true });
        } catch (err) {
            cb && cb({ ok: false, error: err.message });
        }
    });
});

// ── Levantar servidor
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
