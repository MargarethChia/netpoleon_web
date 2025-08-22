"use client";

import React, { useState } from 'react';

export default function ContactUs() {
  const [subject, setSubject] = useState('');

  const subjectOptions = [
    'General Inquiry',
    'Vendor Partnership',
    'Service Request',
    'Technical Support',
    'Apply for Partner',
    'Event Partnership',
    'Media Inquiry',
    'Other'
  ];

  const isPartnerApplication = subject === 'Apply for Partner';
  const isVendorPartnership = subject === 'Vendor Partnership';

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <section className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl mb-6">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to get started? We'd love to hear from you. Send us a message and we'll 
            respond as soon as possible.
          </p>
        </section>

        {/* Main Contact Form */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-12">
          <h2 className="text-2xl mb-6">Send us a Message</h2>
          <form className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block mb-2">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block mb-2">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="john.doe@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block mb-2">Company</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Company Name"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block mb-2">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                  >
                    <option value="">Select a subject...</option>
                    {subjectOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
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
                        Download our partnership information package and upload your company profile to get started.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          // Create a mock PDF download for vendor partnership
                          const link = document.createElement('a');
                          link.href = 'data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA1MAo+PgpzdHJlYW0KQlQKL0YxIDEyIFRmCjEwMCA3MDAgVGQKKE5ldHBvbGVvbiBWZW5kb3IgUGFydG5lcnNoaXAgSW5mb3JtYXRpb24pIFRqCkVUCnN0cmVhbQplbmRvYmoKeHJlZgowIDUKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAowMDAwMDAwMjA0IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNQovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKMzA0CiUlRU9GCg==';
                          link.download = 'Netpoleon-Vendor-Partnership-Info.pdf';
                          link.click();
                        }}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center mb-4"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Partnership Info
                      </button>
                    </div>

                    <div>
                      <label htmlFor="vendorFile" className="block mb-2">Upload Company Profile</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          id="vendorFile"
                          name="vendorFile"
                          className="hidden"
                          accept=".pdf,.doc,.docx,.ppt,.pptx"
                        />
                        <label htmlFor="vendorFile" className="cursor-pointer">
                          <div className="text-gray-400 mb-2">
                            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <p className="text-gray-600 mb-1">Click to upload your company profile or product information</p>
                          <p className="text-sm text-gray-500">PDF, DOC, DOCX, PPT, PPTX up to 10MB</p>
                        </label>
                      </div>
                      <p className="text-sm text-gray-600 mt-4">
                        Please email your uploaded documents to: 
                        <a href="mailto:vendors@netpoleon.com" className="text-blue-600 hover:underline ml-1">
                          vendors@netpoleon.com
                        </a>
                      </p>
                    </div>
                  </>
                ) : isPartnerApplication ? (
                  <>
                    {/* Download Template Section */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="mb-3">Partnership Application</h4>
                      <p className="text-gray-600 text-sm mb-4">
                        Download our partner application template to get started.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          // Create a mock PDF download
                          const link = document.createElement('a');
                          link.href = 'data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQlQKL0YxIDEyIFRmCjEwMCA3MDAgVGQKKE5ldHBvbGVvbiBQYXJ0bmVyIEFwcGxpY2F0aW9uIFRlbXBsYXRlKSBUagpFVApzdHJlYW0KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDU4IDAwMDAwIG4gCjAwMDAwMDAxMTUgMDAwMDAgbiAKMDAwMDAwMDIwNCAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDUKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjI5OAolJUVPRgo=';
                          link.download = 'Netpoleon-Partner-Application-Template.pdf';
                          link.click();
                        }}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center mb-4"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Application Template
                      </button>
                    </div>

                    <div>
                      <label htmlFor="partnerFile" className="block mb-2">Upload Partnership Information</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          id="partnerFile"
                          name="partnerFile"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                        />
                        <label htmlFor="partnerFile" className="cursor-pointer">
                          <div className="text-gray-400 mb-2">
                            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <p className="text-gray-600 mb-1">Click to upload your company profile or partnership proposal</p>
                          <p className="text-sm text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                        </label>
                      </div>
                      <p className="text-sm text-gray-600 mt-4">
                        After uploading, please email your completed application to: 
                        <a href="mailto:partnerships@netpoleon.com" className="text-blue-600 hover:underline ml-1">
                          partnerships@netpoleon.com
                        </a>
                      </p>
                    </div>
                  </>
                ) : (
                  <div>
                    <label htmlFor="message" className="block mb-2">Message</label>
                    <textarea
                      id="message"
                      name="message"
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
              className="w-full bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {isPartnerApplication ? 'Submit Application' : isVendorPartnership ? 'Submit Vendor Inquiry' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Get in Touch Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h3 className="text-xl mb-6">Get in Touch</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="mb-2">Email</h4>
              <p className="text-gray-600">info@netpoleon.com</p>
            </div>
            <div>
              <h4 className="mb-2">Address</h4>
              <p className="text-gray-600">
                123 Business Avenue<br />
                Suite 456<br />
                San Francisco, CA 94105
              </p>
            </div>
            <div>
              <h4 className="mb-2">Business Hours</h4>
              <p className="text-gray-600">
                Monday - Friday: 9:00 AM - 6:00 PM PST<br />
                Saturday: 10:00 AM - 4:00 PM PST<br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>

        {/* Phone Number at Bottom */}
        <div className="text-center mt-16 pt-8 border-t">
          <p className="text-gray-600 mb-2">Need immediate assistance?</p>
          <a 
            href="tel:+1-555-123-4567" 
            className="text-2xl font-medium text-gray-900 hover:text-blue-600 transition-colors"
          >
            +1 (555) 123-4567
          </a>
        </div>
      </div>
    </div>
  );
}