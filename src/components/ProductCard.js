import React from "react";
import { Link } from "react-router-dom";
import "../styles/ProductCard.css";
import axios from "axios";
import { useState } from "react";

const ProductCard = ({ product }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const image =
        product.images && product.images.length > 0
            ? product.images[0]
            : "https://via.placeholder.com/400x500?text=No+Image";

    const price = Number(product.price) || 0;
    const originalPrice = Number(product.originalPrice) || 0;
    const discount = product.discountPercentage || 0;

    const addToWishlist = async () => {

        try {
            const response = await axios.get("http://localhost:5001/wishlist");
            const alreadyExists = response.data.some((item) => item.productId === product.id);
            if (alreadyExists) { alert("Product is already in wishlist"); ; return; }
            const wishlistProduct = { productId: product.id, name: product.name, brand: product.brand, price: product.price, originalPrice: product.originalPrice, discountPercentage: product.discountPercentage, image: image, rating: product.rating, category: product.category };
            await axios.post("http://localhost:5001/wishlist", wishlistProduct);
            setIsWishlisted(true);
            alert("Product added to wishlist ");
        }
        catch (error) {
            console.error("Wishlist Error:", error); alert("Failed to add product to wishlist");
        }
    }

    return (
        <div className="myntra-card">
            <div className="myntra-image-container">

                <Link to={`/products/${product.id}`}>
                    <img
                        src={image}
                        alt={product.name}
                        className="myntra-product-image"
                        onError={(e) => {
                            e.target.src =
                                "https://via.placeholder.com/400x500?text=Image+Not+Found";
                        }}
                    />
                </Link>

                {/* Discount */}
                {discount > 0 && (
                    <span className="discount-badge">
                        {discount}% OFF
                    </span>
                )}

                {/* Wishlist */}
                <button className={`wishlist-btn ${ isWishlisted ? "wishlisted" : "" }`} onClick={addToWishlist} > {isWishlisted ? "♥" : "♡"} </button>

                {/* Rating */}
                <div className="image-rating">
                    ⭐ {product.rating}
                </div>

            </div>

        
            <div className="myntra-details">

                {/* Brand */}
                <h3 className="product-name">
                     {product.name}
                    
                </h3>

                {/* Product Name */}
                <p className="product-brand">
                   {product.brand}
                </p>
                <p className="product-description">
                    {product.shortDescription}
                </p>

                {/* Category */}
                <p className="product-category">
                    {product.category}
                </p>

                {/* Price */}
                <div className="price-row">

                    <span className="current-price">
                        ₹{price.toLocaleString("en-IN")}
                    </span>

                    {originalPrice > price && (
                        <span className="original-price">
                            ₹{originalPrice.toLocaleString("en-IN")}
                        </span>
                    )}

                    {discount > 0 && (
                        <span className="discount-text">
                            ({discount}% OFF)
                        </span>
                    )}

                </div>

                {/* View Button */}
                <Link
                    to={`/products/${product.id}`}
                    className="view-product-btn"
                >
                    View Details
                </Link>

            </div>
        </div>
    );
};

export default ProductCard;