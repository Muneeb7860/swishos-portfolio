"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Check, 
  Sparkles,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { Product } from "@/lib/mock";

interface ProductGridProps {
  products: Product[];
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function SwishProductGrid({ products }: ProductGridProps) {
  // State
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderState, setOrderState] = useState<"browsing" | "ordered">("browsing");
  const [trackingStep, setTrackingStep] = useState(1);

  // Stepper progress simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (orderState === "ordered" && trackingStep < 5) {
      interval = setInterval(() => {
        setTrackingStep(prev => {
          if (prev >= 4) {
            clearInterval(interval);
            toast.success("Swish Delivery Rider has arrived!", {
              description: "Your order is delivered.",
              duration: 5000,
            });
            return 5;
          }
          const stepsName = [
            "",
            "Dark store is packing your items",
            "Rider assigned & moving to store",
            "Out for delivery — Swish Rider is 5 mins away",
          ];
          toast.info(stepsName[prev] || "Processing", { duration: 3000 });
          return prev + 1;
        });
      }, 7000);
    }
    return () => clearInterval(interval);
  }, [orderState, trackingStep]);

  // Categories list
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ["All", ...Array.from(cats)];
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, search]);

  // Add to cart
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart`);
  };

  // Adjust Quantity
  const adjustQuantity = (productId: string, amount: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const nextQty = item.quantity + amount;
          return { ...item, quantity: nextQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  // Cart total cost
  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }, [cart]);

  const totalItemsCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  // Checkout submit
  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setOrderState("ordered");
    setTrackingStep(1);
    toast.success("Order Placed Successfully via SwishOS!", {
      description: "Live tracking has initialized.",
    });
  };

  // Reset tracking view
  const handleResetOrder = () => {
    setCart([]);
    setOrderState("browsing");
    setTrackingStep(1);
  };

  return (
    <div className="mx-auto max-w-[420px] min-h-screen bg-[#07080d] border-x border-white/5 relative flex flex-col pb-24 shadow-2xl">
      {/* simulated mobile phone header notch */}
      <div className="w-full h-8 bg-black flex items-center justify-between px-6 text-[11px] text-slate-500 font-medium select-none border-b border-white/2">
        <span>09:41</span>
        <div className="w-24 h-4 bg-slate-900 rounded-b-xl mx-auto flex items-center justify-center">
          <div className="w-8 h-1 bg-black rounded-full" />
        </div>
        <span className="flex items-center gap-1">5G 🔋</span>
      </div>

      {orderState === "browsing" ? (
        <>
          {/* Header */}
          <div className="p-4 space-y-3.5 bg-slate-950/40 border-b border-white/5 sticky top-0 z-20 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white font-bold text-sm shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                  S
                </span>
                <div>
                  <h3 className="font-extrabold text-white text-sm tracking-tight">SwishOS</h3>
                  <p className="text-[10px] text-slate-500 flex items-center gap-0.5">
                    <MapPin className="h-3 w-3 text-emerald-400" /> Downtown Dark Store
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] px-2 py-0.5 animate-pulse">
                ⚡ 12 min delivery
              </Badge>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input 
                placeholder="Search fresh groceries..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 bg-slate-900 border-white/10 text-xs text-slate-200 placeholder:text-slate-500 focus-visible:ring-emerald-500/30"
              />
            </div>

            {/* Categories horizontal list */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
              {categories.map(cat => (
                <Badge
                  key={cat}
                  variant="outline"
                  className={`cursor-pointer px-3 py-1 text-[10px] rounded-lg transition-colors whitespace-nowrap ${selectedCategory === cat ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-transparent text-slate-400 border-white/5"}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="p-4 grid grid-cols-2 gap-3.5 flex-1 overflow-y-auto">
            {filteredProducts.map(prod => (
              <Card key={prod.id} className="border-white/5 bg-slate-950/40 rounded-xl overflow-hidden flex flex-col group hover:border-emerald-500/20 transition-all duration-300">
                <div className="aspect-square relative overflow-hidden bg-slate-900">
                  <img 
                    src={prod.image} 
                    alt={prod.name} 
                    loading="lazy" 
                    className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] text-slate-300 font-semibold flex items-center gap-0.5">
                    <Clock className="h-2.5 w-2.5 text-emerald-400" /> {prod.deliveryTime}
                  </div>
                </div>
                <CardContent className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">{prod.category}</span>
                    <h4 className="font-bold text-xs text-slate-200 mt-1 leading-tight line-clamp-2">{prod.name}</h4>
                  </div>
                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/5">
                    <span className="font-extrabold text-white text-sm">${prod.price.toFixed(2)}</span>
                    <Button 
                      size="sm" 
                      onClick={() => addToCart(prod)}
                      className="h-7 w-7 rounded-lg bg-emerald-500 text-white p-0 hover:bg-emerald-600 shadow-[0_3px_8px_rgba(16,185,129,0.3)] transition-transform active:scale-95"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredProducts.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500 text-xs">
                No products match your search.
              </div>
            )}
          </div>

          {/* Floating Cart Bar */}
          {cart.length > 0 && (
            <div 
              className="absolute bottom-4 left-4 right-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl p-3.5 flex items-center justify-between shadow-[0_10px_25px_rgba(16,185,129,0.4)] cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] z-30"
              onClick={() => setIsCartOpen(true)}
            >
              <div className="flex items-center gap-3">
                <div className="relative bg-white/20 p-2 rounded-xl">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-extrabold text-[9px] h-4 w-4 rounded-full flex items-center justify-center border border-emerald-600">
                    {totalItemsCount}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-xs">View Basket</h4>
                  <p className="text-[10px] text-white/80">SwishOS Automated Checkout</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 font-extrabold text-sm">
                ${cartTotal.toFixed(2)} <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          )}
        </>
      ) : (
        /* Dynamic Tracking / Live Stepper view */
        <div className="p-6 flex-1 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Sparkles className="h-4 w-4 animate-spin" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">SwishOS Delivery Active</h3>
                <p className="text-[10px] text-slate-400">Order ID: SW-{Math.floor(Math.random() * 89999 + 10000)}</p>
              </div>
            </div>

            {/* Stepper Card */}
            <Card className="border-white/5 bg-slate-950/40 p-5 rounded-2xl space-y-6">
              <h4 className="font-extrabold text-xs uppercase tracking-widest text-slate-500">Live Delivery Steps</h4>
              <div className="space-y-4">
                {[
                  { step: 1, title: "Order Accepted", desc: "Instantly routed to local dark store" },
                  { step: 2, title: "Picking & Packing", desc: "Items verified and bagged securely" },
                  { step: 3, title: "Courier Assigned", desc: "Swish dispatch agent has collected package" },
                  { step: 4, title: "Out for Delivery", desc: "Rider navigating optimal route" },
                  { step: 5, title: "Delivered", desc: "Enjoy your fresh delivery!" },
                ].map((s) => {
                  const isActive = trackingStep >= s.step;
                  const isCurrent = trackingStep === s.step;
                  return (
                    <div key={s.step} className="flex gap-4 relative">
                      {/* Connection Line */}
                      {s.step < 5 && (
                        <div className={`absolute left-3 top-6 bottom-[-22px] w-[2px] transition-colors ${trackingStep > s.step ? "bg-emerald-500" : "bg-white/5"}`} />
                      )}
                      
                      {/* Step Indicator */}
                      <div className={`h-6.5 w-6.5 rounded-full flex items-center justify-center z-10 border transition-all ${
                        isActive 
                          ? "bg-emerald-500 text-white border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
                          : "bg-slate-900 text-slate-500 border-white/5"
                      }`}>
                        {isActive ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : <span className="text-[10px] font-bold">{s.step}</span>}
                      </div>

                      {/* Step Info */}
                      <div className="space-y-0.5">
                        <h5 className={`font-bold text-xs ${isActive ? (isCurrent ? "text-emerald-400" : "text-white") : "text-slate-500"}`}>
                          {s.title}
                        </h5>
                        <p className="text-[10px] text-slate-400">{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/5">
            {trackingStep < 5 && (
              <div className="text-center text-[10px] text-slate-500 animate-pulse flex items-center justify-center gap-1.5">
                <RefreshCw className="h-3 w-3 animate-spin text-emerald-400" /> Simulating live delivery flow...
              </div>
            )}
            <Button 
              size="lg" 
              className="w-full bg-slate-900 border border-white/10 text-white hover:bg-slate-800 text-xs font-semibold h-11 rounded-xl"
              onClick={handleResetOrder}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Reset and Browse Again
            </Button>
          </div>
        </div>
      )}

      {/* Cart Sliding Sheet */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent side="bottom" className="h-[80vh] bg-slate-950 border-t border-white/10 text-slate-100 rounded-t-3xl max-w-[420px] mx-auto p-6 flex flex-col justify-between">
          <div className="space-y-6 flex-1 overflow-y-auto pr-1">
            <SheetHeader>
              <SheetTitle className="text-white text-base font-extrabold tracking-tight">Swish Cart</SheetTitle>
              <SheetDescription className="text-slate-400 text-xs">
                Your hyper-local instant delivery basket
              </SheetDescription>
            </SheetHeader>

            {/* Cart Items List */}
            {cart.length > 0 ? (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.product.id} className="flex items-center justify-between p-3 border border-white/5 bg-slate-900/40 rounded-xl">
                    <div className="flex items-center gap-3">
                      <img src={item.product.image} alt={item.product.name} className="h-10 w-10 object-cover rounded-lg bg-slate-950" />
                      <div className="max-w-[150px]">
                        <h4 className="font-bold text-xs text-slate-200 truncate">{item.product.name}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">${item.product.price.toFixed(2)} each</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-white/5 bg-slate-950 rounded-lg h-7">
                        <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-400 hover:text-white" onClick={() => adjustQuantity(item.product.id, -1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-xs font-bold text-white px-2">{item.quantity}</span>
                        <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-400 hover:text-white" onClick={() => adjustQuantity(item.product.id, 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="font-bold text-xs text-white min-w-[45px] text-right">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs">
                Your basket is empty.
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>SwishOS Delivery Fee</span>
                  <span className="text-emerald-400 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-sm text-white font-extrabold pt-2 border-t border-white/2">
                  <span>Total Amount</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
              <SheetFooter className="sm:justify-start">
                <Button 
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-11 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-98 transition-transform"
                  onClick={handleCheckout}
                >
                  Confirm & Place Order (${cartTotal.toFixed(2)})
                </Button>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
