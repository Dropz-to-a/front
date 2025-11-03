import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '5px 20px',
        backgroundColor: '#2E80FF',
        borderBottom: '1px solid #ddd',
      }}>
      {/* 로고 영역 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="/logo.svg" alt="Logo" style={{ width: '150px', height: '40px' }} />
      </div>

      {/* 메뉴 링크 */}
      <nav style={{ display: 'flex', gap: '15px', color: 'white' }}>
        <Link to="/">홈</Link>
        <Link to="/about">소개</Link>
        <Link to="/jobs">공고</Link>
        <Link to="/pay">페이</Link>
        <Link to="/start">가입하기</Link>
      </nav>
    </header>
  )
}

export default Header
