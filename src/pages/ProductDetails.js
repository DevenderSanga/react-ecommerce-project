import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetails.css";
import { toast } from "react-toastify";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");

    // ==========================================
    // GET PRODUCT
    // ==========================================

    useEffect(() => {
        getProduct();
    }, [id]);

    const getProduct = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5001/products/${id}`
            );

            const data = response.data;

            setProduct(data);

            // ==================================
            // FIRST IMAGE ONLY
            // ==================================

            if (data.images && data.images.length > 0) {
                setSelectedImage(data.images[0]);
            } else if (data.image) {
                setSelectedImage(data.image);
            }

            // ==================================
            // SIZE EMPTY BY DEFAULT
            // USER MUST SELECT
            // ==================================

            setSelectedSize("");

            // ==================================
            // COLOR EMPTY BY DEFAULT
            // USER MUST SELECT
            // ==================================

            setSelectedColor("");

        } catch (error) {
            console.log("Error fetching product:", error);

            toast.error("Unable to load product.");
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (!product) {
        return (
            <div className="product-loading">
                <div className="spinner"></div>
                <p>Loading product...</p>
            </div>
        );
    }

    // ==========================================
    // PRODUCT IMAGES
    // ==========================================

    const productImages =
        product.images && product.images.length > 0
            ? product.images
            : product.image
                ? [product.image]
                : [];

    // ==========================================
    // COLORS
    // ==========================================

    const productColors =
        product.colors && product.colors.length > 0
            ? product.colors
            : [];

    // ==========================================
    // VARIANTS / SIZES
    // ==========================================

    const productVariants =
        product.variants && product.variants.length > 0
            ? product.variants
            : [];

    // ==========================================
    // SELECTED VARIANT
    // ==========================================

    const selectedVariant = productVariants.find((variant) => {
        const variantValue =
            variant.value ||
            variant.size ||
            "";

        return variantValue === selectedSize;
    });

    // ==========================================
    // PRICE
    // ==========================================

    const currentPrice =
        Number(selectedVariant?.price || product.price || 0);

    const originalPrice =
        Number(product.originalPrice || currentPrice);

    // ==========================================
    // DISCOUNT
    // ==========================================

    const discountPercentage =
        product.discountPercentage ||
        (
            originalPrice > currentPrice
                ? Math.round(
                    ((originalPrice - currentPrice) /
                        originalPrice) *
                    100
                )
                : 0
        );

    // ==========================================
    // VALIDATE PRODUCT OPTIONS
    // ==========================================

    const validateProductOptions = () => {

        // Stock Check
        if (
            product.stockStatus &&
            product.stockStatus !== "In Stock"
        ) {
            toast.info("Product is currently out of stock.");
            return false;
        }

        // Size Check
        if (
            productVariants.length > 0 &&
            !selectedSize
        ) {
            toast.warning("Please select a size.");
            return false;
        }

        // Color Check
        if (
            productColors.length > 0 &&
            !selectedColor
        ) {
            toast.warning("Please select a color.");
            return false;
        }

        return true;
    };

    // ==========================================
    // ADD TO CART
    // ==========================================

    const addToCart = async () => {
        try {

            if (!validateProductOptions()) {
                return;
            }

            // ==================================
            // CHECK EXISTING CART
            // ==================================

            const response = await axios.get(
                `http://localhost:5001/cart?productId=${product.id}&size=${encodeURIComponent(
                    selectedSize || ""
                )}&color=${encodeURIComponent(
                    selectedColor || ""
                )}`
            );

            // ==================================
            // UPDATE EXISTING CART ITEM
            // ==================================

            if (response.data.length > 0) {

                const cartItem = response.data[0];

                await axios.patch(
                    `http://localhost:5001/cart/${cartItem.id}`,
                    {
                        quantity:
                            Number(cartItem.quantity || 1) + 1
                    }
                );

            } else {

                // ==================================
                // ADD NEW CART ITEM
                // ==================================

                await axios.post(
                    "http://localhost:5001/cart",
                    {
                        productId: product.id,

                        name: product.name,

                        slug: product.slug,

                        brand: product.brand,

                        category: product.category,

                        subCategory: product.subCategory,

                        images: product.images || [],

                        image:
                            product.images?.[0] ||
                            product.image ||
                            "",

                        price: currentPrice,

                        originalPrice: originalPrice,

                        discountPercentage:
                            discountPercentage,

                        rating: product.rating || 0,

                        totalReviews:
                            product.totalReviews || 0,

                        shortDescription:
                            product.shortDescription || "",

                        quantity: 1,

                        size: selectedSize || "",

                        color: selectedColor || "",

                        stock: product.stock || 0,

                        seller: product.seller || null
                    }
                );
            }

            // ==================================
            // UPDATE NAVBAR CART COUNT
            // ==================================

            window.dispatchEvent(
                new Event("cartUpdated")
            );

            toast.success("Product added to cart!");

        } catch (error) {

            console.log(
                "Error adding product to cart:",
                error
            );

            toast.error("Something went wrong!");
        }
    };

    // ==========================================
    // WISHLIST
    // ==========================================

    const addToWishlist = async () => {
        try {

            const response = await axios.get(
                `http://localhost:5001/wishlist?productId=${product.id}`
            );

            if (response.data.length > 0) {
                toast.warning("Already in wishlist!");
                return;
            }

            await axios.post(
                "http://localhost:5001/wishlist",
                {
                    productId: product.id,

                    name: product.name,

                    slug: product.slug,

                    brand: product.brand,

                    category: product.category,

                    subCategory: product.subCategory,

                    images: product.images || [],

                    image:
                        product.images?.[0] ||
                        product.image ||
                        "",

                    price: currentPrice,

                    originalPrice: originalPrice,

                    discountPercentage:
                        discountPercentage,

                    rating: product.rating || 0,

                    totalReviews:
                        product.totalReviews || 0,

                    shortDescription:
                        product.shortDescription || "",

                    description:
                        product.description || "",

                    stock: product.stock || 0,

                    stockStatus:
                        product.stockStatus || "",

                    colors:
                        product.colors || [],

                    variants:
                        product.variants || [],

                    seller:
                        product.seller || null,

                    selectedColor:
                        selectedColor || "",

                    selectedSize:
                        selectedSize || "",

                    addedAt:
                        new Date().toISOString()
                }
            );

            toast.success("Added to wishlist!");

        } catch (error) {

            console.log(
                "Error adding product to wishlist:",
                error
            );

            toast.error(
                "Unable to add product to wishlist."
            );
        }
    };

    // ==========================================
    // BUY NOW
    // ==========================================

    const buyNow = () => {
        try {

            if (!validateProductOptions()) {
                return;
            }

            const buyNowProduct = {

                productId: product.id,

                name: product.name,

                slug: product.slug,

                brand: product.brand,

                category: product.category,

                subCategory: product.subCategory,

                images: product.images || [],

                image:
                    product.images?.[0] ||
                    product.image ||
                    "",

                price: currentPrice,

                originalPrice: originalPrice,

                discountPercentage:
                    discountPercentage,

                quantity: 1,

                size: selectedSize || "",

                color: selectedColor || "",

                shortDescription:
                    product.shortDescription || "",

                seller:
                    product.seller || null
            };

            localStorage.setItem(
                "buyNowProduct",
                JSON.stringify(buyNowProduct)
            );

            navigate("/checkout");

        } catch (error) {

            console.log(
                "Buy Now error:",
                error
            );

            toast.error("Unable to continue.");
        }
    };

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <div className="product-page">

            {/* ==================================
                TOP BACK BUTTON
            ================================== */}

            <div className="product-topbar">

                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    ← Back to Products
                </button>

            </div>

            <div className="product-wrapper">

                {/* ==================================
                    LEFT - PRODUCT GALLERY
                ================================== */}

                <div className="product-gallery">

                    <div className="gallery-wrapper">

                        {/* THUMBNAILS */}

                        <div className="thumbnail-container">

                            {productImages.map(
                                (image, index) => (

                                    <div
                                        key={index}
                                        className={`thumbnail ${
                                            selectedImage === image
                                                ? "active-thumbnail"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setSelectedImage(image)
                                        }
                                    >

                                        <img
                                            src={image}
                                            alt={`${product.name} ${
                                                index + 1
                                            }`}
                                        />

                                    </div>

                                )
                            )}

                        </div>

                        {/* MAIN IMAGE */}

                        <div className="main-image-box">

                            {selectedImage ? (

                                <img
                                    src={selectedImage}
                                    alt={product.name}
                                    className="main-product-image"
                                />

                            ) : (

                                <div className="no-image">
                                    No Image Available
                                </div>

                            )}

                        </div>

                    </div>

                    {/* IMAGE COUNT */}

                    <div className="image-count">

                        📷 {productImages.length} Images

                    </div>

                </div>

                {/* ==================================
                    RIGHT - PRODUCT INFORMATION
                ================================== */}

                <div className="product-information">

                    {/* BRAND */}

                    <p className="product-brand">
                        {product.brand}
                    </p>

                    {/* PRODUCT NAME */}

                    <h1 className="product-title">
                        {product.name}
                    </h1>

                    {/* SHORT DESCRIPTION */}

                    {product.shortDescription && (

                        <p className="short-description">
                            {product.shortDescription}
                        </p>

                    )}

                    {/* RATING */}

                    <div className="rating-box">

                        <span className="rating-number">
                            ⭐ {product.rating || 0}
                        </span>

                        <span className="rating-divider">
                            |
                        </span>

                        <span>
                            {product.totalReviews || 0}
                            {" "}Ratings
                        </span>

                    </div>

                    <hr />

                    {/* PRICE */}

                    <div className="price-section">

                        <span className="current-price">

                            ₹
                            {currentPrice.toLocaleString(
                                "en-IN"
                            )}

                        </span>

                        {originalPrice > currentPrice && (

                            <span className="original-price">

                                MRP ₹
                                {originalPrice.toLocaleString(
                                    "en-IN"
                                )}

                            </span>

                        )}

                        {discountPercentage > 0 && (

                            <span className="discount">

                                ({discountPercentage}% OFF)

                            </span>

                        )}

                    </div>

                    <p className="tax-text">
                        inclusive of all taxes
                    </p>

                    {/* ==================================
                        COLORS
                    ================================== */}

                    {productColors.length > 0 && (

                        <div className="selection-section">

                            <h3>
                                Select Color
                            </h3>

                            <div className="color-options">

                                {productColors.map(
                                    (color, index) => {

                                        const colorName =
                                            typeof color === "string"
                                                ? color
                                                : color.name;

                                        const colorHex =
                                            typeof color === "string"
                                                ? color
                                                : color.hex;

                                        return (

                                            <button
                                                key={index}
                                                type="button"
                                                className={`color-option ${
                                                    selectedColor ===
                                                    colorName
                                                        ? "selected-color"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    setSelectedColor(
                                                        colorName
                                                    )
                                                }
                                            >

                                                <span
                                                    className="color-circle"
                                                    style={{
                                                        backgroundColor:
                                                            colorHex
                                                    }}
                                                />

                                                <span>
                                                    {colorName}
                                                </span>

                                            </button>

                                        );

                                    }
                                )}

                            </div>

                            {/* SELECTED COLOR */}

                            <p className="selected-option-text">

                                {selectedColor
                                    ? `Selected: ${selectedColor}`
                                    : "Please select a color"}

                            </p>

                        </div>

                    )}

                    {/* ==================================
                        SIZE
                    ================================== */}

                    {productVariants.length > 0 && (

                        <div className="selection-section">

                            <div className="size-heading">

                                <h3>
                                    Select Size
                                </h3>

                                <span>
                                    Size Chart
                                </span>

                            </div>

                            <div className="size-options">

                                {productVariants.map(
                                    (variant, index) => {

                                        const variantValue =
                                            variant.value ||
                                            variant.size ||
                                            "";

                                        return (

                                            <button
                                                key={index}
                                                type="button"
                                                className={`size-button ${
                                                    selectedSize ===
                                                    variantValue
                                                        ? "selected-size"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    setSelectedSize(
                                                        variantValue
                                                    )
                                                }
                                            >
                                                {variantValue}
                                            </button>

                                        );

                                    }
                                )}

                            </div>

                            {/* SELECTED SIZE */}

                            <p className="selected-option-text">

                                {selectedSize
                                    ? `Selected: ${selectedSize}`
                                    : "Please select a size"}

                            </p>

                        </div>

                    )}

                    {/* ==================================
                        STOCK
                    ================================== */}

                    <div className="stock-section">

                        <span className="stock-icon">
                            ✓
                        </span>

                        <strong>
                            {product.stockStatus ||
                                "In Stock"}
                        </strong>

                        {product.stock !== undefined && (
                            <span>
                                {" "}• {product.stock} available
                            </span>
                        )}

                    </div>

                    {/* ==================================
                        ACTION BUTTONS
                    ================================== */}

                    <div className="action-buttons">

                        <button
                            className="add-bag-button"
                            onClick={addToCart}
                        >
                            🛍️ ADD TO BAG
                        </button>

                        <button
                            className="wishlist-button"
                            onClick={addToWishlist}
                        >
                            ♡ WISHLIST
                        </button>

                    </div>

                    {/* BUY NOW */}

                    <button
                        className="buy-now-button"
                        onClick={buyNow}
                    >
                        ⚡ BUY NOW
                    </button>

                    {/* ==================================
                        OFFERS
                    ================================== */}

                    {product.offers &&
                        product.offers.length > 0 && (

                            <div className="offers-section">

                                <h3>
                                    🎁 Offers
                                </h3>

                                {product.offers.map(
                                    (offer, index) => (

                                        <div
                                            className="offer-item"
                                            key={index}
                                        >

                                            <span>
                                                ✓
                                            </span>

                                            <span>
                                                {typeof offer === "string"
                                                    ? offer
                                                    : offer.title ||
                                                    offer.description ||
                                                    "Special Offer"}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    {/* ==================================
                        DELIVERY
                    ================================== */}

                    {product.delivery && (

                        <div className="delivery-section">

                            <h3>
                                🚚 Delivery & Returns
                            </h3>

                            {product.delivery.freeDelivery && (

                                <p>
                                    ✓ Free Delivery
                                </p>

                            )}

                            {product.delivery.estimatedDelivery && (

                                <p>
                                    ✓ Delivery by{" "}
                                    <strong>
                                        {
                                            product.delivery
                                                .estimatedDelivery
                                        }
                                    </strong>
                                </p>

                            )}

                            {product.delivery.cashOnDelivery && (

                                <p>
                                    ✓ Cash on Delivery Available
                                </p>

                            )}

                            {product.delivery.returnAvailable && (

                                <p>
                                    ✓ Easy Return within{" "}
                                    <strong>
                                        {
                                            product.delivery
                                                .returnPeriod
                                        }
                                    </strong>
                                </p>

                            )}

                        </div>

                    )}

                    {/* ==================================
                        FEATURES
                    ================================== */}

                    {product.features &&
                        product.features.length > 0 && (

                            <div className="features-section">

                                <h3>
                                    Product Details
                                </h3>

                                <ul>

                                    {product.features.map(
                                        (feature, index) => (

                                            <li key={index}>
                                                {feature}
                                            </li>

                                        )
                                    )}

                                </ul>

                            </div>

                        )}

                    {/* ==================================
                        DESCRIPTION
                    ================================== */}

                    {product.description && (

                        <div className="description-section">

                            <h3>
                                Description
                            </h3>

                            <p>
                                {product.description}
                            </p>

                        </div>

                    )}

                    {/* ==================================
                        CATEGORY
                    ================================== */}

                    <div className="product-meta">

                        {product.category && (

                            <p>
                                <strong>
                                    Category:
                                </strong>{" "}
                                {product.category}
                            </p>

                        )}

                        {product.subCategory && (

                            <p>
                                <strong>
                                    Sub Category:
                                </strong>{" "}
                                {product.subCategory}
                            </p>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ProductDetails;