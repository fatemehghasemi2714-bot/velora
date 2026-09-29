/* =========================================
   VELORA — INTERACTIONS
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =========================================
     ELEMENTS
  ========================================= */

  const body = document.body;

  const header = document.querySelector(".header");

  const announcement = document.querySelector(".announcement");
  const announcementClose = document.querySelector(".announcement-close");

  const searchToggle = document.querySelector(".search-toggle");
  const searchOverlay = document.querySelector(".search-overlay");
  const searchClose = document.querySelector(".search-close");
  const searchInput = document.querySelector("#searchInput");
  const searchSuggestions = document.querySelectorAll(".search-suggestion");

  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileMenuClose = document.querySelector(".mobile-menu-close");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav a");

  const cartToggle = document.querySelector(".cart-toggle");
  const cartDrawer = document.querySelector(".cart-drawer");
  const cartClose = document.querySelector(".cart-close");
  const cartItems = document.querySelector(".cart-items");
  const cartCount = document.querySelector(".cart-count");
  const cartSubtotal = document.querySelector(".cart-subtotal");
  const checkoutButton = document.querySelector(".checkout-button");

  const overlay = document.querySelector(".overlay");

  const wishlistButtons = document.querySelectorAll(".wishlist-btn");
  const quickAddButtons = document.querySelectorAll(".quick-add");

  const newsletterForm = document.querySelector(".newsletter-form");

  const productCards = document.querySelectorAll(".product-card");


  /* =========================================
     STATE
  ========================================= */

  let cart = [];


  /* =========================================
     HEADER SCROLL
  ========================================= */

  const handleScroll = () => {
    if (!header) return;

    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();


  /* =========================================
     BODY LOCK
  ========================================= */

  const lockBody = () => {
    body.classList.add("no-scroll");
  };

  const unlockBody = () => {
    const searchOpen =
      searchOverlay && searchOverlay.classList.contains("active");

    const menuOpen =
      mobileMenu && mobileMenu.classList.contains("active");

    const cartOpen =
      cartDrawer && cartDrawer.classList.contains("active");

    if (!searchOpen && !menuOpen && !cartOpen) {
      body.classList.remove("no-scroll");
    }
  };


  /* =========================================
     ANNOUNCEMENT BAR
  ========================================= */

  if (announcementClose && announcement) {
    announcementClose.addEventListener("click", () => {
      announcement.style.display = "none";
    });
  }


  /* =========================================
     SEARCH
  ========================================= */

  const openSearch = () => {
    if (!searchOverlay) return;

    searchOverlay.classList.add("active");
    lockBody();

    setTimeout(() => {
      if (searchInput) {
        searchInput.focus();
      }
    }, 150);
  };

  const closeSearch = () => {
    if (!searchOverlay) return;

    searchOverlay.classList.remove("active");
    unlockBody();
  };

  if (searchToggle) {
    searchToggle.addEventListener("click", openSearch);
  }

  if (searchClose) {
    searchClose.addEventListener("click", closeSearch);
  }


  /* =========================================
     SEARCH SUGGESTIONS
  ========================================= */

  const filterProducts = (query) => {
    const searchTerm = query.trim().toLowerCase();

    productCards.forEach((card) => {
      const productName =
        card.querySelector(".product-info h3")?.textContent.toLowerCase() || "";

      const productCategory =
        card.querySelector(".product-category")?.textContent.toLowerCase() || "";

      const matches =
        !searchTerm ||
        productName.includes(searchTerm) ||
        productCategory.includes(searchTerm);

      card.style.display = matches ? "" : "none";
    });
  };

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      filterProducts(searchInput.value);
    });

    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        closeSearch();

        const shopSection = document.querySelector("#shop");

        if (shopSection) {
          shopSection.scrollIntoView({
            behavior: "smooth"
          });
        }
      }
    });
  }

  searchSuggestions.forEach((suggestion) => {
    suggestion.addEventListener("click", () => {
      const value =
        suggestion.dataset.search ||
        suggestion.textContent.trim();

      if (searchInput) {
        searchInput.value = value;
        filterProducts(value);
      }

      closeSearch();

      const shopSection = document.querySelector("#shop");

      if (shopSection) {
        shopSection.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });


  /* =========================================
     MOBILE MENU
  ========================================= */

  const openMobileMenu = () => {
    if (!mobileMenu) return;

    mobileMenu.classList.add("active");
    lockBody();
  };

  const closeMobileMenu = () => {
    if (!mobileMenu) return;

    mobileMenu.classList.remove("active");
    unlockBody();
  };

  if (menuToggle) {
    menuToggle.addEventListener("click", openMobileMenu);
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener("click", closeMobileMenu);
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });


  /* =========================================
     CART
  ========================================= */

  const openCart = () => {
    if (!cartDrawer) return;

    cartDrawer.classList.add("active");

    if (overlay) {
      overlay.classList.add("active");
    }

    lockBody();
  };

  const closeCart = () => {
    if (!cartDrawer) return;

    cartDrawer.classList.remove("active");

    if (overlay) {
      overlay.classList.remove("active");
    }

    unlockBody();
  };

  if (cartToggle) {
    cartToggle.addEventListener("click", openCart);
  }

  if (cartClose) {
    cartClose.addEventListener("click", closeCart);
  }

  if (overlay) {
    overlay.addEventListener("click", closeCart);
  }


  /* =========================================
     CART RENDER
  ========================================= */

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const updateCartCount = () => {
    if (!cartCount) return;

    const totalQuantity = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );

    cartCount.textContent = totalQuantity;
  };

  const updateCartSubtotal = () => {
    if (!cartSubtotal) return;

    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    cartSubtotal.textContent = formatPrice(subtotal);
  };

  const renderCart = () => {
    if (!cartItems) return;

    if (cart.length === 0) {
      cartItems.innerHTML = `
        <div class="empty-cart">
          <span class="empty-cart-icon">♡</span>
          <h3>Your cart is empty</h3>
          <p>Discover something beautiful for your everyday.</p>
        </div>
      `;

      updateCartCount();
      updateCartSubtotal();
      return;
    }

    cartItems.innerHTML = cart
      .map(
        (item, index) => `
          <div class="cart-item">
            <div class="cart-item-image">
              <span>${item.name.charAt(0)}</span>
            </div>

            <div class="cart-item-info">
              <h4>${item.name}</h4>
              <span>${formatPrice(item.price)}</span>

              <div class="cart-item-actions">
                <button
                  class="quantity-btn"
                  data-action="decrease"
                  data-index="${index}"
                >
                  −
                </button>

                <span>${item.quantity}</span>

                <button
                  class="quantity-btn"
                  data-action="increase"
                  data-index="${index}"
                >
                  +
                </button>

                <button
                  class="remove-item"
                  data-action="remove"
                  data-index="${index}"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        `
      )
      .join("");

    updateCartCount();
    updateCartSubtotal();

    const quantityButtons =
      cartItems.querySelectorAll(".quantity-btn, .remove-item");

    quantityButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.index);
        const action = button.dataset.action;

        if (!cart[index]) return;

        if (action === "increase") {
          cart[index].quantity += 1;
        }

        if (action === "decrease") {
          cart[index].quantity -= 1;

          if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
          }
        }

        if (action === "remove") {
          cart.splice(index, 1);
        }

        renderCart();
      });
    });
  };


  /* =========================================
     ADD TO CART
  ========================================= */

  const addToCart = (productCard) => {
    if (!productCard) return;

    const name =
      productCard.querySelector(".product-info h3")?.textContent.trim() ||
      "VELORA Product";

    const priceText =
      productCard.querySelector(".product-info > span")?.textContent || "$0";

    const price =
      parseFloat(priceText.replace(/[^0-9.]/g, "")) || 0;

    const existingItem = cart.find(
      (item) => item.name === name
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        name,
        price,
        quantity: 1
      });
    }

    renderCart();
    openCart();
  };

  quickAddButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const productCard =
        button.closest(".product-card");

      addToCart(productCard);

      const originalText = button.textContent;

      button.textContent = "Added ✓";
      button.classList.add("added");

      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("added");
      }, 1200);
    });
  });


  /* =========================================
     WISHLIST
  ========================================= */

  wishlistButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      button.classList.toggle("active");

      if (button.classList.contains("active")) {
        button.innerHTML = "♥";
        button.setAttribute("aria-label", "Remove from wishlist");
      } else {
        button.innerHTML = "♡";
        button.setAttribute("aria-label", "Add to wishlist");
      }
    });
  });


  /* =========================================
     NEWSLETTER
  ========================================= */

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const input = newsletterForm.querySelector("input");
      const button = newsletterForm.querySelector("button");

      if (!input || !button) return;

      const originalButtonText = button.textContent;

      button.textContent = "You're on the list ✓";
      button.disabled = true;

      input.value = "";

      setTimeout(() => {
        button.textContent = originalButtonText;
        button.disabled = false;
      }, 2500);
    });
  }


  /* =========================================
     CHECKOUT
  ========================================= */

  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
  if (veloraCart.length === 0) {
        return;
      }

      checkoutButton.textContent = "Checkout coming soon";

      setTimeout(() => {
        checkoutButton.textContent = "Proceed to Checkout";
      }, 2000);
    });
  }


  /* =========================================
     ESCAPE KEY
  ========================================= */

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    closeSearch();
    closeMobileMenu();
    closeCart();
  });


  /* =========================================
     ANCHOR LINKS
  ========================================= */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      closeMobileMenu();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });


  /* =========================================
     INITIAL CART
  ========================================= */

  renderCart();
});
/* =========================================
   VELORA — HERO MOUSE PARALLAX
========================================= */

const heroArt = document.querySelector(".hero-art");

if (heroArt && window.innerWidth > 700) {

  document.addEventListener("mousemove", (event) => {

    const x = (event.clientX / window.innerWidth - 0.5) * 2;
    const y = (event.clientY / window.innerHeight - 0.5) * 2;

    heroArt.style.transform = `
      translate(${x * 10}px, ${y * 10}px)
    `;

  });

}
/* =========================================
   VELORA — SCROLL REVEAL ENGINE
========================================= */

const revealElements = document.querySelectorAll(`
  .featured-card,
  .product-card,
  .section-heading,
  .section-header,
  .story-visual,
  .story-content,
  .category-card,
  .newsletter
`);

const revealObserver = new IntersectionObserver(
  (entries) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {

        entry.target.classList.add("is-visible");

        revealObserver.unobserve(entry.target);

      }

    });

  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -60px 0px"
  }
);


revealElements.forEach((element) => {
  revealObserver.observe(element);
});
/* =========================================
   VELORA — MOUSE 3D GALLERY
========================================= */

const gallery = document.querySelector(".featured-gallery");
const galleryCards = document.querySelectorAll(".featured-card");

if (gallery && galleryCards.length && window.innerWidth > 700) {

  gallery.addEventListener("mousemove", (event) => {

    const rect = gallery.getBoundingClientRect();

    const mouseX =
      (event.clientX - rect.left) / rect.width - 0.5;

    const mouseY =
      (event.clientY - rect.top) / rect.height - 0.5;


    galleryCards.forEach((card, index) => {

      const depth = (index + 1) * 2;

      card.style.setProperty(
        "--mouse-x",
        `${mouseX * depth}deg`
      );

      card.style.setProperty(
        "--mouse-y",
        `${mouseY * depth}deg`
      );

    });

  });


  gallery.addEventListener("mouseleave", () => {

    galleryCards.forEach((card) => {

      card.style.setProperty(
        "--mouse-x",
        "0deg"
      );

      card.style.setProperty(
        "--mouse-y",
        "0deg"
      );

    });

  });

}
/* =========================================
   VELORA — SECTION REVEAL ENGINE
========================================= */

const cinematicSections = document.querySelectorAll(`
  .collection-section,
  .shop-section,
  .story-section,
  .newsletter
`);

const sectionObserver = new IntersectionObserver(
  (entries) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {

        entry.target.classList.add(
          "is-section-visible"
        );

        sectionObserver.unobserve(
          entry.target
        );

      }

    });

  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -80px 0px"
  }
);


cinematicSections.forEach((section) => {

  sectionObserver.observe(section);

});
/* =========================================================
   VELORA — EDITORIAL HEADER
   ========================================================= */

const siteHeader = document.querySelector(".site-header");

if (siteHeader) {

  let lastScroll = 0;

  const updateHeader = () => {

    const currentScroll = window.scrollY;

    if (currentScroll > 60) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }

    lastScroll = currentScroll;
  };

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  updateHeader();
}
/* =========================================
   VELORA — FINAL MICRO INTERACTIONS
========================================= */


/* =========================================
   CUSTOM CURSOR
========================================= */

if (window.innerWidth >= 1000) {

  const cursor = document.createElement("div");
  const cursorRing = document.createElement("div");

  cursor.className = "velora-cursor";
  cursorRing.className = "velora-cursor-ring";

  document.body.appendChild(cursor);
  document.body.appendChild(cursorRing);


  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  let ringX = mouseX;
  let ringY = mouseY;


  window.addEventListener("mousemove", (event) => {

    mouseX = event.clientX;
    mouseY = event.clientY;

    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;

  });


  function animateCursor() {

    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;

    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;

    requestAnimationFrame(animateCursor);

  }

  animateCursor();


  const interactiveElements =
    document.querySelectorAll(
      "a, button, input, .featured-card, .product-card, .shop-card"
    );


  interactiveElements.forEach((element) => {

    element.addEventListener("mouseenter", () => {
      document.body.classList.add("cursor-hover");
    });

    element.addEventListener("mouseleave", () => {
      document.body.classList.remove("cursor-hover");
    });

  });

}


/* =========================================
   NEWSLETTER REVEAL
========================================= */

const newsletter =
  document.querySelector(".newsletter");

if (newsletter) {

  const newsletterObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            newsletter.classList.add(
              "is-section-visible"
            );

            newsletterObserver.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.2
      }
    );

  newsletterObserver.observe(newsletter);

}


/* =========================================
   MOUSE PARALLAX — STORY OBJECT
========================================= */

const storySection =
  document.querySelector(".story-section");

const storyObject =
  document.querySelector(".story-object");

if (
  storySection &&
  storyObject &&
  window.innerWidth > 900
) {

  storySection.addEventListener(
    "mousemove",
    (event) => {

      const rect =
        storySection.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) /
        rect.width -
        0.5;

      const y =
        (event.clientY - rect.top) /
        rect.height -
        0.5;

      storyObject.style.transform =
        `translateY(calc(-50% + ${y * 18}px))
         translateX(${x * 18}px)`;

    }
  );


  storySection.addEventListener(
    "mouseleave",
    () => {

      storyObject.style.transform =
        "translateY(-50%) translateX(0)";

    }
  );

}


/* =========================================
   MAGNETIC LINKS
========================================= */

const magneticElements =
  document.querySelectorAll(
    ".story-link, .newsletter-input-wrap button, .shop-card-info a"
  );

if (window.innerWidth > 900) {

  magneticElements.forEach((element) => {

    element.addEventListener(
      "mousemove",
      (event) => {

        const rect =
          element.getBoundingClientRect();

        const x =
          event.clientX -
          rect.left -
          rect.width / 2;

        const y =
          event.clientY -
          rect.top -
          rect.height / 2;

        element.style.transform =
          `translate(${x * 0.18}px, ${y * 0.18}px)`;

      }
    );


    element.addEventListener(
      "mouseleave",
      () => {

        element.style.transform =
          "translate(0,0)";

      }
    );

  });

}
/* =========================================
   VELORA — GALLERY BUTTON FIX
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const slider = document.querySelector(".featured-slider");
  const next = document.querySelector(".slider-next");
  const prev = document.querySelector(".slider-prev");

  if (!slider || !next || !prev) return;


  function getAmount() {

    const card =
      slider.querySelector(".featured-card");

    if (!card) return 400;

    return card.getBoundingClientRect().width + 28;

  }


  next.onclick = () => {

    slider.scrollBy({
      left: getAmount(),
      behavior: "smooth"
    });

  };


  prev.onclick = () => {

    slider.scrollBy({
      left: -getAmount(),
      behavior: "smooth"
    });

  };

});
/* =========================================
   VELORA — SEARCH
========================================= */

const searchTrigger =
  document.querySelector(".search-trigger");

const searchOverlay =
  document.querySelector(".search-overlay");

const searchClose =
  document.querySelector(".search-close");

const searchInput =
  document.querySelector(".search-input");

const searchSuggestions =
  document.querySelector(".search-suggestions");


/* PRODUCTS */

const searchProducts = [
  {
    name: "Aurelia Ring",
    category: "Sculptural gold",
    price: "€180"
  },
  {
    name: "Solis Pendant",
    category: "Champagne finish",
    price: "€220"
  },
  {
    name: "Noma Earrings",
    category: "Polished silver",
    price: "€145"
  },
  {
    name: "Elara Bracelet",
    category: "Burgundy enamel",
    price: "€195"
  }
];


/* OPEN */

if (searchTrigger && searchOverlay) {

  searchTrigger.addEventListener(
    "click",
    () => {

      searchOverlay.classList.add("active");

      document.body.classList.add(
        "search-open"
      );

      setTimeout(() => {

        if (searchInput) {
          searchInput.focus();
        }

      }, 200);

    }
  );

}


/* CLOSE */

function closeSearch() {

  if (!searchOverlay) return;

  searchOverlay.classList.remove(
    "active"
  );

  document.body.classList.remove(
    "search-open"
  );

}


if (searchClose) {

  searchClose.addEventListener(
    "click",
    closeSearch
  );

}


/* ESC */

document.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Escape") {
      closeSearch();
    }

  }
);


/* SEARCH */

if (
  searchInput &&
  searchSuggestions
) {

  searchInput.addEventListener(
    "input",
    () => {

      const query =
        searchInput.value
          .trim()
          .toLowerCase();


      if (!query) {

        searchSuggestions.innerHTML = "";

        return;

      }


      const results =
        searchProducts.filter(
          product =>
            product.name
              .toLowerCase()
              .includes(query) ||

            product.category
              .toLowerCase()
              .includes(query)
        );


      if (!results.length) {

        searchSuggestions.innerHTML = `
          <div class="search-empty">
            No objects found.
          </div>
        `;

        return;

      }


      searchSuggestions.innerHTML =
        results
          .map(
            product => `
              <a
                href="#new"
                class="search-result"
              >
                <span>
                  <small>
                    ${product.category}
                  </small>

                  <strong>
                    ${product.name}
                  </strong>
                </span>

                <b>
                  ${product.price}
                </b>
              </a>
            `
          )
          .join("");

    }
  );

}
/* =========================================
   VELORA — SEARCH GALLERY
========================================= */

const veloraSearchTrigger = document.querySelector(".search-trigger");
const veloraSearchOverlay = document.querySelector(".search-overlay");
const veloraSearchClose = document.querySelector(".search-close");
const veloraSearchInput = document.querySelector(".search-input");
const veloraSearchSuggestions = document.querySelector(".search-suggestions");

const veloraProducts = [
  {
    name: "Aurelia Ring",
    category: "SCULPTURAL GOLD",
    price: "€180",
    art: "aurelia"
  },
  {
    name: "Solis Pendant",
    category: "CHAMPAGNE FINISH",
    price: "€220",
    art: "solis"
  },
  {
    name: "Noma Earrings",
    category: "POLISHED SILVER",
    price: "€145",
    art: "noma"
  },
  {
    name: "Elara Bracelet",
    category: "BURGUNDY ENAMEL",
    price: "€195",
    art: "elara"
  }
];


/* OPEN SEARCH */

if (veloraSearchTrigger && veloraSearchOverlay) {

  veloraSearchTrigger.onclick = () => {

    veloraSearchOverlay.classList.add("active");
    document.body.classList.add("search-open");

    setTimeout(() => {
      if (veloraSearchInput) {
        veloraSearchInput.focus();
      }
    }, 200);

  };

}


/* CLOSE SEARCH */

if (veloraSearchClose) {

  veloraSearchClose.onclick = () => {

    veloraSearchOverlay.classList.remove("active");
    document.body.classList.remove("search-open");

  };

}


/* ESC */

document.addEventListener("keydown", (event) => {

  if (event.key === "Escape" && veloraSearchOverlay) {

    veloraSearchOverlay.classList.remove("active");
    document.body.classList.remove("search-open");

  }

});
if (veloraSearchInput && veloraSearchSuggestions) {

  veloraSearchInput.addEventListener("input", () => {

    const query = veloraSearchInput.value
      .trim()
      .toLowerCase();

    veloraSearchSuggestions.innerHTML = "";

    if (!query) return;

    const results = veloraProducts.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );

    if (!results.length) {

      veloraSearchSuggestions.innerHTML = `
        <div class="search-empty">
          No objects found.
        </div>
      `;

      return;
    }

    results.forEach((product, index) => {

      const card = document.createElement("a");

      card.href = `#product-${product.art}`;
      card.className = "search-result-card";

      card.innerHTML = `
        <div class="search-result-image search-art-${product.art}">

          <span class="search-result-index">
            0${index + 1}
          </span>

          <div class="search-result-object"></div>

        </div>

        <div class="search-result-info">

          <div>
            <small>${product.category}</small>
            <strong>${product.name}</strong>
          </div>

          <span>${product.price}</span>

        </div>
      `;

      veloraSearchSuggestions.appendChild(card);

    });

  });

}
/* =========================================
   VELORA — SEARCH RESULT NAVIGATION
========================================= */

document.addEventListener("click", function (event) {

  const result =
    event.target.closest(".search-result-card");

  if (!result) return;

  const targetId =
    result.getAttribute("href");

  if (!targetId || !targetId.startsWith("#")) {
    return;
  }

  event.preventDefault();

  const target =
    document.querySelector(targetId);

  if (!target) {
    console.log("Product not found:", targetId);
    return;
  }

  /* close search */

  const searchOverlay =
    document.querySelector(".search-overlay");

  if (searchOverlay) {
    searchOverlay.classList.remove("active");
  }

  document.body.classList.remove("search-open");

  /* scroll to product */

  setTimeout(() => {

    target.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  }, 250);

});

/* =========================================
   VELORA — CART SYSTEM
========================================= */

const veloraCart = [];

const cartDrawer =
  document.querySelector(".cart-drawer");

const cartOverlay =
  document.querySelector(".overlay");

const cartClose =
  document.querySelector(".cart-close");

const cartItems =
  document.querySelector(".cart-items");

const cartTotal =
  document.querySelector(".cart-total strong");

const cartCount =
  document.querySelector(".cart-count");

const cartTotalCount =
  document.querySelector(".cart-total-count");

const cartTrigger =
  document.querySelector(".cart-trigger");


/* PRODUCTS */

const veloraCartProducts = {

  "Aurelia Ring": {
    name: "Aurelia Ring",
    price: 180,
    category: "Sculptural gold"
  },

  "Solis Pendant": {
    name: "Solis Pendant",
    price: 220,
    category: "Champagne finish"
  },

  "Noma Earrings": {
    name: "Noma Earrings",
    price: 145,
    category: "Polished silver"
  },

  "Elara Bracelet": {
    name: "Elara Bracelet",
    price: 195,
    category: "Burgundy enamel"
  }

};


/* OPEN */

function openCart() {

  if (!cartDrawer) return;

  cartDrawer.classList.add("active");

  if (cartOverlay) {
    cartOverlay.classList.add("active");
  }

}


/* CLOSE */

function closeCart() {

  if (cartDrawer) {
    cartDrawer.classList.remove("active");
  }

  if (cartOverlay) {
    cartOverlay.classList.remove("active");
  }

}


if (cartTrigger) {

  cartTrigger.addEventListener(
    "click",
    openCart
  );

}


if (cartClose) {

  cartClose.addEventListener(
    "click",
    closeCart
  );

}


if (cartOverlay) {

  cartOverlay.addEventListener(
    "click",
    closeCart
  );

}


/* ADD TO CART */

document.querySelectorAll(
  ".quick-add"
).forEach(button => {

  button.addEventListener(
    "click",
    () => {

      const card =
        button.closest(".product-card");

      if (!card) return;


      const name =
        card.querySelector(
          ".product-info h3"
        )?.textContent.trim();


      const product =
        veloraCartProducts[name];

      if (!product) return;


      const existing =
        veloraCart.find(
          item =>
            item.name === product.name
        );


      if (existing) {

        existing.quantity++;

      } else {

        veloraCart.push({
          ...product,
          quantity: 1
        });

      }


      renderCart();

      openCart();

    }
  );

});


/* RENDER */

function renderCart() {

  if (!cartItems) return;


  if (!veloraCart.length) {

    cartItems.innerHTML = `
      <div class="empty-cart">
        Your bag is empty.
      </div>
    `;

  } else {

    cartItems.innerHTML =
      veloraCart
        .map(
          (item, index) => `

            <div class="cart-item">

              <div class="cart-item-art">
                <span>V</span>
              </div>

              <div class="cart-item-info">

                <strong>
                  ${item.name}
                </strong>

                <small>
                  ${item.category}
                </small>

                <div class="cart-item-bottom">

                  <span>
                    €${item.price}
                  </span>

                  <div class="cart-quantity">

                    <button
                      data-cart-minus="${index}"
                    >
                      −
                    </button>

                    <span>
                      ${item.quantity}
                    </span>

                    <button
                      data-cart-plus="${index}"
                    >
                      +
                    </button>

                  </div>

                </div>

              </div>

            </div>

          `
        )
        .join("");

  }


  const total =
    veloraCart.reduce(
      (sum, item) =>
        sum +
        item.price *
        item.quantity,
      0
    );


  const count =
    veloraCart.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );


  if (cartTotal) {
    cartTotal.textContent =
      `€${total}`;
  }


  if (cartCount) {
    cartCount.textContent =
      count;
  }


  if (cartTotalCount) {
    cartTotalCount.textContent =
      `${count} ITEM${count === 1 ? "" : "S"}`;
  }


  bindCartQuantityButtons();

}


/* QUANTITY */

function bindCartQuantityButtons() {

  document.querySelectorAll(
    "[data-cart-minus]"
  ).forEach(button => {

    button.onclick = () => {

      const index =
        Number(
          button.dataset.cartMinus
        );

      if (
        veloraCart[index]
      ) {

        veloraCart[index].quantity--;

        if (
          veloraCart[index].quantity <= 0
        ) {

          veloraCart.splice(
            index,
            1
          );

        }

        renderCart();

      }

    };

  });


  document.querySelectorAll(
    "[data-cart-plus]"
  ).forEach(button => {

    button.onclick = () => {

      const index =
        Number(
          button.dataset.cartPlus
        );

      if (
        veloraCart[index]
      ) {

        veloraCart[index].quantity++;

        renderCart();

      }

    };

  });

}


/* ESC */

document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {
      closeCart();
    }

  }
);


/* INITIAL */

renderCart();

/* =========================================
   VELORA — FAVORITES SYSTEM
========================================= */

document.addEventListener("click", function (event) {

  const wishlist = event.target.closest(".wishlist");

  if (!wishlist) return;

  event.preventDefault();
  event.stopImmediatePropagation();

  wishlist.classList.toggle("is-favorite");

  if (wishlist.classList.contains("is-favorite")) {
    wishlist.innerHTML = "♥";
    wishlist.setAttribute(
      "aria-label",
      "Remove from favorites"
    );
  } else {
    wishlist.innerHTML = "♡";
    wishlist.setAttribute(
      "aria-label",
      "Add to favorites"
    );
  }

});
/* =========================================
   VELORA — FINAL PURCHASE FLOW
========================================= */

document.addEventListener("click", function (event) {

  /* -----------------------------
     CHECKOUT
  ----------------------------- */

  const checkoutButton =
    event.target.closest(".checkout-button");

  if (checkoutButton) {

    event.preventDefault();

    if (!veloraCart || !veloraCart.length) {

      alert("Your bag is empty.");

      return;
    }

    /*
      فعلاً تا قبل از اتصال Backend
      اطلاعات سفارش را موقتاً نگه می‌داریم.
    */

    const order = {
      items: veloraCart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category
      })),

      total: veloraCart.reduce(
        (sum, item) =>
          sum + item.price * item.quantity,
        0
      ),

      createdAt:
        new Date().toISOString()
    };

    sessionStorage.setItem(
      "veloraPendingOrder",
      JSON.stringify(order)
    );

    /*
      فعلاً صفحه Checkout نداریم.
      بعداً همین مسیر به Backend / Payment وصل می‌شود.
    */

    alert(
      "Checkout is ready. Payment will be connected in the next step."
    );

  }


  /* -----------------------------
     NEWSLETTER
  ----------------------------- */

  const newsletterForm =
    event.target.closest(".newsletter-form");

  if (
    newsletterForm &&
    event.target.type === "submit"
  ) {

    event.preventDefault();

    const input =
      newsletterForm.querySelector(
        'input[type="email"]'
      );

    if (!input) return;

    const email =
      input.value.trim();

    if (!email) return;

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

      alert("Please enter a valid email address.");

      return;
    }

    localStorage.setItem(
      "veloraNewsletterEmail",
      email
    );

    input.value = "";

    const button =
      newsletterForm.querySelector("button");

    if (button) {

      const original =
        button.innerHTML;

      button.innerHTML =
        "<span>Subscribed ✓</span><i>✓</i>";

      button.disabled = true;

      setTimeout(() => {

        button.innerHTML = original;
        button.disabled = false;

      }, 3000);

    }

  }

});
/* =========================================
   VELORA — REAL CHECKOUT FRONTEND
========================================= */

const veloraCheckout = document.querySelector(".velora-checkout");
const checkoutClose = document.querySelector(".checkout-close");
const checkoutButton = document.querySelector(".checkout-button");
const checkoutForm = document.querySelector(".velora-checkout-form");
const checkoutItems = document.querySelector(".checkout-summary-items");
const checkoutSubtotal = document.querySelector(".checkout-subtotal");
const checkoutTotal = document.querySelector(".checkout-total");
const checkoutCount = document.querySelector(".checkout-summary-count");


function openVeloraCheckout() {

  if (!veloraCheckout) return;

  if (!veloraCart.length) {

    alert("Your bag is empty.");

    return;
  }

  renderVeloraCheckout();

  veloraCheckout.classList.add("active");

  document.body.style.overflow = "hidden";
}


function closeVeloraCheckout() {

  if (!veloraCheckout) return;

  veloraCheckout.classList.remove("active");

  document.body.style.overflow = "";
}


function renderVeloraCheckout() {

  if (!checkoutItems) return;

  checkoutItems.innerHTML = "";

  let total = 0;
  let count = 0;


  veloraCart.forEach(item => {

    const product = veloraCartProducts[item.name];

    if (!product) return;

    const quantity = item.quantity || 1;

    const itemTotal =
      product.price * quantity;

    total += itemTotal;

    count += quantity;


    let image = "";

    if (item.name === "Aurelia Ring") {
      image = "images/aurelia-ring.jpg";
    }

    if (item.name === "Elara Bracelet") {
      image = "images/elara-bracelet.jpg";
    }

    if (item.name === "Solis Pendant") {
      image = "images/collection-01.jpg";
    }

    if (item.name === "Noma Earrings") {
      image = "images/collection-02.jpg";
    }


    checkoutItems.insertAdjacentHTML(
      "beforeend",
      `
        <div class="checkout-summary-item">

          <div
            class="checkout-summary-image"
            style="background-image:url('${image}')"
          ></div>

          <div class="checkout-summary-info">

            <strong>
              ${product.name}
            </strong>

            <span>
              ${quantity} × €${product.price}
            </span>

          </div>

          <span class="checkout-summary-price">
            €${itemTotal}
          </span>

        </div>
      `
    );

  });


  if (checkoutSubtotal) {
    checkoutSubtotal.textContent =
      `€${total}`;
  }

  if (checkoutTotal) {
    checkoutTotal.textContent =
      `€${total}`;
  }

  if (checkoutCount) {
    checkoutCount.textContent =
      `${count} ${count === 1 ? "ITEM" : "ITEMS"}`;
  }

}


/* OPEN CHECKOUT */

if (checkoutButton) {

  checkoutButton.addEventListener(
    "click",
    openVeloraCheckout
  );

}


/* CLOSE */

if (checkoutClose) {

  checkoutClose.addEventListener(
    "click",
    closeVeloraCheckout
  );

}


/* ESC */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape" &&
      veloraCheckout &&
      veloraCheckout.classList.contains("active")
    ) {

      closeVeloraCheckout();

    }

  }
);


/* FORM */

if (checkoutForm) {

  checkoutForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      if (!veloraCart.length) {

        alert("Your bag is empty.");

        return;
      }


      const formData =
        new FormData(checkoutForm);


      const customer = {

        firstName:
          formData.get("firstName"),

        lastName:
          formData.get("lastName"),

        email:
          formData.get("email"),

        phone:
          formData.get("phone"),

        address:
          formData.get("address"),

        city:
          formData.get("city"),

        postalCode:
          formData.get("postalCode"),

        country:
          formData.get("country")

      };


      sessionStorage.setItem(
        "veloraCheckoutCustomer",
        JSON.stringify(customer)
      );


      alert(
        "Your details are ready. Payment will be connected in the next step."
      );

    }
  );

}