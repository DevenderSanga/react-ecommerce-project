import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Checkout.css";

const Checkout = () => {
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [buyNowProduct, setBuyNowProduct] = useState(null);

    const [customerName, setCustomerName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [pincode, setPincode] = useState("");

    const [paymentMethod, setPaymentMethod] =
        useState("Cash on Delivery");

    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] =
        useState(false);

    // ==============================
    // GET CHECKOUT PRODUCTS
    // ==============================

    useEffect(() => {
        const loadCheckout = async () => {
            try {
                // Check Buy Now first
                const savedBuyNow =
                    localStorage.getItem(
                        "buyNowProduct"
                    );

                if (savedBuyNow) {
                    const product =
                        JSON.parse(savedBuyNow);

                    setBuyNowProduct(product);
                } else {
                    // Otherwise load cart
                    const response =
                        await axios.get(
                            "http://localhost:5001/cart"
                        );

                    setCartItems(response.data);
                }
            } catch (error) {
                console.log(
                    "Error loading checkout:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadCheckout();
    }, []);

    // ==============================
    // PRODUCTS TO ORDER
    // ==============================

    const orderItems = buyNowProduct
        ? [buyNowProduct]
        : cartItems;

    // ==============================
    // CALCULATE SUBTOTAL
    // ==============================

    const subtotal = orderItems.reduce(
        (total, item) =>
            total +
            Number(item.price || 0) *
                Number(item.quantity || 1),
        0
    );

    // ==============================
    // ORIGINAL PRICE
    // ==============================

    const originalTotal = orderItems.reduce(
        (total, item) =>
            total +
            Number(
                item.originalPrice ||
                    item.price ||
                    0
            ) *
                Number(item.quantity || 1),
        0
    );

    // ==============================
    // DISCOUNT
    // ==============================

    const discount = originalTotal - subtotal;

    // ==============================
    // DELIVERY
    // ==============================

    const deliveryCharge =
        subtotal >= 499 ? 0 : 40;

    // ==============================
    // FINAL TOTAL
    // ==============================

    const total =
        subtotal + deliveryCharge;

    // ==============================
    // PLACE ORDER
    // ==============================

    const placeOrder = async (e) => {
        e.preventDefault();

        // Name validation
        if (!customerName.trim()) {
            alert("Please enter your full name.");
            return;
        }

        // Phone validation
        if (!/^[6-9]\d{9}$/.test(phone)) {
            alert(
                "Please enter a valid 10-digit phone number."
            );
            return;
        }

        // Address validation
        if (!address.trim()) {
            alert(
                "Please enter your delivery address."
            );
            return;
        }

        // City validation
        if (!city.trim()) {
            alert("Please enter your city.");
            return;
        }

        // Pincode validation
        if (!/^\d{6}$/.test(pincode)) {
            alert(
                "Please enter a valid 6-digit pincode."
            );
            return;
        }

        if (orderItems.length === 0) {
            alert("Your cart is empty.");
            navigate("/products");
            return;
        }

        try {
            setPlacingOrder(true);

            const newOrder = {
                id: Date.now().toString(),

                customerName:
                    customerName.trim(),

                phone: phone,

                address:
                    address.trim(),

                city:
                    city.trim(),

                pincode:
                    pincode,

                paymentMethod:
                    paymentMethod,

                date:
                    new Date().toLocaleString(
                        "en-IN"
                    ),

                status: "Processing",

                subtotal:
                    subtotal,

                discount:
                    discount,

                deliveryCharge:
                    deliveryCharge,

                total:
                    total,

                items:
                    orderItems.map((item) => ({
                        productId:
                            item.productId ||
                            item.id,

                        name:
                            item.name ||
                            item.title,

                        brand:
                            item.brand || "",

                        image:
                            item.images?.[0] ||
                            item.image ||
                            "",

                        images:
                            item.images || [],

                        price:
                            Number(
                                item.price || 0
                            ),

                        originalPrice:
                            Number(
                                item.originalPrice ||
                                    item.price ||
                                    0
                            ),

                        quantity:
                            Number(
                                item.quantity || 1
                            ),

                        size:
                            item.size || "",

                        color:
                            item.color || "",

                        shortDescription:
                            item.shortDescription ||
                            "",
                    })),
            };

            // Save order
            await axios.post(
                "http://localhost:5001/orders",
                newOrder
            );

            // =========================
            // IF CART CHECKOUT
            // DELETE ALL CART ITEMS
            // =========================

            if (!buyNowProduct) {
                await Promise.all(
                    cartItems.map((item) =>
                        axios.delete(
                            `http://localhost:5001/cart/${item.id}`
                        )
                    )
                );
            }

            // Remove Buy Now data
            localStorage.removeItem(
                "buyNowProduct"
            );

            alert(
                "Order placed successfully! 🎉"
            );

            navigate("/orders");

        } catch (error) {
            console.log(
                "Error placing order:",
                error
            );

            alert(
                "Something went wrong while placing your order."
            );
        } finally {
            setPlacingOrder(false);
        }
    };

    // ==============================
    // LOADING
    // ==============================

    if (loading) {
        return (
            <div className="checkout-loading">
                <div className="spinner-border"></div>

                <p>
                    Loading checkout...
                </p>
            </div>
        );
    }

    // ==============================
    // EMPTY CHECKOUT
    // ==============================

    if (orderItems.length === 0) {
        return (
            <div className="empty-checkout">

                <div className="empty-icon">
                    🛒
                </div>

                <h2>
                    Nothing to checkout
                </h2>

                <p>
                    Your cart is currently empty.
                </p>

                <button
                    onClick={() =>
                        navigate("/products")
                    }
                >
                    Continue Shopping
                </button>

            </div>
        );
    }

    return (
        <div className="checkout-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="checkout-header">

                <div>
                    <h1>
                        Checkout
                    </h1>

                    <p>
                        Complete your order
                        securely
                    </p>
                </div>

                <div className="checkout-steps">

                    <span className="active">
                        1. Address
                    </span>

                    <span>→</span>

                    <span className="active">
                        2. Order Summary
                    </span>

                    <span>→</span>

                    <span>
                        3. Payment
                    </span>

                </div>

            </div>

            <form
                onSubmit={placeOrder}
                className="checkout-layout"
            >

                {/* ==================================
                    LEFT SIDE
                ================================== */}

                <div className="checkout-left">

                    {/* =========================
                        DELIVERY ADDRESS
                    ========================= */}

                    <div className="checkout-card">

                        <div className="card-title">

                            <span className="step-number">
                                1
                            </span>

                            <div>
                                <h3>
                                    Delivery Address
                                </h3>

                                <p>
                                    Where should we
                                    deliver your order?
                                </p>
                            </div>

                        </div>

                        <div className="form-grid">

                            <div className="form-group">

                                <label>
                                    Full Name *
                                </label>

                                <input
                                    type="text"
                                    value={
                                        customerName
                                    }
                                    onChange={(e) =>
                                        setCustomerName(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your full name"
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Phone Number *
                                </label>

                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(
                                            e.target.value.replace(
                                                /\D/g,
                                                ""
                                            )
                                        )
                                    }
                                    maxLength="10"
                                    placeholder="10-digit mobile number"
                                />

                            </div>

                        </div>

                        <div className="form-group">

                            <label>
                                Address *
                            </label>

                            <textarea
                                value={address}
                                onChange={(e) =>
                                    setAddress(
                                        e.target.value
                                    )
                                }
                                placeholder="House No, Street, Area, Landmark"
                                rows="4"
                            />

                        </div>

                        <div className="form-grid">

                            <div className="form-group">

                                <label>
                                    City *
                                </label>

                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) =>
                                        setCity(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter city"
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Pincode *
                                </label>

                                <input
                                    type="text"
                                    value={pincode}
                                    onChange={(e) =>
                                        setPincode(
                                            e.target.value.replace(
                                                /\D/g,
                                                ""
                                            )
                                        )
                                    }
                                    maxLength="6"
                                    placeholder="6-digit pincode"
                                />

                            </div>

                        </div>

                    </div>

                    {/* =========================
                        PAYMENT
                    ========================= */}

                    <div className="checkout-card">

                        <div className="card-title">

                            <span className="step-number">
                                2
                            </span>

                            <div>
                                <h3>
                                    Payment Method
                                </h3>

                                <p>
                                    Select your preferred
                                    payment method
                                </p>
                            </div>

                        </div>

                        <div className="payment-options">

                            <label
                                className={
                                    paymentMethod ===
                                    "Cash on Delivery"
                                        ? "payment-option selected"
                                        : "payment-option"
                                }
                            >

                                <input
                                    type="radio"
                                    name="payment"
                                    value="Cash on Delivery"
                                    checked={
                                        paymentMethod ===
                                        "Cash on Delivery"
                                    }
                                    onChange={(e) =>
                                        setPaymentMethod(
                                            e.target.value
                                        )
                                    }
                                />

                                <span className="payment-icon">
                                    💵
                                </span>

                                <div>
                                    <strong>
                                        Cash on Delivery
                                    </strong>

                                    <p>
                                        Pay when your
                                        order arrives
                                    </p>
                                </div>

                            </label>

                            <label
                                className={
                                    paymentMethod ===
                                    "UPI"
                                        ? "payment-option selected"
                                        : "payment-option"
                                }
                            >

                                <input
                                    type="radio"
                                    name="payment"
                                    value="UPI"
                                    checked={
                                        paymentMethod ===
                                        "UPI"
                                    }
                                    onChange={(e) =>
                                        setPaymentMethod(
                                            e.target.value
                                        )
                                    }
                                />

                                <span className="payment-icon">
                                    📱
                                </span>

                                <div>
                                    <strong>
                                        UPI
                                    </strong>

                                    <p>
                                        Pay using
                                        Google Pay,
                                        PhonePe, etc.
                                    </p>
                                </div>

                            </label>

                            <label
                                className={
                                    paymentMethod ===
                                    "Card"
                                        ? "payment-option selected"
                                        : "payment-option"
                                }
                            >

                                <input
                                    type="radio"
                                    name="payment"
                                    value="Card"
                                    checked={
                                        paymentMethod ===
                                        "Card"
                                    }
                                    onChange={(e) =>
                                        setPaymentMethod(
                                            e.target.value
                                        )
                                    }
                                />

                                <span className="payment-icon">
                                    💳
                                </span>

                                <div>
                                    <strong>
                                        Credit / Debit Card
                                    </strong>

                                    <p>
                                        Secure card
                                        payment
                                    </p>
                                </div>

                            </label>

                        </div>

                    </div>

                </div>

                {/* ==================================
                    RIGHT SIDE
                ================================== */}

                <div className="checkout-right">

                    {/* =========================
                        ORDER SUMMARY
                    ========================= */}

                    <div className="checkout-card">

                        <div className="summary-title">

                            <h3>
                                Order Summary
                            </h3>

                            <span>
                                {orderItems.length}{" "}
                                {orderItems.length === 1
                                    ? "item"
                                    : "items"}
                            </span>

                        </div>

                        <div className="checkout-products">

                            {orderItems.map(
                                (item, index) => {

                                    const image =
                                        item.images?.[0] ||
                                        item.image ||
                                        "https://via.placeholder.com/100x120?text=No+Image";

                                    const itemTotal =
                                        Number(
                                            item.price || 0
                                        ) *
                                        Number(
                                            item.quantity ||
                                                1
                                        );

                                    return (
                                        <div
                                            className="checkout-product"
                                            key={
                                                item.id ||
                                                index
                                            }
                                        >

                                            <img
                                                src={
                                                    image
                                                }
                                                alt={
                                                    item.name ||
                                                    item.title
                                                }
                                            />

                                            <div className="checkout-product-info">

                                                <strong>
                                                    {item.name ||
                                                        item.title}
                                                </strong>

                                                {item.brand && (
                                                    <small>
                                                        {
                                                            item.brand
                                                        }
                                                    </small>
                                                )}

                                                <div className="product-options">

                                                    {item.size && (
                                                        <span>
                                                            Size:{" "}
                                                            {
                                                                item.size
                                                            }
                                                        </span>
                                                    )}

                                                    {item.color && (
                                                        <span>
                                                            Color:{" "}
                                                            {
                                                                item.color
                                                            }
                                                        </span>
                                                    )}

                                                </div>

                                                <div className="product-qty">

                                                    Qty:{" "}
                                                    {
                                                        item.quantity
                                                    }

                                                </div>

                                            </div>

                                            <strong>
                                                ₹
                                                {itemTotal.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </strong>

                                        </div>
                                    );
                                }
                            )}

                        </div>

                        <div className="summary-divider"></div>

                        {/* Price */}

                        <div className="summary-row">

                            <span>
                                Subtotal
                            </span>

                            <span>
                                ₹
                                {subtotal.toLocaleString(
                                    "en-IN"
                                )}
                            </span>

                        </div>

                        {discount > 0 && (
                            <div className="summary-row discount">

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

                        <div className="summary-row">

                            <span>
                                Delivery
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

                        <div className="summary-divider"></div>

                        <div className="grand-total">

                            <strong>
                                Total Amount
                            </strong>

                            <strong>
                                ₹
                                {total.toLocaleString(
                                    "en-IN"
                                )}
                            </strong>

                        </div>

                        {discount > 0 && (
                            <div className="checkout-saving">

                                🎉 You are saving ₹
                                {discount.toLocaleString(
                                    "en-IN"
                                )}

                            </div>
                        )}

                        <button
                            type="submit"
                            className="place-order-btn"
                            disabled={
                                placingOrder
                            }
                        >

                            {placingOrder
                                ? "Placing Order..."
                                : `Place Order • ₹${total.toLocaleString(
                                      "en-IN"
                                  )}`}

                        </button>

                        <div className="secure-payment">

                            🔒 Secure & Safe Checkout

                        </div>

                    </div>

                </div>

            </form>

        </div>
    );
};

export default Checkout;