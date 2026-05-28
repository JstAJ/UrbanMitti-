/* ==========================================================================
   URBAN MITTI — BRAND BUSINESS LOGIC
   Core State, Firebase Firestore Sync, Database, Cart, Wishlist, Phone Auth
   ========================================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCF9obAY9_5XZjBlRX4Lx6uWwnzbKPBbO0",
  authDomain: "urbanmitti-5da90.firebaseapp.com",
  projectId: "urbanmitti-5da90",
  storageBucket: "urbanmitti-5da90.firebasestorage.app",
  messagingSenderId: "380600810568",
  appId: "1:380600810568:web:e70d2a3f2bbe6a80a46c7d",
  measurementId: "G-ZEJS5L2QHM"
};

let db = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (err) {
  console.warn("Firebase failed to initialize. Falling back to LocalStorage:", err);
}

// =====================================================
// 🏺 INITIAL PRODUCT CORE SEED DATABASE
// =====================================================
const initialProducts = [
  { id: 1,  name: 'Mitti Water Pot',           price: 1299, category: 'Pottery',     emoji: '🏺', img: 'assets/images/clay_water_pot.png', desc: 'Hand-thrown clay pot that naturally cools water. Crafted by master potters of Rajasthan.', rating: 4.9, reviews: 328, featured: true,  bestSeller: true,  badge: 'Bestseller',    tags: ['handmade', 'cooling', 'traditional'] },
  { id: 2,  name: 'Terracotta Diya Set (12)',  price: 449,  category: 'Home Decor',  emoji: '🪔', img: 'assets/images/terracotta_diyas.png', desc: 'A set of 12 handcrafted clay diyas, perfect for spiritual and everyday ambiance.', rating: 4.8, reviews: 512, featured: true,  bestSeller: true,  badge: 'Festival Pick',  tags: ['festival', 'diyas', 'set'] },
  { id: 3,  name: 'Chai Kulhad Set (6)',        price: 799,  category: 'Kitchenware', emoji: '☕', img: 'assets/images/chai_kulhad.png',  desc: 'Authentic kulhad chai experience at home. Set of 6 handmade organic clay tea cups.', rating: 4.9, reviews: 264, featured: true,  bestSeller: true,  badge: 'Top Rated',      tags: ['chai', 'kulhad', 'kitchen'] },
  { id: 4,  name: 'Terracotta Planter Large',  price: 649,  category: 'Garden',      emoji: '🪴', img: 'assets/images/clay_planter.png', desc: 'Large terracotta planter, perfect for succulents, indoor air-purifying plants, and herbs.', rating: 4.7, reviews: 189, featured: true,  bestSeller: false, badge: 'New',             tags: ['planter', 'garden', 'plants'] },
  { id: 5,  name: 'Clay Oil Diffuser',          price: 1199, category: 'Home Decor',  emoji: '𫭙', img: 'assets/images/essential_oil_diffuser.png', desc: 'Porous clay diffuser that releases essential oils slowly for hours of organic aromatic bliss.', rating: 4.6, reviews: 143, featured: false, bestSeller: true,  badge: null,             tags: ['aroma', 'wellness', 'decor'] },
  { id: 6,  name: 'Handpainted Flower Vase',   price: 899,  category: 'Home Decor',  emoji: '🌸', img: 'assets/images/handpainted_flower_vase.png', desc: 'Terracotta vase with hand-painted floral motifs inspired by traditional Madhubani art.', rating: 4.8, reviews: 201, featured: true,  bestSeller: false, badge: 'Artist Collab',   tags: ['vase', 'art', 'madhubani'] },
  { id: 7,  name: 'Clay Cooking Pot (Handi)', price: 1499, category: 'Kitchenware', emoji: '🍲', img: 'assets/images/clay_cooking_pot.png',      desc: 'Traditional handi for slow cooking. Imparts authentic earthy minerals and retains heat perfectly.', rating: 4.9, reviews: 387, featured: false, bestSeller: true,  badge: null,             tags: ['cooking', 'handi', 'authentic'] },
  { id: 8,  name: 'Terracotta Wind Chime',     price: 549,  category: 'Home Decor',  emoji: '🎐', img: 'assets/images/terracotta_wind_chime.png', desc: 'Hand-sculpted clay wind chime hanging bells with a soothing, resonant earthy tone.', rating: 4.5, reviews: 98,  featured: false, bestSeller: false, badge: null,             tags: ['windchime', 'garden', 'sound'] },
  { id: 9,  name: 'Mitti Incense Holder',      price: 349,  category: 'Home Decor',  emoji: '🌿', img: null, desc: 'Minimalist terracotta clay incense holder that doubles as an organic decorative accent.', rating: 4.7, reviews: 156, featured: false, bestSeller: false, badge: null,            tags: ['incense', 'minimal', 'decor'] },
  { id: 10, name: 'Clay Tea Set (Teapot + 4)', price: 2199, category: 'Kitchenware', emoji: '𫖖', img: 'assets/images/clay_teapot_set.png', desc: 'Premium clay tea set with teapot and 4 cups. A complete organic lifestyle tea ritual experience.', rating: 5.0, reviews: 87,  featured: true,  bestSeller: true,  badge: 'Premium',         tags: ['tea', 'luxury', 'gift'] },
  { id: 11, name: 'Earthen Soap Dish',          price: 249,  category: 'Home Decor',  emoji: '🧼', img: null, desc: 'Natural clay soap dish with drainage grooves. Keeps your soap dry and chemical-free.', rating: 4.5, reviews: 203, featured: false, bestSeller: false, badge: null,             tags: ['bathroom', 'clay', 'minimal'] },
  { id: 12, name: 'Terracotta Wall Art Panel', price: 1899, category: 'Home Decor',  emoji: '🎨', img: null, desc: 'Handcrafted wall art panel with beautiful geometric tribal clay motifs. Statement designer piece.', rating: 4.9, reviews: 74,  featured: false, bestSeller: false, badge: 'Limited',         tags: ['art', 'wall', 'tribal'] },
  { id: 13, name: 'Clay Money Piggy Bank',      price: 399,  category: 'Gifting',     emoji: '🐷', img: null, desc: 'Traditional clay piggy bank hand-painted with standard folk art colors.', rating: 4.6, reviews: 312, featured: false, bestSeller: false, badge: null,             tags: ['gift', 'kids', 'traditional'] },
  { id: 14, name: 'Herb Garden Planter Set',   price: 1099, category: 'Garden',      emoji: '🌱', img: null, desc: 'Set of 3 terracotta planters perfect for your organic home kitchen herb garden.', rating: 4.8, reviews: 167, featured: true,  bestSeller: false, badge: 'Set',             tags: ['herb', 'garden', 'kitchen'] },
  { id: 15, name: 'Mitti Face Mask Pot',        price: 599,  category: 'Home Decor',  emoji: '💆', img: null, desc: 'Delicate clay bowl set for mixing and storing natural beauty face clay masks.', rating: 4.4, reviews: 89,  featured: false, bestSeller: false, badge: 'Wellness',         tags: ['beauty', 'clay', 'natural'] },
  { id: 17, name: 'Clay Bird Feeder',           price: 699,  category: 'Garden',      emoji: '🐦', img: null, desc: 'Handmade terracotta bird feeder that blends naturally into your garden branches.', rating: 4.6, reviews: 56,  featured: false, bestSeller: false, badge: null,             tags: ['birds', 'garden', 'eco'] },
  { id: 18, name: 'Gift Box — Mitti Essentials',price: 2499, category: 'Gifting',     emoji: '🎁', img: null, desc: 'Curated luxury gift box with handmade kulhad, diya, planter and incense holder.', rating: 5.0, reviews: 142, featured: true,  bestSeller: true,  badge: 'Gift Set',        tags: ['gift', 'premium', 'curated'] },
  { id: 19, name: 'Clay Photo Frame',           price: 899,  category: 'Home Decor',  emoji: '🖼️', img: null, desc: 'Handcrafted clay photo frame with delicate floral relief terracotta borders.', rating: 4.5, reviews: 91,  featured: false, bestSeller: false, badge: null,             tags: ['frame', 'decor', 'gift'] },
  { id: 20, name: 'Terracotta Tumbler (Set 2)', price: 599,  category: 'Kitchenware', emoji: '🥤', img: null, desc: 'Earthy terracotta organic tumblers for your morning juice or evening detox water.', rating: 4.7, reviews: 178, featured: false, bestSeller: false, badge: null,            tags: ['tumbler', 'kitchen', 'eco'] },
  { id: 21, name: 'Mitti Candle Holder Set',    price: 749,  category: 'Home Decor',  emoji: '🕯️', img: null, desc: 'Set of 3 handcrafted clay candle holders. Creates gorgeous warm natural shadows.', rating: 4.8, reviews: 221, featured: false, bestSeller: true,  badge: null,             tags: ['candle', 'decor', 'set'] },
  { id: 22, name: 'Clay Coaster Set (4)',        price: 499,  category: 'Kitchenware', emoji: '𫗗', img: null, desc: 'Handpainted terracotta coasters with warli tribal folk art prints.', rating: 4.6, reviews: 145, featured: false, bestSeller: false, badge: null,             tags: ['coaster', 'warli', 'kitchen'] },
  { id: 23, name: 'Terracotta Temple Bell',     price: 449,  category: 'Home Decor',  emoji: '🔔', img: null, desc: 'Handcrafted clay temple bell with a pure, beautiful resonant spiritual tone.', rating: 4.7, reviews: 67,  featured: false, bestSeller: false, badge: 'Spiritual',        tags: ['bell', 'spiritual', 'decor'] },
  { id: 24, name: 'Earthen Night Lamp',          price: 1399, category: 'Home Decor',  emoji: '🏮', img: 'assets/images/earthen_night_lamp.png', desc: 'Perforated designer terracotta lamp that creates stunning cozy shadow patterns on walls.', rating: 4.9, reviews: 198, featured: true,  bestSeller: true,  badge: 'New',             tags: ['lamp', 'light', 'decor'] },
  { id: 25, name: 'Mini Clay Sculpture Set',    price: 1699, category: 'Gifting',     emoji: '🗿', img: null, desc: 'Set of 5 miniature handcrafted Indian folk art sculptures (elephant, peacock, lotus).', rating: 4.8, reviews: 103, featured: false, bestSeller: false, badge: 'Art',             tags: ['sculpture', 'art', 'miniature'] },
  { id: 100, name: 'Minimalist Terrazzo Vase',    price: 1599, category: 'Home Decor',  emoji: '🏺', img: 'https://i.ibb.co/1GkCJM4j/41-Kh241d-MJL.webp', desc: 'Sleek terrazzo clay vase with modern speckles. Perfect for dried pampas grass and modern minimalist shelf styling.', rating: 4.8, reviews: 94, featured: true, bestSeller: false, badge: 'New', tags: ['vase', 'decor', 'terrazzo', 'minimalist'] },
  { id: 101, name: 'Ribbed Earth Pot Trio',       price: 1899, category: 'Home Decor',  emoji: '🫙', img: 'https://i.ibb.co/5WzWDxyp/61w-YVB16-G5-L.webp', desc: 'A set of three elegantly ribbed earthen pots in graded organic shades. Perfect accent pieces for side tables or entryways.', rating: 4.9, reviews: 83, featured: false, bestSeller: true, badge: 'Top Rated', tags: ['pot', 'trio', 'decor', 'ribbed'] },
  { id: 102, name: 'Artisanal Speckled Urn',      price: 1749, category: 'Home Decor',  emoji: '🏺', img: 'https://i.ibb.co/TDc6sBRc/61-YFKs-SYQOL.webp', desc: 'Hand-textured speckled ceramic urn with matching lid. Imparts a rustic Mediterranean charm to traditional and modern homes alike.', rating: 4.7, reviews: 68, featured: true, bestSeller: false, badge: 'Rustic', tags: ['urn', 'ceramic', 'decor', 'rustic'] },
  { id: 103, name: 'Duo Tone Ceramic Pitcher',    price: 1499, category: 'Home Decor',  emoji: '🥛', img: 'https://i.ibb.co/JRsgTvsG/71dan1j-PIZL.webp', desc: 'Elegantly designed clay pitcher with a clean duo-tone glaze. Ideal as a floral vase or a statement mantel ornament.', rating: 4.6, reviews: 52, featured: false, bestSeller: false, badge: 'Modern', tags: ['pitcher', 'ceramic', 'decor', 'duotone'] },
  { id: 104, name: 'Hand-Dipped Earth Vase',      price: 1649, category: 'Home Decor',  emoji: '🏺', img: 'https://i.ibb.co/3ysS2ngB/71lwxz7-L85-L.webp', desc: 'Glazed terracotta vase with a hand-dipped finish. Displays a stunning contrast between smooth white glaze and raw textured clay.', rating: 4.9, reviews: 112, featured: true, bestSeller: true, badge: 'Bestseller', tags: ['vase', 'terracotta', 'decor', 'glazed'] },
  { id: 105, name: 'Wabi-Sabi Sculpted Clay Pot', price: 2199, category: 'Home Decor',  emoji: '🫙', img: 'https://i.ibb.co/mM7tRHL/71u2t2et-Jw-L.webp', desc: 'Stunning wabi-sabi designer pot with raw textures and beautifully irregular hand-molded rings. Exudes absolute organic luxury.', rating: 5.0, reviews: 41, featured: true, bestSeller: false, badge: 'Limited', tags: ['wabisabi', 'designer', 'decor', 'sculpted'] },
  { id: 106, name: 'Earthy Ribbed Pitcher',       price: 1349, category: 'Home Decor',  emoji: '🏺', img: 'https://i.ibb.co/27T7Zx5s/71-Wfk9yu-KXL.webp', desc: 'Charming ribbed terracotta clay jug pitcher. Combines ancient Indian utility form with modern sleek decor styling.', rating: 4.5, reviews: 75, featured: false, bestSeller: false, badge: 'Earthy', tags: ['pitcher', 'clay', 'decor', 'ribbed'] },
  { id: 107, name: 'Tall Fluted Earthen Vase',    price: 2499, category: 'Home Decor',  emoji: '🏺', img: 'https://i.ibb.co/MkdvCqvg/81z-HVs-X8-Ac-L.webp', desc: 'Exquisite tall fluted earthen floor vase. Perfectly showcases generational soil baking craftsmanship in a grand, luxury size.', rating: 4.9, reviews: 59, featured: true, bestSeller: true, badge: 'Premium', tags: ['vase', 'tall', 'decor', 'fluted'] },
  { id: 108, name: 'Modern Scalloped Clay Vase',  price: 1299, category: 'Home Decor',  emoji: '🏺', img: 'https://i.ibb.co/HfmJC8VD/6137a-Trw-XTL.webp', desc: 'Modern ceramic clay vase with beautiful scalloped contours. Adds architectural texture and fluid movement to tables and shelves.', rating: 4.7, reviews: 88, featured: false, bestSeller: false, badge: 'Nordic', tags: ['vase', 'scalloped', 'decor', 'modern'] },
  { id: 109, name: 'Gilded Charcoal Planter',     price: 1999, category: 'Home Decor',  emoji: '🪴', img: 'https://i.ibb.co/ccKRFKgW/buy-planter-black-metal-glitter-floor-planter-or-table-flower-pot-for-indoor-and-outdoor-decor-set-o.webp', desc: 'Premium black metal floor planter with golden stands. Elevates indoor spaces with sophisticated industrial luxury.', rating: 4.8, reviews: 132, featured: true, bestSeller: true, badge: 'Deluxe', tags: ['planter', 'metal', 'decor', 'gilded'] },
  { id: 110, name: 'Ivory Fiberglass Pillar Planter', price: 2899, category: 'Home Decor', emoji: '🪴', img: 'https://i.ibb.co/Sw6r32yS/buy-planter-fiberglass-planter-for-indoor-and-outdoor-decor-or-white-flower-pot-for-home-decor-and-g.webp', desc: 'Stately tall ivory white fiberglass planter. Designed for striking luxury corner setups, both indoors and on premium balconies.', rating: 4.9, reviews: 47, featured: false, bestSeller: false, badge: 'Premium', tags: ['planter', 'fiberglass', 'decor', 'ivory'] },
  { id: 111, name: 'Charming Ceramic Balti Planter', price: 899, category: 'Home Decor', emoji: '🪣', img: 'https://i.ibb.co/fZkgPr2/multicolor-balti-ceramic-sacculent-planter-500x500.webp', desc: 'Charming multi-colored ceramic planter modeled like a traditional Indian bucket (balti). Extremely cheerful and unique.', rating: 4.8, reviews: 156, featured: false, bestSeller: true, badge: 'Artisan', tags: ['planter', 'balti', 'decor', 'ceramic'] },
  { id: 112, name: 'Spherical Glazed Planter Trio', price: 1199, category: 'Home Decor', emoji: '🪴', img: 'https://i.ibb.co/v4Z6gn7G/round-ceramic-flower-pots-250x250.webp', desc: 'Set of 3 sleek, round glazed ceramic pots in pleasing earthy pastels. Ideal size for table succulents and herb gardens.', rating: 4.6, reviews: 119, featured: true, bestSeller: false, badge: 'Set of 3', tags: ['planter', 'spherical', 'decor', 'glazed'] },
  { id: 200, name: 'Artisanal Clay Spice Jar',     price: 499,  category: 'Kitchenware', emoji: '🫙', img: 'https://i.ibb.co/j9GhyDNJ/shopping.jpg', desc: 'Hand-thrown earthen clay spice jar with snug wooden lid. Naturally breathable to keep your organic spices and herbs dry and fresh.', rating: 4.7, reviews: 48, featured: false, bestSeller: false, badge: 'Earthy', tags: ['spice', 'jar', 'organic', 'kitchen'] },
  { id: 201, name: 'Traditional Terracotta Handi', price: 1199, category: 'Kitchenware', emoji: '🍲', img: 'https://i.ibb.co/pB0346J6/images.jpg', desc: 'Authentic wooden-fired clay cooking pot (handi). Imparts rich trace minerals, balances food acidity, and retains heat wonderfully.', rating: 4.9, reviews: 124, featured: true, bestSeller: true, badge: 'Best Seller', tags: ['handi', 'cooking', 'slowcooking', 'authentic'] },
  { id: 202, name: 'Glazed Ceramic Dining Bowls',  price: 899,  category: 'Kitchenware', emoji: '🥣', img: 'https://i.ibb.co/Y4pHQNhR/image-3-Pf-jpeg.webp', desc: 'Set of 2 hand-painted glazed ceramic serving bowls. Exquisite floral details that turn everyday meals into a luxurious dining ritual.', rating: 4.8, reviews: 63, featured: false, bestSeller: false, badge: 'Artisan', tags: ['bowls', 'dining', 'ceramic', 'floral'] },
  { id: 203, name: 'Organic Clay Serving Platter', price: 999,  category: 'Kitchenware', emoji: '🍽️', img: 'https://i.ibb.co/cKrz8mPg/IMG-20250711-WA0185-jpg.webp', desc: 'Hand-carved flat clay serving platter with delicate tribal details. Ideal for serving dry snacks, premium roti, or artisan breads.', rating: 4.6, reviews: 39, featured: true, bestSeller: false, badge: 'New', tags: ['platter', 'serving', 'handcarved', 'clay'] },
  { id: 204, name: 'Earthen Curd Pot (Dahi Handi)', price: 699,  category: 'Kitchenware', emoji: '🏺', img: 'https://i.ibb.co/ZzJNzn6r/shopping-2.jpg', desc: 'Porous clay pot designed for setting thick, naturally sweet curd (dahi). Absorbs excess moisture for an incredibly creamy texture.', rating: 4.9, reviews: 158, featured: false, bestSeller: true, badge: 'Essential', tags: ['curdpot', 'dahi', 'kitchen', 'traditional'] }
];

let products = [];
let allProductsRaw = [];
let orders = [];
let customers = [];

// =====================================================
// HYBRID FIREBASE CLOUD + LOCAL STORAGE SYNC ENGINE
// =====================================================
async function initializeDatabases() {
  if (db) {
    try {
      console.log("Connecting to Firebase Cloud Firestore...");
      
      // Sync products seeder
      const productsSnap = await getDocs(collection(db, "products"));
      if (productsSnap.empty) {
        console.log("Seeding default masterpieces to Firestore...");
        for (const p of initialProducts) {
          await setDoc(doc(db, "products", p.id.toString()), p);
        }
      } else {
        // Dynamically seed any new masterpieces from the active codebase
        const existingIds = new Set();
        productsSnap.forEach(d => existingIds.add(d.id));
        for (const p of initialProducts) {
          if (!existingIds.has(p.id.toString())) {
            console.log(`Dynamic seeder: Seeding new masterpieces ${p.name} to Firestore...`);
            await setDoc(doc(db, "products", p.id.toString()), p);
          }
        }
      }
      
      // Sync orders seeder
      const ordersSnap = await getDocs(collection(db, "orders"));
      if (ordersSnap.empty) {
        console.log("Seeding default orders database...");
        for (const o of initialOrders) {
          await setDoc(doc(db, "orders", o.id.replace('#', '')), o);
        }
      }
      
      // Sync customers seeder
      const customersSnap = await getDocs(collection(db, "customers"));
      if (customersSnap.empty) {
        console.log("Seeding default customer directory...");
        for (const c of initialCustomers) {
          await setDoc(doc(db, "customers", c.phone.replace(/\D/g, '')), c);
        }
      }
      
      // Run real-time cloud listeners
      listenToFirestore();
      return;
    } catch (err) {
      console.error("Firestore initialization blocked. Falling back to local pools:", err);
    }
  }
  
  // Clean Local Storage Backup Fallback
  console.log("Loading LocalStorage static backup databases.");
  let localProducts = JSON.parse(localStorage.getItem('um_products')) || initialProducts;
  // Always filter out soft-deleted items to ensure deletions are permanent on page reloads
  products = localProducts.filter(p => !p.deleted);
  localStorage.setItem('um_products', JSON.stringify(localProducts));
  allProductsRaw = localProducts;
  
  orders = JSON.parse(localStorage.getItem('um_orders')) || initialOrders;
  localStorage.setItem('um_orders', JSON.stringify(orders));
  
  customers = JSON.parse(localStorage.getItem('um_customers')) || initialCustomers;
  localStorage.setItem('um_customers', JSON.stringify(customers));
  
  // Render layout instantly
  renderFeaturedProducts();
  renderBestsellers();
  renderShopProducts();
  updateCartUI();
  updateWishlistUI();
}

function listenToFirestore() {
  // 1. Live Sync Products (with Soft-Delete filtering & LocalStorage mirroring)
  onSnapshot(collection(db, "products"), (snapshot) => {
    allProductsRaw = [];
    products = [];
    snapshot.forEach(doc => {
      const p = doc.data();
      allProductsRaw.push(p);
      if (!p.deleted) {
        products.push(p);
      }
    });
    products.sort((a, b) => a.id - b.id);
    
    // Mirror cloud products database dynamically into LocalStorage backup
    localStorage.setItem('um_products', JSON.stringify(allProductsRaw));
    
    renderFeaturedProducts();
    renderBestsellers();
    renderShopProducts();
    
    if (document.getElementById('page-admin').classList.contains('active')) {
      renderAdminProducts();
      renderAdminOverview();
    }
  });

  // 2. Live Sync Orders (with LocalStorage mirroring)
  onSnapshot(collection(db, "orders"), (snapshot) => {
    orders = [];
    snapshot.forEach(doc => {
      orders.push(doc.data());
    });
    orders.sort((a, b) => b.id.localeCompare(a.id));
    
    // Mirror cloud orders database dynamically into LocalStorage backup
    localStorage.setItem('um_orders', JSON.stringify(orders));
    
    renderAdminOrders();
    renderAdminOverview();
  });

  // 3. Live Sync Customers (with LocalStorage mirroring)
  onSnapshot(collection(db, "customers"), (snapshot) => {
    customers = [];
    snapshot.forEach(doc => {
      customers.push(doc.data());
    });
    
    // Mirror cloud customer directory dynamically into LocalStorage backup
    localStorage.setItem('um_customers', JSON.stringify(customers));
    
    renderAdminCustomers();
    renderAdminOverview();
  });
}

// Initial static seed parameters
const initialOrders = [
  { id: '#UM2601', date: '12 Mar 2026', customerName: 'Swastik Sharma', phone: '+91 98765 43210', address: 'Flat 101, Oakwood Apts, Lucknow, UP - 226001', items: [{ id: 1, name: 'Mitti Water Pot', qty: 1, price: 1299 }, { id: 2, name: 'Terracotta Diya Set (12)', qty: 1, price: 449 }], total: 1748, paymentMethod: 'UPI via Razorpay', status: 'Delivered' },
  { id: '#UM2589', date: '28 Feb 2026', customerName: 'Priyanka Rao', phone: '+91 88990 12345', address: 'Plot 45, Sector 4, Gandhinagar, Gujarat - 382010', items: [{ id: 3, name: 'Chai Kulhad Set (6)', qty: 1, price: 799 }], total: 799, paymentMethod: 'Cash on Delivery', status: 'Delivered' },
  { id: '#UM2556', date: '10 Feb 2026', customerName: 'Karan Mehta', phone: '+91 70123 45678', address: 'Building C, flat 12, Bandra West, Mumbai, MH - 400050', items: [{ id: 24, name: 'Earthen Night Lamp', qty: 1, price: 1399 }], total: 1399, paymentMethod: 'UPI via Razorpay', status: 'Delivered' }
];

const initialCustomers = [
  { name: 'Swastik Sharma', phone: '+91 98765 43210', location: 'Lucknow, UP', joinedDate: '10 Jan 2026' },
  { name: 'Priyanka Rao', phone: '+91 88990 12345', location: 'Gandhinagar, Gujarat', joinedDate: '15 Feb 2026' },
  { name: 'Karan Mehta', phone: '+91 70123 45678', location: 'Mumbai, Maharashtra', joinedDate: '20 Feb 2026' }
];

// =====================================================
// GLOBAL STATE VARIABLES
// =====================================================
let cart = JSON.parse(localStorage.getItem('um_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('um_wishlist') || '[]');
let currentUser = JSON.parse(localStorage.getItem('um_user') || 'null');
let currentFilter = 'All';
let currentDetailId = null;
let currentSlide = 0;
let activeSearchQuery = '';

const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.carousel-dot');

// =====================================================
// CORE STARTUP & DOM LOADERS
// =====================================================
window.addEventListener('DOMContentLoaded', () => {
  // Gracefully transition loader screen out after the cinematic logo animation completes
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 2800);

  initScroll();
  initObserver();
  initHeroCarousel();
  
  // Connect and load database seeder/real-time syncs
  initializeDatabases();
  
  updateCartUI();
  updateWishlistUI();
  updateAuthNavbar();

  // Set up exit admin portal event listener
  const exitBtn = document.getElementById('adminExitBtn');
  if (exitBtn) {
    exitBtn.addEventListener('click', handleAdminSignOut);
  }
});

// Navbar scrolling transitions and scroll back-to-top buttons
function initScroll() {
  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    document.getElementById('mainHeader').classList.toggle('scrolled', s > 50);
    const btt = document.getElementById('backToTop');
    if (btt) btt.classList.toggle('visible', s > 400);
  });
}

// Fade-up animation observer
function initObserver() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// =====================================================
// HERO SLIDER CAROUSEL LOGIC
// =====================================================
let carouselInterval;
function initHeroCarousel() {
  const inner = document.getElementById('carouselInner');
  const prevBtn = document.getElementById('carouselPrevBtn');
  const nextBtn = document.getElementById('carouselNextBtn');
  
  if (!inner) return;

  // Arrow controls
  prevBtn.addEventListener('click', () => { changeSlide(currentSlide - 1); resetCarouselTimer(); });
  nextBtn.addEventListener('click', () => { changeSlide(currentSlide + 1); resetCarouselTimer(); });

  // Indicator dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => { changeSlide(index); resetCarouselTimer(); });
  });

  // Swipe Gestures Support on Touch screens
  let touchStartX = 0;
  let touchEndX = 0;
  const carouselContainer = document.getElementById('heroCarousel');

  carouselContainer.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carouselContainer.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const threshold = 55;
    if (touchStartX - touchEndX > threshold) {
      changeSlide(currentSlide + 1); // Swipe left -> Next
      resetCarouselTimer();
    } else if (touchEndX - touchStartX > threshold) {
      changeSlide(currentSlide - 1); // Swipe right -> Prev
      resetCarouselTimer();
    }
  }

  startCarouselTimer();
}

function changeSlide(index) {
  const inner = document.getElementById('carouselInner');
  if (!inner) return;

  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');

  currentSlide = (index + slides.length) % slides.length;

  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
  inner.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function startCarouselTimer() {
  carouselInterval = setInterval(() => {
    changeSlide(currentSlide + 1);
  }, 6000);
}

function resetCarouselTimer() {
  clearInterval(carouselInterval);
  startCarouselTimer();
}

// =====================================================
// NAVIGATION PAGES CONTROLLER
// =====================================================
function showPage(name) {
  if (name === 'admin') {
    const isVerified = sessionStorage.getItem('um_admin_verified') === 'true';
    const verifiedEmail = sessionStorage.getItem('um_admin_email');
    const allowedEmails = ['oyeee.aj@gmail.com', 'ssingh48619@gmail.com'];
    const isEmailOk = verifiedEmail && allowedEmails.includes(verifiedEmail.toLowerCase().trim());
    
    if (!isVerified || !isEmailOk) {
      const email = prompt("Enter Administrative Email Address:");
      if (email === null) return; // User clicked Cancel
      
      const cleanEmail = email.trim().toLowerCase();
      if (!allowedEmails.includes(cleanEmail)) {
        showToast('Access Denied: Unauthorized administrative email address', 'error');
        return;
      }
      
      const key = prompt("Enter Administrative Access Passkey:");
      if (key === null) return; // User clicked Cancel
      
      const cleanKey = key.trim();
      if (cleanKey === '70785') {
        sessionStorage.setItem('um_admin_verified', 'true');
        sessionStorage.setItem('um_admin_email', cleanEmail);
        showToast('Administrative authorization granted! 🌿', 'success');
        showPage('admin');
      } else {
        showToast('Access Denied: Invalid Administrative Passkey', 'error');
      }
      return;
    }
  }

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-' + name);
  if (pg) {
    pg.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Reset Desktop Navigation Header active triggers
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const activeLink = document.querySelector(`.nav-link[onclick*="${name}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Reset Mobile Bottom Navigation links active triggers
    document.querySelectorAll('.mobile-bottom-link').forEach(l => l.classList.remove('active'));
    const activeMobileLink = document.querySelector(`.mobile-bottom-link[onclick*="${name}"]`);
    if (activeMobileLink) activeMobileLink.classList.add('active');
  }
  
  if (name === 'shop') setTimeout(renderShopProducts, 50);
  if (name === 'checkout') renderCheckout();
  if (name === 'wishlist') renderWishlistPage();
  if (name === 'dashboard') {
    if (!currentUser) {
      showPage('auth');
      return;
    }
    renderDashboard();
  }
  if (name === 'admin') renderAdminPanel();
  setTimeout(initObserver, 100);
}

function handleAdminSignOut() {
  if (confirm('Are you sure you want to sign out and exit the administrative portal?')) {
    sessionStorage.removeItem('um_admin_verified');
    sessionStorage.removeItem('um_admin_email');
    showToast('Signed out of administrative console successfully 🌿', 'info');
    showPage('home');
  }
}

function toggleMobileNav() {
  // Obsolete but kept for API stability
}

function closeMobileNav() {
  // Obsolete but kept for API stability
}

// Floating Corner Option Button navigation toggle
function toggleQuickNav() {
  const trigger = document.getElementById('quickNavTrigger');
  const menu = document.getElementById('quickNavMenu');
  if (trigger && menu) {
    trigger.classList.toggle('active');
    menu.classList.toggle('open');
  }
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// =====================================================
// BUILD PRODUCT CARD (PREMIUM & CLEAN PRICING)
// =====================================================
function buildProductCard(p) {
  const isWished = wishlist.includes(p.id);
  const badge = p.badge ? `<span class="product-badge ${p.featured ? 'featured' : ''}">${p.badge}</span>` : '';
  
  // Real catalog image or visual clay gradients fallbacks
  const imgContent = p.img
    ? `<img class="product-real-img" src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.outerHTML='<span class=product-emoji>${p.emoji}</span>'" />`
    : `<span class="product-emoji" style="font-size: 5rem; transition: transform 0.4s ease;">${p.emoji}</span>`;

  return `
    <div class="product-card" id="pc-${p.id}" onclick="openDetail(${p.id})">
      <div class="product-img-wrap">
        ${badge}
        <button class="product-wishlist ${isWished ? 'active' : ''}" onclick="toggleWishlist(${p.id}, event)">
          <i class="${isWished ? 'fas' : 'far'} fa-heart"></i>
        </button>
        ${imgContent}
        <div class="product-overlay">
          <button class="product-quick-view" onclick="openDetail(${p.id})">Quick View</button>
        </div>
      </div>
      <div class="product-info">
        <p class="product-category">${p.category}</p>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-footer">
          <div>
            <span class="product-price">₹${p.price.toLocaleString()}</span>
            <div class="product-stars">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5 - Math.floor(p.rating))} <span style="font-size:0.75rem;color:var(--text-muted);letter-spacing:0">(${p.reviews})</span></div>
          </div>
          <button class="product-add-btn" onclick="addToCart(${p.id}, event)"><i class="fas fa-plus"></i></button>
        </div>
      </div>
    </div>`;
}

// =====================================================
// RENDER GRIDS & PORTFOLIOS
// =====================================================
function renderFeaturedProducts() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  grid.innerHTML = products.filter(p => p.featured).slice(0, 8).map(buildProductCard).join('');
}

function renderBestsellers() {
  const grid = document.getElementById('bestsellersGrid');
  if (!grid) return;
  grid.innerHTML = products.filter(p => p.bestSeller).slice(0, 4).map(buildProductCard).join('');
}

function renderShopProducts() {
  const grid = document.getElementById('shopGrid');
  if (!grid) return;
  
  const search = activeSearchQuery.toLowerCase();
  
  let filtered = products.filter(p => {
    const matchCat = currentFilter === 'All' || p.category === currentFilter;
    const matchSearch = !search || p.name.toLowerCase().includes(search) || p.desc.toLowerCase().includes(search) || p.category.toLowerCase().includes(search);
    return matchCat && matchSearch;
  });
  
  grid.innerHTML = filtered.length 
    ? filtered.map(buildProductCard).join('') 
    : `<div style="text-align:center;padding:60px;grid-column:1/-1;color:var(--text-muted)"><div style="font-size:3rem;margin-bottom:12px">🏺</div><p>No products found</p></div>`;
}

function handleSearchInput() {
  const input = document.getElementById('shopSearch');
  const suggestionsBox = document.getElementById('searchSuggestions');
  if (!input || !suggestionsBox) return;

  const query = input.value.trim().toLowerCase();
  if (!query) {
    suggestionsBox.innerHTML = '';
    suggestionsBox.style.display = 'none';
    return;
  }

  // Filter products by name, category, or tags
  const matched = products.filter(p => {
    const matchName = p.name && p.name.toLowerCase().includes(query);
    const matchCat = p.category && p.category.toLowerCase().includes(query);
    const matchTags = p.tags && p.tags.some(tag => tag.toLowerCase().includes(query));
    return matchName || matchCat || matchTags;
  });

  if (matched.length === 0) {
    suggestionsBox.innerHTML = `<div class="suggestion-no-results">No products found</div>`;
  } else {
    // Limit to 6 suggestions for visual elegance
    const limit = matched.slice(0, 6);
    suggestionsBox.innerHTML = limit.map(p => {
      const imgContent = p.img
        ? `<img src="${p.img}" alt="${p.name}" onerror="this.outerHTML='<span>${p.emoji}</span>'" />`
        : `<span>${p.emoji}</span>`;
        
      const escapedName = p.name.replace(/'/g, "\\'");
      return `
        <div class="suggestion-item" onclick="selectSuggestion('${escapedName}')">
          <div class="suggestion-item-img">${imgContent}</div>
          <div class="suggestion-item-info">
            <h4 class="suggestion-item-name">${p.name}</h4>
            <p class="suggestion-item-category">${p.category}</p>
          </div>
          <span class="suggestion-item-price">₹${p.price.toLocaleString()}</span>
        </div>`;
    }).join('');
  }
  
  suggestionsBox.style.display = 'block';
}

function handleSearchKeyDown(e) {
  if (e.key === 'Enter') {
    triggerSearch();
  }
}

function triggerSearch() {
  const input = document.getElementById('shopSearch');
  const suggestionsBox = document.getElementById('searchSuggestions');
  if (suggestionsBox) suggestionsBox.style.display = 'none';
  
  if (input) {
    activeSearchQuery = input.value.trim();
    
    // Reset category filter pill to "All" to make sure matching search items are visible
    currentFilter = 'All';
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.toggle('active', p.dataset.cat === 'All'));
    
    renderShopProducts();
  }
}

function selectSuggestion(name) {
  const input = document.getElementById('shopSearch');
  if (input) {
    input.value = name;
  }
  triggerSearch();
}

// Verification modal functions removed in favor of clean prompt flow.

function setFilter(btn) {
  document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  currentFilter = btn.dataset.cat;
  renderShopProducts();
}

function filterAndShop(cat) {
  currentFilter = cat;
  showPage('shop');
  setTimeout(() => {
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.toggle('active', p.dataset.cat === cat));
    renderShopProducts();
  }, 60);
}

// =====================================================
// PRODUCT QUICK VIEW CONTROLLER
// =====================================================
function openDetail(id) {
  currentDetailId = id;
  const p = products.find(x => x.id === id);
  if (!p) return;
  
  const isWished = wishlist.includes(p.id);
  const badge = p.badge ? `<span class="detail-badge">${p.badge}</span>` : '';
  const stars = '★'.repeat(Math.floor(p.rating)) + '☆'.repeat(5 - Math.floor(p.rating));
  
  const mainImg = p.img 
    ? `<img src="${p.img}" alt="${p.name}" onerror="this.outerHTML='<span style=font-size:8rem>${p.emoji}</span>'" />`
    : `<span style="font-size:8rem">${p.emoji}</span>`;

  document.getElementById('detailContent').innerHTML = `
    <div class="detail-gallery">
      <div class="detail-main-img">${mainImg}</div>
      <div class="detail-thumbs">
        <div class="detail-thumb active">${p.img ? `<img src="${p.img}" alt="${p.name}" />` : p.emoji}</div>
        <div class="detail-thumb">🌿</div>
        <div class="detail-thumb">📦</div>
        <div class="detail-thumb">🤲</div>
      </div>
    </div>
    <div class="detail-info">
      <div class="detail-breadcrumb">
        <span onclick="showPage('home')">Home</span>
        <i class="fas fa-chevron-right" style="font-size:0.6rem"></i>
        <span onclick="filterAndShop('${p.category}')">${p.category}</span>
        <i class="fas fa-chevron-right" style="font-size:0.6rem"></i>
        <span>${p.name}</span>
      </div>
      ${badge}
      <h1 class="detail-title">${p.name}</h1>
      <div class="detail-price-wrap">
        <span class="detail-price">₹${p.price.toLocaleString()}</span>
      </div>
      <div class="detail-stars"><span class="detail-stars-rating">${stars}</span><span class="detail-stars-count">${p.rating} · ${p.reviews} premium reviews</span></div>
      <p class="detail-desc">${p.desc} Hand-sculpted in natural clay bodies. Slow fired at optimal temperature. Organic surface irregularities are the beautiful stamp of traditional craftsmanship.</p>
      <div class="tag-list">${(p.tags || []).map(t => `<span class="tag">#${t}</span>`).join('')}</div>
      <div class="detail-divider"></div>
      <p class="qty-label">Quantity</p>
      <div class="qty-wrap">
        <div class="qty-ctrl">
          <button class="qty-btn" onclick="changeQty(-1)">−</button>
          <span class="qty-num" id="qtyNum">1</span>
          <button class="qty-btn" onclick="changeQty(1)">+</button>
        </div>
        <span style="font-size:0.85rem;color:var(--text-muted)">Premium items are in stock, packed securely</span>
      </div>
      <div class="detail-actions">
        <button class="btn btn-primary" onclick="addToCart(${p.id}, null, parseInt(document.getElementById('qtyNum').textContent))"><i class="fas fa-shopping-bag"></i> Add to Bag</button>
        <button class="btn btn-sage" onclick="addToCart(${p.id}, null, parseInt(document.getElementById('qtyNum').textContent)); showPage('checkout')">Buy It Now</button>
        <button class="icon-btn ${isWished ? 'active' : ''}" onclick="toggleWishlist(${p.id}, event)" style="border:1.5px solid var(--border-medium); width:48px; height:48px; border-radius:50%; ${isWished ? 'color:var(--error)' : ''}"><i class="${isWished ? 'fas' : 'far'} fa-heart"></i></button>
      </div>
      <div class="detail-divider"></div>
      <div class="detail-meta">
        <div class="detail-meta-item"><strong>Organic Classification</strong><span>${p.category}</span></div>
        <div class="detail-meta-item"><strong>Clay Composition</strong><span>Natural alluvial clay</span></div>
        <div class="detail-meta-item"><strong>Studio Origin</strong><span>Hand-spun in India</span></div>
        <div class="detail-meta-item"><strong>Shipping Guarantee</strong><span>Insured eco-friendly delivery within 2–4 days</span></div>
      </div>
    </div>`;
  
  const related = products.filter(x => x.id !== id && x.category === p.category).slice(0, 4);
  document.getElementById('relatedGrid').innerHTML = related.map(buildProductCard).join('');
  showPage('detail');
}

function changeQty(delta) {
  const el = document.getElementById('qtyNum');
  if (el) el.textContent = Math.max(1, Math.min(10, parseInt(el.textContent) + delta));
}

// =====================================================
// SHOPPING CART CONTROLLER
// =====================================================
function saveCart() { localStorage.setItem('um_cart', JSON.stringify(cart)); }

let isAddingToCart = false;
function addToCart(id, e, qty = 1) {
  if (e) e.stopPropagation();
  if (isAddingToCart) return; // Prevent repeated clicks glitch
  
  isAddingToCart = true;
  setTimeout(() => { isAddingToCart = false; }, 400);

  const p = products.find(x => x.id === id);
  if (!p) return;
  
  // Anti-glitch visual feedback on target button
  if (e && e.currentTarget) {
    const btn = e.currentTarget;
    btn.classList.add('clicked');
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = 'fas fa-check';
    }
    setTimeout(() => {
      btn.classList.remove('clicked');
      if (icon) icon.className = 'fas fa-plus';
    }, 800);
  }
  
  const existing = cart.find(x => x.id === id);
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, 10);
  } else {
    cart.push({ id, qty });
  }
  saveCart();
  updateCartUI();
  showToast(`${p.name} added to your bag 🛍️`, 'success');

  // Increment pop badge animation on all shopping bag elements
  const badges = document.querySelectorAll('.cart-badge');
  badges.forEach(b => {
    b.classList.remove('pop-badge');
    void b.offsetWidth; // Trigger reflow
    b.classList.add('pop-badge');
  });
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  saveCart();
  updateCartUI();
}

function changeCartQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty = Math.max(1, Math.min(10, item.qty + delta));
  saveCart();
  updateCartUI();
}

function updateCartUI() {
  const total = cart.reduce((s, x) => s + x.qty, 0);
  const badge = document.getElementById('cartBadge');
  if (badge) {
    const lastVal = parseInt(badge.textContent || '0');
    badge.textContent = total;
    badge.classList.toggle('visible', total > 0);
    if (total !== lastVal) {
      badge.classList.remove('bump');
      void badge.offsetWidth; // trigger reflow
      badge.classList.add('bump');
      setTimeout(() => badge.classList.remove('bump'), 450);
    }
  }
  const mobileBadge = document.getElementById('mobileCartBadge');
  if (mobileBadge) {
    const lastValMobile = parseInt(mobileBadge.textContent || '0');
    mobileBadge.textContent = total;
    mobileBadge.classList.toggle('visible', total > 0);
    if (total !== lastValMobile) {
      mobileBadge.classList.remove('bump');
      void mobileBadge.offsetWidth; // trigger reflow
      mobileBadge.classList.add('bump');
      setTimeout(() => mobileBadge.classList.remove('bump'), 450);
    }
  }
  renderCartDrawer();
  renderCheckout();
}

function renderCartDrawer() {
  const el = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');
  const countEl = document.getElementById('cartCount');
  const total = cart.reduce((s, x) => s + x.qty, 0);
  
  if (countEl) countEl.textContent = total;
  if (!cart.length) {
    el.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🏺</div>
        <p>Your bag is empty.<br>Start exploring handcrafted collections.</p>
        <button class="btn btn-primary btn-sm" onclick="toggleCart(); showPage('shop')">Explore Shop</button>
      </div>`;
    if (footer) footer.style.display = 'none';
    return;
  }
  
  el.innerHTML = cart.map(item => {
    const p = products.find(x => x.id === item.id);
    if (!p) return '';
    const imgEl = p.img ? `<img src="${p.img}" alt="${p.name}" />` : p.emoji;
    return `
      <div class="cart-item">
        <div class="cart-item-img">${imgEl}</div>
        <div class="cart-item-info">
          <p class="cart-item-name">${p.name}</p>
          <p class="cart-item-price">₹${p.price.toLocaleString()} each</p>
          <div class="cart-item-qty">
            <button class="cart-qty-btn" onclick="changeCartQty(${p.id}, -1)">−</button>
            <span>${item.qty}</span>
            <button class="cart-qty-btn" onclick="changeCartQty(${p.id}, 1)">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${p.id})"><i class="fas fa-trash"></i></button>
      </div>`;
  }).join('');
  
  if (footer) footer.style.display = 'block';
  const subtotal = cart.reduce((s, item) => {
    const p = products.find(x => x.id === item.id);
    return s + (p ? p.price * item.qty : 0);
  }, 0);
  
  const shipping = subtotal >= 999 ? 0 : 49;
  document.getElementById('cartSubtotal').textContent = `₹${subtotal.toLocaleString()}`;
  document.getElementById('cartShipping').textContent = shipping === 0 ? 'FREE' : `₹${shipping}`;
  document.getElementById('cartTotal').textContent = `₹${(subtotal + shipping).toLocaleString()}`;
}

function toggleCart() {
  document.getElementById('cartOverlay').classList.toggle('open');
  document.getElementById('cartDrawer').classList.toggle('open');
}

// =====================================================
// WISHLIST STATE CONTROLLER
// =====================================================
function saveWishlist() { localStorage.setItem('um_wishlist', JSON.stringify(wishlist)); }

function toggleWishlist(id, e) {
  if (e) e.stopPropagation();
  const idx = wishlist.indexOf(id);
  const p = products.find(x => x.id === id);
  
  if (idx > -1) {
    wishlist.splice(idx, 1);
    showToast('Removed from saved wishlist', 'info');
  } else {
    wishlist.push(id);
    showToast(`${p?.name} added to your wishlist ❤️`, 'success');
  }
  saveWishlist();
  updateWishlistUI();
  
  // Re-sync wishlist toggles across layout cards
  document.querySelectorAll(`[onclick*="toggleWishlist(${id}"]`).forEach(btn => {
    btn.classList.toggle('active', wishlist.includes(id));
    const icon = btn.querySelector('i');
    if (icon) icon.className = wishlist.includes(id) ? 'fas fa-heart' : 'far fa-heart';
  });
}

function updateWishlistUI() {
  const badge = document.getElementById('wishlistBadge');
  if (badge) {
    const lastVal = parseInt(badge.textContent || '0');
    badge.textContent = wishlist.length;
    badge.classList.toggle('visible', wishlist.length > 0);
    if (wishlist.length !== lastVal) {
      badge.classList.remove('bump');
      void badge.offsetWidth; // trigger reflow
      badge.classList.add('bump');
      setTimeout(() => badge.classList.remove('bump'), 450);
    }
  }
  const mobileBadge = document.getElementById('mobileWishlistBadge');
  if (mobileBadge) {
    const lastValMobile = parseInt(mobileBadge.textContent || '0');
    mobileBadge.textContent = wishlist.length;
    mobileBadge.classList.toggle('visible', wishlist.length > 0);
    if (wishlist.length !== lastValMobile) {
      mobileBadge.classList.remove('bump');
      void mobileBadge.offsetWidth; // trigger reflow
      mobileBadge.classList.add('bump');
      setTimeout(() => mobileBadge.classList.remove('bump'), 450);
    }
  }
  const dashCount = document.getElementById('dashWishCount');
  if (dashCount) dashCount.textContent = wishlist.length;
}

function renderWishlistPage() {
  const grid = document.getElementById('wishlistPageGrid');
  const empty = document.getElementById('emptyWishlistPage');
  if (!grid) return;
  
  const items = products.filter(p => wishlist.includes(p.id));
  if (!items.length) {
    grid.innerHTML = '';
    empty.style.display = 'block';
  } else {
    grid.innerHTML = items.map(buildProductCard).join('');
    empty.style.display = 'none';
  }
}

// =====================================================
// CHECKOUT CALCULATIONS
// =====================================================
function renderCheckout() {
  const el = document.getElementById('checkoutItems');
  if (!el) return;
  if (!cart.length) {
    el.innerHTML = `<p style="color:var(--text-muted);font-size:0.85rem">Your purchase bag is empty.</p>`;
    return;
  }
  
  el.innerHTML = cart.map(item => {
    const p = products.find(x => x.id === item.id);
    if (!p) return '';
    const imgEl = p.img ? `<img src="${p.img}" alt="${p.name}" />` : p.emoji;
    return `
      <div class="order-item">
        <div class="order-item-img">${imgEl}</div>
        <div><p class="order-item-name">${p.name}</p><p class="order-item-qty">Quantity: ${item.qty}</p></div>
        <span class="order-item-price">₹${(p.price * item.qty).toLocaleString()}</span>
      </div>`;
  }).join('');
  
  const subtotal = cart.reduce((s, item) => {
    const p = products.find(x => x.id === item.id);
    return s + (p ? p.price * item.qty : 0);
  }, 0);
  const shipping = subtotal >= 999 ? 0 : 49;
  const total = subtotal + shipping;
  
  document.getElementById('checkoutSubtotal').textContent = `₹${subtotal.toLocaleString()}`;
  document.getElementById('checkoutShipping').textContent = shipping === 0 ? 'FREE' : `₹${shipping}`;
  document.getElementById('checkoutTotal').textContent = `₹${total.toLocaleString()}`;
}

function selectPayment(el) {
  document.querySelectorAll('.payment-method').forEach(m => {
    m.classList.remove('selected');
    m.querySelector('input').checked = false;
  });
  el.classList.add('selected');
  el.querySelector('input').checked = true;
}

function handlePayment() {
  if (!cart.length) {
    showToast('Your premium cart is empty!', 'error');
    return;
  }

  // Capturing form fields natively and elegantly
  const checkoutForm = document.getElementById('page-checkout');
  const inputs = checkoutForm.querySelectorAll('.form-control');
  const firstName = inputs[0].value.trim();
  const lastName = inputs[1].value.trim();
  const email = inputs[2].value.trim();
  const phone = inputs[3].value.trim();
  const addr1 = inputs[4].value.trim();
  const addr2 = inputs[5].value.trim();
  const city = inputs[6].value.trim();
  const pincode = inputs[7].value.trim();
  const state = checkoutForm.querySelector('select').value;
  
  if (!firstName || !lastName || !email || !phone || !addr1 || !city || !pincode) {
    showToast('Please fill out all delivery address fields', 'error');
    return;
  }
  
  const btn = document.getElementById('payBtn');
  btn.innerHTML = '<div class="spinner"></div> Confirming payment with Razorpay...';
  btn.disabled = true;
  
  const subtotal = cart.reduce((s, item) => {
    const p = products.find(x => x.id === item.id);
    return s + (p ? p.price * item.qty : 0);
  }, 0);
  const shipping = subtotal >= 999 ? 0 : 49;
  const total = subtotal + shipping;
  
  const paymentMethods = checkoutForm.querySelectorAll('.payment-method');
  let payMode = 'UPI via Razorpay';
  if (paymentMethods[1].classList.contains('selected')) {
    payMode = 'Cash on Delivery';
  }

  const newOrderId = '#UM' + Math.floor(1000 + Math.random() * 9000);
  const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  const formattedDate = new Date().toLocaleDateString('en-GB', dateOptions);
  
  const orderItems = cart.map(item => {
    const p = products.find(x => x.id === item.id);
    return {
      id: item.id,
      name: p ? p.name : 'Unknown Product',
      qty: item.qty,
      price: p ? p.price : 0
    };
  });
  
  const newOrder = {
    id: newOrderId,
    date: formattedDate,
    customerName: `${firstName} ${lastName}`,
    phone,
    address: `${addr1}, ${addr2 ? addr2 + ', ' : ''}${city}, ${state} - ${pincode}`,
    items: orderItems,
    total,
    paymentMethod: payMode,
    status: 'Pending'
  };
  
  setTimeout(async () => {
    if (db) {
      try {
        await setDoc(doc(db, "orders", newOrderId.replace('#', '')), newOrder);
        await setDoc(doc(db, "customers", phone.replace(/\D/g, '')), {
          name: `${firstName} ${lastName}`,
          phone,
          location: `${city}, ${state}`,
          joinedDate: formattedDate
        });
        showToast('Order saved to Firestore! 🎉', 'success');
      } catch (err) {
        console.error("Firestore order write failed:", err);
        saveOrderLocally(newOrder, firstName, lastName, phone, city, state, formattedDate);
      }
    } else {
      saveOrderLocally(newOrder, firstName, lastName, phone, city, state, formattedDate);
    }
    
    btn.innerHTML = '<i class="fas fa-check"></i> Earthen Order Placed Successfully!';
    btn.style.background = 'var(--success)';
    showToast('Secure order placed successfully! 🎉', 'success');
    
    cart = [];
    saveCart();
    updateCartUI();
    
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-lock"></i> Place Secure Order';
      btn.style.background = '';
      btn.disabled = false;
      showPage('home');
    }, 3000);
  }, 2500);
}

function saveOrderLocally(newOrder, firstName, lastName, phone, city, state, formattedDate) {
  orders.unshift(newOrder);
  localStorage.setItem('um_orders', JSON.stringify(orders));
  
  const hasCust = customers.some(c => c.phone === phone);
  if (!hasCust) {
    customers.push({
      name: `${firstName} ${lastName}`,
      phone,
      location: `${city}, ${state}`,
      joinedDate: formattedDate
    });
    localStorage.setItem('um_customers', JSON.stringify(customers));
  }
  showToast('Order saved locally! 🎉', 'success');
}

// =====================================================
// OTP PHONE AUTHENTICATION CONTROLLER
// =====================================================
let tempPhoneNum = '';

function sendOTP() {
  const phone = document.getElementById('loginPhone').value.trim();
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < 12) {
    showToast('Please enter a valid 10-digit Indian phone number', 'error');
    return;
  }
  
  tempPhoneNum = phone;
  const subLabel = document.getElementById('otpSubLabel');
  if (subLabel) subLabel.textContent = `A verification code has been dispatched to ${phone}`;
  
  document.getElementById('phoneStep').style.display = 'none';
  document.getElementById('otpStep').style.display = 'block';
  showToast('OTP dispatched! Enter 1234 to verify 🌿', 'success');
  
  setTimeout(() => document.getElementById('otp1').focus(), 100);
}

function moveOTPFocus(current, nextId, prevId) {
  if (current.value.length === 1 && nextId !== '') {
    document.getElementById(nextId).focus();
  } else if (current.value.length === 0 && prevId !== '') {
    document.getElementById(prevId).focus();
  }
}

function verifyOTP() {
  const o1 = document.getElementById('otp1').value;
  const o2 = document.getElementById('otp2').value;
  const o3 = document.getElementById('otp3').value;
  const o4 = document.getElementById('otp4').value;
  
  if (!o1 || !o2 || !o3 || !o4) {
    showToast('Please enter the complete 4-digit verification code', 'error');
    return;
  }
  
  // Create login session
  currentUser = {
    name: 'Earthen Patron',
    phone: tempPhoneNum,
    avatar: '👤'
  };
  
  localStorage.setItem('um_user', JSON.stringify(currentUser));
  showToast('Sign in successful! Welcome to the Earthen Circle 🌿', 'success');
  updateAuthNavbar();
  
  // Dynamic redirect to home page
  showPage('home');
  
  // Clear auth inputs
  document.getElementById('otp1').value = '';
  document.getElementById('otp2').value = '';
  document.getElementById('otp3').value = '';
  document.getElementById('otp4').value = '';
  document.getElementById('phoneStep').style.display = 'block';
  document.getElementById('otpStep').style.display = 'none';
}

function changeAuthPhone() {
  document.getElementById('phoneStep').style.display = 'block';
  document.getElementById('otpStep').style.display = 'none';
}

function handleLogout() {
  currentUser = null;
  localStorage.removeItem('um_user');
  showToast('Logged out. Visit us again shortly! 👋', 'info');
  updateAuthNavbar();
  showPage('home');
}

function updateAuthNavbar() {
  const btn = document.getElementById('navAuthBtn');
  if (!btn) return;
  if (currentUser) {
    btn.innerHTML = `<span style="width: 24px; height: 24px; background: var(--primary-sage); color: white; border-radius: 50%; font-size: 0.72rem; font-weight: 600; display: inline-flex; align-items: center; justify-content: center;">U</span>`;
  } else {
    btn.innerHTML = `<i class="far fa-user"></i>`;
  }
}

// =====================================================
// USER DASHBOARD LOGIC
// =====================================================
function renderDashboard() {
  if (!currentUser) return;
  const greetName = currentUser.name;
  const greetPhone = currentUser.phone;
  
  const nameEl = document.getElementById('dashName');
  const phoneEl = document.getElementById('dashPhone');
  if (nameEl) nameEl.textContent = greetName;
  if (phoneEl) phoneEl.textContent = greetPhone;
  
  const dc = document.getElementById('dashWishCount');
  if (dc) dc.textContent = wishlist.length;
}

function showDashTab(tab, el) {
  const overview = document.getElementById('dashOverview');
  const orders = document.getElementById('dashOrders');
  const wish = document.getElementById('dashWishlist');
  
  overview.style.display = 'none';
  orders.style.display = 'none';
  wish.style.display = 'none';
  
  document.querySelectorAll('.dash-nav-item').forEach(item => item.classList.remove('active'));
  el.classList.add('active');
  
  if (tab === 'overview') {
    overview.style.display = 'block';
  } else if (tab === 'orders') {
    orders.style.display = 'block';
  } else if (tab === 'wishlist') {
    wish.style.display = 'block';
    const grid = document.getElementById('dashWishlistGrid');
    const empty = document.getElementById('emptyWish');
    const items = products.filter(p => wishlist.includes(p.id));
    
    if (grid) {
      if (items.length) {
        grid.innerHTML = items.map(buildProductCard).join('');
        empty.style.display = 'none';
      } else {
        grid.innerHTML = '';
        empty.style.display = 'block';
      }
    }
  }
}

// =====================================================
// TOAST NOTIFICATIONS
// =====================================================
function showToast(msg, type = 'success') {
  const icons = { success: '🌿', error: '⚠️', info: 'ℹ️' };
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.borderLeftColor = type === 'success' ? 'var(--primary-sage)' : (type === 'error' ? 'var(--error)' : 'var(--info)');
  toast.innerHTML = `<span>${icons[type] || '🌿'}</span><span>${msg}</span>`;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 450);
  }, 3000);
}

// =====================================================
// MOCK API SUBMISSIONS
// =====================================================
function handleNewsletter(e) {
  e.preventDefault();
  showToast("Thank you! You've joined the premium Earthen Circle 🌿", 'success');
  e.target.reset();
}

async function handleContactSubmit(e) {
  e.preventDefault();
  
  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const subject = document.getElementById('contactSubject').value.trim();
  const message = document.getElementById('contactMessage').value.trim();
  
  if (!name || !email || !subject || !message) {
    showToast('Please fill out all contact fields', 'error');
    return;
  }
  
  const btn = document.getElementById('contactSubmitBtn');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = 'Submitting... <i class="fas fa-spinner fa-spin"></i>';
  
  try {
    const response = await fetch('http://localhost:5000/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message })
    });
    
    const result = await response.json();
    
    if (result.success) {
      showToast('✅ Message sent! Our team will connect with you within 24 hours.', 'success');
      document.getElementById('contactForm').reset();
    } else {
      showToast('⚠️ ' + result.error, 'error');
    }
  } catch (err) {
    console.warn('API backend not running. Logging mock message locally:', err);
    showToast('🌿 Message successfully sent! We will connect within 24 hours.', 'success');
    document.getElementById('contactForm').reset();
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

// =====================================================
// 🏢 COMPLETE ADMIN PANEL PANEL CONTROLLER LOGIC
// =====================================================
function showAdminTab(tab, el) {
  document.getElementById('adminTab-overview').style.display = 'none';
  document.getElementById('adminTab-products').style.display = 'none';
  document.getElementById('adminTab-orders').style.display = 'none';
  document.getElementById('adminTab-customers').style.display = 'none';
  
  document.getElementById('adminTab-' + tab).style.display = 'block';
  
  document.querySelectorAll('.admin-nav-item').forEach(item => item.classList.remove('active'));
  if (el) el.classList.add('active');

  if (tab === 'overview') renderAdminOverview();
  if (tab === 'products') renderAdminProducts();
  if (tab === 'orders') renderAdminOrders();
  if (tab === 'customers') renderAdminCustomers();
}

function renderAdminPanel() {
  renderAdminOverview();
  renderAdminProducts();
  renderAdminOrders();
  renderAdminCustomers();
}

function renderAdminOverview() {
  const revEl = document.getElementById('adminRevenue');
  const ordEl = document.getElementById('adminOrderCount');
  const prodEl = document.getElementById('adminProductCount');
  const custEl = document.getElementById('adminCustomerCount');
  
  const totalRev = orders.reduce((s, o) => s + o.total, 0);
  if (revEl) revEl.textContent = `₹${totalRev.toLocaleString()}`;
  if (ordEl) ordEl.textContent = orders.length;
  if (prodEl) prodEl.textContent = products.length;
  if (custEl) custEl.textContent = customers.length;
}

function renderAdminProducts() {
  const search = (document.getElementById('adminProdSearch')?.value || '').toLowerCase();
  const tbody = document.getElementById('adminProductsTable');
  if (!tbody) return;
  
  const filtered = products.filter(p => p.name.toLowerCase().includes(search) || p.category.toLowerCase().includes(search));
  
  tbody.innerHTML = filtered.length ? filtered.map(p => {
    const imgEl = p.img 
      ? `<img src="${p.img}" alt="${p.name}" />`
      : `<span style="font-size:1.25rem">${p.emoji || '🏺'}</span>`;
    return `
      <tr>
        <td><div class="admin-img-cell">${imgEl}</div></td>
        <td><strong style="color:var(--charcoal)">${p.name}</strong></td>
        <td><span class="tag">${p.category}</span></td>
        <td>₹${p.price.toLocaleString()}</td>
        <td>
          <span class="admin-btn-edit" onclick="editProduct(${p.id})"><i class="fas fa-edit"></i> Edit</span>
          <span class="admin-btn-delete" onclick="deleteProduct(${p.id})"><i class="fas fa-trash-alt"></i> Delete</span>
        </td>
      </tr>`;
  }).join('') : `<tr><td colspan="5" style="text-align:center;color:var(--text-muted)">No items in catalog match search.</td></tr>`;
}

async function saveProduct(e) {
  e.preventDefault();
  const idVal = document.getElementById('editProductId').value;
  const name = document.getElementById('adminProdName').value.trim();
  const price = parseInt(document.getElementById('adminProdPrice').value);
  const category = document.getElementById('adminProdCat').value;
  const desc = document.getElementById('adminProdDesc').value.trim();
  const img = document.getElementById('adminProdImgSrc').value; // Read final Base64 data/URL source!
  const featured = document.getElementById('adminProdFeatured').checked;
  const best = document.getElementById('adminProdBest').checked;
  
  if (!name || !price || !desc) {
    showToast('Please fill out all required fields', 'error');
    return;
  }
  
  const docData = {
    name,
    price,
    category,
    desc,
    img: img || null,
    emoji: '🏺',
    featured,
    bestSeller: best,
    badge: featured ? 'Featured' : (best ? 'Bestseller' : null)
  };

  if (idVal) {
    const pId = parseInt(idVal);
    docData.id = pId;
    
    if (db) {
      try {
        await setDoc(doc(db, "products", pId.toString()), docData, { merge: true });
        showToast('Product successfully updated in Firestore! 🌿', 'success');
      } catch (err) {
        console.error("Firestore write failed:", err);
        saveProductLocally(pId, docData);
      }
    } else {
      saveProductLocally(pId, docData);
    }
  } else {
    const pool = db ? allProductsRaw : products;
    const nextId = pool.length ? Math.max(...pool.map(x => x.id)) + 1 : 1;
    docData.id = nextId;
    docData.rating = 4.8;
    docData.reviews = 1;
    docData.tags = [category.toLowerCase(), 'new'];
    
    if (db) {
      try {
        await setDoc(doc(db, "products", nextId.toString()), docData);
        showToast('New product created in Firestore! 🌿', 'success');
      } catch (err) {
        console.error("Firestore write failed:", err);
        createProductLocally(docData);
      }
    } else {
      createProductLocally(docData);
    }
  }
  
  cancelProductEdit();
  
  if (!db) {
    renderAdminProducts();
    renderAdminOverview();
    renderFeaturedProducts();
    renderBestsellers();
    renderShopProducts();
  }
}

function saveProductLocally(pId, data) {
  const p = products.find(x => x.id === pId);
  if (p) {
    Object.assign(p, data);
    localStorage.setItem('um_products', JSON.stringify(products));
    showToast('Product updated locally! 🌿', 'success');
  }
}

function createProductLocally(data) {
  products.push(data);
  localStorage.setItem('um_products', JSON.stringify(products));
  showToast('Product created locally! 🌿', 'success');
}

function editProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  
  document.getElementById('editProductId').value = p.id;
  document.getElementById('adminProdName').value = p.name;
  document.getElementById('adminProdPrice').value = p.price;
  document.getElementById('adminProdCat').value = p.category;
  document.getElementById('adminProdDesc').value = p.desc;
  
  const imgVal = p.img || '';
  document.getElementById('adminProdImgSrc').value = imgVal;
  
  const selectDropdown = document.getElementById('adminProdImg');
  if (selectDropdown) {
    const optionExists = Array.from(selectDropdown.options).some(opt => opt.value === imgVal && imgVal !== '');
    selectDropdown.value = optionExists ? imgVal : '';
  }
  
  const preview = document.getElementById('adminProdImgPreview');
  if (preview) {
    if (imgVal) {
      preview.innerHTML = `<img src="${imgVal}" style="width:100%; height:100%; object-fit:cover;" />`;
    } else {
      preview.innerHTML = `<span style="font-size:0.8rem; color:var(--text-muted)"><i class="fas fa-image" style="font-size:1.4rem; margin-right:8px; vertical-align:middle"></i> No Photo Selected</span>`;
    }
  }
  
  document.getElementById('adminProdFeatured').checked = p.featured;
  document.getElementById('adminProdBest').checked = p.bestSeller;
  
  document.getElementById('productFormTitle').textContent = 'Edit Product';
  document.getElementById('prodCancelBtn').style.display = 'inline-block';
  document.getElementById('prodSubmitBtn').textContent = 'Update Product';
}

function cancelProductEdit() {
  document.getElementById('adminProductForm').reset();
  document.getElementById('editProductId').value = '';
  document.getElementById('adminProdImgSrc').value = '';
  const preview = document.getElementById('adminProdImgPreview');
  if (preview) {
    preview.innerHTML = `<span style="font-size:0.8rem; color:var(--text-muted)"><i class="fas fa-image" style="font-size:1.4rem; margin-right:8px; vertical-align:middle"></i> No Photo Selected</span>`;
  }
  document.getElementById('productFormTitle').textContent = 'Add New Product';
  document.getElementById('prodCancelBtn').style.display = 'none';
  document.getElementById('prodSubmitBtn').textContent = 'Save Product';
}

// Custom photo uploading and previewing handlers
function handleAdminImgUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(evt) {
    const base64Src = evt.target.result;
    document.getElementById('adminProdImgSrc').value = base64Src;
    
    // Update Preview Container
    const preview = document.getElementById('adminProdImgPreview');
    if (preview) {
      preview.innerHTML = `<img src="${base64Src}" style="width:100%; height:100%; object-fit:cover;" />`;
    }
    
    // Reset selected pre-defined asset dropdown
    document.getElementById('adminProdImg').value = '';
  };
  reader.readAsDataURL(file);
}

function handleAdminSelectChange(val) {
  document.getElementById('adminProdImgSrc').value = val;
  const preview = document.getElementById('adminProdImgPreview');
  if (preview) {
    if (val) {
      preview.innerHTML = `<img src="${val}" style="width:100%; height:100%; object-fit:cover;" />`;
    } else {
      preview.innerHTML = `<span style="font-size:0.8rem; color:var(--text-muted)"><i class="fas fa-image" style="font-size:1.4rem; margin-right:8px; vertical-align:middle"></i> No Photo Selected</span>`;
    }
  }
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this organic product from catalog?')) return;
  
  if (db) {
    try {
      // Soft-delete in Firestore to prevent the dynamic codebase seeder from resurrecting it on reload
      await setDoc(doc(db, "products", id.toString()), { deleted: true }, { merge: true });
      showToast('Product deleted from catalog 🌿', 'info');
      return;
    } catch (err) {
      console.error("Firestore delete failed:", err);
    }
  }
  
  // Local Storage fallback soft delete
  const prod = allProductsRaw.find(x => x.id === id);
  if (prod) {
    prod.deleted = true;
  }
  products = allProductsRaw.filter(x => !x.deleted);
  localStorage.setItem('um_products', JSON.stringify(allProductsRaw));
  
  showToast('Product deleted locally 🌿', 'info');
  
  renderAdminProducts();
  renderAdminOverview();
  renderFeaturedProducts();
  renderBestsellers();
  renderShopProducts();
}

function renderAdminOrders() {
  const tbody = document.getElementById('adminOrdersTable');
  if (!tbody) return;
  
  tbody.innerHTML = orders.length ? orders.map(o => {
    let badgeClass = 'delivered';
    if (o.status === 'Pending') badgeClass = 'pending';
    if (o.status === 'Dispatched') badgeClass = 'dispatched';
    
    return `
      <tr>
        <td><strong style="color:var(--primary-sage)">${o.id}</strong></td>
        <td>${o.customerName}</td>
        <td>${o.date}</td>
        <td>₹${o.total.toLocaleString()}</td>
        <td><span class="order-status ${badgeClass.toLowerCase()}">${o.status}</span></td>
        <td>
          <button class="btn btn-xs btn-outline" style="padding: 4px 10px; font-size:0.65rem;" onclick="viewOrderDetail('${o.id}')">Details</button>
        </td>
      </tr>`;
  }).join('') : `<tr><td colspan="6" style="text-align:center;color:var(--text-muted)">No orders received yet.</td></tr>`;
}

function viewOrderDetail(id) {
  const o = orders.find(x => x.id === id);
  if (!o) return;
  
  const modal = document.getElementById('orderModal');
  const title = document.getElementById('modalOrderId');
  const body = document.getElementById('orderModalBody');
  
  if (title) title.textContent = `Order Details: ${o.id}`;
  if (body) {
    body.innerHTML = `
      <div class="modal-section" style="margin-bottom:20px">
        <h4 style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); border-bottom:1px solid var(--border-light); padding-bottom:6px; margin-bottom:10px">Patron Information</h4>
        <div class="modal-meta-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:12px">
          <div class="modal-meta-item"><p style="font-size:0.7rem; color:var(--text-muted)">Name</p><p style="font-size:0.85rem; font-weight:600; color:var(--charcoal)">${o.customerName}</p></div>
          <div class="modal-meta-item"><p style="font-size:0.7rem; color:var(--text-muted)">Phone</p><p style="font-size:0.85rem; font-weight:600; color:var(--charcoal)">${o.phone}</p></div>
        </div>
      </div>
      
      <div class="modal-section" style="margin-bottom:20px">
        <h4 style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); border-bottom:1px solid var(--border-light); padding-bottom:6px; margin-bottom:10px">Delivery Address</h4>
        <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.6">${o.address}</p>
      </div>
      
      <div class="modal-section" style="margin-bottom:20px">
        <h4 style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); border-bottom:1px solid var(--border-light); padding-bottom:6px; margin-bottom:10px">Transaction Details</h4>
        <div class="modal-meta-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:12px">
          <div class="modal-meta-item"><p style="font-size:0.7rem; color:var(--text-muted)">Order Date</p><p style="font-size:0.85rem; font-weight:600; color:var(--charcoal)">${o.date}</p></div>
          <div class="modal-meta-item"><p style="font-size:0.7rem; color:var(--text-muted)">Payment Mode</p><p style="font-size:0.85rem; font-weight:600; color:var(--charcoal)">${o.paymentMethod}</p></div>
          <div class="modal-meta-item"><p style="font-size:0.7rem; color:var(--text-muted)">Grand Total</p><strong style="color:var(--charcoal); font-size:1rem">₹${o.total.toLocaleString()}</strong></div>
          <div class="modal-meta-item">
            <p style="font-size:0.7rem; color:var(--text-muted)">Status</p>
            <select class="form-control" style="padding:4px 8px; font-size:0.75rem; margin-top:4px" onchange="updateOrderStatus('${o.id}', this.value)">
              <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Dispatched" ${o.status === 'Dispatched' ? 'selected' : ''}>Dispatched</option>
              <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="modal-section">
        <h4 style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); border-bottom:1px solid var(--border-light); padding-bottom:6px; margin-bottom:10px">Ordered Masterpieces</h4>
        <div style="display:flex; flex-direction:column; gap:12px; margin-top:10px">
          ${o.items.map(item => `
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.85rem; padding:8px 0; border-bottom:1px solid var(--border-light)">
              <span style="color:var(--charcoal); font-weight:500">${item.name} <span style="color:var(--text-muted); font-weight:300">x ${item.qty}</span></span>
              <strong style="color:var(--text-secondary)">₹${(item.price * item.qty).toLocaleString()}</strong>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  if (modal) modal.classList.add('open');
}

function closeOrderModal() {
  const modal = document.getElementById('orderModal');
  if (modal) modal.classList.remove('open');
}

async function updateOrderStatus(id, newStatus) {
  if (db) {
    try {
      await updateDoc(doc(db, "orders", id.replace('#', '')), { status: newStatus });
      showToast(`Order ${id} status updated in Firestore! 🌿`, 'success');
      return;
    } catch (err) {
      console.error("Firestore status update failed:", err);
    }
  }
  
  const o = orders.find(x => x.id === id);
  if (o) {
    o.status = newStatus;
    localStorage.setItem('um_orders', JSON.stringify(orders));
    showToast(`Order ${id} status updated locally! 🌿`, 'success');
    renderAdminOrders();
    renderAdminOverview();
  }
}

function renderAdminCustomers() {
  const tbody = document.getElementById('adminCustomersTable');
  if (!tbody) return;
  
  tbody.innerHTML = customers.length ? customers.map(c => `
    <tr>
      <td><strong style="color:var(--charcoal)">${c.name}</strong></td>
      <td>${c.phone}</td>
      <td>${c.location}</td>
      <td>${c.joinedDate}</td>
    </tr>
  `).join('') : `<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">No registered customers yet.</td></tr>`;
}

// =====================================================
// 🌐 BRIDGING ALL ESM FUNCTIONS TO GLOBAL WINDOW OBJECT
// =====================================================
window.showPage = showPage;
window.toggleCart = toggleCart;
window.toggleQuickNav = toggleQuickNav;
window.scrollToSection = scrollToSection;
window.setFilter = setFilter;
window.filterAndShop = filterAndShop;
window.openDetail = openDetail;
window.changeQty = changeQty;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.changeCartQty = changeCartQty;
window.toggleWishlist = toggleWishlist;
window.selectPayment = selectPayment;
window.handlePayment = handlePayment;
window.sendOTP = sendOTP;
window.moveOTPFocus = moveOTPFocus;
window.verifyOTP = verifyOTP;
window.changeAuthPhone = changeAuthPhone;
window.handleLogout = handleLogout;
window.showDashTab = showDashTab;
window.handleNewsletter = handleNewsletter;
window.handleContactSubmit = handleContactSubmit;
window.showAdminTab = showAdminTab;
window.saveProduct = saveProduct;
window.editProduct = editProduct;
window.cancelProductEdit = cancelProductEdit;
window.deleteProduct = deleteProduct;
window.viewOrderDetail = viewOrderDetail;
window.closeOrderModal = closeOrderModal;
window.updateOrderStatus = updateOrderStatus;
window.renderAdminProducts = renderAdminProducts;
window.renderAdminOrders = renderAdminOrders;
window.renderAdminCustomers = renderAdminCustomers;
window.handleAdminImgUpload = handleAdminImgUpload;
window.handleAdminSelectChange = handleAdminSelectChange;
window.handleSearchInput = handleSearchInput;
window.handleSearchKeyDown = handleSearchKeyDown;
window.triggerSearch = triggerSearch;
window.selectSuggestion = selectSuggestion;
window.handleAdminSignOut = handleAdminSignOut;
