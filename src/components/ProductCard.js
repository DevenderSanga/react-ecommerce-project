import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/ProductCard.css";

const ProductCard = ({ product }) => {

    const [isWishlisted, setIsWishlisted] = useState(false);

    const image =
        product.images && product.images.length > 0
            ? product.images[0]
            : product.image || "https://placehold.co/400x500?text=No+Image";

    const price = Number(product.price) || 0;
    const originalPrice = Number(product.originalPrice) || 0;

    const discount =
        product.discountPercentage ||
        (originalPrice > price
            ? Math.round(
                ((originalPrice - price) / originalPrice) * 100
            )
            : 0);

    const addToWishlist = async () => {
        try {

            const response = await axios.get(
                `http://localhost:5001/wishlist?productId=${product.id}`
            );

            if (response.data.length > 0) {
                await axios.delete(
                    `http://localhost:5001/wishlist/${response.data[0].id}`
                );

                setIsWishlisted(false);
            } else {

                await axios.post(
                    "http://localhost:5001/wishlist",
                    {
                        productId: product.id,
                        name: product.name,
                        brand: product.brand,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        discountPercentage: product.discountPercentage,
                        images: product.images || [],
                        image: image,
                        category: product.category,
                        addedAt: new Date().toISOString()
                    }
                );

                setIsWishlisted(true);
            }

        } catch (error) {
            console.log("Wishlist error:", error);
        }
    };

    return (
        <div className="myntra-card">

            {/* IMAGE */}
            <div className="myntra-image-container">

                <Link to={`/products/${product.id}`}>
                    <img
                        src={image}
                        alt={product.name}
                        className="myntra-product-image"
                        onError={(e) => {
                            e.currentTarget.src =
                                "https://placehold.co/400x500?text=Image+Not+Available";
                        }}
                    />
                </Link>

                {/* DISCOUNT */}
                {discount > 0 && (
                    <span className="myntra-discount">
                        {discount}% OFF
                    </span>
                )}

                {/* WISHLIST */}
                <button
                    className={`myntra-wishlist ${
                        isWishlisted ? "wishlist-active" : ""
                    }`}
                    onClick={addToWishlist}
                    aria-label="Wishlist"
                >
                    {isWishlisted ? "♥" : "♡"}
                </button>

            </div>


            {/* PRODUCT INFORMATION */}
            <div className="myntra-product-info">

                <p className="myntra-brand">
                    {product.brand}
                </p>

                <h3 className="myntra-product-name">
                    {product.name}
                </h3>

                {product.shortDescription && (
                    <p className="myntra-description">
                        {product.shortDescription}
                    </p>
                )}

                {/* RATING */}
                {product.rating && (
                    <div className="myntra-rating">
                        <span>★</span>
                        <span>{product.rating}</span>

                        {product.totalReviews && (
                            <span className="review-count">
                                | {product.totalReviews} Reviews
                            </span>
                        )}
                    </div>
                )}

                {/* PRICE */}
                <div className="myntra-price-row">

                    <span className="myntra-price">
                        ₹{price.toLocaleString("en-IN")}
                    </span>

                    {originalPrice > price && (
                        <span className="myntra-original-price">
                            ₹{originalPrice.toLocaleString("en-IN")}
                        </span>
                    )}

                    {discount > 0 && (
                        <span className="myntra-price-discount">
                            ({discount}% OFF)
                        </span>
                    )}

                </div>

                {/* VIEW BUTTON */}
                <Link
                    to={`/products/${product.id}`}
                    className="myntra-view-button"
                >
                    View Details
                </Link>

            </div>

        </div>
    );
};

export default ProductCard;