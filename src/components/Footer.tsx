import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <div>
          <footer className="border-t border-gray-100">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-sm text-gray-500 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <p>© {new Date().getFullYear()} JobMatch Manager. All rights reserved.</p>
                  <div className="flex gap-4">
                      <Link to="/terms" className="hover:text-gray-700">이용약관</Link>
                      <Link to="/privacy" className="hover:text-gray-700">개인정보처리방침</Link>
                      <Link to="/contact" className="hover:text-gray-700">문의하기</Link>
                  </div>
              </div>
          </footer>
    </div>
  );
};

export default Footer;