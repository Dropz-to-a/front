// App.jsx 파일
import '@/index.css'
import AppRouter from '@/routes/AppRouter'
import ToastProvider from '@/components/Toast/ToastProvider'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <>
      <ToastProvider />
      <AppRouter />
    </>
  )
}

export default App
