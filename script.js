
"use strict";

// ==========================================
// PENGATURAN WHATSAPP SMEKSA STORE
// ==========================================
const STORE_WHATSAPP = "6285648262713";

// ==========================================
// DAFTAR PRODUK SMEKSA STORE
// ==========================================
const products = [
  {
    id: 1,
    name: "Pakan Konsentrat Sapi",
    category: "Agribisnis Ternak Ruminansia",
    price: 25000,
    description: "Pakan tambahan untuk ternak ruminansia.",
    image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    name: "Mineral Blok Ternak",
    category: "Agribisnis Ternak Ruminansia",
    price: 15000,
    description: "Produk mineral untuk kebutuhan ternak.",
    image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    name: "Paket P3K Hewan",
    category: "Kesehatan Hewan",
    price: 35000,
    description: "Contoh paket perlengkapan dasar hewan.",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    name: "Sampo Perawatan Hewan",
    category: "Kesehatan Hewan",
    price: 20000,
    description: "Produk untuk menjaga kebersihan hewan.",
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5,
    name: "Keripik Singkong UMKM",
    category: "Agribisnis Pengolahan Hasil Pertanian",
    price: 12000,
    description: "Camilan lokal yang cocok untuk teman santai.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6,
    name: "Paket Sambal Kemasan",
    category: "Agribisnis Pengolahan Hasil Pertanian",
    price: 18000,
    description: "Contoh produk olahan pangan dalam kemasan.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 7,
    name: "Jasa Desain Logo UMKM",
    category: "Desain Komunikasi Visual",
    price: 50000,
    description: "Jasa pembuatan logo untuk usaha kecil.",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 8,
    name: "Jasa Desain Poster",
    category: "Desain Komunikasi Visual",
    price: 30000,
    description: "Desain poster untuk promosi atau acara.",
    image: "https://images.unsplash.com/photo-1541701494587-cb585028ab?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 9,
    name: "Paket Ganti Oli Motor",
    category: "Teknik Sepeda Motor",
    price: 65000,
    description: "Contoh paket kebutuhan perawatan motor.",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 10,
    name: "Jasa Servis Ringan Motor",
    category: "Teknik Sepeda Motor",
    price: 40000,
    description: "Contoh layanan pemeriksaan motor dasar.",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 11,
    name: "Jasa Pembukuan UMKM",
    category: "Akuntansi dan Keuangan Lembaga",
    price: 50000,
    description: "Bantuan pencatatan transaksi usaha.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 12,
    name: "Paket Laporan Keuangan",
    category: "Akuntansi dan Keuangan Lembaga",
    price: 75000,
    description: "Penyusunan laporan keuangan sederhana.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=700&q=80"
  }
];

// ==========================================
// MENGHUBUNGKAN HTML DENGAN JAVASCRIPT
// ==========================================
const $ = (selector) => document.querySelector(selector);

const productContainer = $("#products");
const searchInput = $("#search");
const categorySelect = $("#category");
const emptyState = $("#empty-state");
const productCount = $("#product-count");

const cartModal = $("#cart-modal");
const checkoutModal = $("#checkout-modal");
const cartItems = $("#cart-items");
const cartTotal = $("#cart-total");
const toast = $("#toast");

let toastTimer;
let cart = loadCart();

// ==========================================
// MENYIMPAN KERANJANG DI BROWSER
// ==========================================
function loadCart() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("smeksa-cart") || "[]"
    );

    if (!Array.isArray(saved)) return [];

    return saved
      .filter(item =>
        Number.isInteger(item.id) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        products.some(p => p.id === item.id)
      )
      .map(item => ({
        id: item.id,
        quantity: Math.min(item.quantity, 99)
      }));

  } catch {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(
      "smeksa-cart",
      JSON.stringify(cart)
    );
  } catch {
    showToast("Keranjang tidak dapat disimpan di browser ini.");
  }
}

// ==========================================
// FORMAT HARGA RUPIAH
// ==========================================
function rupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);
}

function getProduct(id) {
  return products.find(product => product.id === id);
}

function totalItems() {
  return cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
}

function totalPrice() {
  return cart.reduce(
    (sum, item) =>
      sum + (getProduct(item.id)?.price || 0) * item.quantity,
    0
  );
}

// ==========================================
// NOTIFIKASI WEBSITE
// ==========================================
function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

// ==========================================
// JUMLAH PRODUK DI IKON KERANJANG
// ==========================================
function updateBadge() {
  const badge = $("#cart-count");

  if (badge) {
    badge.textContent = totalItems();
  }
}

// ==========================================
// TAMBAH PRODUK KE KERANJANG
// ==========================================
function addToCart(id) {
  const product = getProduct(id);

  if (!product) return;

  const found = cart.find(item => item.id === id);

  if (found) {
    if (found.quantity >= 99) {
      return showToast("Maksimal 99 barang per produk.");
    }

    found.quantity++;
  } else {
    cart.push({
      id,
      quantity: 1
    });
  }

  saveCart();
  updateBadge();
  renderCart();

  showToast("Produk ditambahkan ke keranjang.");
}

// ==========================================
// TAMBAH ATAU KURANGI JUMLAH PRODUK
// ==========================================
function changeQuantity(id, change) {
  const item = cart.find(entry => entry.id === id);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(entry => entry.id !== id);
  }

  if (item.quantity > 99) {
    item.quantity = 99;
  }

  saveCart();
  updateBadge();
  renderCart();
}

// ==========================================
// HAPUS PRODUK DARI KERANJANG
// ==========================================
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);

  saveCart();
  updateBadge();
  renderCart();

  showToast("Produk dihapus dari keranjang.");
}

// ==========================================
// GAMBAR PRODUK
// ==========================================
function makeImage(src, alt, className) {
  const img = document.createElement("img");

  img.src = src;
  img.alt = alt;
  img.className = className;
  img.loading = "lazy";

  img.onerror = () => {
    img.onerror = null;
    img.src =
      "https://placehold.co/700x450/e4f0ff/193451?text=SMEKSA+STORE";
  };

  return img;
}

// ==========================================
// MENAMPILKAN PRODUK
// ==========================================
function renderProducts() {
  if (!productContainer) return;

  const keyword = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;

  const filtered = products.filter(product => {
    const matchKeyword =
      `${product.name} ${product.category} ${product.description}`
        .toLowerCase()
        .includes(keyword);

    const matchCategory =
      category === "Semua" ||
      product.category === category;

    return matchKeyword && matchCategory;
  });

  productContainer.replaceChildren();

  filtered.forEach(product => {
    const card = document.createElement("article");
    card.className = "product";

    const info = document.createElement("div");
    info.className = "product-info";

    const categoryText = document.createElement("p");
    categoryText.className = "product-category";
    categoryText.textContent = product.category;

    const name = document.createElement("h3");
    name.className = "product-name";
    name.textContent = product.name;

    const desc = document.createElement("p");
    desc.className = "product-description";
    desc.textContent = product.description;

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = rupiah(product.price);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "add-button";
    button.textContent = "Tambah ke Keranjang";

    button.addEventListener("click", () => {
      addToCart(product.id);
    });

    info.append(
      categoryText,
      name,
      desc,
      price,
      button
    );

    card.append(
      makeImage(product.image, product.name, "product-image"),
      info
    );

    productContainer.append(card);
  });

  if (productCount) {
    productCount.textContent = `${filtered.length} produk`;
  }

  if (emptyState) {
    emptyState.hidden = filtered.length !== 0;
  }
}

// ==========================================
// MENAMPILKAN ISI KERANJANG
// ==========================================
function renderCart() {
  if (!cartItems) return;

  cartItems.replaceChildren();

  if (cart.length === 0) {
    const empty = document.createElement("p");

    empty.className = "empty-state";
    empty.textContent =
      "Keranjang masih kosong. Yuk, pilih produk!";

    cartItems.append(empty);
  }

  cart.forEach(item => {
    const product = getProduct(item.id);

    if (!product) return;

    const row = document.createElement("div");
    row.className = "cart-item";

    const details = document.createElement("div");
    details.className = "cart-details";

    const name = document.createElement("h3");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.className = "item-price";

    price.textContent =
      `${item.quantity} × ${rupiah(product.price)} = ${rupiah(product.price * item.quantity)}`;

    const controls = document.createElement("div");
    controls.className = "quantity-row";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.className = "quantity-button";
    minus.textContent = "−";
    minus.setAttribute(
      "aria-label",
      `Kurangi ${product.name}`
    );

    minus.addEventListener("click", () => {
      changeQuantity(product.id, -1);
    });

    const qty = document.createElement("span");
    qty.textContent = item.quantity;

    const plus = document.createElement("button");
    plus.type = "button";
    plus.className = "quantity-button";
    plus.textContent = "+";
    plus.setAttribute(
      "aria-label",
      `Tambah ${product.name}`
    );

    plus.addEventListener("click", () => {
      changeQuantity(product.id, 1);
    });

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-button";
    remove.textContent = "Hapus";

    remove.addEventListener("click", () => {
      removeFromCart(product.id);
    });

    controls.append(
      minus,
      qty,
      plus,
      remove
    );

    details.append(name, price, controls);

    row.append(
      makeImage(product.image, product.name, "cart-image"),
      details
    );

    cartItems.append(row);
  });

  if (cartTotal) {
    cartTotal.textContent = rupiah(totalPrice());
  }

  const checkoutButton = $("#checkout-button");

  if (checkoutButton) {
    checkoutButton.disabled = cart.length === 0;
  }
}

// ==========================================
// BUKA DAN TUTUP POPUP
// ==========================================
function openModal(modal) {
  if (!modal) return;

  modal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeModal(modal) {
  if (!modal) return;

  modal.hidden = true;

  if (
    (!cartModal || cartModal.hidden) &&
    (!checkoutModal || checkoutModal.hidden)
  ) {
    document.body.classList.remove("modal-open");
  }
}

// ==========================================
// TOMBOL KERANJANG DAN CHECKOUT
// ==========================================
$("#open-cart")?.addEventListener("click", () => {
  renderCart();
  openModal(cartModal);
});

$("#close-cart")?.addEventListener("click", () => {
  closeModal(cartModal);
});

$("#continue-shopping")?.addEventListener("click", () => {
  closeModal(cartModal);
});

$("#checkout-button")?.addEventListener("click", () => {
  if (!cart.length) {
    return showToast("Keranjang masih kosong.");
  }

  closeModal(cartModal);
  openModal(checkoutModal);
});

$("#close-checkout")?.addEventListener("click", () => {
  closeModal(checkoutModal);
});

// Klik di luar popup untuk menutup
[cartModal, checkoutModal].forEach(modal => {
  modal?.addEventListener("click", event => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

// Tombol Escape untuk menutup popup
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeModal(cartModal);
    closeModal(checkoutModal);
  }
});

// ==========================================
// PENCARIAN DAN FILTER PRODUK
// ==========================================
searchInput?.addEventListener("input", renderProducts);

categorySelect?.addEventListener("change", renderProducts);

// ==========================================
// CHECKOUT KE WHATSAPP PENJUAL
// ==========================================
$("#checkout-form")?.addEventListener("submit", event => {
  event.preventDefault();

  if (!cart.length) {
    return showToast(
      "Keranjang kosong. Pilih produk terlebih dahulu."
    );
  }

  if (!/^\d{10,15}$/.test(STORE_WHATSAPP)) {
    return showToast(
      "Nomor WhatsApp toko belum benar."
    );
  }

  const name = $("#buyer-name")?.value.trim();
  const phone = $("#buyer-phone")?.value.trim();
  const address = $("#buyer-address")?.value.trim();
  const note = $("#buyer-note")?.value.trim();

  if (!name || !phone || !address) {
    return showToast(
      "Lengkapi nama, nomor HP, dan alamat."
    );
  }

  const lines = [
    "*PESANAN BARU - SMEKSA STORE*",
    "",
    `Nama: ${name}`,
    `Nomor HP: ${phone}`,
    `Alamat: ${address}`,
    "",
    "*Detail pesanan:*"
  ];

  cart.forEach((item, index) => {
    const product = getProduct(item.id);

    if (product) {
      lines.push(
        `${index + 1}. ${product.name}`,
        `   ${item.quantity} × ${rupiah(product.price)} = ${rupiah(product.price * item.quantity)}`
      );
    }
  });

  lines.push(
    "",
    `*TOTAL BELANJA: ${rupiah(totalPrice())}*`,
    "Ongkir: mohon dikonfirmasi penjual.",
    "Pembayaran: menunggu konfirmasi penjual."
  );

  if (note) {
    lines.push("", `Catatan: ${note}`);
  }

  lines.push(
    "",
    "Mohon konfirmasi pesanan ini. Terima kasih."
  );

  const url =
    `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`;

  // Membuka WhatsApp setelah pembeli menekan tombol checkout.
  window.open(url, "_blank", "noopener,noreferrer");
});

// ==========================================
// MENJALANKAN WEBSITE
// ==========================================
renderProducts();
renderCart();
updateBadge();
