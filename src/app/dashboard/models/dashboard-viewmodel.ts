import { Product } from "../../data/models/product";
import { ShoppingCart } from "../../data/models/shopping-cart";
import { User } from "../../data/models/user";

export interface DashboardViewModel {
    currentFlowStep: number;
    user: User;
    shoppingCart: ShoppingCart;
    products: Product[];
    selectedProduct: Product | null;
    total: number;
    isLoggedIn: boolean;
    isShoppingCartOpen: boolean;
}
