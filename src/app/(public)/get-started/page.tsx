"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Upload, ArrowRight, ArrowLeft, Zap, X, Globe, Palette, Megaphone, PlayCircle } from "lucide-react";
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

const logoOptions = [
  { value: "have", label: "I already have a logo", desc: "You'll upload it in the next step — we'll use it as-is." },
  { value: "redesign", label: "I have one, but want it improved", desc: "We'll refine or modernize your existing logo." },
  { value: "need", label: "I need a logo designed", desc: "We'll create a brand-new logo for you from scratch." },
];

const logoStyleOptions = [
  "Wordmark (text only)",
  "Icon + text (combination)",
  "Icon / symbol only",
  "Lettermark (initials)",
  "Emblem / badge",
  "Not sure — you decide",
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

const serviceCatalogue = [
  {
    key: "website" as const,
    icon: Globe,
    title: "Website",
    price: "from $399",
    desc: "A business site, landing page, booking site or online store.",
    ring: "border-violet-500 bg-violet-500/10",
    dot: "border-violet-500 bg-violet-500",
  },
  {
    key: "brand" as const,
    icon: Palette,
    title: "Brand & Identity",
    price: "from $149",
    desc: "Logo, colour palette, fonts and a brand guide built from scratch.",
    ring: "border-amber-500 bg-amber-500/10",
    dot: "border-amber-500 bg-amber-500",
  },
  {
    key: "ads" as const,
    icon: Megaphone,
    title: "Meta Ads",
    price: "from $299/mo",
    desc: "Facebook & Instagram campaigns that bring customers to you.",
    ring: "border-emerald-500 bg-emerald-500/10",
    dot: "border-emerald-500 bg-emerald-500",
  },
];

/**
 * Paste a YouTube video ID here to show a walkthrough on the Meta Ads step
 * (the part after "v=" in a YouTube URL). Left empty, the step shows the
 * written step-by-step instead — we don't embed a video we can't verify.
 */
const ADS_VIDEO_ID = "";

type StepKey =
  | "services" | "business" | "details"
  | "design" | "features" | "brand" | "ads"
  | "files" | "review";

interface FormState {
  step1: Partial<Step1Data>;
  step2: Partial<Step2Data>;
  step3: Partial<Step3Data>;
  step4: { featuresNeeded: string[] };
  addOns: { branding: boolean; ads: boolean };
  files: { [category: string]: File[] };
}

export default function GetStartedPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [services, setServices] = useState({ website: true, brand: false, ads: false });

  // The form adapts to what they picked: a brand-only order never sees website
  // design questions, and ads questions only appear if ads were chosen.
  const stepDefs = useMemo(() => {
    const defs: { key: StepKey; label: string }[] = [
      { key: "services", label: "Services" },
      { key: "business", label: "Business Info" },
      { key: "details", label: "Business Details" },
    ];
    if (services.website) {
      defs.push({ key: "design", label: "Design" });
      defs.push({ key: "features", label: "Features" });
    }
    if (services.brand) defs.push({ key: "brand", label: "Logo & Brand" });
    if (services.ads) defs.push({ key: "ads", label: "Meta Ads" });
    defs.push({ key: "files", label: "Files" });
    defs.push({ key: "review", label: "Review" });
    return defs;
  }, [services]);

  const steps = stepDefs.map((d) => d.label);
  const stepIndex = Math.min(currentStep, stepDefs.length - 1);
  const stepKey = stepDefs[stepIndex].key;
  const anyService = services.website || services.brand || services.ads;

  const goNext = () => setCurrentStep((i) => Math.min(stepDefs.length - 1, i + 1));
  const goBack = () => setCurrentStep((i) => Math.max(0, i - 1));

  const [formState, setFormState] = useState<FormState>({
    step1: {},
    step2: {},
    step3: { preferredColors: "", preferredStyle: "", hasLogo: "" },
    step4: { featuresNeeded: [] },
    addOns: { branding: false, ads: false },
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
  const [adsBudget, setAdsBudget] = useState("");
  const [adsGoal, setAdsGoal] = useState("");
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
    goNext();
  }

  async function handleStep2(data: Step2Data) {
    setFormState((prev) => ({ ...prev, step2: data }));
    goNext();
  }

  async function handleStep3(data: Step3Data) {
    setFormState((prev) => ({ ...prev, step3: data }));
    goNext();
  }

  function handleStep4() {
    if (selectedFeatures.length === 0) return;
    setFormState((prev) => ({ ...prev, step4: { featuresNeeded: selectedFeatures } }));
    goNext();
  }

  function handleStep5() {
    setFormState((prev) => ({ ...prev, files: uploadedFiles }));
    goNext();
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
        featuresNeeded: JSON.stringify(services.website ? selectedFeatures : []),
        wantsWebsite: String(services.website),
        wantsBranding: String(services.brand),
        wantsAds: String(services.ads),
        adsMonthlyBudget: services.ads ? adsBudget : "",
        adsGoal: services.ads ? adsGoal : "",
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
      <div className="min-h-screen bg-[#080810] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Project Submitted!</h1>
          <p className="text-white/50 mb-6">
            Thank you for submitting your project details. Our team will review your information and reach out within 1 business day to discuss next steps.
          </p>
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-5 text-left mb-6">
            <h4 className="font-semibold text-white mb-2">What happens next?</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> We review your project details</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Discovery call to align on scope & goals</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Custom proposal sent within 24–48 hours</li>
            </ul>
          </div>

          {/* Stay in touch — set up portal access to message us */}
          {portalDone ? (
            <div className="bg-green-50 border border-green-100 rounded-xl p-5 text-left mb-8">
              <h4 className="font-semibold text-white mb-1">Your portal is ready</h4>
              <p className="text-sm text-white/60 mb-3">
                Sign in any time to track progress and message us directly.
              </p>
              <a href="/login">
                <Button className="w-full" size="lg">Go to Sign In</Button>
              </a>
            </div>
          ) : accountCreated ? (
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 text-left mb-8">
              <h4 className="font-semibold text-white mb-1">Stay in touch</h4>
              <p className="text-sm text-white/50 mb-4">
                Create a password to access your client portal — track your project status and message us directly, any time.
              </p>
              <div className="space-y-3">
                <Input tone="dark"
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
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 text-left mb-8">
              <p className="text-sm text-white/50 mb-3">
                You can track this project and message us from your client portal.
              </p>
              <a href="/login"><Button variant="outline" className="w-full">Sign In to Your Portal</Button></a>
            </div>
          )}

          <a href="/" className="text-violet-400 font-semibold hover:underline">← Return to Homepage</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080810]">
      {/* Top bar */}
      <div className="bg-[#080810]/90 backdrop-blur-md border-b border-white/10 sticky top-16 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-violet-400" />
            <span className="font-semibold text-white">Project Intake Form</span>
            <span className="text-white/30 text-sm ml-2">Step {currentStep + 1} of {steps.length}</span>
          </div>
          {/* Progress bar */}
          <div className="flex items-center gap-1">
            {steps.map((step, i) => (
              <div key={step} className="flex-1 flex items-center gap-1">
                <div
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-all duration-300",
                    i <= currentStep ? "bg-violet-500" : "bg-white/10"
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
                  i === currentStep ? "text-violet-400" : i < currentStep ? "text-white/50" : "text-white/25"
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
        {/* Step: choose services */}
        {stepKey === "services" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">What do you need?</h2>
              <p className="text-white/50">
                Pick everything you&apos;re interested in. We&apos;ll only ask questions about what
                you choose.
              </p>
            </div>

            <div className="space-y-3">
              {serviceCatalogue.map((sv) => {
                const on = services[sv.key];
                return (
                  <button
                    key={sv.key}
                    type="button"
                    onClick={() => setServices((prev) => ({ ...prev, [sv.key]: !prev[sv.key] }))}
                    className={cn(
                      "w-full text-left p-5 rounded-xl border-2 transition-all",
                      on ? sv.ring : "border-white/10 hover:border-white/20"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
                          on ? sv.dot : "border-white/15"
                        )}
                      >
                        {on && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <sv.icon className="w-5 h-5 text-white/50 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="font-semibold text-white">{sv.title}</span>
                          <span className="text-xs font-bold text-white/40">{sv.price}</span>
                        </div>
                        <p className="text-sm text-white/50 mt-1 leading-relaxed">{sv.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {services.website && services.brand && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                Nice — bundling branding with a website saves you $50.
              </div>
            )}

            {!anyService && (
              <p className="text-xs text-red-400">Please choose at least one service to continue.</p>
            )}

            <p className="text-xs text-white/30">
              Not sure yet? Pick what sounds closest — nothing is charged now, and we&apos;ll
              confirm everything before any work starts.
            </p>

            <Button type="button" size="lg" className="w-full" onClick={goNext} disabled={!anyService}>
              Continue <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Step: brand & logo direction (only when branding was chosen) */}
        {stepKey === "brand" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Your logo &amp; brand</h2>
              <p className="text-white/50">
                Tell us what you want your identity to look like. The more detail you give, the
                closer we&apos;ll get it on the first round.
              </p>
            </div>

            {/* Only asked here when there's no website step to ask it in. */}
            {!services.website && (
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Do you have a logo today?
                </label>
                <div className="space-y-2">
                  {logoOptions.map((opt) => (
                    <label
                      key={opt.value}
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                        form3.watch("hasLogo") === opt.value
                          ? "border-violet-500 bg-violet-500/10"
                          : "border-white/10 hover:border-white/20"
                      )}
                    >
                      <input type="radio" value={opt.value} {...form3.register("hasLogo")} className="sr-only" />
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5",
                          form3.watch("hasLogo") === opt.value ? "border-violet-500 bg-violet-500" : "border-white/15"
                        )}
                      />
                      <div>
                        <div className="text-sm font-medium text-white">{opt.label}</div>
                        <div className="text-xs text-white/40 mt-0.5">{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

                <div className="mt-4 space-y-5 rounded-xl border-2 border-violet-500/30 bg-violet-500/10 p-5">
                  <p className="text-sm text-white/60">
                    Tell us exactly how you'd like your logo to look. The more detail you share, the closer we'll get it on the first try.
                  </p>

                  <Input tone="dark"
                    label="Exact text / wording for the logo"
                    placeholder="e.g., Acme Co. — or a tagline you want included"
                    {...form3.register("logoText")}
                  />

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-3">Logo type you prefer</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {logoStyleOptions.map((style) => (
                        <label
                          key={style}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all",
                            form3.watch("logoStyle") === style
                              ? "border-violet-500 bg-violet-500/10"
                              : "border-white/10 bg-white/5 hover:border-white/20"
                          )}
                        >
                          <input type="radio" value={style} {...form3.register("logoStyle")} className="sr-only" />
                          <div className={cn(
                            "w-4 h-4 rounded-full border-2 flex-shrink-0",
                            form3.watch("logoStyle") === style ? "border-violet-500 bg-violet-500" : "border-white/15"
                          )} />
                          <span className="text-sm font-medium text-white/70">{style}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Input tone="dark"
                    label="Logo colors (optional)"
                    placeholder="e.g., Same as my website colors, or gold & black, etc."
                    {...form3.register("logoColorNotes")}
                  />

                  <Textarea tone="dark"
                    label="Describe exactly how you want it"
                    placeholder="Any icons, symbols, imagery, or feeling you want the logo to capture. e.g., 'A minimal truck icon next to the name, modern and bold, conveys speed and trust.'"
                    rows={4}
                    {...form3.register("logoIdeas")}
                  />

                  <Textarea tone="dark"
                    label="Logos you admire (optional)"
                    placeholder="Name brands or paste links to logos whose style you like..."
                    rows={2}
                    {...form3.register("logoInspiration")}
                  />
                </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" size="lg" className="flex-1" onClick={goBack}>
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button
                type="button"
                size="lg"
                className="flex-1"
                onClick={() => {
                  setFormState((prev) => ({ ...prev, step3: { ...prev.step3, ...form3.getValues() } }));
                  goNext();
                }}
              >
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step: Meta Ads rundown (only when ads were chosen) */}
        {stepKey === "ads" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">How Meta Ads will work</h2>
              <p className="text-white/50">
                A quick rundown so you know exactly what you&apos;re signing up for, then two
                questions.
              </p>
            </div>

            {ADS_VIDEO_ID ? (
              <div className="relative w-full overflow-hidden rounded-xl border border-white/10" style={{ paddingTop: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${ADS_VIDEO_ID}`}
                  title="How Meta Ads work"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <PlayCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <p className="text-sm text-white/50">
                  A short walkthrough video is coming soon. The steps below cover everything in the
                  meantime.
                </p>
              </div>
            )}

            <div className="divide-y divide-white/5 rounded-xl border border-white/10 bg-white/[0.02]">
              {[
                { t: "We set up tracking", d: "We connect the Meta Pixel and Conversions API to your site so every click, lead and sale is measured. Without this you're flying blind." },
                { t: "We build your audiences", d: "We research who actually buys from you — by location, interest and behaviour — and build audiences around them, plus a retargeting audience of people who already visited." },
                { t: "We create the ads", d: "Images and copy written for your offer. We launch several versions so we can see which one people respond to." },
                { t: "Meta learns (7–14 days)", d: "Early on, Meta spends some budget learning who converts. Results usually look rough for the first week or two — that's normal, not a failure." },
                { t: "We cut losers, scale winners", d: "Once there's data, we turn off what isn't working and put more budget behind what is. This is the part that compounds." },
                { t: "You get a report", d: "What you spent, what came back, and what we're changing next. No jargon." },
              ].map((st, i) => (
                <div key={st.t} className="flex gap-4 p-5">
                  <span className="font-mono text-xs text-emerald-400 flex-shrink-0 pt-0.5">0{i + 1}</span>
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">{st.t}</div>
                    <p className="text-sm text-white/45 leading-relaxed">{st.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.07] p-4">
              <p className="text-sm text-white/60 leading-relaxed">
                <span className="font-semibold text-white">Your ad budget is separate.</span> It&apos;s
                paid straight to Meta from your own ad account, never through us — so you keep
                control of the spending and ownership of the account.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Roughly what monthly ad budget did you have in mind?
              </label>
              <select
                value={adsBudget}
                onChange={(e) => setAdsBudget(e.target.value)}
                className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              >
                <option value="" className="bg-zinc-900">Select a range…</option>
                {["Under $500/mo", "$500–1,500/mo", "$1,500–5,000/mo", "$5,000+/mo", "Not sure yet"].map((b) => (
                  <option key={b} value={b} className="bg-zinc-900">{b}</option>
                ))}
              </select>
              <p className="text-xs text-white/30 mt-2">
                This is what you&apos;d pay Meta, not us. It helps us recommend the right plan.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                What should the ads actually achieve?
              </label>
              <Textarea
                tone="dark"
                value={adsGoal}
                onChange={(e) => setAdsGoal(e.target.value)}
                placeholder="e.g. Book 10 more appointments a week, sell more of a specific product, get quote requests from local businesses…"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" size="lg" className="flex-1" onClick={goBack}>
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button type="button" size="lg" className="flex-1" onClick={goNext}>
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {stepKey === "business" && (
          <form onSubmit={form1.handleSubmit(handleStep1)} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Business Information</h2>
              <p className="text-white/50">Tell us about your business so we can tailor the right solution.</p>
            </div>
            <Input tone="dark"
              label="Business Name *"
              placeholder="Acme Corporation"
              {...form1.register("businessName")}
              error={form1.formState.errors.businessName?.message}
            />
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Industry *</label>
              <select
                {...form1.register("industry")}
                className="flex h-11 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
              >
                <option value="">Select your industry...</option>
                {industries.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
              {form1.formState.errors.industry && (
                <p className="mt-1 text-xs text-red-600">{form1.formState.errors.industry.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input tone="dark"
                label="Your Name *"
                placeholder="Jane Smith"
                {...form1.register("contactName")}
                error={form1.formState.errors.contactName?.message}
              />
              <Input tone="dark"
                label="Email Address *"
                type="email"
                placeholder="jane@company.com"
                {...form1.register("email")}
                error={form1.formState.errors.email?.message}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input tone="dark"
                label="Phone Number *"
                type="tel"
                placeholder="+1 (555) 000-0000"
                {...form1.register("phone")}
                error={form1.formState.errors.phone?.message}
              />
              <Input tone="dark"
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
        {stepKey === "details" && (
          <form onSubmit={form2.handleSubmit(handleStep2)} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Business Details</h2>
              <p className="text-white/50">Help us understand what you do and who you serve.</p>
            </div>
            <div>
              <Textarea tone="dark"
                label="Services You Offer * (be detailed — at least 50 words)"
                placeholder="Describe your products or services in detail. The more you share — what you offer, who it's for, what makes you different, your pricing approach, and any specialties — the better we can build for you. Aim for at least 50 words."
                rows={5}
                {...form2.register("servicesOffered")}
                error={form2.formState.errors.servicesOffered?.message}
              />
              {(() => {
                const words = (form2.watch("servicesOffered") || "").trim().split(/\s+/).filter(Boolean).length;
                return (
                  <p className={cn("mt-1 text-xs", words >= 50 ? "text-green-600" : "text-white/30")}>
                    {words} / 50 words {words >= 50 ? "✓" : ""}
                  </p>
                );
              })()}
            </div>
            <Input tone="dark"
              label="Service Area / Location *"
              placeholder="e.g., New York City, Nationwide, Online"
              {...form2.register("serviceArea")}
              error={form2.formState.errors.serviceArea?.message}
            />
            <Input tone="dark"
              label="Target Audience *"
              placeholder="e.g., Small business owners aged 30–55 in the US"
              {...form2.register("targetAudience")}
              error={form2.formState.errors.targetAudience?.message}
            />
            <Textarea tone="dark"
              label="About Your Business *"
              placeholder="Give us a summary of your business — your story, mission, and what makes you different..."
              rows={4}
              {...form2.register("businessDescription")}
              error={form2.formState.errors.businessDescription?.message}
            />
            <div className="flex gap-3">
              <Button type="button" variant="outline" size="lg" className="flex-1" onClick={goBack}>
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button type="submit" size="lg" className="flex-1">
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </form>
        )}

        {/* Step 3 */}
        {stepKey === "design" && (
          <form onSubmit={form3.handleSubmit(handleStep3)} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Design Preferences</h2>
              <p className="text-white/50">Help us understand your aesthetic so we can design something you'll love.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-3">Color Palette Preference *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {colorOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                      form3.watch("preferredColors") === opt.value
                        ? "border-violet-500 bg-violet-500/10"
                        : "border-white/10 hover:border-white/15"
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
                        <div key={c} className="w-5 h-5 rounded-full border border-white/10" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-white/70">{opt.label}</span>
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
                  showCustomColors ? "border-violet-500 bg-violet-500/15 text-violet-300" : "border-dashed border-white/15 text-white/60 hover:border-white/30"
                )}
              >
                + Choose my own exact colors
              </button>

              {showCustomColors && (
                <div className="mt-3 p-4 rounded-xl border-2 border-violet-500/30 bg-violet-500/10">
                  <p className="text-sm text-white/60 mb-3">Pick the exact colors you'd like us to use:</p>
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
                          className="w-14 h-14 rounded-lg border border-white/10 cursor-pointer bg-white/10 p-1"
                        />
                        <span className="text-xs font-medium text-white/60">{label}</span>
                        <span className="text-[10px] text-white/30 uppercase">{customColors[i]}</span>
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
              <label className="block text-sm font-medium text-white/70 mb-3">Website Style / Feel *</label>
              <div className="space-y-2">
                {styleOptions.map((style) => (
                  <label
                    key={style}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                      form3.watch("preferredStyle") === style
                        ? "border-violet-500 bg-violet-500/10"
                        : "border-white/10 hover:border-white/15"
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
                      form3.watch("preferredStyle") === style ? "border-violet-500 bg-violet-500" : "border-white/15"
                    )} />
                    <span className="text-sm font-medium text-white/70">{style}</span>
                  </label>
                ))}
              </div>
              {form3.formState.errors.preferredStyle && (
                <p className="mt-1 text-xs text-red-600">{form3.formState.errors.preferredStyle.message}</p>
              )}
            </div>

            {/* Logo & Branding */}
            <div className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-bold text-white mb-1">Logo &amp; Branding</h3>
              <p className="text-sm text-white/50 mb-4">Do you already have a logo, or would you like us to design one?</p>

              <label className="block text-sm font-medium text-white/70 mb-3">Your logo *</label>
              <div className="space-y-2">
                {logoOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                      form3.watch("hasLogo") === opt.value
                        ? "border-violet-500 bg-violet-500/10"
                        : "border-white/10 hover:border-white/15"
                    )}
                  >
                    <input type="radio" value={opt.value} {...form3.register("hasLogo")} className="sr-only" />
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5",
                      form3.watch("hasLogo") === opt.value ? "border-violet-500 bg-violet-500" : "border-white/15"
                    )} />
                    <div>
                      <span className="text-sm font-medium text-white/70 block">{opt.label}</span>
                      <span className="text-xs text-white/50">{opt.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
              {form3.formState.errors.hasLogo && (
                <p className="mt-1 text-xs text-red-600">{form3.formState.errors.hasLogo.message}</p>
              )}

              {/* If they already have a logo */}
              {form3.watch("hasLogo") === "have" && (
                <div className="mt-3 rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-800">
                  Perfect — you'll be able to upload your logo files in the next step (PNG, SVG, AI, or EPS preferred).
                </div>
              )}

              {(form3.watch("hasLogo") === "need" || form3.watch("hasLogo") === "redesign") && !services.brand && (
                <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                  <p className="text-sm text-amber-200/90 leading-relaxed">
                    <span className="font-semibold text-amber-200">Want us to design it properly?</span>{" "}
                    Our Brand &amp; Identity package covers the logo plus a colour palette, fonts and
                    a brand guide — and it&apos;s $50 cheaper bought with a website.
                  </p>
                  <button
                    type="button"
                    onClick={() => setServices((prev) => ({ ...prev, brand: true }))}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 px-3 py-1.5 text-xs font-semibold text-amber-100 hover:bg-amber-500/30 transition"
                  >
                    Add Brand &amp; Identity (+$99)
                  </button>
                </div>
              )}
            </div>

            <Textarea tone="dark"
              label="Competitor Websites (optional)"
              placeholder="List any competitor websites we should be aware of (one per line)..."
              rows={3}
              {...form3.register("competitorWebsites")}
            />

            {/* Example domains / inspiration */}
            <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-5">
              <h3 className="text-sm font-semibold text-violet-200 mb-1">
                Example websites you'd like yours to look like
              </h3>
              <p className="text-xs text-violet-300 mb-3">
                Share a few domains (e.g. <span className="font-medium">apple.com, stripe.com, airbnb.com</span>)
                whose design, layout, or feel you love. This gives us a clear starting point and helps us match your vision.
              </p>
              <Textarea tone="dark"
                placeholder={"Paste example domains here, one per line:\nhttps://example.com\nhttps://another-site.com"}
                rows={4}
                {...form3.register("websitesTheyLike")}
              />
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" size="lg" className="flex-1" onClick={goBack}>
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button type="submit" size="lg" className="flex-1">
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </form>
        )}

        {/* Step 4 */}
        {stepKey === "features" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Features Needed</h2>
              <p className="text-white/50">Select all the features you'd like on your website.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {featuresList.map((feature) => (
                <label
                  key={feature.id}
                  onClick={() => toggleFeature(feature.id)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                    selectedFeatures.includes(feature.id)
                      ? "border-violet-500 bg-violet-500/10"
                      : "border-white/10 hover:border-white/15"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all",
                    selectedFeatures.includes(feature.id) ? "border-violet-500 bg-violet-500" : "border-white/15"
                  )}>
                    {selectedFeatures.includes(feature.id) && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-white/70">{feature.label}</span>
                </label>
              ))}
            </div>
            {selectedFeatures.length === 0 && (
              <p className="text-xs text-red-600">Please select at least one feature</p>
            )}

            <div className="flex gap-3">
              <Button type="button" variant="outline" size="lg" className="flex-1" onClick={goBack}>
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
        {stepKey === "files" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">File Uploads</h2>
              <p className="text-white/50">Upload your branding assets and any files that will help us understand your project. All files are optional.</p>
            </div>

            {fileCategories.map((cat) => (
              <div key={cat.id}>
                <label className="block text-sm font-medium text-white/70 mb-2">{cat.label}</label>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-xl p-6 text-center transition-all",
                    dragOver === cat.id ? "border-violet-500 bg-violet-500/10" : "border-white/10 hover:border-white/15"
                  )}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(cat.id); }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(null); handleFileDrop(cat.id, e.dataTransfer.files); }}
                >
                  <Upload className="w-8 h-8 text-white/30 mx-auto mb-2" />
                  <p className="text-sm text-white/50 mb-1">{cat.desc}</p>
                  <input
                    type="file"
                    multiple
                    accept={cat.accept}
                    className="hidden"
                    id={`file-${cat.id}`}
                    onChange={(e) => handleFileDrop(cat.id, e.target.files)}
                  />
                  <label htmlFor={`file-${cat.id}`} className="text-sm text-violet-400 font-medium cursor-pointer hover:underline">
                    Browse files
                  </label>
                </div>
                {uploadedFiles[cat.id]?.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {uploadedFiles[cat.id].map((file, i) => (
                      <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 text-sm">
                        <span className="text-white/70 truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(cat.id, i)}
                          className="text-white/30 hover:text-red-500 ml-2 flex-shrink-0"
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
              <Button type="button" variant="outline" size="lg" className="flex-1" onClick={goBack}>
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button type="button" size="lg" className="flex-1" onClick={handleStep5}>
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 6 — Summary */}
        {stepKey === "review" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Review & Submit</h2>
              <p className="text-white/50">Review your information before submitting.</p>
            </div>

            <div className="space-y-4">
              <SummarySection title="Services Requested">
                <div className="flex flex-wrap gap-2">
                  {serviceCatalogue.filter((sv) => services[sv.key]).map((sv) => (
                    <span key={sv.key} className="bg-violet-500/15 text-violet-300 text-xs font-medium px-2.5 py-1 rounded-full">
                      {sv.title}
                    </span>
                  ))}
                </div>
              </SummarySection>

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

              {services.website && (
              <SummarySection title="Design Preferences">
                <SummaryRow label="Color Palette" value={formState.step3.preferredColors} />
                <SummaryRow label="Style" value={formState.step3.preferredStyle} />
                {formState.step3.websitesTheyLike && (
                  <SummaryRow label="Example Websites" value={formState.step3.websitesTheyLike} />
                )}
              </SummarySection>
              )}

              {services.brand && (
              <SummarySection title="Logo & Branding">
                <SummaryRow
                  label="Logo"
                  value={logoOptions.find((o) => o.value === formState.step3.hasLogo)?.label || formState.step3.hasLogo}
                />
                <SummaryRow label="Logo text" value={formState.step3.logoText} />
                <SummaryRow label="Logo type" value={formState.step3.logoStyle} />
                <SummaryRow label="Logo colors" value={formState.step3.logoColorNotes} />
                <SummaryRow label="Logo details" value={formState.step3.logoIdeas} multiline />
                <SummaryRow label="Logo inspiration" value={formState.step3.logoInspiration} multiline />
              </SummarySection>
              )}

              {services.website && (
              <SummarySection title="Features Selected">
                <div className="flex flex-wrap gap-2">
                  {selectedFeatures.map((f) => {
                    const label = featuresList.find((fl) => fl.id === f)?.label || f;
                    return (
                      <span key={f} className="bg-violet-500/15 text-violet-300 text-xs font-medium px-2.5 py-1 rounded-full">
                        {label}
                      </span>
                    );
                  })}
                </div>
              </SummarySection>
              )}

              {services.ads && (
              <SummarySection title="Meta Ads">
                <SummaryRow label="Monthly ad budget" value={adsBudget} />
                <SummaryRow label="Goal" value={adsGoal} multiline />
              </SummarySection>
              )}

              <SummarySection title="Uploaded Files">
                {Object.keys(uploadedFiles).length === 0 ? (
                  <p className="text-sm text-white/30">No files uploaded</p>
                ) : (
                  Object.entries(uploadedFiles).map(([cat, files]) => (
                    <div key={cat} className="mb-2">
                      <div className="text-xs text-white/50 uppercase tracking-wide mb-1">{cat}</div>
                      {files.map((f, i) => (
                        <div key={i} className="text-sm text-white/70">{f.name}</div>
                      ))}
                    </div>
                  ))
                )}
              </SummarySection>
            </div>

            <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-5 text-sm text-violet-200">
              <h4 className="font-semibold mb-1">What happens after you submit</h4>
              <p className="text-violet-200/80 leading-relaxed">
                Once you submit, I'll personally start working on your website right away. I'll email you
                with progress updates and any follow-up questions along the way, so you're never left
                guessing. Most websites are completed and ready to review within <strong>1–3 business days</strong>.
              </p>
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                {submitError}
              </div>
            )}

            <div className="flex gap-3">
              <Button type="button" variant="outline" size="lg" className="flex-1" onClick={goBack}>
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
    <div className="bg-white/[0.03] rounded-xl border border-white/10 overflow-hidden">
      <div className="bg-white/5 px-5 py-3 border-b border-white/10">
        <h4 className="text-sm font-semibold text-white/70">{title}</h4>
      </div>
      <div className="p-5 space-y-2">{children}</div>
    </div>
  );
}

function SummaryRow({ label, value, multiline }: { label: string; value?: string; multiline?: boolean }) {
  if (!value) return null;
  return (
    <div className={`flex gap-3 text-sm ${multiline ? "flex-col" : ""}`}>
      <span className="text-white/30 font-medium min-w-[120px] flex-shrink-0">{label}</span>
      <span className="text-white/70">{value}</span>
    </div>
  );
}
