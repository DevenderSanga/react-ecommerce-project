import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Cart.css";

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    const getCart = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5001/cart"
            );

            setCart(response.data);
        } catch (error) {
            console.log("Error fetching cart data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCart();
    }, []);

    // Increase quantity
    const increaseQuantity = async (item) => {
        try {
            await axios.patch(
                `http://localhost:5001/cart/${item.id}`,
                {
                    quantity: Number(item.quantity) + 1,
                }
            );

            getCart();
        } catch (error) {
            console.log("Error increasing quantity", error);
        }
    };

    // Decrease quantity
    const decreaseQuantity = async (item) => {
        try {
            if (Number(item.quantity) === 1) {
                await removeItem(item);
                return;
            }

            await axios.patch(
                `http://localhost:5001/cart/${item.id}`,
                {
                    quantity: Number(item.quantity) - 1,
                }
            );

            getCart();
        } catch (error) {
            console.log("Error decreasing quantity", error);
        }
    };

    // Remove item
    const removeItem = async (item) => {
        try {
            await axios.delete(
                `http://localhost:5001/cart/${item.id}`
            );

            getCart();
        } catch (error) {
            console.log("Error removing item", error);
        }
    };

    // Price calculation
    const subtotal = cart.reduce(
        (sum, item) =>
            sum +
            Number(item.price || 0) *
                Number(item.quantity || 1),
        0
    );

    const totalOriginalPrice = cart.reduce(
        (sum, item) =>
            sum +
            Number(item.originalPrice || item.price || 0) *
                Number(item.quantity || 1),
        0
    );

    const discount = totalOriginalPrice - subtotal;

    const deliveryCharge = subtotal >= 499 ? 0 : 40;

    const totalAmount = subtotal + deliveryCharge;

    if (loading) {
        return (
            <div className="cart-loading">
                <div className="spinner-border"></div>
                <p>Loading your cart...</p>
            </div>
        );
    }

    return (
        <div className="cart-page">

            {/* Header */}
            <div className="cart-header">
                <div>
                    <h1>Shopping Cart</h1>
                    <p>
                        {cart.length}{" "}
                        {cart.length === 1
                            ? "item"
                            : "items"}{" "}
                        in your cart
                    </p>
                </div>

                <Link
                    to="/products"
                    className="continue-shopping"
                >
                    ← Continue Shopping
                </Link>
            </div>

            {cart.length === 0 ? (

                /* Empty Cart */
                <div className="empty-cart">

                    <div className="empty-cart-icon">
                        🛒
                    </div>

                    <h2>Your cart is empty</h2>

                    <p>
                        Looks like you haven't added
                        anything to your cart yet.
                    </p>

                    <Link
                        to="/products"
                        className="shop-now-btn"
                    >
                        Start Shopping
                    </Link>

                </div>

            ) : (

                <div className="cart-layout">

                    {/* LEFT SIDE */}
                    <div className="cart-items-section">

                        <div className="cart-items-header">
                            <h3>
                                My Cart ({cart.length})
                            </h3>

                            <span>
                                Free delivery on orders
                                above ₹499
                            </span>
                        </div>

                        {cart.map((item) => {

                            const image =
                                item.images?.[0] ||
                                item.image ||
                                "https://via.placeholder.com/300x350?text=No+Image";

                            const itemPrice =
                                Number(item.price || 0);

                            const itemOriginalPrice =
                                Number(
                                    item.originalPrice ||
                                        item.price ||
                                        0
                                );

                            const itemDiscount =
                                itemOriginalPrice -
                                itemPrice;

                            return (
                                <div
                                    className="cart-item"
                                    key={item.id}
                                >

                                    {/* Product Image */}
                                    <div className="cart-image-container">

                                        <Link
                                            to={`/products/${
                                                item.productId ||
                                                item.id
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={
                                                    item.name ||
                                                    item.title
                                                }
                                                className="cart-product-image"
                                            />
                                        </Link>

                                    </div>

                                    {/* Product Information */}
                                    <div className="cart-product-info">

                                        <div className="product-top">

                                            <div>
                                                <p className="cart-brand">
                                                    {item.brand ||
                                                        "Brand"}
                                                </p>

                                                <Link
                                                    to={`/products/${
                                                        item.productId ||
                                                        item.id
                                                    }`}
                                                    className="cart-product-name"
                                                >
                                                    {item.name ||
                                                        item.title}
                                                </Link>
                                            </div>

                                            <button
                                                className="remove-btn"
                                                onClick={() =>
                                                    removeItem(
                                                        item
                                                    )
                                                }
                                            >
                                                ♡ Remove
                                            </button>

                                        </div>

                                        {/* Description */}
                                        {item.shortDescription && (
                                            <p className="cart-description">
                                                {
                                                    item.shortDescription
                                                }
                                            </p>
                                        )}

                                        {/* Size & Color */}
                                        <div className="cart-options">

                                            {item.size && (
                                                <span>
                                                    Size:{" "}
                                                    <strong>
                                                        {
                                                            item.size
                                                        }
                                                    </strong>
                                                </span>
                                            )}

                                            {item.color && (
                                                <span>
                                                    Color:{" "}
                                                    <strong>
                                                        {
                                                            item.color
                                                        }
                                                    </strong>
                                                </span>
                                            )}

                                        </div>

                                        {/* Price */}
                                        <div className="cart-price">

                                            <strong>
                                                ₹
                                                {itemPrice.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </strong>

                                            {itemOriginalPrice >
                                                itemPrice && (
                                                <>
                                                    <del>
                                                        ₹
                                                        {itemOriginalPrice.toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </del>

                                                    <span className="discount">
                                                        {item.discountPercentage
                                                            ? `${item.discountPercentage}% OFF`
                                                            : `₹${itemDiscount.toLocaleString(
                                                                  "en-IN"
                                                              )} OFF`}
                                                    </span>
                                                </>
                                            )}

                                        </div>

                                        {/* Quantity */}
                                        <div className="cart-bottom">

                                            <div className="quantity-box">

                                                <button
                                                    onClick={() =>
                                                        decreaseQuantity(
                                                            item
                                                        )
                                                    }
                                                >
                                                    −
                                                </button>

                                                <span>
                                                    {
                                                        item.quantity
                                                    }
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        increaseQuantity(
                                                            item
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>

                                            </div>

                                            <span className="delivery-text">
                                                🚚 Delivery
                                                available
                                            </span>

                                        </div>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                    {/* RIGHT SIDE */}
                    <div className="price-section">

                        <div className="price-card">

                            <h3>PRICE DETAILS</h3>

                            <div className="price-row">
                                <span>
                                    Price (
                                    {cart.length} items)
                                </span>

                                <span>
                                    ₹
                                    {totalOriginalPrice.toLocaleString(
                                        "en-IN"
                                    )}
                                </span>
                            </div>

                            {discount > 0 && (
                                <div className="price-row discount-row">
                                    <span>
                                        Discount
                                    </span>

                                    <span>
                                        − ₹
                                        {discount.toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>
                                </div>
                            )}

                            <div className="price-row">
                                <span>
                                    Delivery Charges
                                </span>

                                <span>
                                    {deliveryCharge ===
                                    0 ? (
                                        <span className="free">
                                            FREE
                                        </span>
                                    ) : (
                                        `₹${deliveryCharge}`
                                    )}
                                </span>
                            </div>

                            <div className="price-divider"></div>

                            <div className="total-row">
                                <strong>
                                    Total Amount
                                </strong>

                                <strong>
                                    ₹
                                    {totalAmount.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>
                            </div>

                            {discount > 0 && (
                                <div className="savings">
                                    🎉 You saved ₹
                                    {discount.toLocaleString(
                                        "en-IN"
                                    )}{" "}
                                    on this order
                                </div>
                            )}

                            <Link
                                to="/checkout"
                                className="checkout-btn"
                            >
                                Proceed to Checkout
                            </Link>

                        </div>

                        {/* Safety information */}
                        <div className="secure-box">

                            <div>🔒</div>

                            <div>
                                <strong>
                                    Safe & Secure Payments
                                </strong>

                                <p>
                                    Your payment information
                                    is protected.
                                </p>
                            </div>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default Cart;