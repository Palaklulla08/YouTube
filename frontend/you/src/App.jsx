
import { Route, Routes } from 'react-router'
import './App.css'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Home from './pages/Home'

function App() {
  

  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/signin" element={<SignIn/>}/>
      <Route path="/signup" element={<SignUp/>}/>

      
    </Routes>
    
        
    </>
  )
}

export default App
