const socket = io();
const list = document.getElementById('realtimeList');
const formCreate = document.getElementById('formCreate');
const formDelete = document.getElementById('formDelete');
const msgCreate = document.getElementById('msgCreate');
const msgDelete = document.getElementById('msgDelete');


function renderList(products) {
    if (!products || products.length === 0) {
        list.innerHTML = '<li>No hay productos (todavía)</li>';
        return;
    }
    list.innerHTML = products.map(p => `
<li>
<strong>[#${p.id}] ${p.title}</strong> — $${p.price} — Stock: ${p.stock}
<div class="muted">${p.description}</div>
</li>
`).join('');
}


socket.on('products', renderList);


formCreate.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(formCreate).entries());
    socket.emit('createProduct', data, (res) => {
        if (res?.ok) {
            msgCreate.textContent = `Creado ID ${res.created.id}`;
            formCreate.reset();
        } else {
            msgCreate.textContent = `Error: ${res?.error || 'desconocido'}`;
        }
        setTimeout(() => (msgCreate.textContent = ''), 2000);
    });
});


formDelete.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = new FormData(formDelete).get('id');
    socket.emit('deleteProduct', id, (res) => {
        if (res?.ok) {
            msgDelete.textContent = 'Eliminado';
            formDelete.reset();
        } else {
            msgDelete.textContent = `Error: ${res?.error || 'desconocido'}`;
        }
        setTimeout(() => (msgDelete.textContent = ''), 2000);
    });
});