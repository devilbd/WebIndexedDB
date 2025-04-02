import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../data/models/product';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ProductsListComponent implements OnInit {
    @Input()
    products!: Product[];

    @Output()
    addToCart = new EventEmitter<Product>();

    ngOnInit(): void {

    }

    onAddToCart(product: Product) {
        this.addToCart.emit(product);
    }
}
