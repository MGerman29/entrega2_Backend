# 🧩 Entrega N°2 — WebSockets + Handlebars

Proyecto correspondiente a la **Entrega N°2** del curso **Backend I (Coderhouse)**.  
Consigna: integrar **Socket.IO** y **Handlebars** en un servidor **Express** para renderizar productos y actualizarlos en tiempo real.

---

## 🚀 Objetivo
Implementar un servidor con **Express**, **Handlebars** y **Socket.IO** que:
- Muestre una lista de productos en la vista `home.handlebars` (HTTP).
- Permita crear y eliminar productos desde `realTimeProducts.handlebars` usando **WebSockets**.
- Actualice la lista en tiempo real en todos los clientes conectados.

---

## ⚙️ Tecnologías utilizadas
- **Node.js**
- **Express**
- **Socket.IO**
- **Express-Handlebars**
- **Nodemon** (dev)
- **HTML / CSS / JS**


---

## 🧠 Descripción general

### 1️⃣ `home.handlebars`
Renderiza la lista actual de productos mediante una consulta HTTP al servidor.  
Cada producto muestra su `id`, `title`, `price` y `stock`.

### 2️⃣ `realTimeProducts.handlebars`
- Contiene dos formularios:
  - **Crear producto** (envía datos por WebSocket).
  - **Eliminar producto** (por ID, también vía WebSocket).
- La lista se actualiza automáticamente cuando un cliente crea o elimina un producto.

### 3️⃣ `ProductManager.js`
Clase encargada de manejar la persistencia de productos en `products.json` mediante operaciones asíncronas:
- `getAll()`
- `add(product)`
- `deleteById(id)`

### 4️⃣ `server.js`
Configura:
- Motor de plantillas **Handlebars**
- Servidor **Socket.IO**
- Middleware de Express
- Rutas (`views` y `api/products`)
- Eventos de WebSocket:
  - `createProduct`
  - `deleteProduct`

---

## 🧩 Uso del servidor

### Instalación
```bash
npm install


