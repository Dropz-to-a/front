import { Link } from 'react-router-dom'

const navigateToTerms = () => {
  window.open('/terms', '_blank')
}

const Footer = () => {
  return (
    <div>
      <footer className="border-t border-gray-100">
        <div className="flex flex-col gap-3 px-4 py-8 mx-auto text-sm text-gray-500 max-w-7xl sm:px-6 lg:px-8 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} JobMatch Manager. All rights reserved.</p>
          <div className="flex gap-4">
            <div onClick={navigateToTerms} className="cursor-pointer hover:text-gray-700">
              이용약관
            </div>
            <Link to="/privacy" className="hover:text-gray-700">
              개인정보처리방침
            </Link>
            <Link to="/contact" className="hover:text-gray-700">
              문의하기
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
