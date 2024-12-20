export const WishlistSection: React.FC = () => (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
      <div className="text-center text-gray-500">
        <p>Your wishlist is empty.</p>
        <button className="btn btn-primary mt-4">Explore Products</button>
      </div>
    </div>
  );