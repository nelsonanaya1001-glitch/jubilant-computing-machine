"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Get In Touch</h1>
          <p className="text-xl text-slate-300">
            Have questions or want to discuss your project? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Let's talk about your project</h2>
              <p className="text-gray-500 leading-relaxed mb-10">
                Whether you're ready to start immediately or still exploring your options, we're happy to answer questions and share ideas. No commitment required.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Email Us</div>
                    <a href="mailto:hello@launchboarding.com" className="text-blue-600 hover:underline">
                      hello@launchboarding.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Call Us</div>
                    <a href="tel:+15551234567" className="text-blue-600 hover:underline">
                      +1 (555) 123-4567
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Location</div>
                    <div className="text-gray-500">Remote — Available Worldwide</div>
                  </div>
                </div>
              </div>

              <div className="mt-10 bg-blue-50 rounded-2xl p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Ready to start your project?</h4>
                <p className="text-sm text-gray-500 mb-4">
                  Our intake form takes 10 minutes and gives us everything we need to prepare a proposal.
                </p>
                <a href="/get-started" className="text-blue-600 font-semibold text-sm hover:underline">
                  Complete the Project Intake Form →
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500">
                    Thank you for reaching out. We'll get back to you within one business day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="First Name" placeholder="John" required />
                    <Input label="Last Name" placeholder="Smith" required />
                  </div>
                  <Input label="Email Address" type="email" placeholder="john@company.com" required />
                  <Input label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" />
                  <Input label="Company Name" placeholder="Your Company LLC" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Service Interested In</label>
                    <select className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all">
                      <option value="">Select a service...</option>
                      <option>Business Website</option>
                      <option>E-Commerce Store</option>
                      <option>Landing Page</option>
                      <option>Booking System</option>
                      <option>Not Sure Yet</option>
                    </select>
                  </div>
                  <Textarea
                    label="Your Message"
                    placeholder="Tell us about your project, goals, and timeline..."
                    rows={4}
                    required
                  />
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "Sending..." : <>Send Message <Send className="ml-2 w-4 h-4" /></>}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
