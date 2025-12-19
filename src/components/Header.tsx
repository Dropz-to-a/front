import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { logout } from '@/features/auth/authSlice'

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  //  Redux에서 가져오기
  const { token, userType, username } = useAppSelector(s => s.auth)

  const noLoggedIn = !token
  const isLoggedIn = !!token
  // const isCompany = userType === 'company'


  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#2E80FF',
        borderBottom: '1px solid #ddd',
      }}
    >
      {/* 로고 */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        <img src="/logo.svg" alt="Logo" style={{ width: '150px', height: '40px' }} />
      </div>

      {/* 메뉴 */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>

        {/*  비로그인 메뉴 */}
        {noLoggedIn && (
          <>
        <Link to="/" style={{ color: 'white' }}>
          홈
        </Link>
        <Link to="/about" style={{ color: 'white' }}>
          소개
        </Link>
        <Link to="/jobs" style={{ color: 'white' }}>
          공고
        </Link>
          </>
        )}

        {/*  구직자 메뉴 */}
        {isLoggedIn && userType === 'user' && (
          <>
            <Link to="/" style={{ color: 'white' }}>
              홈
            </Link>
            <Link to="/about" style={{ color: 'white' }}>
              소개
            </Link>
            <Link to="/jobs" style={{ color: 'white' }}>
              공고
            </Link>
            <Link to="/my-applications" style={{ color: 'white' }}>
              지원목록
            </Link>
            <Link to="/profile" style={{ color: 'white' }}>
              프로필
            </Link>
          </>
        )}

        {/*  재직자 메뉴 */}
        {/* {isLoggedIn && userType === 'user' && (
          <>
            <Link to="/attendance" style={{ color: 'white' }}>
              출퇴근 관리
            </Link>
            <Link to="/work-dashboard" style={{ color: 'white' }}>
              근무 대시보드
            </Link>
            <Link to="/paylog" style={{ color: 'white' }}>
              급여내역
            </Link>
            <Link to="/profile" style={{ color: 'white' }}>
              프로필
            </Link>
          </>
        )} */}

        {/*  기업 메뉴 */}
        {isLoggedIn && userType === 'company' && (
          <>
            <Link to="/jobmanage" style={{ color: 'white' }}>
              공고관리
            </Link>
            <Link to="/contracts" style={{ color: 'white' }}>
              계약관리
            </Link>
            <Link to="/payroll" style={{ color: 'white' }}>
              급여관리
            </Link>
            <Link to="/jobs/completed/admin" style={{ color: 'white' }}>
              지원자관리
            </Link>
          </>
        )}
      </nav>

      {/* 로그인/회원가입/로그아웃 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {isLoggedIn ? (
          <>
            <span style={{ color: 'white', fontSize: '14px' }}>
              {username}님 환영합니다.
            </span>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#ff4d4d',
                color: 'white',
                borderRadius: '6px',
                padding: '4px 10px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                backgroundColor: 'white',
                color: '#2E80FF',
                borderRadius: '6px',
                padding: '4px 10px',
                fontWeight: 600,
              }}
            >
              로그인
            </Link>

            <Link
              to="/start"
              style={{
                backgroundColor: '#0051C4',
                color: 'white',
                borderRadius: '6px',
                padding: '4px 10px',
                fontWeight: 600,
              }}
            >
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Header
