import { Injectable } from "@angular/core";
import { Product } from "./models/product";
import { ShoppingCart } from "./models/shopping-cart";
import { User } from "./models/user";

@Injectable({
    providedIn: 'root'
})
export class IndexedDBService {
    dbName!: string;

    async openDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBRequest).result;
                if (!db.objectStoreNames.contains('Users')) {
                    const objectStore = db.createObjectStore('Users', { keyPath: 'id', autoIncrement: true });
                    objectStore.createIndex('id', 'id', { unique: true });
                    objectStore.createIndex('username', 'username', { unique: true });
                }

                if (!db.objectStoreNames.contains('Products')) {
                    const objectStore = db.createObjectStore('Products', { keyPath: 'id', autoIncrement: true });
                    objectStore.createIndex('id', 'id', { unique: true });
                }

                if (!db.objectStoreNames.contains('ShoppingCarts')) {
                    const objectStore = db.createObjectStore('ShoppingCarts', { keyPath: 'id', autoIncrement: true });
                    objectStore.createIndex('id', 'id', { unique: true });
                    objectStore.createIndex('userId', 'userId', { unique: true });
                }
            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async addProduct(product: Product): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('Products', 'readwrite');
            const store = transaction.objectStore('Products');
            const request = store.add(product);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async updateProduct(product: Product): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('Products', 'readwrite');
            const store = transaction.objectStore('Products');
            const request = store.put(product);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async deleteProduct(id: number): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('Products', 'readwrite');
            const store = transaction.objectStore('Products');
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getProduct(id: number): Promise<Product | undefined> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('Products', 'readonly');
            const store = transaction.objectStore('Products');
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result as Product);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllProducts(): Promise<Product[]> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('Products', 'readonly');
            const store = transaction.objectStore('Products');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result as Product[]);
            request.onerror = () => reject(request.error);
        });
    }

    async addShoppingCart(shoppingCart: ShoppingCart): Promise<number | undefined> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('ShoppingCarts', 'readwrite');
            const store = transaction.objectStore('ShoppingCarts');
            const request = store.add(shoppingCart);

            request.onsuccess = () => resolve(request.result as number);
            request.onerror = () => reject(request.error);
        });
    }

    async updateShoppingCart(shoppingCart: ShoppingCart): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('ShoppingCarts', 'readwrite');
            const store = transaction.objectStore('ShoppingCarts');
            const request = store.put(shoppingCart);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async deleteShoppingCart(id: number): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('ShoppingCarts', 'readwrite');
            const store = transaction.objectStore('ShoppingCarts');
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getShoppingCart(userId: number): Promise<ShoppingCart | undefined> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('ShoppingCarts', 'readonly');
            const store = transaction.objectStore('ShoppingCarts');
            const index = store.index('userId');
            const request = index.get(userId);

            request.onsuccess = () => resolve(request.result as ShoppingCart);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllShoppingCarts(): Promise<ShoppingCart[]> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('ShoppingCarts', 'readonly');
            const store = transaction.objectStore('ShoppingCarts');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result as ShoppingCart[]);
            request.onerror = () => reject(request.error);
        });
    }

    async addUser(user: User): Promise<number> {
        const db = await this.openDB();
        return new Promise(async (resolve, reject) => {
            const transaction = db.transaction('Users', 'readwrite');
            const store = transaction.objectStore('Users');
            const request = store.add({ name: user.username });

            request.onsuccess = () => resolve(request.result as number);
            request.onerror = () => reject(request.error);
        });
    }

    async updateUser(user: User): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('Users', 'readwrite');
            const store = transaction.objectStore('Users');
            const request = store.put(user);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async deleteUser(id: number): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('Users', 'readwrite');
            const store = transaction.objectStore('Users');
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getUser(username: string): Promise<User | undefined> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('Users', 'readonly');
            const store = transaction.objectStore('Users');
            const index = store.index('username');
            const request = index.get(username);

            request.onsuccess = () => resolve(request.result as User);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllUsers(): Promise<User[]> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('Users', 'readonly');
            const store = transaction.objectStore('Users');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result as User[]);
            request.onerror = () => reject(request.error);
        });
    }
}
