import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Minus,
  Plus,
  Package,
} from 'lucide-react';
import { listProductDetails, listProducts } from '../actions/productActions';
import { addToCart } from '../actions/cartActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Product from '../components/Product';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [prevId, setPrevId] = useState(id);
  const [imgError, setImgError] = useState(false);

  if (prevId !== id) {
    setPrevId(id);
    setImgError(false);
  }

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productList = useSelector((state) => state.productList);
  const { products } = productList;

  useEffect(() => {
    dispatch(listProductDetails(id));
    dispatch(listProducts());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch, id]);

  const addToCartHandler = () => {
    dispatch(addToCart(product._id, qty));
    setAdded(true);
    setTimeout(() => {
      navigate('/cart');
    }, 450);
  };

  const handleQtyChange = (delta) => {
    const newQty = qty + delta;
    if (newQty >= 1 && newQty <= (product?.countInStock || 1)) {
      setQty(newQty);
    }
  };

  // Find genuine related artifacts from the store catalog
  const relatedProducts = (products || [])
    .filter((p) => p._id !== id && (p.category === product?.category || p.brand === product?.brand))
    .slice(0, 4);

  return (
    <div className="bg-canvas min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-charcoal/60 hover:text-charcoal transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Collection</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-24">
            <Loader text="Retrieving artifact specifications..." />
          </div>
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : product ? (
          <div>
            <div className="bg-white border border-sand/60 p-6 sm:p-10 lg:p-12 shadow-sm mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
                {/* Left Column: Product Gallery Frame */}
                <div className="lg:col-span-7">
                  <div className="aspect-[4/3] sm:aspect-square bg-sand/15 border border-sand/40 overflow-hidden relative flex items-center justify-center p-6 sm:p-8 group">
                    {imgError ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-[#F7F5F0] text-[#7D7E77] p-8 text-center">
                        <Package className="w-16 h-16 text-[#C7C0B0] mb-3 stroke-[1.25]" />
                        <span className="font-sans text-base text-[#181816] font-semibold">{product.brand || 'VERO'}</span>
                        <span className="text-xs uppercase tracking-[0.2em] text-[#9A988F] mt-1">{product.category || 'Curated Specification'}</span>
                      </div>
                    ) : (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
                        onError={() => setImgError(true)}
                      />
                    )}
                    {product.countInStock <= 3 && product.countInStock > 0 && (
                      <span className="absolute top-4 left-4 bg-charcoal text-ivory text-[10px] uppercase tracking-widest px-3 py-1 font-medium">
                        Low Inventory ({product.countInStock} Left)
                      </span>
                    )}
                    {product.countInStock === 0 && (
                      <span className="absolute top-4 left-4 bg-sand text-charcoal text-[10px] uppercase tracking-widest px-3 py-1 font-medium">
                        Sold Out
                      </span>
                    )}
                  </div>

                  {/* Additional Technical Attributes */}
                  <div className="mt-8 grid grid-cols-3 gap-4 border-t border-sand/40 pt-6 text-center">
                    <div>
                      <span className="block text-[10px] uppercase tracking-widest text-charcoal/50 mb-1">
                        Department
                      </span>
                      <span className="font-serif text-sm text-charcoal">
                        {product.category || 'General'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase tracking-widest text-charcoal/50 mb-1">
                        Manufacturer
                      </span>
                      <span className="font-serif text-sm text-charcoal">
                        {product.brand || 'Authentic'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase tracking-widest text-charcoal/50 mb-1">
                        Item Reference
                      </span>
                      <span className="font-mono text-xs text-charcoal/80">
                        #{product._id ? product._id.slice(-6).toUpperCase() : 'VRO-01'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Spec, Pricing, and Cart Controls */}
                <div className="lg:col-span-5 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 mb-3">
                      <span className="w-4 h-px bg-olive"></span>
                      <span className="text-[10px] uppercase tracking-[0.25em] text-olive font-semibold">
                        {product.brand}
                      </span>
                    </div>

                    <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-charcoal font-normal leading-snug mb-4">
                      {product.name}
                    </h1>

                    <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-sand/40">
                      <span className="font-sans text-2xl sm:text-3xl text-charcoal font-semibold">
                        ${Number(product.price).toFixed(2)}
                      </span>
                      <span className="text-xs text-charcoal/50 uppercase tracking-widest font-medium">
                        USD / Tax Included
                      </span>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                      <h3 className="text-[11px] uppercase tracking-[0.2em] text-charcoal/60 font-medium mb-3">
                        Design Notes & Description
                      </h3>
                      <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-light">
                        {product.description}
                      </p>
                    </div>

                    {/* Stock Availability */}
                    <div className="border border-sand/50 bg-ivory/50 p-4 mb-6">
                      <div className="flex items-center justify-between text-xs">
                        <span className="uppercase tracking-widest text-charcoal/60 font-medium">
                          Inventory Status
                        </span>
                        <span
                          className={`font-medium ${
                            product.countInStock > 0 ? 'text-olive' : 'text-red-700'
                          }`}
                        >
                          {product.countInStock > 0
                            ? `In Stock (${product.countInStock} units ready to dispatch)`
                            : 'Currently Unavailable'}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Stepper & Add to Cart */}
                    {product.countInStock > 0 && (
                      <div className="space-y-4 mb-8">
                        <div>
                          <label className="block text-[11px] uppercase tracking-widest text-charcoal/60 mb-2 font-medium">
                            Select Quantity
                          </label>
                          <div className="flex items-center border border-sand w-fit bg-white">
                            <button
                              type="button"
                              onClick={() => handleQtyChange(-1)}
                              disabled={qty <= 1}
                              aria-label="Decrease quantity"
                              className="p-3 text-charcoal hover:bg-sand/20 disabled:opacity-30 disabled:hover:bg-transparent transition"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-mono text-sm px-6 py-2 text-charcoal font-medium select-none min-w-[3rem] text-center">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQtyChange(1)}
                              disabled={qty >= product.countInStock}
                              aria-label="Increase quantity"
                              className="p-3 text-charcoal hover:bg-sand/20 disabled:opacity-30 disabled:hover:bg-transparent transition"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={addToCartHandler}
                          disabled={product.countInStock === 0}
                          className={`w-full py-4 text-xs uppercase tracking-[0.2em] font-medium transition duration-300 flex items-center justify-center gap-2 shadow-sm ${
                            added
                              ? 'bg-olive text-ivory'
                              : 'bg-charcoal hover:bg-olive text-ivory'
                          }`}
                        >
                          {added ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Added to Bag</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4" />
                              <span>Add to Shopping Bag &bull; ${(product.price * qty).toFixed(2)}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {product.countInStock === 0 && (
                      <div className="mb-8">
                        <button
                          disabled
                          className="w-full py-4 text-xs uppercase tracking-[0.2em] font-medium bg-sand/40 text-charcoal/40 cursor-not-allowed border border-sand"
                        >
                          Temporarily Out of Stock
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Assurance and Dispatch Badges */}
                  <div className="border-t border-sand/40 pt-6 space-y-3 text-xs text-charcoal/70">
                    <div className="flex items-center gap-3">
                      <Truck className="w-4 h-4 text-olive shrink-0" />
                      <span>Complimentary insured shipping on all orders</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-olive shrink-0" />
                      <span>Manufacturer warranty & verified authenticity</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <RotateCcw className="w-4 h-4 text-olive shrink-0" />
                      <span>30-day unhurried return policy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Authentic Related Artifacts Section */}
            {relatedProducts.length > 0 && (
              <section className="mt-16 pt-12 border-t border-sand/60">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-olive font-semibold block mb-1">
                      Curated For You
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-normal">
                      Complementary Pieces
                    </h2>
                  </div>
                  <Link
                    to="/"
                    className="text-xs uppercase tracking-wider text-charcoal/60 hover:text-charcoal underline"
                  >
                    View All &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((relProduct) => (
                    <Product key={relProduct._id} product={relProduct} />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProductPage;
