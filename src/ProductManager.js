import fs from "fs";
import path from "path";

export default class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        if (!fs.existsSync(this.path)) {
            fs.mkdirSync(path.dirname(this.path), { recursive: true });
            fs.writeFileSync(this.path, JSON.stringify([]));
        }
    }

    async _readFile() {
        const data = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(data);
    }

    async _writeFile(products) {
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    }

    async getAll() {
        return await this._readFile();
    }

    async add(product) {
        const required = ["title", "description", "price", "thumbnail", "code", "stock"];
        for (const f of required)
            if (!product[f] && product[f] !== 0) throw new Error(`Falta campo: ${f}`);

        const products = await this._readFile();
        if (products.some((p) => p.code === product.code)) {
            throw new Error("El código ya existe");
        }
        const id = products.length ? products[products.length - 1].id + 1 : 1;
        const newProd = { id, ...product };
        products.push(newProd);
        await this._writeFile(products);
        return newProd;
    }

    async deleteById(id) {
        const products = await this._readFile();
        const idx = products.findIndex((p) => p.id === id);
        if (idx === -1) throw new Error("No encontrado");
        const [removed] = products.splice(idx, 1);
        await this._writeFile(products);
        return removed;
    }
}
