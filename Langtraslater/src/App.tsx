import './App.css'
import { Route,BrowserRouter,Routes} from 'react-router-dom'
// pages
import Home from './services/Home'
const App = ()=>{
  return (
    <>
  <BrowserRouter>
      <Routes>

        <Route path='/' element = {<Home/>} />
      </Routes>
  </BrowserRouter>

    </>
  )
}

export default App
