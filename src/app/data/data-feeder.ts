import { Injectable } from "@angular/core";
import { IndexedDBService } from "./data.service";
import { Product } from "./models/product";

@Injectable({
    providedIn: 'root'
})
export class DataFeederService {
    constructor(private dataService: IndexedDBService) {
        this.dataService.dbName = 'myDatabase';
    }

    async feedProducts() {
        const anyProducts = await this.dataService.getAllProducts();
        if (anyProducts.length > 0) {
            console.log('Products already exist in the database.');
            return;
        }

        const products = [
            { id: 1, name: 'Product 1', price: 10 },
            { id: 2, name: 'Product 2', price: 20 },
            { id: 3, name: 'Product 3', price: 30 },
        ] as Product[];

        products.forEach(async product => {
            await this.dataService.addProduct(product);
        });
    }
}
