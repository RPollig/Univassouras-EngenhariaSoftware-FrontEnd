import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Painel from './pages/Painel'
import Contatos from './pages/Contatos'
import NaoEncontrada from './pages/NaoEncontrada'

// O App é a tabela de rotas
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Painel />} />
          <Route path="contatos" element={<Contatos />} />
        </Route>
      </Route>
      <Route path="*" element={<NaoEncontrada />} />
    </Routes>
  )
}
