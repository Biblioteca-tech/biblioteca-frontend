"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { livrosAPI } from "../api/api"
import { toast } from "react-toastify"
import { ArrowLeft, Download, Loader2 } from "lucide-react"

export const LivroView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pdfUrl, setPdfUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [canDownload, setCanDownload] = useState(false)

  useEffect(() => {
    fetchPdf()
  }, [id])

  const fetchPdf = async () => {
    try {
      const response = await livrosAPI.getPdf(id);

      // Lê header em lowercase
      const canDownload = response.headers["x-can-download"] === "true";
      console.log("Can Download Header:", canDownload);
      console.log("Headers recebidos:", response.headers);
      console.log("x-can-download:", response.headers["x-can-download"]);
      setCanDownload(canDownload);

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);

    } catch (error) {
      console.error(error);
      if (error.response?.status === 403) {
        toast.error("Você não tem acesso a este livro.");
      } else {
        toast.error("Erro ao carregar o PDF do livro");
      }
      navigate("/meus-livros");
    } finally {
      setLoading(false);
    }
  };


  const handleDownload = () => {
    if (!canDownload) {
      toast.error("Você só pode baixar este livro se tiver COMPRADO")
      return
    }

    if (pdfUrl) {
      const link = document.createElement("a")
      link.href = pdfUrl
      link.download = `livro-${id}.pdf`
      link.click()
      toast.success("Download iniciado!")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando livro...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/meus-livros")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Voltar para Biblioteca</span>
            </button>

            {/* === DOWNLOAD BLOQUEADO POR STATUS === */}
            <button
              onClick={handleDownload}
              disabled={!canDownload}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors 
                ${canDownload ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-gray-300 text-gray-600 cursor-not-allowed"}
              `}
            >
              <Download className="h-4 w-4" />
              <span>{canDownload ? "Baixar PDF" : "Download indisponível"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {pdfUrl ? (
          <div
            className="bg-card border border-border rounded-xl overflow-hidden"
            style={{ height: "calc(100vh - 200px)" }}
          >
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full"
              title="PDF Viewer"
            />
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Não foi possível carregar o PDF</p>
          </div>
        )}
      </div>
    </div>
  )
}
