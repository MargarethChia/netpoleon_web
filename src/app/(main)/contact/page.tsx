'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { getVendorRegistrationFormUrl } from '@/lib/storage';

export default function ContactUs() {
  const [subject, setSubject] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    message: '',
  });
  const [partnerFile, setPartnerFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const subjectOptions = [
    'General Inquiry',
    'Service Request',
    'Technical Support',
    'Deal Registration',
    'Apply for Partnership',
    'Other',
  ];

  const isPartnerApplication = subject === 'Apply for Partnership';
  const isVendorPartnership = subject === 'Vendor Partnership';

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const payload = {
        ...formData,
        subject,
        partnerFile: partnerFile ? partnerFile.name : null,
        isPartnerApplication,
        isVendorPartnership,
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message:
            'Thank you! Your message has been sent successfully. You will receive a confirmation email shortly.',
        });

        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          company: '',
          message: '',
        });
        setSubject('');
        setPartnerFile(null);
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Failed to send message. Please try again.',
        });
      }
    } catch {
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section
        className="py-20 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Badge
              variant="outline"
              className="text-orange-600 border-orange-600 px-4 py-2 text-sm font-medium mb-6"
            >
              Get in Touch
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Contact{' '}
              <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 bg-clip-text text-transparent">
                Netpoleon
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Ready to strengthen your cybersecurity posture? Get in touch with
              our experts to discuss how we can help secure your organization.
            </p>
          </motion.div>
        </div>
      </motion.section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Submit Status Messages */}
        {submitStatus.type && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 p-4 rounded-lg ${
              submitStatus.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {submitStatus.message}
          </motion.div>
        )}

        {/* Main Contact Form */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Send us a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="john.doe@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Company Name"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                  >
                    <option value="">Select a subject...</option>
                    {subjectOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right Column - Message/File Upload */}
              <div className="space-y-6">
                {isVendorPartnership ? (
                  <>
                    {/* Vendor Partnership Upload Section */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="mb-3">Vendor Partnership Information</h4>
                      <p className="text-gray-600 text-sm mb-4">
                        Download our partnership information package to get
                        started.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          // Create a mock PDF download for vendor partnership
                          const link = document.createElement('a');
                          link.href =
                            'data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA1MAo+PgpzdHJlYW0KQlQKL0YxIDEyIFRmCjEwMCA3MDAgVGQKKE5ldHBvbGVvbiBWZW5kb3IgUGFydG5lcnNoaXAgSW5mb3JtYXRpb24pIFRqCkVUCnN0cmVhbQplbmRvYmoKeHJlZgowIDUKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAowMDAwMDAwMjA0IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNQovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKMzA0CiUlRU9GCg==';
                          link.download =
                            'Netpoleon-Vendor-Partnership-Info.pdf';
                          link.click();
                        }}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center mb-4"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Download Partnership Info
                      </button>
                    </div>

                    <div>
                      <label htmlFor="message" className="block mb-2">
                        Additional Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="Tell us about your vendor partnership interest..."
                      ></textarea>
                    </div>
                  </>
                ) : isPartnerApplication ? (
                  <>
                    {/* Download Template Section */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="mb-3">Partnership Application</h4>
                      <p className="text-gray-600 text-sm mb-4">
                        Download our vendor registration form to get started.
                        Please send an email to au.sales@netpoleons.com to
                        complete your partnership application.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          // Download the real Vendor Registration Form
                          const registrationFormUrl =
                            getVendorRegistrationFormUrl();
                          window.open(
                            registrationFormUrl,
                            '_blank',
                            'noopener,noreferrer'
                          );
                        }}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center mb-4"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Download Application Template
                      </button>
                    </div>

                    <div>
                      <label htmlFor="message" className="block mb-2">
                        Additional Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="Tell us about your partnership goals..."
                      ></textarea>
                    </div>
                  </>
                ) : (
                  <div>
                    <label htmlFor="message" className="block mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={12}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="Tell us about your project or inquiry..."
                    ></textarea>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isPartnerApplication}
              className={`w-full px-8 py-3 rounded-lg transition-colors ${
                isSubmitting || isPartnerApplication
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:bg-orange-700'
              } text-white`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </span>
              ) : isPartnerApplication ? (
                'Download Application and Submit to au.sales@netpoleons.com'
              ) : isVendorPartnership ? (
                'Submit Vendor Inquiry'
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </motion.div>

        {/* Get in Touch Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3 className="text-xl mb-6">Get in Touch</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="mb-2">Email</h4>
              <p className="text-gray-600">au.sales@netpoleons.com</p>
            </div>
            <div>
              <h4 className="mb-2">Address</h4>
              <p className="text-gray-600 pb-4">
                1514/401 Docklands Drive, Docklands, VIC 3008
              </p>
              <p className="text-gray-600">9/70 Pitt St, Sydney, NSW 2000</p>
            </div>
            <div>
              <h4 className="mb-2">Business Hours</h4>
              <p className="text-gray-600">
                Monday – Friday: 9:00 – 5:00 pm
                <br />
                24/7 Technical On-call
              </p>
            </div>
          </div>
        </motion.div>

        {/* Phone Number at Bottom */}
        <motion.div
          className="text-center mt-16 pt-8 border-t border-orange-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <p className="text-gray-600 mb-2">Need immediate assistance?</p>
          <a
            href="tel:+1-555-123-4567"
            className="text-2xl font-bold text-orange-600 hover:text-orange-700 transition-colors"
          >
            1300 193 170
          </a>
        </motion.div>
      </div>
    </div>
  );
}
