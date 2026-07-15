"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Calculator, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw,
  Building2,
  DollarSign,
  Clock,
  Briefcase
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

export default function DealValidator() {
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Inputs state
  const [company, setCompany] = useState("");
  const [sector, setSector] = useState("supermarket");
  const [monthlyVolume, setMonthlyVolume] = useState("5000");
  const [currentDistance, setCurrentDistance] = useState("6"); // in km
  const [currentDeliveryTime, setCurrentDeliveryTime] = useState("45"); // in minutes
  const [targetDeliveryTime, setTargetDeliveryTime] = useState("15"); // in minutes
  const [averageOrderValue, setAverageOrderValue] = useState("45"); // in $

  // Results calculation
  const validationResults = useMemo(() => {
    const vol = parseFloat(monthlyVolume) || 0;
    const aov = parseFloat(averageOrderValue) || 0;
    const currentT = parseFloat(currentDeliveryTime) || 0;
    const targetT = parseFloat(targetDeliveryTime) || 0;

    if (vol <= 0 || aov <= 0) return null;

    // 1. Recommend app
    let recommendedApp: "SwishOS" | "Draviqo B2B OS" = "SwishOS";
    let appKey: "swishos" | "b2bos" = "swishos";
    if (sector === "distributor" || currentT > 90 || vol > 50000) {
      recommendedApp = "Draviqo B2B OS";
      appKey = "b2bos";
    }

    // 2. Compatibility Score (formula based on segments & targets)
    let baseScore = 85;
    if (recommendedApp === "SwishOS") {
      if (targetT <= 20) baseScore += 10;
      if (sector === "supermarket" || sector === "food") baseScore += 4;
    } else {
      if (sector === "distributor") baseScore += 12;
    }
    const compatibilityScore = Math.min(Math.max(baseScore, 70), 99);

    // 3. ROI Savings (SwishOS saves around 22% in operational delivery efficiency)
    const dist = Math.max(parseFloat(currentDistance) || 0, 0);
    const currentCostPerOrder = 4.5 + (dist * 0.4);
    const swishCostPerOrder = currentCostPerOrder * 0.65; // 35% savings in route packing
    const monthlySavings = Math.round((currentCostPerOrder - swishCostPerOrder) * vol);
    const yearlySavings = monthlySavings * 12;

    // 4. Time Saved
    const timeSavedPerOrder = Math.max(currentT - targetT, 0);

    return {
      recommendedApp,
      appKey,
      compatibilityScore,
      monthlySavings,
      yearlySavings,
      timeSavedPerOrder,
      currentCostPerOrder: Math.round(currentCostPerOrder * vol),
      swishCostPerOrder: Math.round(swishCostPerOrder * vol),
    };
  }, [sector, monthlyVolume, currentDistance, currentDeliveryTime, targetDeliveryTime, averageOrderValue]);

  // Chart data
  const chartData = useMemo(() => {
    if (!validationResults) return [];
    return [
      {
        name: "Current Cost",
        Cost: validationResults.currentCostPerOrder,
        fill: "rgba(239, 68, 68, 0.4)",
      },
      {
        name: "SwishOS Cost",
        Cost: validationResults.swishCostPerOrder,
        fill: "rgba(16, 185, 129, 0.8)",
      }
    ];
  }, [validationResults]);

  // Handle Redirect to Contact with deal params
  const handleLockDeal = () => {
    if (!validationResults) return;
    if (!company) {
      toast.error("Please enter your Company Name to lock the deal proposal");
      return;
    }

    toast.success("Deal validated & pre-approved!", {
      description: "Redirecting you to complete sandbox request...",
    });

    const params = new URLSearchParams({
      company,
      app: validationResults.appKey,
      savings: validationResults.monthlySavings.toString(),
      score: validationResults.compatibilityScore.toString(),
      volume: monthlyVolume,
    });

    router.push(`/contact?${params.toString()}`);
  };

  return (
    <div className="grid md:grid-cols-12 gap-8 items-start">
      {/* Left Input Form Card */}
      <Card className="md:col-span-5 border-white/5 bg-slate-900/20 backdrop-blur-sm rounded-3xl shadow-xl">
        <CardHeader className="border-b border-white/5 bg-slate-950/40 p-6">
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <Calculator className="h-5 w-5 text-emerald-400" /> Segment Calculator
          </CardTitle>
          <CardDescription className="text-slate-400">
            Define your operational limits to check system compatibility.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Company Name */}
          <div className="space-y-1.5">
            <label htmlFor="dv-company" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5 text-emerald-400" /> Company Name
            </label>
            <Input 
              id="dv-company"
              placeholder="e.g. FreshMart Group" 
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="bg-slate-950 border-white/10 text-xs h-9 text-slate-200"
              aria-label="Company name"
            />
          </div>

          {/* Sector selection */}
          <div className="space-y-1.5">
            <label htmlFor="dv-sector" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5 text-emerald-400" /> Business Sector
            </label>
            <select
              id="dv-sector"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              aria-label="Select business sector"
              className="w-full bg-slate-950 border border-white/10 rounded-lg h-9 px-2 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="supermarket">Grocery & Supermarket (Local)</option>
              <option value="food">QSR & Food Delivery (Instant)</option>
              <option value="courier">Courier & Fleet Provider</option>
              <option value="distributor">FMCG Bulk Distributor</option>
            </select>
          </div>

          {/* Monthly volume */}
          <div className="space-y-1.5">
            <label htmlFor="dv-volume" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              Monthly Order Volume
            </label>
            <Input 
              id="dv-volume"
              type="number"
              min="1"
              value={monthlyVolume}
              onChange={(e) => setMonthlyVolume(e.target.value)}
              className="bg-slate-950 border-white/10 text-xs h-9 text-slate-200"
              aria-label="Monthly order volume"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Avg Distance */}
            <div className="space-y-1.5">
              <label htmlFor="dv-distance" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Avg Distance (km)
              </label>
              <Input 
                id="dv-distance"
                type="number"
                min="0"
                value={currentDistance}
                onChange={(e) => setCurrentDistance(e.target.value)}
                className="bg-slate-950 border-white/10 text-xs h-9 text-slate-200"
                aria-label="Average delivery distance in km"
              />
            </div>
            {/* Avg order value */}
            <div className="space-y-1.5">
              <label htmlFor="dv-basket" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-0.5">
                <DollarSign className="h-3 w-3" /> Avg Basket ($)
              </label>
              <Input 
                id="dv-basket"
                type="number"
                min="1"
                value={averageOrderValue}
                onChange={(e) => setAverageOrderValue(e.target.value)}
                className="bg-slate-950 border-white/10 text-xs h-9 text-slate-200"
                aria-label="Average basket value in dollars"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
            {/* Current speed */}
            <div className="space-y-1.5">
              <label htmlFor="dv-current-time" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> Current Speed
              </label>
              <div className="relative">
                <Input 
                  id="dv-current-time"
                  type="number"
                  min="1"
                  value={currentDeliveryTime}
                  onChange={(e) => setCurrentDeliveryTime(e.target.value)}
                  className="bg-slate-950 border-white/10 text-xs h-9 pr-8 text-slate-200"
                  aria-label="Current delivery time in minutes"
                />
                <span className="absolute right-2.5 top-2 text-[10px] text-slate-500 font-bold" aria-hidden="true">min</span>
              </div>
            </div>

            {/* Target speed */}
            <div className="space-y-1.5">
              <label htmlFor="dv-target-time" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-emerald-400" /> Target Speed
              </label>
              <div className="relative">
                <Input 
                  id="dv-target-time"
                  type="number"
                  min="1"
                  max="120"
                  value={targetDeliveryTime}
                  onChange={(e) => setTargetDeliveryTime(e.target.value)}
                  className="bg-slate-950 border-emerald-500/20 text-xs h-9 pr-8 text-slate-200 focus-visible:ring-emerald-500/20"
                  aria-label="Target delivery time in minutes"
                />
                <span className="absolute right-2.5 top-2 text-[10px] text-emerald-400 font-bold" aria-hidden="true">min</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right Validation Results Card */}
      <div className="md:col-span-7 space-y-6">
        {validationResults ? (
          <>
            <Card className="border-white/5 bg-slate-900/20 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl">
              <CardHeader className="bg-slate-950/40 border-b border-white/5 p-6 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-extrabold text-white">Deal Validation Report</CardTitle>
                  <CardDescription className="text-slate-400 text-xs">
                    Target configuration matching {company || "Your Business"}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs font-bold px-3.5 py-1">
                  {validationResults.compatibilityScore}% Match
                </Badge>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Product Match Recommendation */}
                <div className="p-5 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 animate-pulse">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Recommended OS License</span>
                    <h3 className="text-xl font-bold text-white mt-0.5">{validationResults.recommendedApp}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {validationResults.recommendedApp === "SwishOS" 
                        ? "Optimal configuration for local supermarket networks needing automated dispatch and hyper-local rider routing."
                        : "Optimal configuration for multi-warehouse wholesale distribution hubs managing pallet shipping routes."
                      }
                    </p>
                  </div>
                </div>

                {/* ROI Savings Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-white/5 bg-slate-950/40 rounded-2xl">
                    <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider block">Estimated Monthly Savings</span>
                    <div className="text-2xl font-extrabold text-white mt-1 flex items-baseline">
                      ${validationResults.monthlySavings.toLocaleString()}
                      <span className="text-[10px] text-emerald-400 font-semibold ml-1.5 flex items-center gap-0.5">
                        <TrendingUp className="h-3 w-3" /> 35% cut
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Direct savings in fulfillment costs</p>
                  </div>
                  <div className="p-4 border border-white/5 bg-slate-950/40 rounded-2xl">
                    <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider block">Est. Time Saved</span>
                    <div className="text-2xl font-extrabold text-white mt-1">
                      {validationResults.timeSavedPerOrder} <span className="text-xs text-slate-400">mins</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Reduction in dispatch-to-door duration</p>
                  </div>
                </div>

                {/* Efficiency Comparison Bar Chart */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Monthly Operational Cost</h4>
                  <div className="h-[140px] w-full border border-white/5 bg-slate-950/20 p-2.5 rounded-xl">
                    {isMounted ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" horizontal={false} />
                          <XAxis type="number" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                          <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                          <Bar dataKey="Cost" radius={[0, 4, 4, 0]} barSize={18} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full w-full bg-slate-900/10 animate-pulse rounded" />
                    )}
                  </div>
                </div>

                {/* Proposal validation button */}
                <div className="pt-2">
                  <Button 
                    onClick={handleLockDeal}
                    className="w-full h-12 bg-gradient-to-r from-emerald-500 to-indigo-600 hover:opacity-95 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
                  >
                    Lock Pre-Approved Deal & Deploy Sandbox <ArrowRight className="h-4.5 w-4.5" />
                  </Button>
                  <p className="text-center text-[10px] text-slate-500 mt-2.5">
                    *Pre-approved pricing holds for 30 days. Triggers instant sandbox routing on submission.
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="h-[340px] border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center p-8" role="status" aria-label="Awaiting input parameters">
            <div className="h-12 w-12 rounded-xl bg-slate-900 border border-white/5 text-slate-500 flex items-center justify-center mb-4">
              <RefreshCw className="h-5 w-5 text-emerald-400" aria-hidden="true" />
            </div>
            <h4 className="font-bold text-white text-sm">Awaiting Input Parameters</h4>
            <p className="text-xs text-slate-500 max-w-xs mt-2">
              Fill in your order volume and basket size details on the left to validate deal pricing and verify compatibility.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
