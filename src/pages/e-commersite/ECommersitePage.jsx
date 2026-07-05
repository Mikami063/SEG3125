import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./ECommersitePage.css";

const products = [
  {
    id: 1,
    name: "TrailLite Daypack",
    brand: "Northline",
    category: "Bags",
    price: 64,
    weekendSale: true,
    color: "Forest",
    size: "18L",
    material: "Recycled nylon",
    rating: 4.8,
    availability: "In stock",
    image: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&w=900&q=80",
    description: "A light everyday pack with padded straps, a laptop sleeve, and water resistant finish.",
    specs: ["18L capacity", "13 inch laptop pocket", "Two side bottle sleeves"],
  },
  {
    id: 2,
    name: "CloudStep Runner",
    brand: "AeroFit",
    category: "Shoes",
    price: 92,
    weekendSale: true,
    color: "White",
    size: "M",
    material: "Knit mesh",
    rating: 4.6,
    availability: "In stock",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    description: "Breathable running shoes designed for daily walks, campus days, and weekend errands.",
    specs: ["Cushioned sole", "Flexible knit upper", "Removable insole"],
  },
  {
    id: 3,
    name: "Mellow Hoodie",
    brand: "Everyday Co.",
    category: "Apparel",
    price: 58,
    weekendSale: true,
    color: "Blue",
    size: "L",
    material: "Organic cotton",
    rating: 4.9,
    availability: "In stock",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",
    description: "A soft midweight hoodie with a relaxed fit and durable ribbed cuffs.",
    specs: ["Organic cotton fleece", "Kangaroo pocket", "Machine washable"],
  },
  {
    id: 4,
    name: "PourOver Starter Kit",
    brand: "BrewNest",
    category: "Kitchen",
    price: 48,
    weekendSale: false,
    color: "Black",
    size: "One size",
    material: "Ceramic",
    rating: 4.5,
    availability: "Low stock",
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=900&q=80",
    description: "Everything needed for a clean morning pour over, including dripper, filters, and scoop.",
    specs: ["Ceramic dripper", "Reusable scoop", "Includes 40 filters"],
  },
  {
    id: 5,
    name: "DeskFocus Lamp",
    brand: "Lumina",
    category: "Home",
    price: 76,
    weekendSale: false,
    color: "Silver",
    size: "One size",
    material: "Aluminum",
    rating: 4.7,
    availability: "In stock",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    description: "An adjustable LED desk lamp with warm and cool modes for reading, study, and work.",
    specs: ["Three light temperatures", "Touch controls", "Adjustable arm"],
  },
  {
    id: 6,
    name: "Studio Water Bottle",
    brand: "HydraHaus",
    category: "Accessories",
    price: 34,
    weekendSale: true,
    color: "Green",
    size: "750ml",
    material: "Stainless steel",
    rating: 4.4,
    availability: "In stock",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80",
    description: "A double wall bottle that keeps drinks cold through class, work, and gym sessions.",
    specs: ["750ml capacity", "Leak resistant cap", "BPA free"],
  },
  {
    id: 7,
    name: "Transit Tech Pouch",
    brand: "Northline",
    category: "Bags",
    price: 29,
    weekendSale: false,
    color: "Black",
    size: "Small",
    material: "Recycled polyester",
    rating: 4.3,
    availability: "Out of stock",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=900&q=80",
    description: "A compact organizer for chargers, cables, earbuds, and small travel essentials.",
    specs: ["Cable loops", "Mesh pocket", "Water resistant shell"],
  },
  {
    id: 8,
    name: "Campus Beanie",
    brand: "Everyday Co.",
    category: "Apparel",
    price: 24,
    weekendSale: false,
    color: "Red",
    size: "One size",
    material: "Merino blend",
    rating: 4.2,
    availability: "In stock",
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=900&q=80",
    description: "A warm rib knit beanie for cold walks, transit stops, and weekend trips.",
    specs: ["Merino blend", "Stretch fit", "Fold over cuff"],
  },
];

const checkoutSteps = ["Cart", "Personal Information", "Payment Information", "Confirmation"];
const filtersConfig = ["category", "brand", "color", "size", "material", "availability"];
const initialFilters = {
  category: [],
  brand: [],
  color: [],
  size: [],
  material: [],
  availability: [],
  weekendSale: [],
  price: 120,
  rating: 0,
};

function money(value) {
  return `$${value.toFixed(2)}`;
}

function regularPrice(value) {
  return Math.round(value * 1.25);
}

function saleLabel(product) {
  return product.weekendSale ? "Weekend Sale" : "Regular Price";
}

function ECommersitePage() {
  const [view, setView] = useState("home");
  const [selectedProductId, setSelectedProductId] = useState(products[0].id);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("fieldkit-cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [filters, setFilters] = useState(initialFilters);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [personal, setPersonal] = useState({ name: "", email: "", address: "", city: "" });
  const [payment, setPayment] = useState({ cardName: "", cardNumber: "", expiry: "" });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState("");
  const [surveySubmitted, setSurveySubmitted] = useState(false);
  const [survey, setSurvey] = useState({ satisfaction: 5, recommend: "Yes", comments: "" });

  useEffect(() => {
    localStorage.setItem("fieldkit-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timeout);
  }, [toast]);

  const cartDetails = useMemo(
    () =>
      cart.map((item) => ({
        ...item,
        product: products.find((product) => product.id === item.id),
      })),
    [cart]
  );

  const totals = useMemo(() => {
    const subtotal = cartDetails.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shipping = subtotal > 75 || subtotal === 0 ? 0 : 8;
    const tax = subtotal * 0.13;
    return { subtotal, shipping, tax, total: subtotal + shipping + tax };
  }, [cartDetails]);

  const filterOptions = useMemo(() => {
    const options = {};
    filtersConfig.forEach((key) => {
      options[key] = [...new Set(products.map((product) => product[key]))];
    });
    options.weekendSale = ["Weekend Sale", "Regular Price"];
    return options;
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesText =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);
      const matchesFacets = filtersConfig.every(
        (key) => filters[key].length === 0 || filters[key].includes(product[key])
      );
      const matchesSale =
        filters.weekendSale.length === 0 || filters.weekendSale.includes(saleLabel(product));
      return (
        matchesText &&
        matchesFacets &&
        matchesSale &&
        product.price <= filters.price &&
        product.rating >= filters.rating
      );
    });

    return [...filtered].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return b.rating - a.rating || a.price - b.price;
    });
  }, [filters, search, sort]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const selectedProduct = products.find((product) => product.id === selectedProductId);

  function navigate(nextView) {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function addToCart(product) {
    if (product.availability === "Out of stock") {
      setToast("This item is currently out of stock.");
      return;
    }
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id);
      if (existing) {
        return items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...items, { id: product.id, quantity: 1 }];
    });
    setToast(`${product.name} added to cart.`);
  }

  function updateQuantity(id, quantity) {
    if (quantity <= 0) {
      setCart((items) => items.filter((item) => item.id !== id));
      return;
    }
    setCart((items) => items.map((item) => (item.id === id ? { ...item, quantity } : item)));
  }

  function toggleFilter(key, value) {
    setFilters((current) => {
      const isActive = current[key].includes(value);
      return {
        ...current,
        [key]: isActive
          ? current[key].filter((item) => item !== value)
          : [...current[key], value],
      };
    });
  }

  function clearFilters() {
    setFilters(initialFilters);
    setSearch("");
    setSort("featured");
  }

  function shopWeekendSale() {
    setFilters({ ...initialFilters, weekendSale: ["Weekend Sale"] });
    setSearch("");
    setSort("featured");
    navigate("listing");
  }

  function validatePersonal() {
    const nextErrors = {};
    if (!personal.name.trim()) nextErrors.name = "Please enter your full name.";
    if (!personal.email.includes("@")) nextErrors.email = "Please enter a valid email address.";
    if (!personal.address.trim()) nextErrors.address = "Please enter your delivery address.";
    if (!personal.city.trim()) nextErrors.city = "Please enter your city.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function validatePayment() {
    const digits = payment.cardNumber.replace(/\D/g, "");
    const nextErrors = {};
    if (!payment.cardName.trim()) nextErrors.cardName = "Name on card is required.";
    if (digits.length < 12) nextErrors.cardNumber = "Use at least 12 digits for the demo card.";
    if (!payment.expiry.trim()) nextErrors.expiry = "Expiry date is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function nextCheckoutStep() {
    if (checkoutStep === 0 && cart.length === 0) {
      setToast("Add at least one item before checkout.");
      return;
    }
    if (checkoutStep === 1 && !validatePersonal()) return;
    if (checkoutStep === 2 && !validatePayment()) return;
    if (checkoutStep === 3) {
      setCart([]);
      setCheckoutStep(0);
      navigate("confirmation");
      return;
    }
    setErrors({});
    setCheckoutStep((step) => Math.min(step + 1, checkoutSteps.length - 1));
  }

  function startCheckout() {
    setCheckoutStep(0);
    setErrors({});
    navigate("checkout");
  }

  function submitSurvey(event) {
    event.preventDefault();
    setSurveySubmitted(true);
    setToast("Thanks for your feedback.");
  }

  return (
    <div className="shop-shell">
      <header className="shop-nav">
        <button className="brand-button" onClick={() => navigate("home")} aria-label="Go to FieldKit home">
          <span className="brand-picture" aria-hidden="true">
            <Icon name="bag" />
            <span className="brand-ribbon">Field</span>
          </span>
          <span>
            <strong>FieldKit</strong>
            <small>Smart everyday gear</small>
          </span>
        </button>
        <nav aria-label="Main navigation">
          <button onClick={() => navigate("home")}><Icon name="home" />Home</button>
          <button onClick={() => navigate("listing")}><Icon name="bag" />Shop</button>
          <button onClick={() => navigate("survey")}><Icon name="message" />Survey</button>
        </nav>
        <button className="cart-button" onClick={() => navigate("cart")} aria-label={`Shopping cart with ${cartCount} items`}>
          <Icon name="cart" />
          <span aria-hidden="true">Cart</span>
          <strong>{cartCount}</strong>
        </button>
      </header>

      {toast && <div className="shop-toast" role="status">{toast}</div>}

      <main>
        {view === "home" && (
          <>
            <section className="shop-hero">
              <div className="hero-copy">
                <span className="promo-pill"><Icon name="tag" />Weekend Drop · 20% off today</span>
                <h1>Gear up for less.</h1>
                <p>
                  Backpacks, hoodies, bottles, and desk essentials picked for busy
                  school days, work sessions, and weekend plans.
                </p>
                <div className="flyer-highlights" aria-label="Current shopping offers">
                  <span><Icon name="tag" />20% off select picks</span>
                  <span><Icon name="truck" />Free shipping over $75</span>
                  <span><Icon name="rotate" />30 day returns</span>
                </div>
                <div className="hero-actions">
                  <span className="cta-pointer">Sale starts here</span>
                  <button className="primary-action hero-sale-button" onClick={shopWeekendSale}>
                    <Icon name="bag" /><span className="button-label">Shop the Sale</span>
                  </button>
                </div>
              </div>
              <div className="flyer-panel">
                <img src={products[0].image} alt="TrailLite Daypack product" />
                <div className="deal-badge" aria-label="Featured sale deal">
                  <strong>Save <span className="deal-percent">20%</span></strong>
                  <span>Today only</span>
                </div>
                <div className="flyer-caption">
                  <span className="caption-label">Best seller</span>
                  <strong>TrailLite Daypack</strong>
                  <PriceDisplay product={products[0]} />
                  <small>Now featured in the daily gear sale</small>
                </div>
              </div>
            </section>
            <section className="shop-section">
              <div className="section-heading">
                <span>Popular picks</span>
                <h2>Quick add essentials</h2>
              </div>
              <div className="product-grid">
                {products.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={addToCart}
                    onOpen={() => {
                      setSelectedProductId(product.id);
                      navigate("detail");
                    }}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {view === "listing" && (
          <section className="shop-section listing-layout">
            <aside className="filter-panel" aria-label="Product filters">
              <div className="filter-header">
                <h2><Icon name="filter" />Filters</h2>
                <button onClick={clearFilters}>Clear all</button>
              </div>
              <label className="field-label">
                <span className="label-with-icon"><Icon name="search" />Search</span>
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" />
              </label>
              <label className="field-label">
                Max price: ${filters.price}
                <input
                  type="range"
                  min="20"
                  max="120"
                  value={filters.price}
                  onChange={(event) => setFilters({ ...filters, price: Number(event.target.value) })}
                />
              </label>
              <label className="field-label">
                Minimum rating
                <select value={filters.rating} onChange={(event) => setFilters({ ...filters, rating: Number(event.target.value) })}>
                  <option value="0">Any rating</option>
                  <option value="4.3">4.3 stars and up</option>
                  <option value="4.6">4.6 stars and up</option>
                  <option value="4.8">4.8 stars and up</option>
                </select>
              </label>
              {["weekendSale", ...filtersConfig].map((key) => (
                <fieldset key={key}>
                  <legend>{key === "weekendSale" ? "Sale type" : key}</legend>
                  {filterOptions[key].map((option) => (
                    <label key={option} className="check-row">
                      <input
                        type="checkbox"
                        checked={filters[key].includes(option)}
                        onChange={() => toggleFilter(key, option)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </fieldset>
              ))}
            </aside>

            <div className="listing-results">
              <div className="results-toolbar">
                <div>
                  <span className="eyebrow">Shop all</span>
                  <h1>{filteredProducts.length} products found</h1>
                </div>
                <label>
                  Sort
                  <select value={sort} onChange={(event) => setSort(event.target.value)}>
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="price-high">Price: high to low</option>
                    <option value="rating">Top rated</option>
                  </select>
                </label>
              </div>
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={addToCart}
                    onOpen={() => {
                      setSelectedProductId(product.id);
                      navigate("detail");
                    }}
                  />
                ))}
              </div>
              {filteredProducts.length === 0 && (
                <div className="empty-state">
                  <h2>No products match those filters.</h2>
                  <p>Try clearing a filter or increasing the price range.</p>
                  <button className="primary-action" onClick={clearFilters}><Icon name="filter" />Clear filters</button>
                </div>
              )}
            </div>
          </section>
        )}

        {view === "detail" && selectedProduct && (
          <section className="shop-section detail-layout">
            <img src={selectedProduct.image} alt={selectedProduct.name} />
            <div className="detail-copy">
              <button className="text-button" onClick={() => navigate("listing")}><Icon name="arrowLeft" />Back to products</button>
              <span className="eyebrow">{selectedProduct.brand}</span>
              <h1>{selectedProduct.name}</h1>
              <PriceDisplay product={selectedProduct} large />
              <p>{selectedProduct.description}</p>
              <ul>
                {selectedProduct.specs.map((spec) => <li key={spec}>{spec}</li>)}
              </ul>
              <p><strong>Shipping info:</strong> Ships in 2-4 business days. Returns accepted within 30 days.</p>
              <button
                className="primary-action"
                onClick={() => addToCart(selectedProduct)}
                disabled={selectedProduct.availability === "Out of stock"}
              >
                {selectedProduct.availability === "Out of stock" ? "Out of stock" : <><Icon name="cart" />Add to cart</>}
              </button>
            </div>
          </section>
        )}

        {view === "cart" && (
          <CartView
            cartDetails={cartDetails}
            totals={totals}
            updateQuantity={updateQuantity}
            onShop={() => navigate("listing")}
            onCheckout={startCheckout}
          />
        )}

        {view === "checkout" && (
          <section className="shop-section checkout-layout">
            <CheckoutProgress current={checkoutStep} />
            <div className="checkout-panel">
              {checkoutStep === 0 && (
                <CartView
                  compact
                  cartDetails={cartDetails}
                  totals={totals}
                  updateQuantity={updateQuantity}
                  onShop={() => navigate("listing")}
                  onCheckout={nextCheckoutStep}
                />
              )}
              {checkoutStep === 1 && (
                <CheckoutForm title="Personal Information">
                  <FormField label="Full name" value={personal.name} error={errors.name} onChange={(value) => setPersonal({ ...personal, name: value })} />
                  <FormField label="Email" value={personal.email} error={errors.email} onChange={(value) => setPersonal({ ...personal, email: value })} />
                  <FormField label="Address" value={personal.address} error={errors.address} onChange={(value) => setPersonal({ ...personal, address: value })} />
                  <FormField label="City" value={personal.city} error={errors.city} onChange={(value) => setPersonal({ ...personal, city: value })} />
                </CheckoutForm>
              )}
              {checkoutStep === 2 && (
                <CheckoutForm title="Payment Information">
                  <p className="muted">Fake payment only. Use any demo card details.</p>
                  <FormField label="Name on card" value={payment.cardName} error={errors.cardName} onChange={(value) => setPayment({ ...payment, cardName: value })} />
                  <FormField label="Card number" value={payment.cardNumber} error={errors.cardNumber} onChange={(value) => setPayment({ ...payment, cardNumber: value })} />
                  <FormField label="Expiry" value={payment.expiry} error={errors.expiry} placeholder="MM/YY" onChange={(value) => setPayment({ ...payment, expiry: value })} />
                </CheckoutForm>
              )}
              {checkoutStep === 3 && (
                <div className="review-box">
                  <h2>Confirm your order</h2>
                  <p>Review your total and place the fake order when everything looks correct.</p>
                  <OrderSummary totals={totals} />
                </div>
              )}
              <div className="checkout-controls">
                <button className="secondary-action" onClick={() => (checkoutStep === 0 ? navigate("cart") : setCheckoutStep(checkoutStep - 1))}>
                  <Icon name="arrowLeft" />Back
                </button>
                <button className="text-button" onClick={() => navigate("cart")}>Cancel checkout</button>
                <button className="primary-action" onClick={nextCheckoutStep}>
                  {checkoutStep === 3 ? <><Icon name="check" />Place Order</> : <>Next<Icon name="arrowRight" /></>}
                </button>
              </div>
            </div>
          </section>
        )}

        {view === "confirmation" && (
          <section className="shop-section confirmation">
            <span className="success-icon"><Icon name="check" /></span>
            <h1>Order confirmed</h1>
            <p>Your FieldKit order has been placed. A confirmation message would be sent to {personal.email || "your email"}.</p>
            <button className="primary-action" onClick={() => navigate("survey")}><Icon name="message" />Tell us about your experience</button>
            <button className="secondary-action" onClick={() => navigate("listing")}><Icon name="bag" />Continue shopping</button>
          </section>
        )}

        {view === "survey" && (
          <section className="shop-section survey-layout">
            <div>
              <span className="eyebrow">We would love your feedback</span>
              <h1>How was your shopping experience?</h1>
              <p>
                This short survey helps FieldKit make the prototype clearer, faster, and easier to use.
              </p>
            </div>
            <form className="survey-form" onSubmit={submitSurvey}>
              <label className="field-label">
                Overall satisfaction
                <select value={survey.satisfaction} onChange={(event) => setSurvey({ ...survey, satisfaction: Number(event.target.value) })}>
                  <option value="5">★★★★★ Excellent</option>
                  <option value="4">★★★★ Good</option>
                  <option value="3">★★★ Okay</option>
                  <option value="2">★★ Needs work</option>
                  <option value="1">★ Poor</option>
                </select>
              </label>
              <fieldset>
                <legend>Recommend to friends?</legend>
                <label className="check-row">
                  <input type="radio" name="recommend" checked={survey.recommend === "Yes"} onChange={() => setSurvey({ ...survey, recommend: "Yes" })} />
                  <span>Yes</span>
                </label>
                <label className="check-row">
                  <input type="radio" name="recommend" checked={survey.recommend === "No"} onChange={() => setSurvey({ ...survey, recommend: "No" })} />
                  <span>No</span>
                </label>
              </fieldset>
              <label className="field-label">
                Comments
                <textarea value={survey.comments} onChange={(event) => setSurvey({ ...survey, comments: event.target.value })} placeholder="Tell us what worked well or what felt confusing." />
              </label>
              <button className="primary-action" type="submit"><Icon name="send" />Submit survey</button>
              {surveySubmitted && <p className="success-message">Thanks. Your feedback has been recorded for this prototype.</p>}
            </form>
          </section>
        )}
      </main>

      <footer className="shop-footer">
        <Link to="/">Portfolio home</Link>
        <span>FAQ: Free shipping over $75, 30 day returns, contact hello@fieldkit.demo</span>
      </footer>
    </div>
  );
}

function ProductCard({ product, onAdd, onOpen }) {
  return (
    <article className="product-card">
      <button className="image-button" onClick={onOpen} aria-label={`View ${product.name} details`}>
        <img src={product.image} alt={product.name} />
        <span className={product.weekendSale ? "product-badge sale" : "product-badge"}>
          {saleLabel(product)}
        </span>
      </button>
      <div className="product-card-copy">
        <span>{product.brand}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-meta">
          <PriceDisplay product={product} />
          <span className="rating-pill"><Icon name="star" />{product.rating}</span>
        </div>
        <div className="product-actions">
          <button className="secondary-action" onClick={onOpen}><Icon name="eye" />Details</button>
          <button className="primary-action" onClick={() => onAdd(product)} disabled={product.availability === "Out of stock"}>
            {product.availability === "Out of stock" ? "Out" : <><Icon name="cart" />Add</>}
          </button>
        </div>
      </div>
    </article>
  );
}

function PriceDisplay({ product, large = false }) {
  if (!product.weekendSale) {
    return (
      <div className={large ? "detail-price" : "sale-price-row"}>
        <span className={large ? "regular-price large" : "regular-price"}>{money(product.price)}</span>
      </div>
    );
  }

  return (
    <div className={large ? "detail-price" : "sale-price-row"}>
      <span className="was-price">{money(regularPrice(product.price))}</span>
      <span className="now-price">{money(product.price)}</span>
    </div>
  );
}

function CartView({ cartDetails, totals, updateQuantity, onShop, onCheckout, compact = false }) {
  return (
    <section className={compact ? "cart-view compact-cart" : "shop-section cart-view"}>
      <div className="section-heading">
        <span>Shopping cart</span>
        <h1>Your items</h1>
      </div>
      {cartDetails.length === 0 ? (
        <div className="empty-state">
          <h2>Your cart is empty.</h2>
          <p>Browse products and add something useful for your day.</p>
          <button className="primary-action" onClick={onShop}><Icon name="bag" />Shop products</button>
        </div>
      ) : (
        <div className="cart-grid">
          <div className="cart-items">
            {cartDetails.map(({ product, quantity }) => (
              <article className="cart-row" key={product.id}>
                <img src={product.image} alt={product.name} />
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.brand} · {product.color} · {product.size}</p>
                  <strong>{money(product.price)}</strong>
                </div>
                <div className="quantity-controls" aria-label={`Quantity for ${product.name}`}>
                  <button onClick={() => updateQuantity(product.id, quantity - 1)} aria-label={`Decrease ${product.name} quantity`}>
                    <Icon name="minus" />
                  </button>
                  <span>{quantity}</span>
                  <button onClick={() => updateQuantity(product.id, quantity + 1)} aria-label={`Increase ${product.name} quantity`}>
                    <Icon name="plus" />
                  </button>
                </div>
                <button className="text-button" onClick={() => updateQuantity(product.id, 0)}><Icon name="trash" />Remove</button>
              </article>
            ))}
          </div>
          <div className="summary-card">
            <h2>Order summary</h2>
            <OrderSummary totals={totals} />
            <button className="primary-action" onClick={onCheckout}><Icon name="creditCard" />Checkout</button>
          </div>
        </div>
      )}
    </section>
  );
}

function OrderSummary({ totals }) {
  return (
    <dl className="order-summary">
      <div><dt>Subtotal</dt><dd>{money(totals.subtotal)}</dd></div>
      <div><dt>Shipping</dt><dd>{totals.shipping === 0 ? "Free" : money(totals.shipping)}</dd></div>
      <div><dt>Estimated tax</dt><dd>{money(totals.tax)}</dd></div>
      <div className="summary-total"><dt>Total</dt><dd>{money(totals.total)}</dd></div>
    </dl>
  );
}

function CheckoutProgress({ current }) {
  return (
    <ol className="checkout-progress" aria-label="Checkout progress">
      {checkoutSteps.map((step, index) => (
        <li key={step} className={index < current ? "done" : index === current ? "current" : ""}>
          <span>{index + 1}</span>
          <strong>{step}</strong>
          <small>{index < current ? "Completed" : index === current ? "Current step" : "Remaining"}</small>
        </li>
      ))}
    </ol>
  );
}

function CheckoutForm({ title, children }) {
  return (
    <form className="checkout-form" noValidate>
      <h2>{title}</h2>
      {children}
    </form>
  );
}

function Icon({ name }) {
  const paths = {
    arrowLeft: <path d="M19 12H5m6 7-7-7 7-7" />,
    arrowRight: <path d="M5 12h14m-6-7 7 7-7 7" />,
    bag: <path d="M6 8h12l-1 12H7L6 8Zm3 0a3 3 0 0 1 6 0" />,
    cart: <><path d="M5 6h16l-2 8H8L5 3H2" /><path d="M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    creditCard: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h4" /></>,
    eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
    filter: <path d="M4 5h16l-6 7v5l-4 2v-7L4 5Z" />,
    home: <path d="m3 11 9-8 9 8v9h-6v-6H9v6H3v-9Z" />,
    message: <path d="M4 5h16v11H8l-4 4V5Z" />,
    minus: <path d="M5 12h14" />,
    plus: <path d="M12 5v14M5 12h14" />,
    rotate: <path d="M4 12a8 8 0 0 1 13-6l2 2M20 12a8 8 0 0 1-13 6l-2-2M17 5v4h4M7 19v-4H3" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m16 16 5 5" /></>,
    send: <path d="m22 2-7 20-4-9-9-4 20-7Z" />,
    star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.8-5.4 2.8 1-6-4.4-4.3 6.1-.9L12 3Z" />,
    tag: <path d="M20 12 12 20 4 12V4h8l8 8ZM8 8h.01" />,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13" /><path d="M10 11v5M14 11v5" /></>,
    truck: <><path d="M3 6h11v10H3V6Zm11 4h4l3 3v3h-7v-6Z" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>,
  };

  return (
    <svg className="shop-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {paths[name]}
    </svg>
  );
}

function FormField({ label, value, onChange, error, placeholder = "" }) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <label className="field-label" htmlFor={id}>
      {label}
      <input
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && <span className="field-error" id={`${id}-error`}>{error}</span>}
    </label>
  );
}

export default ECommersitePage;
