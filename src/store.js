// Akses localStorage dan satu sumber data aplikasi. Sumber: SPEC.md §4.3, §4.4, N-10.

import { GEAR_SEED, CONFIG_DEFAULT, CARTS_KOSONG } from './products.js';

export const STORAGE_KEYS = {
  gear: 'maruemgear:v1:gear',
  orders: 'maruemgear:v1:orders',
  cart: 'maruemgear:v1:cart',
  config: 'maruemgear:v1:config',
  meta: 'maruemgear:v1:meta',
};

const salin = (nilai) => JSON.parse(JSON.stringify(nilai));
const WA_PLACEHOLDER_LAMA = '6280000000000';
const state = { gear: [], orders: [], cart: CARTS_KOSONG(), config: salin(CONFIG_DEFAULT), meta: {}, rusak: false };

// Migrasi konfigurasi lama: placeholder diganti nomor admin saat ini.
// Nomor yang sudah diubah pengguna lewat dashboard tidak ditimpa.
function normalisasiConfig(config) {
  const hasil = { ...salin(CONFIG_DEFAULT), ...(config || {}) };
  const nomor = String(hasil.whatsappAdmin ?? '').replace(/[^\d]/g, '');
  hasil.whatsappAdmin = !nomor || nomor === WA_PLACEHOLDER_LAMA ? CONFIG_DEFAULT.whatsappAdmin : nomor;
  return hasil;
}

function dataAwal() {
  return {
    gear: salin(GEAR_SEED),
    orders: [],
    cart: CARTS_KOSONG(),
    config: salin(CONFIG_DEFAULT),
    meta: { versi: 1, tanggalSeed: new Date().toLocaleDateString('id-ID') },
  };
}

function bacaKunci(kunci) {
  const mentah = localStorage.getItem(kunci);
  if (mentah === null) return { ada: false, nilai: null };
  try {
    return { ada: true, nilai: JSON.parse(mentah) };
  } catch {
    return { ada: true, nilai: null, rusak: true };
  }
}

export function getState() {
  return state;
}

export function loadState() {
  state.rusak = false;
  try {
    const hasil = Object.fromEntries(Object.entries(STORAGE_KEYS).map(([nama, kunci]) => [nama, bacaKunci(kunci)]));
    const semuaKosong = Object.values(hasil).every((h) => !h.ada);
    if (semuaKosong) {
      Object.assign(state, dataAwal());
      simpanSemua();
      return state;
    }
    if (Object.values(hasil).some((h) => h.rusak || (h.ada && h.nilai === null))) {
      state.rusak = true;
      Object.assign(state, dataAwal());
      return state;
    }
    state.gear = Array.isArray(hasil.gear.nilai) ? hasil.gear.nilai : [];
    state.orders = Array.isArray(hasil.orders.nilai) ? hasil.orders.nilai : [];
    state.cart = hasil.cart.nilai && typeof hasil.cart.nilai === 'object' ? hasil.cart.nilai : CARTS_KOSONG();
    state.config = normalisasiConfig(hasil.config.nilai);
    state.meta = hasil.meta.nilai || {};
  } catch {
    state.rusak = true;
    Object.assign(state, dataAwal());
  }
  return state;
}

export function simpanSemua() {
  try {
    localStorage.setItem(STORAGE_KEYS.gear, JSON.stringify(state.gear));
    localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(state.orders));
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(state.cart));
    localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(state.config));
    localStorage.setItem(STORAGE_KEYS.meta, JSON.stringify(state.meta));
    return true;
  } catch {
    state.rusak = true;
    return false;
  }
}

export function resetState() {
  Object.assign(state, dataAwal());
  state.rusak = false;
  simpanSemua();
  return state;
}

export function getConfig() { return state.config; }
export function setConfig(patch) { state.config = normalisasiConfig({ ...state.config, ...patch }); simpanSemua(); }

export function getCart() { return state.cart; }
export function setCart(cart) { state.cart = cart; simpanSemua(); }

export function getOrders() { return state.orders; }
export function getGear() { return state.gear; }

export function cariGear(id) { return state.gear.find((g) => g.id === id) || null; }

export function tambahGear(gear) {
  const item = { ...gear, id: `G-${String(Date.now()).slice(-6)}` };
  state.gear.push(item);
  simpanSemua();
  return item;
}

export function ubahGear(id, patch) {
  const item = cariGear(id);
  if (!item) return null;
  Object.assign(item, patch);
  simpanSemua();
  return item;
}

export function hapusGear(id) {
  const index = state.gear.findIndex((g) => g.id === id);
  if (index < 0) return false;
  state.gear.splice(index, 1);
  simpanSemua();
  return true;
}

export function nomorSewaBerikut(tanggal = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  const prefix = `RG-${tanggal.getFullYear()}${p(tanggal.getMonth() + 1)}${p(tanggal.getDate())}-`;
  const sama = state.orders.filter((o) => String(o.kodeSewa).startsWith(prefix));
  return `${prefix}${String(sama.length + 1).padStart(3, '0')}`;
}

export function tambahOrder(order) {
  state.orders.push(order);
  simpanSemua();
  return order;
}

export function ubahOrder(id, patch) {
  const order = state.orders.find((o) => o.id === id);
  if (!order) return null;
  Object.assign(order, patch);
  simpanSemua();
  return order;
}

export function eksporData() {
  return JSON.stringify({
    gear: state.gear,
    orders: state.orders,
    cart: state.cart,
    config: state.config,
    meta: state.meta,
  }, null, 2);
}

export function imporData(teks) {
  try {
    const data = JSON.parse(teks);
    if (!Array.isArray(data.gear) || !Array.isArray(data.orders) || !data.config) return false;
    state.gear = data.gear;
    state.orders = data.orders;
    state.cart = data.cart || CARTS_KOSONG();
    state.config = normalisasiConfig(data.config);
    state.meta = data.meta || {};
    simpanSemua();
    return true;
  } catch {
    return false;
  }
}
