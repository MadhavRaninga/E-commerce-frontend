import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className="bg-[#FAF9F6] text-gray-900">
              {/* ================= FOOTER ================= */}
      <footer className="bg-[#FAF9F6] border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-20">

          {/* Top Footer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">

            {/* Brand */}
            <div>
              <h3 className="text-2xl font-bold tracking-widest">
                CLOTHIFY
              </h3>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Premium fashion destination for Men, Women & Kids.
                Discover trends that define your style.
              </p>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Shop</h4>
              <ul className="space-y-4 text-gray-600">
                <li className="hover:text-black cursor-pointer"><Link to="/mens">Men</Link></li>
                <li className="hover:text-black cursor-pointer"><Link to="/womens">Women</Link></li>
                <li className="hover:text-black cursor-pointer"><Link to="/kids">Kids</Link></li>
                <li className="hover:text-black cursor-pointer"><Link to="/newarrival">New Arrivals</Link></li>
                <li className="hover:text-black cursor-pointer"><Link to="/sale">Sale</Link></li>
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Customer Care</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="hover:text-black cursor-pointer">Contact Us</li>
                <li className="hover:text-black cursor-pointer">FAQs</li>
                <li className="hover:text-black cursor-pointer">Shipping & Returns</li>
                <li className="hover:text-black cursor-pointer">Privacy Policy</li>
                <li className="hover:text-black cursor-pointer">Terms & Conditions</li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-5 text-xl text-gray-700">
                <span className="hover:text-black cursor-pointer">📘</span>
                <span className="hover:text-black cursor-pointer">📸</span>
                <span className="hover:text-black cursor-pointer">🐦</span>
                <span className="hover:text-black cursor-pointer">▶️</span>
              </div>
            </div>

          </div>

          {/* Bottom Footer */}
          <div className="mt-16 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">

            <p>
              © {new Date().getFullYear()} Clothify. All rights reserved.
            </p>

            <div className="flex items-center space-x-4 mt-4 md:mt-0 text-lg">
              <span>💳</span>
              <span>💰</span>
              <span>🏦</span>
              <span>📱</span>
            </div>

          </div>

        </div>
      </footer>
    </div>
  )
}

export default Footer
