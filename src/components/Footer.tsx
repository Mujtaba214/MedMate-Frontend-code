import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span className="text-gray-600">by MedMate Team</span>
          </div>

          <div className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} MedMate. All rights reserved.
          </div>

          <div className="flex space-x-6 text-sm text-gray-600">
            <button className="hover:text-blue-600 transition-colors">Privacy Policy</button>
            <button className="hover:text-blue-600 transition-colors">Terms of Service</button>
            <button className="hover:text-blue-600 transition-colors">Contact Us</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
