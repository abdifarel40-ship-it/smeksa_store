"use strict";

// ============================================
// PENGATURAN TOKO - UBAH BAGIAN INI
// ============================================

// Ganti dengan nomor WhatsApp penjual.
// Format: kode negara + nomor, tanpa +, spasi, atau tanda hubung.
// Contoh format Indonesia: +6285648262713
const STORE_WHATSAPP = "+6285648262713";

// Data rekening tidak dicantumkan di website.
// Berikan informasi rekening kepada pembeli secara aman
// setelah pesanan dikonfirmasi.

// ============================================
// DATA PRODUK
// ============================================

const products = [
  {
    id: 1,
    name: "Pakan Konsentrat Sapi",
    category: "Agribisnis Ternak Ruminansia",
    price: 25000,
    description: "Pakan tambahan untuk ternak ruminansia.",
    image: "https://i.pinimg.com/736x/43/de/c0/43dec0799987456473a927650023d509.jpg"
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
    image: "![Kucing Garang](https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=700&q=80)"
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
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=700&q=80"
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

// ============================================
// ELEMEN HTML
// ============================================

const productContainer = document.getElementById("products");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const emptyState = document.getElementById("empty-state");
const productCount = document.getElementById("product-count");
const cartCount = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const checkoutModal = document.getElementById("checkout-modal");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const toast = document.getElementById("toast");

// ============================================
// KERANJANG BELANJA
// ============================================

// Keranjang disimpan di browser pengunjung.
// Ini bukan database bersama untuk semua pelanggan.
let cart = loadCart();
let toastTimeout;

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("smeksa-cart") || "[]");

    if (!Array.isArray(saved)) return [];

    return saved
      .filter(item =>
        Number.isInteger(item.id) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        products.some(product => product.id === item.id)
      )
      .map(item => ({
        id: item.id,
        quantity: Math.min(item.quantity, 99)
      }));
  } catch (error) {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem("smeksa-cart", JSON.stringify(cart));
  } catch (error) {
    showToast("Keranjang tidak dapat disimpan di browser ini.");
  }
}

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);
}

function getProduct(id) {
  return products.find(product => product.id === id);
}

function getCartQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal() {
  return cart.reduce((total, item) => {
    const product = getProduct(item.id);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
}

function updateCartBadge() {
  cartCount.textContent = getCartQuantity();
}

function addToCart(id) {
  const item = cart.find(entry => entry.id === id);

  if (item) {
    if (item.quantity >= 99) {
      showToast("Jumlah maksimal per produk adalah 99.");
      return;
    }
    item.quantity++;
  } else {
    cart.push({ id, quantity: 1 });
  }

  saveCart();
  updateCartBadge();
  renderCart();
  showToast("Produk berhasil ditambahkan!");
}

function changeQuantity(id, amount) {
  const item = cart.find(entry => entry.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(entry => entry.id !== id);
  } else if (item.quantity > 99) {
    item.quantity = 99;
    showToast("Jumlah maksimal per produk adalah 99.");
  }

  saveCart();
  updateCartBadge();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartBadge();
  renderCart();
  showToast("Produk dihapus dari keranjang.");
}

// ============================================
// MENAMPILKAN PRODUK
// ============================================

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product";

  const image = document.createElement("img");
  image.className = "product-image";
  image.src = product.image;
  image.alt = product.name;
  image.loading = "lazy";
  image.onerror = () => {
    image.onerror = null;
    image.src =
      "https://placehold.co/700x450/e4f0ff/193451?text=SMEKSA+STORE";
  };

  const info = document.createElement("div");
  info.className = "product-info";

  const category = document.createElement("p");
  category.className = "product-category";
  category.textContent = product.category;

  const name = document.createElement("h3");
  name.className = "product-name";
  name.textContent = product.name;

  const description = document.createElement("p");
  description.className = "product-description";
  description.textContent = product.description;

  const price = document.createElement("p");
  price.className = "product-price";
  price.textContent = formatRupiah(product.price);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "add-button";
  button.textContent = "Tambah ke Keranjang";
  button.addEventListener("click", () => addToCart(product.id));

  info.append(category, name, description, price, button);
  card.append(image, info);

  return card;
}

function renderProducts() {
  const keyword = searchInput.value.toLowerCase().trim();
  const selectedCategory = categorySelect.value;

  const filtered = products.filter(product => {
    const searchableText =
      `${product.name} ${product.category} ${product.description}`
        .toLowerCase();

    const matchesSearch = searchableText.includes(keyword);
    const matchesCategory =
      selectedCategory === "Semua" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  productContainer.replaceChildren();

  filtered.forEach(product => {
    productContainer.appendChild(createProductCard(product));
  });

  productCount.textContent = `${filtered.length} produk`;
  emptyState.hidden = filtered.length !== 0;
}

// ============================================
// MENAMPILKAN KERANJANG
// ============================================

function renderCart() {
  cartItems.replaceChildren();

  if (cart.length === 0) {
    const message = document.createElement("p");
    message.className = "empty-state";
    message.textContent = "Keranjang masih kosong. Yuk, pilih produk!";
    cartItems.appendChild(message);
  }

  cart.forEach(item => {
    const product = getProduct(item.id);
    if (!product) return;

    const row = document.createElement("div");
    row.className = "cart-item";

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;
    image.onerror = () => {
      image.onerror = null;
      image.src =
        "https://placehold.co/100x100/e4f0ff/193451?text=Produk";
    };

    const details = document.createElement("div");

    const name = document.createElement("h3");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.className = "item-price";
    price.textContent = formatRupiah(product.price * item.quantity);

    const quantityRow = document.createElement("div");
    quantityRow.className = "quantity-row";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.className = "quantity-button";
    minus.textContent = "−";
    minus.setAttribute("aria-label", `Kurangi ${product.name}`);
    minus.addEventListener("click", () => changeQuantity(product.id, -1));

    const quantity = document.createElement("span");
    quantity.textContent = item.quantity;

    const plus = document.createElement("button");
    plus.type = "button";
    plus.className = "quantity-button";
    plus.textContent = "+";
    plus.setAttribute("aria-label", `Tambah ${product.name}`);
    plus.addEventListener("click", () => changeQuantity(product.id, 1));

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-button";
    remove.textContent = "Hapus";
    remove.addEventListener("click", () => removeFromCart(product.id));

    quantityRow.append(minus, quantity, plus, remove);
    details.append(name, price, quantityRow);
    row.append(image, details);
    cartItems.appendChild(row);
  });

  cartTotal.textContent = formatRupiah(getCartTotal());

  document.getElementById("checkout-button").disabled = cart.length === 0;
  document.getElementById("checkout-button").style.opacity =
    cart.length === 0 ? "0.5" : "1";
}

// ============================================
// MODAL DAN NOTIFIKASI
// ============================================

function openModal(modal) {
  modal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeModal(modal) {
  modal.hidden = true;

  if (cartModal.hidden && checkoutModal.hidden) {
    document.body.classList.remove("modal-open");
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

document.getElementById("open-cart").addEventListener("click", () => {
  renderCart();
  openModal(cartModal);
});

document.getElementById("close-cart").addEventListener("click", () => {
  closeModal(cartModal);
});

document.getElementById("continue-shopping").addEventListener("click", () => {
  closeModal(cartModal);
});

document.getElementById("checkout-button").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Tambahkan produk terlebih dahulu.");
    return;
  }

  closeModal(cartModal);
  openModal(checkoutModal);
});

document.getElementById("close-checkout").addEventListener("click", () => {
  closeModal(checkoutModal);
});

[cartModal, checkoutModal].forEach(modal => {
  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal(modal);
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeModal(cartModal);
    closeModal(checkoutModal);
  }
});

searchInput.addEventListener("input", renderProducts);
categorySelect.addEventListener("change", renderProducts);

// ============================================
// CHECKOUT WHATSAPP
// ============================================

document.getElementById("checkout-form").addEventListener("submit", event => {
  event.preventDefault();

  if (cart.length === 0) {
    showToast("Keranjang kosong. Pilih produk terlebih dahulu.");
    closeModal(checkoutModal);
    return;
  }

  // Pastikan nomor toko sudah diganti dengan nomor penjual yang benar.
  if (!/^\d{10,15}$/.test(STORE_WHATSAPP)) {
    showToast("Nomor WhatsApp toko belum diatur dengan benar.");
    return;
  }

  const name = document.getElementById("buyer-name").value.trim();
  const phone = document.getElementById("buyer-phone").value.trim();
  const address = document.getElementById("buyer-address").value.trim();
  const note = document.getElementById("buyer-note").value.trim();

  if (!name || !phone || !address) {
    showToast("Lengkapi nama, nomor HP, dan alamat.");
    return;
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
    if (!product) return;

    lines.push(
      `${index + 1}. ${product.name}`,
      `   ${item.quantity} x ${formatRupiah(product.price)} = ${formatRupiah(product.price * item.quantity)}`
    );
  });

  lines.push(
    "",
    `*TOTAL BELANJA: ${formatRupiah(getCartTotal())}*`,
    "Pengiriman/ongkir: mohon dikonfirmasi penjual.",
    "Pembayaran: transfer bank atau pembayaran manual setelah konfirmasi."
  );

  if (note) {
    lines.push("", `Catatan: ${note}`);
  }

  lines.push(
    "",
    "Mohon konfirmasi ketersediaan produk, ongkir, dan instruksi pembayaran. Terima kasih."
  );

  const message = lines.join("\n");
  const whatsappURL =
    `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(message)}`;

  // Membuka WhatsApp. Pembeli tetap harus menekan tombol kirim di WhatsApp.
  const whatsappWindow = window.open(whatsappURL, "_blank");

  if (!whatsappWindow) {
    // Jika browser memblokir tab baru, gunakan tab saat ini.
    window.location.href = whatsappURL;
  }
});

// ============================================
// JALANKAN WEBSITE
// ============================================

renderProducts();
renderCart();
updateCartBadge();
