export interface ShoppingCart {
    id?: number;
    userId: number;
    productIds: number[];
    createdAt: Date;
    updatedAt: Date;
}
