import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Wishlist.css";

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);

    const getWishlist = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5001/wishlist"
            );

            setWishlist(response.data);
        } catch (error) {
            console.log("Error fetching wishlist:", error);
        }
    };

    useEffect(() => {
        getWishlist();
    }, []);

    const removeFromWishlist = async (id) => {
        try {
            await axios.delete(
                `http://localhost:5001/wishlist/${id}`
            );

            getWishlist();
        } catch (error) {
            console.log("Error removing item:", error);
        }
    };

    if (wishlist.length === 0) {
        return (
            <div className="empty-wishlist">
                <h2>❤️ Your Wishlist is Empty</h2>
                <p>Add products you love to your wishlist.</p>

                <Link to="/products">
                    <button>Continue Shopping</button>
                </Link>
            </div>
        );
    }

    // console.log("Wishlist items:", wishlist);

    return (
        <div className="wishlist-container">

            <div className="wishlist-header">
                <h1>My Wishlist</h1>
                <span>{wishlist.length} Items</span>
            </div>

            <div className="wishlist-grid">

                {wishlist.map((item) => (

                    <div className="wishlist-card" key={item.id}>

                        <button
                            className="remove-wishlist"
                            onClick={() =>
                                removeFromWishlist(item.id)
                            }
                        >
                            ×
                        </button>

                        <Link to={`/products/${item.id}`}>

                            <div className="wishlist-image-container">

                                <img
                                    src={
                                        item.images?.[0] ||
                                        item.image
                                    }
                                    alt={item.name}
                                    className="wishlist-image"
                                />

                            </div>

                        </Link>

                        <div className="wishlist-info">

                            <p className="wishlist-brand">
                                {item.brand}
                            </p>

                            <h3>{item.name}</h3>

                            <p className="wishlist-description">
                                {item.shortDescription}
                            </p>

                            <div className="wishlist-price">

                                <span className="current-price">
                                    ₹{item.price?.toLocaleString("en-IN")}
                                </span>

                                {item.originalPrice && (
                                    <span className="original-price">
                                        ₹{item.originalPrice?.toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>
                                )}

                                {item.discountPercentage && (
                                    <span className="discount">
                                        {item.discountPercentage}% OFF
                                    </span>
                                )}

                            </div>

                            <Link
                                to={`/products/${item.productId}`}
                                className="view-product"
                            >
                                View Product
                            </Link>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default Wishlist;