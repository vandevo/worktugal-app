import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ProductGrid } from './ProductGrid';
import { Calculator, FileText, Users, Briefcase } from 'lucide-react';

export function ServicesPage() {
  return (
    <>
      <Helmet>
        <title>Services - Worktugal</title>
        <meta name="description" content="Professional accounting and business services for expats and digital nomads in Portugal." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                Professional Services
              </h1>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Expert accounting and tax services designed specifically for expats, digital nomads, and businesses in Portugal.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Tax Optimization</h3>
                <p className="text-gray-600 mt-2">Maximize deductions and minimize tax burden</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Compliance</h3>
                <p className="text-gray-600 mt-2">Stay compliant with Portuguese tax laws</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Expert Support</h3>
                <p className="text-gray-600 mt-2">OCC-certified accountants at your service</p>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Business Setup</h3>
                <p className="text-gray-600 mt-2">Complete freelancer and business registration</p>
              </div>
            </div>

            {/* Services Grid */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Choose Your Service
              </h2>
              <ProductGrid />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}