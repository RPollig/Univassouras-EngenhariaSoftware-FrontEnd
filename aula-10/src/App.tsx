import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './routes/ProtectedRoute'
import Login from './pages/Login'
import Destinos from './pages/Destinos'
import Desejos from './pages/Desejos'
import NaoEncontrada from './pages/NaoEncontrada'

// Aula 9: o App virou a tabela de rotas
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Destinos />} />
          <Route path="desejos" element={<Desejos />} />
        </Route>
      </Route>
      <Route path="*" element={<NaoEncontrada />} />
    </Routes>
  )
}
