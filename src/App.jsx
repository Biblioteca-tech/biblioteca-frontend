import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { AuthProvider } from "./auth/AuthProvider"
import { PrivateRoute } from "./auth/PrivateRoute"
import { Navbar } from "./components/Navbar"
import { CartProvider } from "./context/CartContext"
import { CadastrarFuncionario } from "./pages/admin/CadastrarFuncionario"
import { GerenciarClientes } from "./pages/admin/GerenciarClientes"
import { GerenciarFuncionarios } from "./pages/admin/GerenciarFuncionarios"
import { AdminDashboard } from "./pages/AdminDashboard"
import { CadastrarLivro } from "./pages/CadastrarLivro"
import { Cadastro } from "./pages/Cadastro"
import { Carrinho } from "./pages/Carrinho"
import { ExecutiveDashboard } from "./pages/ExecutiveDashboard"
import { FuncionarioLivroDetalhes } from "./pages/FuncionarioLivroDetalhes"
import { FuncionarioLivros } from "./pages/FuncionarioLivros"
import { Home } from "./pages/Home"
import { LivroDetalhes } from "./pages/LivroDetalhes"
import { LivroView } from "./pages/LivroView"
import { Login } from "./pages/Login"
import { MeusLivros } from "./pages/MeusLivros"
import { MeusPedidos } from "./pages/MeusPedidos"
import { NotFound } from "./pages/NotFound"
import { Perfil } from "./pages/Perfil"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-background">
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/" element={<Home />} />

              <Route path="/livro/:id" element={<LivroDetalhes />} />

              {/* Cliente routes */}
              <Route
                path="/meus-livros"
                element={
                  <PrivateRoute rolesAllowed={["ROLE_CLIENTE"]}>
                    <MeusLivros />
                  </PrivateRoute>
                }
              />
              <Route
                path="/meus-pedidos"
                element={
                  <PrivateRoute rolesAllowed={["ROLE_CLIENTE"]}>
                    <MeusPedidos />
                  </PrivateRoute>
                }
              />
              <Route
                path="/perfil"
                element={
                  <PrivateRoute rolesAllowed={["ROLE_CLIENTE"]}>
                    <Perfil />
                  </PrivateRoute>
                }
              />
              <Route
                path="/livro/:id/ler"
                element={
                  <PrivateRoute rolesAllowed={["ROLE_CLIENTE"]}>
                    <LivroView />
                  </PrivateRoute>
                }
              />
              <Route
                path="/carrinho"
                element={
                  <PrivateRoute rolesAllowed={["ROLE_CLIENTE"]}>
                    <Carrinho />
                  </PrivateRoute>
                }
              />

              {/* Funcionario routes */}
              <Route
                path="/funcionario/livros"
                element={
                  <PrivateRoute rolesAllowed={["ROLE_FUNCIONARIO", "ROLE_ADMINISTRADOR"]}>
                    <FuncionarioLivros />
                  </PrivateRoute>
                }
              />
              <Route
                path="/funcionario/livro/:id"
                element={
                  <PrivateRoute rolesAllowed={["ROLE_FUNCIONARIO", "ROLE_ADMINISTRADOR"]}>
                    <FuncionarioLivroDetalhes />
                  </PrivateRoute>
                }
              />
              <Route
                path="/cadastrar-livro"
                element={
                  <PrivateRoute rolesAllowed={["ROLE_FUNCIONARIO", "ROLE_ADMINISTRADOR"]}>
                    <CadastrarLivro />
                  </PrivateRoute>
                }
              />

              <Route
                path="/admin/clientes"
                element={
                  <PrivateRoute rolesAllowed={["ROLE_FUNCIONARIO", "ROLE_ADMINISTRADOR"]}>
                    <GerenciarClientes />
                  </PrivateRoute>
                }
              />

              <Route
                path="/admin/funcionarios"
                element={
                  <PrivateRoute rolesAllowed={["ROLE_ADMINISTRADOR"]}>
                    <GerenciarFuncionarios />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/cadastrar-funcionario"
                element={
                  <PrivateRoute rolesAllowed={["ROLE_ADMINISTRADOR"]}>
                    <CadastrarFuncionario />
                  </PrivateRoute>
                }
              />

              {/* Admin routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute rolesAllowed={["ROLE_ADMINISTRADOR"]}>
                    <AdminDashboard />
                    <ExecutiveDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/funcionario/livros-detalhes"
                element={
                  <PrivateRoute>
                    <FuncionarioLivroDetalhes />
                  </PrivateRoute>
                }
              />
              <Route
                path="/livros-detalhes"
                element={
                  <PrivateRoute>
                    <LivroDetalhes />
                  </PrivateRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
