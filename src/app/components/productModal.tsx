// components/ProductModal.tsx
import React from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  return (
    <div className="modal modal-open">
      <div className="modal-box relative">
        <button 
          className="btn btn-sm btn-circle absolute right-2 top-2" 
          onClick={onClose}
        >
          ✕
        </button>
        
        <figure className="mb-4">
          <img 
            src={`http://127.0.0.1:8000/storage/${product.image}`} 
            alt={product.name} 
            className="w-full h-96 object-cover rounded-xl"
          />
        </figure>
        
        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
        <p className="text-primary text-xl font-semibold mb-4">${product.price.toFixed(2)}</p>
        
        <p>Detailed description of the product would go here.</p>
        
        <div className="modal-action">
          <button className="btn btn-primary">Add to Cart</button>
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;