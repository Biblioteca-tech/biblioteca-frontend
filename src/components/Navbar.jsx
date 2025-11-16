"use client"

import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthProvider"
import { BookOpen, ShoppingCart, LogOut, User, LayoutDashboard, BookMarked, Users, UserCog } from "lucide-react"
import { useCart } from "../context/CartContext"

export const Navbar = () => {
  const { user, logout, isCliente, isFuncionario, isAdmin } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-amber-300 bg-clip-text text-transparent">
              Neo-Xandria
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Livros
                </Link>

                {isCliente() && (
                  <>
                    <Link
                      to="/meus-livros"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Minha Biblioteca
                    </Link>
                    <Link
                      to="/meus-pedidos"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Meus Pedidos
                    </Link>
                  </>
                )}

                {(isFuncionario() || isAdmin()) && (
                  <>
                    <Link
                      to="/funcionario/livros"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      <BookMarked className="h-4 w-4" />
                      Gerenciar Livros
                    </Link>
                    <Link
                      to="/admin/clientes"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      <Users className="h-4 w-4" />
                      Clientes
                    </Link>
                  </>
                )}

                {isAdmin() && (
                  <>
                    <Link
                      to="/admin/funcionarios"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      <UserCog className="h-4 w-4" />
                      Funcionários
                    </Link>
                    <Link
                      to="/admin/dashboard"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </>
                )}

                {/* Cart Icon */}
                {isCliente() && (
                  <button
                    onClick={() => navigate("/carrinho")}
                    className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                        {cart.length}
                      </span>
                    )}
                  </button>
                )}

                {/* User Menu */}
                <div className="flex items-center gap-3 pl-3 border-l border-border">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {isAdmin() ? (
                      <button
                        onClick={() => navigate("/admin/perfil")}
                        className="text-sm text-foreground hover:text-primary transition-colors"
                      >
                        {user.email}
                      </button>
                    ) : isCliente() ? (
                      <button
                        onClick={() => navigate("/perfil")}
                        className="text-sm text-foreground hover:text-primary transition-colors"
                      >
                        {user.email}
                      </button>
                    ) : (
                      <span className="text-sm text-foreground">{user.email}</span>
                    )}


                    {isAdmin() && (
                      <span className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">Admin</span>
                    )}

                    {isFuncionario() && !isAdmin() && (
                      <span className="px-2 py-0.5 text-xs bg-accent/20 text-accent rounded-full">Funcionário</span>
                    )}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    title="Sair"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Login
                </Link>
                <Link
                  to="/cadastro"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
