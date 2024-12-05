// components/ProductCard.tsx
import React from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  return (
    <div 
      className="card bg-base-100 shadow-xl hover:scale-105 transition-transform cursor-pointer"
      onClick={() => onProductClick(product)}
    >
      <figure>
        <img 
          src={`http://127.0.0.1:8000/storage/${product.image}`} 
          alt={product.name} 
          className="w-full h-64 object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{product.name}</h2>
        <p className="text-primary font-bold">${product.price.toFixed(2)}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">View Details</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;