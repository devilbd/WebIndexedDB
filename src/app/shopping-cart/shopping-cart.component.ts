import { Component, input, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShoppingCart } from '../data/models/shopping-cart';
import { Product } from '../data/models/product';
import { IndexedDBService } from '../data/data.service';
import { User } from '../data/models/user';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

    @Input()
    shoppingCart!: ShoppingCart;

    @Input()
    products!: Product[];

    @Input()
    user!: User;

    @Input()
    total: number = 0;

    @Input()
    open = false;

    constructor(private dataService: IndexedDBService) { }

    ngOnInit(): void {
        this.updateTotal();
    }

    getProductById(id: number): Product | undefined {
        return this.products?.find(product => product.id === id);
    }

    updateTotal() {
        this.total = 0;
        if(this.shoppingCart && this.shoppingCart.productIds) {
            this.shoppingCart.productIds.forEach(id => {
                const product = this.getProductById(id);
                if (product) {
                    this.total += product.price;
                }
            });
        }
    }

    async removeFromCart(product: Product | undefined) {
        if (product && this.shoppingCart) {
            const index = this.shoppingCart.productIds.indexOf(product.id);
            if (index > -1) {
                this.shoppingCart.productIds.splice(index, 1);
                console.log('Product removed from cart:', product);
                await this.dataService.updateShoppingCart(this.shoppingCart);
                this.updateTotal();
            }
        }
    }
}
