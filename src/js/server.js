const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // --- Rota API: /api/produtos ---
  if (req.method === "GET" && (pathname === "/api/produtos" || pathname === "/api/produtos/")) {
    const produtos = [
      { id: 1, nome: "Camisa Branca Essencial", preco: 189.9, material: "Algodão Orgânico", imagem: "/imgs/camisa.png" },
      { id: 2, nome: "Vestido Midi", preco: 329.9, material: "Linho Misto", imagem: "/imgs/vestido.png" },
      { id: 3, nome: "Calça Pantalona Verde", preco: 299.9, material: "Tencel", imagem: "/imgs/calca.png" },
      { id: 4, nome: "Bolsa de Ombro Artesanal", preco: 149.9, material: "Juta", imagem: "/imgs/bolsa.png" }
    ];
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(produtos));
  }

  // --- Servir arquivos estáticos (CSS, JS, imagens etc) ---
  const filePath = path.join(__dirname, "..", pathname); // sobe um nível (está em src/js/server.js)
  if (pathname.startsWith("/styles/") || pathname.startsWith("/js/") || pathname.startsWith("/imgs/") || pathname.startsWith("/pages/")) {
    return fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("Arquivo não encontrado");
      }
      const ext = path.extname(filePath).toLowerCase();
      const types = {
        ".css": "text/css",
        ".js": "application/javascript",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".ico": "image/x-icon",
        ".html": "text/html"
      };
      res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
      res.end(data);
    });
  }

  // --- Página principal (index.html que você me mandou) ---
  if (pathname === "/" || pathname === "/index.html") {
    const indexPath = path.join(__dirname, "..", "pages", "index.html"); // ajuste conforme sua pasta
    return fs.readFile(indexPath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("Erro ao carregar index.html");
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(data);
    });
  }

  // --- 404 ---
  res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
  res.end("<h1>404 - Página não encontrada</h1>");
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
