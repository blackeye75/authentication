import './App.css'
import { Login } from './compo/Login'
import { Register } from './compo/Register'

function App() {

  return (
    <div className='w-full h-screen bg-[#121212]' >
   <Login/>
   {/* <h1>hello</h1> */}
   <Register/> 
    </div>
  )
}

export default App
