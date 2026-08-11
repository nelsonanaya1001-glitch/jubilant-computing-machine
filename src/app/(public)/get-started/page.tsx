"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Upload, ArrowRight, ArrowLeft, Zap, X } from "lucide-react";
import { step1Schema, step2Schema, step3Schema, step4Schema, Step1Data, Step2Data, Step3Data, Step4Data } from "@/lib/validations";
import { cn } from "@/lib/utils";

const industries = [
  "Healthcare", "Legal", "Real Estate", "Retail / E-Commerce", "Restaurant / Food",
  "Fitness & Wellness", "Technology", "Finance", "Education", "Construction",
  "Beauty & Salon", "Consulting", "Non-Profit", "Entertainment", "Other",
];

const colorOptions = [
  { value: "blue-professional", label: "Blue & Professional", colors: ["#1d4ed8", "#3b82f6", "#e2e8f0"] },
  { value: "green-natural", label: "Green & Natural", colors: ["#15803d", "#22c55e", "#f0fdf4"] },
  { value: "dark-bold", label: "Dark & Bold", colors: ["#0f172a", "#334155", "#f8fafc"] },
  { value: "warm-earthy", label: "Warm & Earthy", colors: ["#92400e", "#d97706", "#fffbeb"] },
  { value: "purple-luxury", label: "Purple & Luxury", colors: ["#6d28d9", "#a855f7", "#f5f3ff"] },
  { value: "red-energetic", label: "Red & Energetic", colors: ["#b91c1c", "#ef4444", "#fff1f2"] },
  { value: "teal-fresh", label: "Teal & Fresh", colors: ["#0f766e", "#14b8a6", "#f0fdfa"] },
  { value: "pink-playful", label: "Pink & Playful", colors: ["#be185d", "#ec4899", "#fdf2f8"] },
  { value: "orange-vibrant", label: "Orange & Vibrant", colors: ["#c2410c", "#f97316", "#fff7ed"] },
  { value: "navy-gold", label: "Navy & Gold", colors: ["#1e293b", "#ca8a04", "#fefce8"] },
  { value: "black-white", label: "Black & White", colors: ["#000000", "#6b7280", "#ffffff"] },
  { value: "pastel-soft", label: "Soft Pastels", colors: ["#a5b4fc", "#f9a8d4", "#fef3c7"] },
  { value: "monochrome-gray", label: "Sleek Greyscale", colors: ["#111827", "#9ca3af", "#f3f4f6"] },
  { value: "sunset-gradient", label: "Sunset Tones", colors: ["#db2777", "#f97316", "#fbbf24"] },
];

const styleOptions = [
  "Modern & Minimal",
  "Classic & Professional",
  "Bold & Creative",
  "Playful & Friendly",
  "Luxury & Premium",
  "Clean & Corporate",
  "Warm & Welcoming",
  "Sleek & High-Tech",
  "Elegant & Refined",
  "Fun & Energetic",
];

const featuresList = [
  { id: "contact-form", label: "Contact Form" },
  { id: "booking-system", label: "Booking System" },
  { id: "online-payments", label: "Online Payments" },
  { id: "ecommerce", label: "E-Commerce / Online Store" },
  { id: "customer-portal", label: "Customer Portal" },
  { id: "membership", label: "Membership Area" },
  { id: "blog", label: "Blog / News Section" },
  { id: "live-chat", label: "Live Chat" },
  { id: "gallery", label: "Photo / Video Gallery" },
  { id: "testimonials", label: "Testimonials Section" },
];

const fileCategories = [
  { id: "logo", label: "Logo Files", desc: "PNG, SVG, AI, or EPS formats preferred", accept: ".png,.svg,.ai,.eps,.pdf" },
  { id: "brand", label: "Brand Guidelines", desc: "Brand guide, style guide, or color palette documents", accept: ".pdf,.doc,.docx" },
  { id: "images", label: "Images & Photos", desc: "Team photos, product images, location photos", accept: ".jpg,.jpeg,.png,.webp" },
  { id: "docs", label: "Other Documents", desc: "Content, copy, or any other relevant files", accept: ".pdf,.doc,.docx,.txt" },
];

const steps = [
  "Business Info",
  "Business Details",
  "Design Preferences",
  "Features",
  "File Uploads",
  "Review & Submit",
];

interface FormState {
  step1: Partial<Step1Data>;
  step2: Partial<Step2Data>;
  step3: Partial<Step3Data>;
  step4: { featuresNeeded: string[] };
  files: { [category: string]: File[] };
}

export default function GetStartedPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formState, setFormState] = useState<FormState>({
    step1: {},
    step2: {},
    step3: { preferredColors: "", preferredStyle: "" },
    step4: { featuresNeeded: [] },
    files: {},
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);
  const [portalPassword, setPortalPassword] = useState("");
  const [portalDone, setPortalDone] = useState(false);
  const [portalError, setPortalError] = useState("");
  const [portalSaving, setPortalSaving] = useState(false);

  async function setupPortal() {
    if (portalPassword.length < 8) {
      setPortalError("Password must be at least 8 characters");
      return;
    }
    setPortalSaving(true);
    setPortalError("");
    try {
      const res = await fetch("/api/auth/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: submittedEmail, password: portalPassword }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.message || "Could not set up access");
      }
      setPortalDone(true);
    } catch (err: any) {
      setPortalError(err.message);
    } finally {
      setPortalSaving(false);
    }
  }

  const form1 = useForm<Step1Data>({ resolver: zodResolver(step1Schema), defaultValues: formState.step1 });
  const form2 = useForm<Step2Data>({ resolver: zodResolver(step2Schema), defaultValues: formState.step2 });
  const form3 = useForm<Step3Data>({ resolver: zodResolver(step3Schema), defaultValues: formState.step3 });

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<{ [category: string]: File[] }>({});
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [showCustomColors, setShowCustomColors] = useState(false);
  const [customColors, setCustomColors] = useState<string[]>(["#7c3aed", "#ec4899", "#f8fafc"]);

  function applyCustomColors(next: string[]) {
    setCustomColors(next);
    form3.setValue("preferredColors", `Custom palette: ${next.join(", ")}`, { shouldValidate: true });
  }

  function toggleFeature(id: string) {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  function handleFileDrop(category: string, files: FileList | null) {
    if (!files) return;
    const fileArray = Array.from(files);
    setUploadedFiles((prev) => ({
      ...prev,
      [category]: [...(prev[category] || []), ...fileArray],
    }));
  }

  function removeFile(category: string, index: number) {
    setUploadedFiles((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  }

  async function handleStep1(data: Step1Data) {
    setFormState((prev) => ({ ...prev, step1: data }));
    setCurrentStep(1);
  }

  async function handleStep2(data: Step2Data) {
    setFormState((prev) => ({ ...prev, step2: data }));
    setCurrentStep(2);
  }

  async function handleStep3(data: Step3Data) {
    setFormState((prev) => ({ ...prev, step3: data }));
    setCurrentStep(3);
  }

  function handleStep4() {
    if (selectedFeatures.length === 0) return;
    setFormState((prev) => ({ ...prev, step4: { featuresNeeded: selectedFeatures } }));
    setCurrentStep(4);
  }

  function handleStep5() {
    setFormState((prev) => ({ ...prev, files: uploadedFiles }));
    setCurrentStep(5);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError("");

    try {
      const formData = new FormData();

      // Append all form fields
      const allData = {
        ...formState.step1,
        ...formState.step2,
        ...formState.step3,
        featuresNeeded: JSON.stringify(selectedFeatures),
      };

      Object.entries(allData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string);
        }
      });

      // Append files
      Object.entries(uploadedFiles).forEach(([category, files]) => {
        files.forEach((file) => {
          formData.append(`file_${category}`, file);
        });
      });

      const response = await fetch("/api/submissions", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Submission failed");
      }

      const result = await response.json();
      setSubmittedEmail(result.email || formState.step1.email || "");
      setAccountCreated(!!result.accountCreated);
      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Project Submitted!</h1>
          <p className="text-gray-500 mb-6">
            Thank you for submitting your project details. Our team will review your information and reach out within 1 business day to discuss next steps.
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-left mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">What happens next?</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> We review your project details</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Discovery call to align on scope & goals</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Custom proposal sent within 24–48 hours</li>
            </ul>
          </div>

          {/* Stay in touch — set up portal access to message us */}
          {portalDone ? (
            <div className="bg-green-50 border border-green-100 rounded-xl p-5 text-left mb-8">
              <h4 className="font-semibold text-gray-900 mb-1">Your portal is ready</h4>
              <p className="text-sm text-gray-600 mb-3">
                Sign in any time to track progress and message us directly.
              </p>
              <a href="/login">
                <Button className="w-full" size="lg">Go to Sign In</Button>
              </a>
            </div>
          ) : accountCreated ? (
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-left mb-8">
              <h4 className="font-semibold text-gray-900 mb-1">Stay in touch</h4>
              <p className="text-sm text-gray-500 mb-4">
                Create a password to access your client portal — track your project status and message us directly, any time.
              </p>
              <div className="space-y-3">
                <Input
                  type="password"
                  placeholder="Choose a password (min. 8 characters)"
                  value={portalPassword}
                  onChange={(e) => setPortalPassword(e.target.value)}
                  error={portalError}
                />
                <Button className="w-full" size="lg" onClick={setupPortal} disabled={portalSaving}>
                  {portalSaving ? "Setting up..." : "Create Portal Access"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-left mb-8">
              <p className="text-sm text-gray-500 mb-3">
                You can track this project and message us from your client portal.
              </p>
              <a href="/login"><Button variant="outline" className="w-full">Sign In to Your Portal</Button></a>
            </div>
          )}

          <a href="/" className="text-blue-600 font-semibold hover:underline">← Return to Homepage</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-900">Project Intake Form</span>
            <span className="text-gray-400 text-sm ml-2">Step {currentStep + 1} of {steps.length}</span>
          </div>
          {/* Progress bar */}
          <div className="flex items-center gap-1">
            {steps.map((step, i) => (
              <div key={step} className="flex-1 flex items-center gap-1">
                <div
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-all duration-300",
                    i <= currentStep ? "bg-blue-600" : "bg-gray-200"
                  )}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1">
            {steps.map((step, i) => (
              <span
                key={step}
                className={cn(
                  "text-xs font-medium hidden sm:block",
                  i === currentStep ? "text-blue-600" : i < currentStep ? "text-gray-500" : "text-gray-300"
                )}
              >
                {step}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Step 1 */}
        {currentStep === 0 && (
          <form onSubmit={form1.handleSubmit(handleStep1)} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Business Information</h2>
              <p className="text-gray-500">Tell us about your business so we can tailor the right solution.</p>
            </div>
            <Input
              label="Business Name *"
              placeholder="Acme Corporation"
              {...form1.register("businessName")}
              error={form1.formState.errors.businessName?.message}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Industry *</label>
              <select
                {...form1.register("industry")}
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                <option value="">Select your industry...</option>
                {industries.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
              {form1.formState.errors.industry && (
                <p className="mt-1 text-xs text-red-600">{form1.formState.errors.industry.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Your Name *"
                placeholder="Jane Smith"
                {...form1.register("contactName")}
                error={form1.formState.errors.contactName?.message}
              />
              <Input
                label="Email Address *"
                type="email"
                placeholder="jane@company.com"
                {...form1.register("email")}
                error={form1.formState.errors.email?.message}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number *"
                type="tel"
                placeholder="+1 (555) 000-0000"
                {...form1.register("phone")}
                error={form1.formState.errors.phone?.message}
              />
              <Input
                label="Current Website (optional)"
                type="url"
                placeholder="https://yourwebsite.com"
                {...form1.register("website")}
                error={form1.formState.errors.website?.message}
              />
            </div>
            <Button type="submit" size="lg" className="w-full">
              Continue <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
        )}

        {/* Step 2 */}
        {currentStep === 1 && (
          <form onSubmit={form2.handleSubmit(handleStep2)} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Business Details</h2>
              <p className="text-gray-500">Help us understand what you do and who you serve.</p>
            </div>
            <div>
              <Textarea
                label="Services You Offer * (be detailed — at least 50 words)"
                placeholder="Describe your products or services in detail. The more you share — what you offer, who it's for, what makes you different, your pricing approach, and any specialties — the better we can build for you. Aim for at least 50 words."
                rows={5}
                {...form2.register("servicesOffered")}
                error={form2.formState.errors.servicesOffered?.message}
              />
              {(() => {
                const words = (form2.watch("servicesOffered") || "").trim().split(/\s+/).filter(Boolean).length;
                return (
                  <p className={cn("mt-1 text-xs", words >= 50 ? "text-green-600" : "text-gray-400")}>
                    {words} / 50 words {words >= 50 ? "✓" : ""}
                  </p>
                );
              })()}
            </div>
            <Input
              label="Service Area / Location *"
              placeholder="e.g., New York City, Nationwide, Online"
              {...form2.register("serviceArea")}
              error={form2.formState.errors.serviceArea?.message}
            />
            <Input
              label="Target Audience *"
              placeholder="e.g., Small business owners aged 30–55 in the US"
              {...form2.register("targetAudience")}
              error={form2.formState.errors.targetAudience?.message}
            />
            <Textarea
              label="About Your Business *"
              placeholder="Give us a summary of your business — your story, mission, and what makes you different..."
              rows={4}
              {...form2.register("businessDescription")}
              error={form2.formState.errors.businessDescription?.message}
            />
            <div className="flex gap-3">
              <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => setCurrentStep(0)}>
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button type="submit" size="lg" className="flex-1">
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </form>
        )}

        {/* Step 3 */}
        {currentStep === 2 && (
          <form onSubmit={form3.handleSubmit(handleStep3)} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Design Preferences</h2>
              <p className="text-gray-500">Help us understand your aesthetic so we can design something you'll love.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Color Palette Preference *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {colorOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                      form3.watch("preferredColors") === opt.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <input
                      type="radio"
                      value={opt.value}
                      {...form3.register("preferredColors")}
                      className="sr-only"
                    />
                    <div className="flex gap-1">
                      {opt.colors.map((c) => (
                        <div key={c} className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>

              {/* Custom color picker */}
              <button
                type="button"
                onClick={() => {
                  const next = !showCustomColors;
                  setShowCustomColors(next);
                  if (next) applyCustomColors(customColors);
                }}
                className={cn(
                  "mt-3 w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all",
                  showCustomColors ? "border-blue-500 bg-blue-50 text-blue-700" : "border-dashed border-gray-300 text-gray-600 hover:border-gray-400"
                )}
              >
                + Choose my own exact colors
              </button>

              {showCustomColors && (
                <div className="mt-3 p-4 rounded-xl border-2 border-blue-200 bg-blue-50/40">
                  <p className="text-sm text-gray-600 mb-3">Pick the exact colors you'd like us to use:</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Primary", i: 0 },
                      { label: "Accent", i: 1 },
                      { label: "Background", i: 2 },
                    ].map(({ label, i }) => (
                      <div key={label} className="flex flex-col items-center gap-2">
                        <input
                          type="color"
                          value={customColors[i]}
                          onChange={(e) => {
                            const next = [...customColors];
                            next[i] = e.target.value;
                            applyCustomColors(next);
                          }}
                          className="w-14 h-14 rounded-lg border border-gray-200 cursor-pointer bg-white p-1"
                        />
                        <span className="text-xs font-medium text-gray-600">{label}</span>
                        <span className="text-[10px] text-gray-400 uppercase">{customColors[i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {form3.formState.errors.preferredColors && (
                <p className="mt-1 text-xs text-red-600">{form3.formState.errors.preferredColors.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Website Style / Feel *</label>
              <div className="space-y-2">
                {styleOptions.map((style) => (
                  <label
                    key={style}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                      form3.watch("preferredStyle") === style
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <input
                      type="radio"
                      value={style}
                      {...form3.register("preferredStyle")}
                      className="sr-only"
                    />
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 flex-shrink-0",
                      form3.watch("preferredStyle") === style ? "border-blue-500 bg-blue-500" : "border-gray-300"
                    )} />
                    <span className="text-sm font-medium text-gray-700">{style}</span>
                  </label>
                ))}
              </div>
              {form3.formState.errors.preferredStyle && (
                <p className="mt-1 text-xs text-red-600">{form3.formState.errors.preferredStyle.message}</p>
              )}
            </div>

            <Textarea
              label="Competitor Websites (optional)"
              placeholder="List any competitor websites we should be aware of (one per line)..."
              rows={3}
              {...form3.register("competitorWebsites")}
            />

            {/* Example domains / inspiration */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">
                Example websites you'd like yours to look like
              </h3>
              <p className="text-xs text-blue-700 mb-3">
                Share a few domains (e.g. <span className="font-medium">apple.com, stripe.com, airbnb.com</span>)
                whose design, layout, or feel you love. This gives us a clear starting point and helps us match your vision.
              </p>
              <Textarea
                placeholder={"Paste example domains here, one per line:\nhttps://example.com\nhttps://another-site.com"}
                rows={4}
                {...form3.register("websitesTheyLike")}
              />
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button type="submit" size="lg" className="flex-1">
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </form>
        )}

        {/* Step 4 */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Features Needed</h2>
              <p className="text-gray-500">Select all the features you'd like on your website.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {featuresList.map((feature) => (
                <label
                  key={feature.id}
                  onClick={() => toggleFeature(feature.id)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                    selectedFeatures.includes(feature.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all",
                    selectedFeatures.includes(feature.id) ? "border-blue-500 bg-blue-500" : "border-gray-300"
                  )}>
                    {selectedFeatures.includes(feature.id) && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{feature.label}</span>
                </label>
              ))}
            </div>
            {selectedFeatures.length === 0 && (
              <p className="text-xs text-red-600">Please select at least one feature</p>
            )}
            <div className="flex gap-3">
              <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => setCurrentStep(2)}>
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button
                type="button"
                size="lg"
                className="flex-1"
                onClick={handleStep4}
                disabled={selectedFeatures.length === 0}
              >
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 5 */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">File Uploads</h2>
              <p className="text-gray-500">Upload your branding assets and any files that will help us understand your project. All files are optional.</p>
            </div>

            {fileCategories.map((cat) => (
              <div key={cat.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{cat.label}</label>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-xl p-6 text-center transition-all",
                    dragOver === cat.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  )}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(cat.id); }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(null); handleFileDrop(cat.id, e.dataTransfer.files); }}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-1">{cat.desc}</p>
                  <input
                    type="file"
                    multiple
                    accept={cat.accept}
                    className="hidden"
                    id={`file-${cat.id}`}
                    onChange={(e) => handleFileDrop(cat.id, e.target.files)}
                  />
                  <label htmlFor={`file-${cat.id}`} className="text-sm text-blue-600 font-medium cursor-pointer hover:underline">
                    Browse files
                  </label>
                </div>
                {uploadedFiles[cat.id]?.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {uploadedFiles[cat.id].map((file, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                        <span className="text-gray-700 truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(cat.id, i)}
                          className="text-gray-400 hover:text-red-500 ml-2 flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="flex gap-3">
              <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => setCurrentStep(3)}>
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button type="button" size="lg" className="flex-1" onClick={handleStep5}>
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 6 — Summary */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Review & Submit</h2>
              <p className="text-gray-500">Review your information before submitting.</p>
            </div>

            <div className="space-y-4">
              <SummarySection title="Business Information">
                <SummaryRow label="Business" value={formState.step1.businessName} />
                <SummaryRow label="Industry" value={formState.step1.industry} />
                <SummaryRow label="Contact" value={formState.step1.contactName} />
                <SummaryRow label="Email" value={formState.step1.email} />
                <SummaryRow label="Phone" value={formState.step1.phone} />
                {formState.step1.website && <SummaryRow label="Website" value={formState.step1.website} />}
              </SummarySection>

              <SummarySection title="Business Details">
                <SummaryRow label="Services" value={formState.step2.servicesOffered} multiline />
                <SummaryRow label="Service Area" value={formState.step2.serviceArea} />
                <SummaryRow label="Target Audience" value={formState.step2.targetAudience} />
              </SummarySection>

              <SummarySection title="Design Preferences">
                <SummaryRow label="Color Palette" value={formState.step3.preferredColors} />
                <SummaryRow label="Style" value={formState.step3.preferredStyle} />
                {formState.step3.websitesTheyLike && (
                  <SummaryRow label="Example Websites" value={formState.step3.websitesTheyLike} />
                )}
              </SummarySection>

              <SummarySection title="Features Selected">
                <div className="flex flex-wrap gap-2">
                  {selectedFeatures.map((f) => {
                    const label = featuresList.find((fl) => fl.id === f)?.label || f;
                    return (
                      <span key={f} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                        {label}
                      </span>
                    );
                  })}
                </div>
              </SummarySection>

              <SummarySection title="Uploaded Files">
                {Object.keys(uploadedFiles).length === 0 ? (
                  <p className="text-sm text-gray-400">No files uploaded</p>
                ) : (
                  Object.entries(uploadedFiles).map(([cat, files]) => (
                    <div key={cat} className="mb-2">
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{cat}</div>
                      {files.map((f, i) => (
                        <div key={i} className="text-sm text-gray-700">{f.name}</div>
                      ))}
                    </div>
                  ))
                )}
              </SummarySection>
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                {submitError}
              </div>
            )}

            <div className="flex gap-3">
              <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => setCurrentStep(4)}>
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button
                type="button"
                size="lg"
                className="flex-1"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : <>Submit Project <ArrowRight className="ml-2 w-4 h-4" /></>}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummarySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
      </div>
      <div className="p-5 space-y-2">{children}</div>
    </div>
  );
}

function SummaryRow({ label, value, multiline }: { label: string; value?: string; multiline?: boolean }) {
  if (!value) return null;
  return (
    <div className={`flex gap-3 text-sm ${multiline ? "flex-col" : ""}`}>
      <span className="text-gray-400 font-medium min-w-[120px] flex-shrink-0">{label}</span>
      <span className="text-gray-700">{value}</span>
    </div>
  );
}
