import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../data/models/user';
import { IndexedDBService } from '../data/data.service';
import { ShoppingCart } from '../data/models/shopping-cart';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class LoginComponent implements OnInit {
    @Input()
    user!: User;

    @Output()
    userChange = new EventEmitter<User>();

    @Input()
    shoppingCart!: ShoppingCart;

    @Output()
    loggedIn = new EventEmitter<User>();

    constructor(private dataService: IndexedDBService) {

    }

    ngOnInit(): void {
        const user = localStorage.getItem('user');
        if (user) {
            this.user = JSON.parse(user) as User;
            this.loggedIn.emit(this.user);
        }
    }

    generateRandomUser() {
        const timestamp = new Date().getTime(); // Get the current time in milliseconds
        const baseString = timestamp.toString(36); // Convert timestamp to base-36 (alphanumeric)
        const randomValue = Math.random().toString(36).substring(2, 8); // Generate a random alphanumeric component
        const randomString = `${baseString}${randomValue}`; // Combine timestamp-based string with the random value
        this.user.username = randomString;
        this.userChange.emit(this.user);
    }

    async login() {
        let localStorageUser: any = localStorage.getItem('user');
        if (localStorageUser) {
            localStorageUser = JSON.parse(localStorageUser) as User;
            const userExist = await this.dataService.getUser(localStorageUser.username);
            if (userExist) {
                this.user = userExist as User;
                this.loggedIn.emit(this.user);
            }
        } else {
            await this.addUserIfNotExists();
            const userExists = await this.dataService.getUser(this.user.username);
            if (userExists) {
                localStorage.setItem('user', JSON.stringify(userExists));
                this.user = userExists as User;
                this.loggedIn.emit(this.user);
            }
        }
    }

    async addUserIfNotExists() {
        const user = await this.dataService.getUser(this.user.username);
        console.log('User:', user);
        if (!user) {
            await this.dataService.addUser(this.user);
            const createdUser = await this.dataService.getUser(this.user.username);
            console.log(createdUser);
            if (createdUser) {
                this.user = createdUser as User;
                this.shoppingCart = { userId: createdUser.id } as ShoppingCart;
                this.shoppingCart.productIds = [];
                const createdShoppingCartId = await this.dataService.addShoppingCart(this.shoppingCart);
                this.shoppingCart.id = createdShoppingCartId;
                console.log('User added:', this.user);
                localStorage.setItem('user', JSON.stringify(this.user));
            }
        }
    }
}
