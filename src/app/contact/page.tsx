"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { ArrowLeft, Send, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

// Zod Schema
const ContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().min(1, "Company name is required"),
  appOfInterest: z.enum(["swishos", "b2bos", "custom", "other"]),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof ContactFormSchema>;

function ContactFormInner() {
  const searchParams = useSearchParams();

  // State variables
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    appOfInterest: "swishos",
    message: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  // Read search params to pre-populate deal data
  useEffect(() => {
    const companyParam = searchParams.get("company");
    const appParam = searchParams.get("app");
    const savingsParam = searchParams.get("savings");
    const scoreParam = searchParams.get("score");
    const volumeParam = searchParams.get("volume");

    if (companyParam || appParam || savingsParam) {
      // Type-safe guard: only use known enum values
      const validApps: FormData["appOfInterest"][] = ["swishos", "b2bos", "custom", "other"];
      const resolvedApp: FormData["appOfInterest"] =
        appParam && validApps.includes(appParam as FormData["appOfInterest"])
          ? (appParam as FormData["appOfInterest"])
          : "swishos";

      setFormData(prev => ({
        ...prev,
        company: companyParam || prev.company,
        appOfInterest: resolvedApp,
        message: `Validated Deal Proposal Details:\n- Recommended OS: ${resolvedApp === "b2bos" ? "Draviqo B2B OS" : "SwishOS"}\n- System Compatibility: ${scoreParam || 95}%\n- Projected Monthly Savings: $${savingsParam || 0}/mo\n- Target Volume: ${volumeParam || 0} orders/mo.`,
      }));
      toast.info("Imported pre-approved deal details from calculator");
    }
  }, [searchParams]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error on change
    if (formErrors[name as keyof FormData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setStatus("submitting");

    // Zod Validation
    const result = ContactFormSchema.safeParse(formData);
    if (!result.success) {
      const errors: Partial<Record<keyof FormData, string>> = {};
      result.error.issues.forEach(issue => {
        const path = issue.path[0] as keyof FormData;
        errors[path] = issue.message;
      });
      setFormErrors(errors);
      setStatus("idle");
      toast.error("Form validation failed. Please check your fields.");
      return;
    }

    // Simulate Network Request
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus("success");
      toast.success("Deal Proposal Locked & Sent!", {
        description: `Thanks ${formData.name}, our deal desk will email you shortly.`,
      });
    } catch (err) {
      console.error(err);
      setStatus("idle");
      toast.error("Network error. Please try again later.");
    }
  };

  return (
    <>
      {status === "success" ? (
        <Card className="border-white/5 bg-slate-900/20 backdrop-blur-sm text-center p-8 rounded-3xl shadow-2xl">
          <CardContent className="space-y-6 pt-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto">
              <CheckCircle2 className="h-8 w-8 animate-bounce" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-extrabold text-white">Deal Proposal Submitted</CardTitle>
              <CardDescription className="text-slate-400 text-sm">
                Your pre-approved pricing has been locked in. Our B2B deal desk is validating compatibility parameters and will send the setup credentials to {formData.email}.
              </CardDescription>
            </div>
            <div className="pt-4">
              <Button 
                onClick={() => {
                  setStatus("idle");
                  setFormData({
                    name: "",
                    email: "",
                    company: "",
                    appOfInterest: "swishos",
                    message: "",
                  });
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl h-11 px-6 shadow-lg shadow-emerald-600/25"
              >
                Submit New Deal
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-white/5 bg-slate-900/20 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
          <CardHeader className="border-b border-white/5 bg-slate-950/40 p-6 sm:p-8">
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs text-emerald-400 self-start w-fit mb-3">
              <Sparkles className="h-3 w-3" /> Secure Deal Routing
            </div>
            <CardTitle className="text-2xl font-extrabold text-white tracking-tight">Submit Deal Proposal</CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              Connect your business metrics. Pre-validated deal proposals hold custom pricing configurations for 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-bold text-slate-300 uppercase tracking-wider">Your Name</label>
                <Input 
                  type="text" 
                  id="name" 
                  name="name" 
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={handleChange}
                  className={`bg-slate-900/40 border-white/10 text-slate-100 text-sm rounded-xl focus-visible:ring-emerald-500/20 ${formErrors.name ? "border-rose-500 focus-visible:ring-rose-500/20" : ""}`}
                />
                {formErrors.name && (
                  <p className="text-rose-400 text-[10px] flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3.5 w-3.5" /> {formErrors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-bold text-slate-300 uppercase tracking-wider">Work Email</label>
                <Input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="john@company.com" 
                  value={formData.email}
                  onChange={handleChange}
                  className={`bg-slate-900/40 border-white/10 text-slate-100 text-sm rounded-xl focus-visible:ring-emerald-500/20 ${formErrors.email ? "border-rose-500 focus-visible:ring-rose-500/20" : ""}`}
                />
                {formErrors.email && (
                  <p className="text-rose-400 text-[10px] flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3.5 w-3.5" /> {formErrors.email}
                  </p>
                )}
              </div>

              {/* Company */}
              <div className="space-y-1.5">
                <label htmlFor="company" className="text-xs font-bold text-slate-300 uppercase tracking-wider">Company / Agency</label>
                <Input 
                  type="text" 
                  id="company" 
                  name="company" 
                  placeholder="Acme Corp" 
                  value={formData.company}
                  onChange={handleChange}
                  className={`bg-slate-900/40 border-white/10 text-slate-100 text-sm rounded-xl focus-visible:ring-emerald-500/20 ${formErrors.company ? "border-rose-500 focus-visible:ring-rose-500/20" : ""}`}
                />
                {formErrors.company && (
                  <p className="text-rose-400 text-[10px] flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3.5 w-3.5" /> {formErrors.company}
                  </p>
                )}
              </div>

              {/* Product/App Selection */}
              <div className="space-y-1.5">
                <label htmlFor="appOfInterest" className="text-xs font-bold text-slate-300 uppercase tracking-wider">Solution Configuration</label>
                <select 
                  id="appOfInterest" 
                  name="appOfInterest"
                  aria-label="Select a solution configuration"
                  value={formData.appOfInterest}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl h-10 px-3 text-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="swishos">SwishOS Q-Commerce Suite</option>
                  <option value="b2bos">Draviqo B2B Logistics OS</option>
                  <option value="custom">Bespoke WMS / ERP Integration</option>
                  <option value="other">Other Commerce Services</option>
                </select>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-bold text-slate-300 uppercase tracking-wider">Deal Verification Details</label>
                <Textarea 
                  id="message" 
                  name="message" 
                  placeholder="Tell us about your operations or paste deal details..." 
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`bg-slate-900/40 border-white/10 text-slate-100 text-sm rounded-xl focus-visible:ring-emerald-500/20 ${formErrors.message ? "border-rose-500 focus-visible:ring-rose-500/20" : ""}`}
                />
                {formErrors.message && (
                  <p className="text-rose-400 text-[10px] flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3.5 w-3.5" /> {formErrors.message}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <Button 
                type="submit" 
                disabled={status === "submitting"}
                className="w-full h-11 bg-gradient-to-r from-emerald-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/10 hover:opacity-95 transition-opacity mt-4 flex items-center justify-center gap-2"
              >
                {status === "submitting" ? (
                  <>Verifying & Submitting...</>
                ) : (
                  <>
                    Submit Deal Proposal <Send className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-[#030408] text-slate-100 flex flex-col justify-between font-sans">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px]" />
      </div>

      <main className="relative z-10 container mx-auto max-w-lg px-4 py-16 flex-1 flex flex-col justify-center">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 mb-6 transition-colors self-start">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Draviqo Portfolio
        </Link>

        {/* Suspense wrapper around form reading useSearchParams */}
        <Suspense fallback={
          <Card className="border-white/5 bg-slate-900/20 backdrop-blur-sm p-8 rounded-3xl text-center">
            <p className="text-sm text-slate-500">Loading form parameters...</p>
          </Card>
        }>
          <ContactFormInner />
        </Suspense>
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-600">
        © 2026 Draviqo. All rights reserved.
      </footer>
    </div>
  );
}
