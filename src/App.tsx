// App.tsx
import { Outlet } from 'react-router-dom'
import './App.css'
import { FooterComponent } from './components/FooterComponent'
import { NavbarComponent } from './components/NavbarComponent'
import { useTheme } from './ThemeProvider'


function App() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <>
      <NavbarComponent isDark={isDark} onToggleTheme={toggleTheme} />
      <Outlet />
      <FooterComponent />
    </>
  )
}

export default App