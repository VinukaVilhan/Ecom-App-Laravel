
export interface CartItem {
    id: number;           // Unique identifier for the cart item
    product_id: number;   // Reference to the product
    quantity: number;     // Quantity of the product in cart
    price: number;        // Price of the product
  }