import { useState, useEffect } from "react";

// ── Storage helpers (localStorage for persistence) ────────────────
const STORAGE_KEY = "eindu_laundry_orders";
const loadOrders = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
};
const saveOrders = (orders) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(orders)); } catch {}
};

// ── Data ──────────────────────────────────────────────────────────
const SERVICES = [
  { id: "wash",     en: "Wash Only",       mm: "ဆေးကြောသာ",        price: 2000, icon: "🫧" },
  { id: "washDry",  en: "Wash + Dry",      mm: "ဆေး + ခြောက်",     price: 4000, icon: "☀️" },
  { id: "washFold", en: "Wash + Fold",     mm: "ဆေး + ချုပ်",      price: 5000, icon: "👕" },
  { id: "dropoff",  en: "Drop-off",        mm: "ထားခဲ့ဝန်ဆောင်မှု", price: 3000, icon: "📦" },
  { id: "blanket",  en: "Blanket/Duvet",   mm: "စောင်ကြီး",         price: 8000, icon: "🛏️" },
  { id: "express",  en: "Express (+2hrs)", mm: "အလျင်အမြန်",        price: 5500, icon: "⚡" },
];

const PAYMENT = [
  { id: "cash",  label: "Cash",    mm: "ငွေသား",  icon: "💵" },
  { id: "kbz",   label: "KBZPay",  mm: "KBZPay",  icon: "📱" },
  { id: "wave",  label: "WavePay", mm: "WavePay", icon: "🌊" },
];

const STATUS = {
  pending:   { en: "Pending",   mm: "စောင့်ဆိုင်းဆဲ", color: "#D97706", bg: "#FEF3C7", next: "washing",   nextLabel: "Start Washing | ဆေးစပါ" },
  washing:   { en: "Washing",   mm: "ဆေးကြောနေ",     color: "#2563EB", bg: "#DBEAFE", next: "drying",    nextLabel: "Move to Dry | ခြောက်ရန်" },
  drying:    { en: "Drying",    mm: "ခြောက်သွေ့နေ",  color: "#7C3AED", bg: "#EDE9FE", next: "ready",     nextLabel: "Mark Ready | အသင့်ဖြစ်ပြီ" },
  ready:     { en: "Ready ✓",   mm: "ထုတ်ရန်အသင့်",  color: "#059669", bg: "#D1FAE5", next: "collected", nextLabel: "Collected | ထုတ်ပြီ" },
  collected: { en: "Collected", mm: "ထုတ်ပြီး",       color: "#6B7280", bg: "#F3F4F6", next: null,        nextLabel: "" },
};

// ── Utils ─────────────────────────────────────────────────────────
const fmtMMK   = (n) => Number(n).toLocaleString() + " Ks";
const fmtDate  = () => new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });
const fmtTime  = () => new Date().toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" });
const todayKey = () => new Date().toISOString().slice(0, 10);
let _counter   = 1;
const nextId   = () => String(_counter++).padStart(3, "0");

// ── Colours ───────────────────────────────────────────────────────
const TEAL  = "#1A7A6E";
const TEALL = "#E8F5F3";
const GOLD  = "#F0B429";
