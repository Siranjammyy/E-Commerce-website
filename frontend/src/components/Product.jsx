import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Plus, Check, Package } from 'lucide-react';
import { addToCart } from '../actions/cartActions';

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.countInStock > 0) {
      dispatch(addToCart(product._id, 1));
      setAdded(true);
      setTimeout(() => setAdded(false), 1600);
    }
  };

  return (
    <article className="group flex flex-col bg-[#FFFFFF] border border-[#EAE4D8] rounded-sm overflow-hidden hover:border-[#D5CDC0] hover:shadow-card transition-all duration-300">
      {/* Product Image Frame */}
      <Link
        to={`/product/${product._id}`}
        className="block relative aspect-[4/5] bg-[#F7F5F0] overflow-hidden border-b border-[#F0EBE0]"
      >
        {imgError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#F7F5F0] text-[#7D7E77] p-6 text-center">
            <Package className="w-10 h-10 text-[#C7C0B0] mb-2 stroke-[1.25]" />
            <span className="font-sans text-xs text-[#181816] font-semibold">{product.brand || 'VERO'}</span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#9A988F] mt-1">{product.category || 'Curated'}</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500 ease-out"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}

        {/* Stock Badge Overlay */}
        {product.countInStock === 0 && (
          <div className="absolute inset-0 bg-[#FAF8F5]/85 backdrop-blur-2xs flex items-center justify-center p-4">
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#8B3A2B] border border-[#D9B5AD] px-3 py-1 bg-white">
              Currently Unavailable
            </span>
          </div>
        )}

        {/* Category Pill */}
        <span className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.2em] font-semibold text-[#666660] bg-white/90 backdrop-blur-xs px-2 py-0.5 border border-[#EAE4D8]">
          {product.category || 'Curated'}
        </span>
      </Link>

      {/* Product Content Details */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-[#7D7E77] mb-1.5 font-medium">
            <span>{product.brand}</span>
            {product.countInStock > 0 && product.countInStock <= 5 && (
              <span className="text-[#A65B44] font-semibold">Low Stock</span>
            )}
          </div>

          <Link
            to={`/product/${product._id}`}
            className="font-sans text-sm sm:text-base leading-snug font-medium text-[#181816] group-hover:text-[#2D4436] transition-colors line-clamp-2"
            title={product.name}
          >
            {product.name}
          </Link>
        </div>

        {/* Pricing & Add to Cart Footer */}
        <div className="pt-4 mt-4 border-t border-[#F2EEE7] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#9A988F] block font-medium">
              Price
            </span>
            <span className="font-sans text-base font-semibold text-[#181816] tracking-tight">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className={`text-xs uppercase tracking-[0.14em] font-semibold px-3 py-2 transition-all duration-200 flex items-center gap-1.5 rounded-sm ${
              product.countInStock === 0
                ? 'bg-[#EAE4D8] text-[#9E9E96] cursor-not-allowed'
                : added
                ? 'bg-[#2D4436] text-[#FAF8F5]'
                : 'bg-[#F4F0E8] hover:bg-[#2D4436] text-[#2D4436] hover:text-[#FAF8F5]'
            }`}
            title={product.countInStock === 0 ? 'Out of stock' : 'Quick add to cart'}
            aria-label={`Add ${product.name} to bag`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default Product;
