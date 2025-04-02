import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { IndexedDBService } from '../data/data.service';
import { CommonModule } from '@angular/common';
import { User } from '../data/models/user';
import { FormsModule } from '@angular/forms';
import { Product } from '../data/models/product';
import { ShoppingCart } from '../data/models/shopping-cart';
import { DashboardViewModel } from './models/dashboard-viewmodel';
import { LoginComponent } from "../login/login.component";
import { ProductsListComponent } from "../products-list/products-list.component";
import { ShoppingCartComponent } from "../shopping-cart/shopping-cart.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, LoginComponent, ProductsListComponent, ShoppingCartComponent],
})
export class DashboardComponent implements OnInit {
    @ViewChild('appShoppingCart')
    appShoppingCartRef!: ShoppingCartComponent | undefined;

    viewModel: DashboardViewModel = {
        isShoppingCartOpen: false,
        currentFlowStep: 1,
        user: {
            name: '',
            email: '',
        } as User,
        total: 0,
        isLoggedIn: false,
    } as DashboardViewModel;

    constructor(private dataService: IndexedDBService, private changeDetectorRef: ChangeDetectorRef) {}

    async ngOnInit() {
        this.viewModel.products = await this.dataService.getAllProducts();
    }

    async onLogin(user: User) {
        this.viewModel.user = user;
        if (user) {
            const shoppingCart = await this.dataService.getShoppingCart(this.viewModel.user.id);
            if (shoppingCart) {
                this.viewModel.shoppingCart = shoppingCart as ShoppingCart;
                this.viewModel.currentFlowStep = 2;
                this.viewModel.isLoggedIn = true;
            }
        }
    }

    async nextStep(step: number) {
        this.viewModel.currentFlowStep = step;
        console.log('Current flow step:', this.viewModel.currentFlowStep);
    }

    get loggedUser() {
        return this.viewModel.user.name && this.viewModel.user.email ? this.viewModel.user : null;
    }

    async onAddToCart(product: Product) {
        this.viewModel.shoppingCart.productIds.push(product.id);
        console.log('Product added to cart:', product);
        await this.dataService.updateShoppingCart(this.viewModel.shoppingCart);
        this.appShoppingCartRef?.updateTotal();
    }

    onLogout() {
        this.viewModel.user = {} as User;
        this.viewModel.shoppingCart = {} as ShoppingCart;
        this.viewModel.currentFlowStep = 1;
        localStorage.removeItem('user');
        this.viewModel.isLoggedIn = false;
    }

    toggleShoppingCart() {
        this.viewModel.isShoppingCartOpen = !this.viewModel.isShoppingCartOpen;
        // this.changeDetectorRef.detectChanges();
    }
}

