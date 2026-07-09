import { useState, useRef, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Menu, X, Play, ChevronRight, Mail, Phone, MapPin } from "lucide-react";

import img1 from "../imports/Desktop1/18b0caf3897591d8c1c84007680e45ef3dd38e5e.png";
import img2 from "../imports/Desktop1/938c33b673c85c6cf82ac75d0074f93b0c07b5c6.png";
import img3 from "../imports/Desktop1/48d034b4aef90f7f10b8a26969edc0fab15134f2.png";
import imgHero from "../imports/Desktop1/8eca6d587389eb6377265312672d597bd019582d.png";
import imgNews from "../imports/Desktop1/1ac3fe9a52f9936f0ba106c637870fdec9e8ce7d.png";
import imgP1 from "../imports/Desktop1/be17e9f7e0927609ff698fd0a4d735b40e847967.png";
import imgP2 from "../imports/Desktop1/19c3b8a1535b744916bbc165772ebf437b2ff640.png";
import imgP3 from "../imports/Desktop1/c2ad0f45529c5cd58eebe84764eee594333e1cf4.png";
import imgP4 from "../imports/Desktop1/f1867d935ac446cf325f24ccf8a9dbb735faa3e4.png";
import imgP5 from "../imports/Desktop1/d4366ff884d6748fe62fdbd7064d8eee30810e48.png";
import svgPaths from "../imports/Desktop1/svg-d0dz0p44q0";
import heroLabsul from "../imports/hero-labsul.png";

// ─── Types ────────────────────────────────────────────────────────────────────

type Page =
  | "home"
  | "sobre"
  | "acervo"
  | "acervo-item"
  | "biblioteca"
  | "biblioteca-item"
  | "noticias"
  | "noticia-item"
  | "entrevistas"
  | "entrevista-item"
  | "galeria"
  | "atelie"
  | "atelie-inscricao"
  | "contato";

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_LINKS: { label: string; page: Page }[] = [
  { label: "INÍCIO", page: "home" },
  { label: "SOBRE", page: "sobre" },
  { label: "ACERVO", page: "acervo" },
  { label: "BIBLIOTECA", page: "biblioteca" },
  { label: "NOTÍCIAS", page: "noticias" },
  { label: "ENTREVISTAS", page: "entrevistas" },
  { label: "GALERIA", page: "galeria" },
  { label: "ATELIÊ", page: "atelie" },
];

// ACERVO_ITEMS agora vem do Supabase (tabela "cordeis") via o hook useCordeis().
function useCordeis() {
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
          let ativo = true;

          supabase
            .from("cordeis")
            .select("*")
            .order("criado_em", { ascending: false })
            .then(({ data, error }) => {
                      if (!ativo) return;
                      if (error) {
                                  console.error("Erro ao buscar itens do acervo no Supabase:", error.message);
                                  return;
                      }
                      if (data) {
                                  setItems(
                                                data.map((row) => ({
                                                                id: row.id,
                                                                title: row.titulo,
                                                                category: row.categoria,
                                                                year: row.ano ? String(row.ano) : "",
                                                                origin: row.origem,
                                                                img: row.imagem_url,
                                                }))
                                              );
                      }
            });

          return () => {
                  ativo = false;
          };
    }, []);

    return items;
}

const ACERVO_CATEGORIES = [
    "Todos", "Xilogravura", "Cordel", "Mamulengo", "Cerâmica",
    "Fotografia", "Registro Sonoro", "Manuscrito", "Indumentária",
  ];

// BIBLIOTECA_ITEMS agora vem do Supabase (tabela "livros") via o hook useLivros().
function useLivros() {
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
          let ativo = true;

          supabase
            .from("livros")
            .select("*")
            .order("criado_em", { ascending: false })
            .then(({ data, error }) => {
                      if (!ativo) return;
                      if (error) {
                                  console.error("Erro ao buscar livros no Supabase:", error.message);
                                  return;
                      }
                      if (data) {
                                  setItems(
                                                data.map((row) => ({
                                                                id: row.id,
                                                                title: row.titulo,
                                                                type: row.categoria || "Livro",
                                                                author: row.autor,
                                                                year: row.ano ? String(row.ano) : "",
                                                                desc: row.descricao,
                                                                img: row.imagem_url,
                                                }))
                                              );
                      }
            });

          return () => {
                  ativo = false;
          };
    }, []);

    return items;
}

const BIBLIOTECA_TYPES = ["Todos", "Livro", "Artigo", "Antologia", "Catálogo"];

function useNoticias() { const [items, setItems] = useState<any[]>([]); useEffect(() => { let ativo = true; supabase.from("noticias").select("*").order("criado_em", { ascending: false }).then(({ data, error }) => { if (!ativo) return; if (error) { console.error("Erro ao buscar noticias no Supabase:", error.message); return; } if (data) { setItems(data.map((row) => ({ id: row.id, title: row.titulo, date: row.data_publicacao, category: row.categoria, excerpt: row.resumo, img: row.imagem_url }))); } }); return () => { ativo = false; }; }, []); return items; }

function useEntrevistas() { const [items, setItems] = useState<any[]>([]); useEffect(() => { let ativo = true; supabase.from("entrevistas").select("*").order("criado_em", { ascending: false }).then(({ data, error }) => { if (!ativo) return; if (error) { console.error("Erro ao buscar entrevistas no Supabase:", error.message); return; } if (data) { setItems(data.map((row) => ({ id: row.id, name: row.nome, role: row.cargo, duration: row.duracao, date: row.data_gravacao, img: row.imagem_url, tags: row.tags || [], desc: row.resumo, content: row.conteudo }))); } }); return () => { ativo = false; }; }, []); return items; }

const WORKSHOPS = [
  { id: 1, title: "Oficina de Xilogravura", dates: "Mar–Abr 2025", level: "Iniciante", spots: "12 vagas", duration: "8 semanas", schedule: "Sábados, 9h–13h", local: "LabSul – Quixadá, CE", img: imgP1, desc: "Aprenda as técnicas fundamentais da xilogravura popular nordestina com um mestre da arte. Da escolha da madeira à impressão final, você produzirá suas próprias matrizes." },
  { id: 2, title: "Cordel e Literatura Popular", dates: "Abr–Mai 2025", level: "Todos os níveis", spots: "20 vagas", duration: "6 semanas", schedule: "Quintas-feiras, 18h–21h", local: "LabSul – Quixadá, CE", img: imgP4, desc: "Explore a tradição do cordel nordestino: métrica, rima, oração e narrativa. Ao final, você terá composto e diagramado seu próprio folheto de cordel." },
  { id: 3, title: "Cerâmica Nordestina", dates: "Mai–Jun 2025", level: "Intermediário", spots: "8 vagas", duration: "10 semanas", schedule: "Sábados, 14h–18h", local: "LabSul – Quixadá, CE", img: imgP2, desc: "Imersão na tradição da cerâmica figurativa inspirada em Mestre Vitalino. Técnicas de modelagem manual, queima e acabamento com materiais naturais da região." },
  { id: 4, title: "Mamulengo e Teatro Popular", dates: "Jun–Jul 2025", level: "Todos os níveis", spots: "15 vagas", duration: "8 semanas", schedule: "Sextas-feiras, 18h–21h", local: "LabSul – Quixadá, CE", img: imgP3, desc: "Construção e manipulação de bonecos de mamulengo. Aprenda a criar personagens tradicionais, técnicas de voz e o vocabulário cênico do teatro popular nordestino." },
];

// ─── Shared Components ────────────────────────────────────────────────────────

function Logo({ fill = "black" }: { fill?: string }) {
  return (
    <div className="relative h-[29px] w-[236px] overflow-hidden flex-shrink-0">
      <div className="absolute inset-[1.56%_50.98%_1.56%_0]">
        <svg className="block w-full h-full" fill="none" viewBox="0 0 115.683 28.094">
          <path d={svgPaths.p250e1f80} fill={fill} />
          <path d={svgPaths.p3fc84400} fill={fill} />
          <path d={svgPaths.p2f8f8a80} fill={fill} />
        </svg>
      </div>
      <div className="absolute inset-[0.03%_0_0_50.63%]">
        <svg className="block w-full h-full" fill="none" viewBox="0 0 116.517 28.9936">
          <path d={svgPaths.p1c71f00} fill={fill} />
          <path d={svgPaths.p20e7ef00} fill={fill} />
          <path d={svgPaths.p1f2efb00} fill={fill} />
        </svg>
      </div>
    </div>
  );
}

function ColorBar() {
  return (
    <div className="w-full h-5 flex overflow-hidden">
      <div className="w-16 bg-[#3f0a0e] flex-shrink-0" />
      <div className="w-[170px] bg-[#94231f] flex-shrink-0" />
      <div className="w-[143px] bg-[#3f0a0e] flex-shrink-0" />
      <div className="w-[258px] bg-[#a5912c] flex-shrink-0" />
      <div className="w-[197px] bg-[#94231f] flex-shrink-0" />
      <div className="flex-1 bg-[#3f0a0e]" />
      <div className="w-[180px] bg-[#d75f85] flex-shrink-0" />
      <div className="w-[178px] bg-[#94231f] flex-shrink-0" />
      <div className="w-[151px] bg-[#3f0a0e] flex-shrink-0" />
    </div>
  );
}

function Tag({ label, color = "gold" }: { label: string; color?: "gold" | "red" | "pink" }) {
  const styles = {
    gold: "bg-[#ffb928] text-[#2b0101]",
    red: "bg-[#9b2220] text-[#f3e0b7]",
    pink: "bg-[#d75f85] text-[#2e0e15]",
  };
  return (
    <span className={`inline-block text-[11px] uppercase tracking-wide px-2 py-0.5 font-['Inter'] ${styles[color]}`}>
      {label}
    </span>
  );
}

function BtnPrimary({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`bg-[#9b2220] text-[#f3deb7] font-['Inter'] uppercase tracking-wide px-6 py-3 rounded-lg hover:bg-[#ca1419] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb928] ${className}`}
    >
      {children}
    </button>
  );
}

function BtnSecondary({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`bg-black text-[#f3deb7] font-['Inter'] uppercase tracking-wide px-5 py-2 rounded-lg hover:bg-[#2b0101] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb928] ${className}`}
    >
      {children}
    </button>
  );
}

function ImgPlaceholder({ className = "", label = "" }: { className?: string; label?: string }) {
  return (
    <div className={`bg-white flex items-center justify-center ${className}`}>
      {label && <span className="text-[#2e0e15]/25 text-[11px] uppercase tracking-wide text-center px-2">{label}</span>}
    </div>
  );
}

function Header({ currentPage, onNavigate }: { currentPage: Page; onNavigate: (p: Page) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-[#ffb928] w-full z-50 sticky top-0 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-10 h-[86px] flex items-center justify-between gap-4">
        <button
          onClick={() => onNavigate("home")}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ca1419] rounded flex-shrink-0"
          aria-label="Ir para início"
        >
          <Logo />
        </button>

        <nav className="hidden lg:flex items-center gap-5 text-[12px] font-['Inter'] font-normal flex-1 justify-center">
          {NAV_LINKS.map((link) => (
            <button
              key={link.page}
              onClick={() => onNavigate(link.page)}
              className={`uppercase tracking-wide whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ca1419] rounded-sm transition-colors ${
                currentPage === link.page
                  ? "text-[#ca1419] underline underline-offset-2"
                  : "text-black hover:text-[#ca1419]"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => onNavigate("contato")}
            className="bg-[#ca1419] text-white text-[12px] uppercase font-['Inter'] px-5 py-2 rounded-lg hover:bg-[#9b2220] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            CONTATO
          </button>
        </div>

        <button
          className="lg:hidden p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ca1419] rounded"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-[#2b0101] text-[#f3e0b7]">
          <nav className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <button
                key={link.page}
                onClick={() => { onNavigate(link.page); setMobileOpen(false); }}
                className={`px-6 py-4 text-left text-sm uppercase tracking-wide border-b border-[#3f0a0e] hover:bg-[#3f0a0e] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb928] ${
                  currentPage === link.page ? "text-[#ffb928]" : ""
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="px-6 py-5">
              <button
                onClick={() => { onNavigate("contato"); setMobileOpen(false); }}
                className="w-full bg-[#ca1419] text-white text-sm uppercase py-3 rounded-lg text-center hover:bg-[#9b2220] transition-colors"
              >
                CONTATO
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <footer className="bg-[#2b0101] text-[#f3e0b7]">
      <ColorBar />
      <div className="max-w-[1440px] mx-auto px-10 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="mb-5">
              <Logo fill="#f3e0b7" />
            </div>
            <p className="text-[#f3d7af] text-sm leading-relaxed">
              Laboratório de Formação em Cultura Popular Nordestina e Ibérica
            </p>
            <div className="mt-5 h-px w-12 bg-[#f53c25]" />
          </div>
          <div>
            <p className="text-[12px] uppercase font-medium mb-5 text-[#ffb928] tracking-wide">Navegação</p>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => onNavigate(link.page)}
                    className="text-[14px] text-[#f3d7af] hover:text-[#ffb928] transition-colors focus:outline-none focus-visible:underline"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[12px] uppercase font-medium mb-5 text-[#ffb928] tracking-wide">Acesso Rápido</p>
            <ul className="space-y-2.5">
              {([
                { label: "Acervo Digital", page: "acervo" },
                { label: "Biblioteca", page: "biblioteca" },
                { label: "Entrevistas", page: "entrevistas" },
                { label: "Galeria", page: "galeria" },
                { label: "Ateliê", page: "atelie" },
              ] as { label: string; page: Page }[]).map((item) => (
                <li key={item.page}>
                  <button
                    onClick={() => onNavigate(item.page)}
                    className="text-[14px] text-[#f3d7af] hover:text-[#ffb928] transition-colors focus:outline-none focus-visible:underline"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[12px] uppercase font-medium mb-5 text-[#ffb928] tracking-wide">Contato</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={14} className="mt-0.5 flex-shrink-0 text-[#f53c25]" />
                <span className="text-[14px] text-[#f3d7af]">labsul@culturapopular.br</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={14} className="mt-0.5 flex-shrink-0 text-[#f53c25]" />
                <span className="text-[14px] text-[#f3d7af]">(88) 3000-0000</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={14} className="mt-0.5 flex-shrink-0 text-[#f53c25]" />
                <span className="text-[14px] text-[#f3d7af]">Quixadá, Ceará, Brasil</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-[#3f0a0e] flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[12px] text-[#f3d7af]/60">© 2025 LabSul — Todos os direitos reservados</p>
          <p className="text-[12px] text-[#f3d7af]/60">Quixadá, Ceará · Cultura Popular Nordestina e Ibérica</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────

function PageHome({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const NOTICIAS_ITEMS = useNoticias();

  return (
    <div className="bg-[#2b0101]">
      {/* Hero */}
      <section className="relative bg-[#2b0101] overflow-hidden">
         <button
          type="button"
          aria-label="Conheça o LABSUL"
          onClick={() => onNavigate("sobre")}
          className="absolute left-[11%] bottom-[15%] w-[250px] h-[68px] cursor-pointer bg-transparent"
        />
        
        
        <img
          src={heroLabsul}
          alt="LABSUL - Laboratório de Formação em Cultura Popular Nordestina e Ibérica"
          className="block w-full h-auto"
        />
      </section>

      <ColorBar />

      {/* Three color cards */}
      <section className="bg-[#fbdfb5] py-8 px-4 md:px-8">
        {/* Desktop: three side-by-side cards with gap */}
        <div className="hidden md:grid md:grid-cols-3 gap-5 max-w-[1440px] mx-auto">
          <div className="bg-[#a7922c] relative overflow-hidden min-h-[309px] p-10 pr-[200px]">
            <div className="absolute right-0 top-0 bottom-0 w-[186px] overflow-hidden pointer-events-none">
              <img src={img1} alt="" className="w-full h-full object-cover" style={{ mixBlendMode: "multiply", opacity: 0.8 }} />
              <div className="absolute inset-0 bg-[#a5912c]/80" style={{ mixBlendMode: "multiply" }} />
            </div>
            <p className="text-[12px] uppercase text-[#2e0e15] mb-4 relative z-10 tracking-widest font-medium">BIBLIOTECA</p>
            <h2 className="font-['Inter'] font-medium text-[32px] text-[#2e0e15] leading-tight mb-4 relative z-10">
              Biblioteca<br />de cultura<br />popular.
            </h2>
            <p className="text-[12px] text-[#2f0f16] mb-8 relative z-10 leading-relaxed">
              Livros, artigos, cordéis e<br />materiais de consulta reunidos<br />pelo LabSul.
            </p>
            <BtnSecondary onClick={() => onNavigate("biblioteca")} className="text-[12px] relative z-10">
              ACESSAR BIBLIOTECA
            </BtnSecondary>
          </div>

          <div className="bg-[#d65e84] relative overflow-hidden min-h-[309px] p-10 pr-[180px]">
            <div className="absolute right-0 top-0 bottom-0 w-[168px] overflow-hidden pointer-events-none">
              <img src={img2} alt="" className="w-full h-full object-cover opacity-80" />
            </div>
            <p className="text-[12px] uppercase text-[#2e0e15] mb-4 relative z-10 tracking-widest font-medium">ACERVO</p>
            <h2 className="font-['Inter'] font-medium text-[32px] text-[#2e0e15] leading-tight mb-4 relative z-10">
              Memórias<br />que formam<br />territórios
            </h2>
            <p className="text-[12px] text-[#2f0f16] mb-8 relative z-10 leading-relaxed">
              Explore documentos, registros<br />audiovisuais e obras que celebram<br />a cultura popular.
            </p>
            <BtnSecondary onClick={() => onNavigate("acervo")} className="text-[12px] relative z-10">
              EXPLORAR ACERVO
            </BtnSecondary>
          </div>

          <div className="bg-[#d9b244] relative overflow-hidden min-h-[309px] p-10 pr-[200px]">
            <div className="absolute right-0 top-0 bottom-0 w-[185px] overflow-hidden pointer-events-none">
              <img src={img3} alt="" className="w-full h-full object-cover opacity-80" />
            </div>
            <p className="text-[12px] uppercase text-[#2e0e15] mb-4 relative z-10 tracking-widest font-medium">ENTREVISTAS</p>
            <h2 className="font-['Inter'] font-medium text-[32px] text-[#2e0e15] leading-tight mb-4 relative z-10">
              Vozes<br />que contam<br />histórias
            </h2>
            <p className="text-[12px] text-[#2f0f16] mb-8 relative z-10 leading-relaxed">
              Conversas com pesquisadores,<br />mestres, artistas e educadores<br />que inspiram caminhos.
            </p>
            <BtnSecondary onClick={() => onNavigate("entrevistas")} className="text-[12px] relative z-10">
              OUVIR ENTREVISTAS
            </BtnSecondary>
          </div>
        </div>

        {/* Mobile: draggable horizontal carousel */}
        <div className="md:hidden">
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
          >
            <div className="bg-[#a7922c] min-h-[280px] p-8 flex-shrink-0 snap-start" style={{ width: "calc(85vw)" }}>
              <p className="text-[12px] uppercase text-[#2e0e15] mb-3 tracking-widest font-medium">BIBLIOTECA</p>
              <h2 className="font-['Inter'] font-medium text-[28px] text-[#2e0e15] leading-tight mb-3">
                Biblioteca de cultura popular.
              </h2>
              <p className="text-[12px] text-[#2f0f16] mb-6 leading-relaxed">
                Livros, artigos, cordéis e materiais de consulta reunidos pelo LabSul.
              </p>
              <BtnSecondary onClick={() => onNavigate("biblioteca")} className="text-[12px]">
                ACESSAR BIBLIOTECA
              </BtnSecondary>
            </div>
            <div className="bg-[#d65e84] min-h-[280px] p-8 flex-shrink-0 snap-start" style={{ width: "calc(85vw)" }}>
              <p className="text-[12px] uppercase text-[#2e0e15] mb-3 tracking-widest font-medium">ACERVO</p>
              <h2 className="font-['Inter'] font-medium text-[28px] text-[#2e0e15] leading-tight mb-3">
                Memórias que formam territórios
              </h2>
              <p className="text-[12px] text-[#2f0f16] mb-6 leading-relaxed">
                Explore documentos, registros audiovisuais e obras que celebram a cultura popular.
              </p>
              <BtnSecondary onClick={() => onNavigate("acervo")} className="text-[12px]">
                EXPLORAR ACERVO
              </BtnSecondary>
            </div>
            <div className="bg-[#d9b244] min-h-[280px] p-8 flex-shrink-0 snap-start" style={{ width: "calc(85vw)" }}>
              <p className="text-[12px] uppercase text-[#2e0e15] mb-3 tracking-widest font-medium">ENTREVISTAS</p>
              <h2 className="font-['Inter'] font-medium text-[28px] text-[#2e0e15] leading-tight mb-3">
                Vozes que contam histórias
              </h2>
              <p className="text-[12px] text-[#2f0f16] mb-6 leading-relaxed">
                Conversas com pesquisadores, mestres, artistas e educadores que inspiram caminhos.
              </p>
              <BtnSecondary onClick={() => onNavigate("entrevistas")} className="text-[12px]">
                OUVIR ENTREVISTAS
              </BtnSecondary>
            </div>
          </div>
          <div className="flex justify-center gap-2 pt-1">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => {
                  if (carouselRef.current) {
                    const w = carouselRef.current.offsetWidth * 0.85 + 16;
                    carouselRef.current.scrollTo({ left: w * i, behavior: "smooth" });
                  }
                }}
                className="w-2 h-2 rounded-full bg-[#2e0e15]/25 hover:bg-[#9b2220] transition-colors"
                aria-label={`Card ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <ColorBar />

      {/* Em Destaque */}
      <section className="bg-[#2b0101] py-20">
        <div className="max-w-[1440px] mx-auto px-10">
          <p className="text-[#f53c25] text-[20px] uppercase mb-4 tracking-wide">EM DESTAQUE</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-['Inter'] font-semibold text-[56px] lg:text-[64px] text-[#f3e0b7] leading-tight mb-10">
                Xilogravuras,<br />cordéis e registros<br />da cultura em formação
              </h2>
              <p className="text-[#f3e0b7] text-[28px] lg:text-[32px] leading-relaxed mb-12 max-w-md">
                Publicações, oficinas e materiais reunidos em um só lugar.
              </p>
              <BtnPrimary onClick={() => onNavigate("acervo")} className="text-[20px] px-8 py-4">
                VER MATERIAIS
              </BtnPrimary>
            </div>
            <div>
              <img src={imgHero} alt="Xilogravuras e cultura popular" className="w-full object-cover" style={{ maxHeight: "815px" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Últimas Publicações */}
      <section className="bg-[#ffb928] py-20">
        <div className="max-w-[1440px] mx-auto px-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
            <div>
              <p className="text-[#2b0101] text-[20px] uppercase tracking-wide mb-2">ÚLTIMAS PUBLICAÇÕES</p>
              <h2 className="font-['Inter'] font-semibold text-[48px] lg:text-[64px] text-[#2b0101] leading-tight">
                Notícias e projetos
              </h2>
            </div>
            <button
              onClick={() => onNavigate("noticias")}
              className="bg-[#9b2220] text-[#fbdfb5] text-[20px] uppercase px-6 py-3 rounded-lg hover:bg-[#ca1419] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black whitespace-nowrap"
            >
              VER TODAS
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {NOTICIAS_ITEMS.slice(0, 3).map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate("noticia-item")}
                className="bg-[#9b2220] text-left overflow-hidden hover:scale-[1.01] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-black group"
              >
                <div className="h-[256px] overflow-hidden">
                  <ImgPlaceholder className="w-full h-full" label="foto em breve" />
                </div>
                <div className="p-6">
                  <p className="text-[#f3e0b7] text-[12px] mb-2">{item.date}</p>
                  <h3 className="font-['Inter'] font-medium text-[22px] text-[#f3e0b7] leading-tight mb-4">{item.title}</h3>
                  <span className="text-[#f3e0b7] text-[12px] font-extrabold underline">LER MAIS</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function PageSobre({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="bg-[#2b0101]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#2b0101] py-20">
        <div className="max-w-[1440px] mx-auto px-10 xl:pr-[210px]">
          <p className="text-[12px] uppercase text-[#f53c25] mb-4 tracking-widest font-medium">SOBRE O LABSUL</p>
          <h1 className="font-['Inter'] font-semibold text-[56px] lg:text-[64px] text-[#f3e0b7] leading-tight max-w-2xl">
            Um laboratório vivo de cultura popular
          </h1>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-[183px] hidden xl:block bg-[#94231f] overflow-hidden pointer-events-none">
          <img src={imgP1} alt="" className="w-full h-full object-cover opacity-70" />
        </div>
      </section>

      <ColorBar />

      {/* Missão */}
      <section className="bg-[#fbdfb5] py-20">
        <div className="max-w-[1440px] mx-auto px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[12px] uppercase text-[#9b2220] mb-4 tracking-widest font-medium">MISSÃO</p>
              <h2 className="font-['Inter'] font-medium text-[40px] text-[#2e0e15] leading-tight mb-6">
                Preservar, pesquisar e difundir a cultura popular nordestina
              </h2>
              <p className="text-[#2f0f16] text-base leading-relaxed mb-4">
                O LabSul é um laboratório de formação dedicado à pesquisa, documentação e difusão das expressões culturais do Nordeste brasileiro e sua matriz ibérica. Sediado em Quixadá, no Ceará, reunimos pesquisadores, artistas e educadores em torno de práticas que valorizam o saber tradicional.
              </p>
              <p className="text-[#2f0f16] text-base leading-relaxed">
                Nosso trabalho abrange xilogravuras, cordéis, mamulengo, forró, bumba-meu-boi, reisado e outras formas de expressão que constituem a identidade cultural da região.
              </p>
              <div className="mt-8 h-px w-12 bg-[#f53c25]" />
            </div>
            <div className="grid grid-cols-2 gap-px bg-[#2e0e15]">
              {[
                { num: "12+", label: "anos de atuação", bg: "bg-[#a7922c]", text: "text-[#2e0e15]" },
                { num: "3.400", label: "itens no acervo", bg: "bg-[#d65e84]", text: "text-[#2e0e15]" },
                { num: "80+", label: "oficinas realizadas", bg: "bg-[#9b2220]", text: "text-[#f3e0b7]" },
                { num: "200", label: "entrevistas gravadas", bg: "bg-[#d9b244]", text: "text-[#2e0e15]" },
              ].map((item) => (
                <div key={item.label} className={`${item.bg} p-8`}>
                  <p className={`text-[48px] font-semibold ${item.text} leading-none mb-2`}>{item.num}</p>
                  <p className={`${item.text} uppercase text-[12px] tracking-wide`}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* História */}
      <section className="bg-[#2b0101] py-20">
        <div className="max-w-[1440px] mx-auto px-10">
          <p className="text-[12px] uppercase text-[#f53c25] mb-10 tracking-widest font-medium">HISTÓRIA</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { year: "2012", title: "Fundação", desc: "Criado pelo Prof. Rodrigo Marques em Quixadá, Ceará, com o objetivo de preservar o patrimônio cultural imaterial nordestino." },
              { year: "2017", title: "Digitalização", desc: "Início do processo de digitalização do acervo físico, com mais de 1.200 itens catalogados nos primeiros dois anos." },
              { year: "2023", title: "Portal Digital", desc: "Lançamento do portal de acesso aberto ao acervo digital, com possibilidade de consulta e pesquisa online." },
            ].map((item) => (
              <div key={item.year} className="border-t-2 border-[#3f0a0e] pt-6">
                <p className="text-[#f53c25] text-[40px] font-semibold leading-none mb-3">{item.year}</p>
                <p className="text-[#f3e0b7] text-xl font-medium mb-3">{item.title}</p>
                <p className="text-[#f3d7af] text-base leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipe */}
      <section className="bg-[#ffb928] py-20">
        <div className="max-w-[1440px] mx-auto px-10">
          <p className="text-[12px] uppercase text-[#2b0101] mb-4 tracking-widest font-medium">EQUIPE</p>
          <h2 className="font-['Inter'] font-semibold text-[48px] text-[#2b0101] leading-tight mb-12">
            Quem faz o LabSul
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Rodrigo Marques — fundador */}
            <div className="bg-[#9b2220] overflow-hidden">
              <div className="h-[220px] overflow-hidden">
                <ImgPlaceholder className="w-full h-full" label="foto Rodrigo Marques" />
              </div>
              <div className="p-6">
                <p className="text-[#f3e0b7] text-[20px] font-semibold leading-snug">Prof. Rodrigo Marques</p>
                <p className="text-[#f3d7af] text-sm mt-1 mb-3">Fundador e diretor</p>
                <Tag label="LabSul" color="gold" />
              </div>
            </div>
            {[
              { name: "Dra. Ana Lima", role: "Pesquisadora e coordenadora", area: "Cultura Popular" },
              { name: "Prof. José Ferreira", role: "Coordenador de acervo", area: "Documentação" },
            ].map((member) => (
              <div key={member.name} className="bg-[#9b2220] overflow-hidden">
                <div className="h-[220px] overflow-hidden">
                  <ImgPlaceholder className="w-full h-full" label="foto em breve" />
                </div>
                <div className="p-6">
                  <p className="text-[#f3e0b7] text-[20px] font-semibold leading-snug">{member.name}</p>
                  <p className="text-[#f3d7af] text-sm mt-1 mb-3">{member.role}</p>
                  <Tag label={member.area} color="gold" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <BtnPrimary onClick={() => onNavigate("contato")} className="text-base px-8 py-4">
              ENTRE EM CONTATO
            </BtnPrimary>
          </div>
        </div>
      </section>
    </div>
  );
}

function PageAcervo({ onNavigate }: { onNavigate: (p: Page) => void }) {
    const ACERVO_ITEMS = useCordeis();
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [search, setSearch] = useState("");

  const filtered = ACERVO_ITEMS.filter((item) => {
      const matchCat = activeFilter === "Todos" || item.category === activeFilter;
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="bg-[#2b0101]">
      <section className="bg-[#2b0101] py-16 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-10 xl:pr-[210px]">
          <p className="text-[12px] uppercase text-[#f53c25] mb-4 tracking-widest font-medium">COLEÇÃO</p>
          <h1 className="font-['Inter'] font-semibold text-[56px] lg:text-[64px] text-[#f3e0b7] leading-tight">
            Acervo Digital
          </h1>
          <p className="text-[#f3d7af] text-xl mt-4 max-w-lg">
            Mais de 3.400 itens catalogados da cultura popular nordestina
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-[183px] hidden xl:block bg-[#94231f] overflow-hidden pointer-events-none">
          <img src={imgHero} alt="" className="w-full h-full object-cover opacity-40" />
        </div>
      </section>

      <ColorBar />

      <section className="bg-[#fbdfb5] pt-10 pb-6">
        <div className="max-w-[1440px] mx-auto px-10">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center bg-white border-2 border-[#2e0e15] overflow-hidden max-w-xl w-full">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar no acervo..."
                className="flex-1 px-4 py-3 text-base text-[#2e0e15] outline-none bg-transparent placeholder-[#2e0e15]/50"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {ACERVO_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`text-[12px] uppercase px-4 py-2 tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ca1419] ${
                  activeFilter === cat
                    ? "bg-[#9b2220] text-[#f3e0b7]"
                    : "bg-[#2e0e15] text-[#f3d7af] hover:bg-[#9b2220] hover:text-[#f3e0b7]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbdfb5] pb-20 pt-6">
        <div className="max-w-[1440px] mx-auto px-10">
          <p className="text-[#2e0e15] text-[12px] uppercase mb-6 tracking-wide">
            {filtered.length} ITEM{filtered.length !== 1 ? "S" : ""} ENCONTRADO{filtered.length !== 1 ? "S" : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate("acervo-item")}
                className="bg-[#9b2220] text-left overflow-hidden hover:scale-[1.01] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb928] group"
              >
                <div className="h-[200px] overflow-hidden relative">
                  <ImgPlaceholder className="w-full h-full" label="imagem em breve" />
                  <div className="absolute top-3 left-3">
                    <Tag label={item.category} />
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-[#f3d7af] text-[11px] mb-2 uppercase tracking-wide">{item.year} · {item.origin}</p>
                  <h3 className="font-['Inter'] font-medium text-[18px] text-[#f3e0b7] leading-snug">{item.title}</h3>
                  <span className="inline-block mt-4 text-[#f3e0b7] text-[11px] font-extrabold underline">VER ITEM</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function PageAcervoItem({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const ACERVO_ITEMS = useCordeis();
const item = ACERVO_ITEMS[0];
    if (!item) {
          return <div className="bg-[#2b0101] text-[#f3e0b7] p-10">Carregando...</div>;
    }
    return (
        <div className="bg-[#2b0101]">
      <div className="max-w-[1440px] mx-auto px-10 py-5">
        <div className="flex items-center gap-2 text-[12px] font-['Inter']">
          <button onClick={() => onNavigate("home")} className="text-[#f3d7af] hover:text-[#ffb928] transition-colors">Início</button>
          <ChevronRight size={12} className="text-[#f3d7af]" />
          <button onClick={() => onNavigate("acervo")} className="text-[#f3d7af] hover:text-[#ffb928] transition-colors">Acervo</button>
          <ChevronRight size={12} className="text-[#f3d7af]" />
          <span className="text-[#ffb928]">{item.title}</span>
        </div>
      </div>

      <section className="py-10">
        <div className="max-w-[1440px] mx-auto px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="bg-[#9b2220] p-2">
                <img src={imgHero} alt="Xilogravura" className="w-full object-cover" style={{ maxHeight: "600px" }} />
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {[imgNews, imgP4, imgP2, imgP3].map((img, i) => (
                  <div key={i} className="bg-[#3f0a0e] h-20 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                    <img src={img} alt="" className="w-full h-full object-cover opacity-70" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Tag label={item.category} />
              <h1 className="font-['Inter'] font-semibold text-[40px] text-[#f3e0b7] leading-tight mt-4 mb-6">
                Lampião e Maria Bonita
              </h1>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: "Ano", value: "1980" },
                  { label: "Origem", value: "Juazeiro do Norte, CE" },
                  { label: "Artista", value: "Mestre João Borges" },
                  { label: "Técnica", value: "Xilogravura em madeira" },
                  { label: "Dimensões", value: "30 × 45 cm" },
                  { label: "Coleção", value: "Acervo LabSul" },
                ].map((field) => (
                  <div key={field.label} className="border-b border-[#3f0a0e] pb-3">
                    <p className="text-[#f53c25] text-[11px] uppercase tracking-wide">{field.label}</p>
                    <p className="text-[#f3e0b7] text-base mt-1">{field.value}</p>
                  </div>
                ))}
              </div>
              <p className="text-[#f3d7af] text-base leading-relaxed mb-8">
                Obra representativa da tradição xilogravurista do Nordeste, esta peça retrata os lendários cangaceiros Lampião e Maria Bonita em linguagem gráfica típica, com linhas expressivas e composição frontal característica dos mestres de Juazeiro.
              </p>
              <div className="flex flex-wrap gap-4">
                <BtnPrimary className="text-sm">SOLICITAR ACESSO</BtnPrimary>
                <button className="border border-[#f3e0b7] text-[#f3e0b7] uppercase text-sm px-6 py-3 rounded-lg hover:bg-[#f3e0b7]/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb928]">
                  COMPARTILHAR
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ColorBar />

      <section className="bg-[#fbdfb5] py-16">
        <div className="max-w-[1440px] mx-auto px-10">
          <p className="text-[12px] uppercase text-[#9b2220] mb-4 tracking-widest font-medium">RELACIONADOS</p>
          <h2 className="font-['Inter'] font-medium text-[32px] text-[#2e0e15] mb-8">Outros itens de Xilogravura</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {ACERVO_ITEMS.slice(1, 4).map((relItem) => (
              <button
                key={relItem.id}
                onClick={() => onNavigate("acervo-item")}
                className="bg-[#9b2220] text-left overflow-hidden hover:scale-[1.01] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb928] group"
              >
                <div className="h-[160px] overflow-hidden">
                  <ImgPlaceholder className="w-full h-full" label="imagem em breve" />
                </div>
                <div className="p-4">
                  <p className="text-[#f3e0b7] text-base font-medium leading-snug">{relItem.title}</p>
                  <span className="text-[#f3d7af] text-[11px] underline font-bold mt-2 block">VER ITEM</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function PageBiblioteca({ onNavigate }: { onNavigate: (p: Page) => void }) {
    const BIBLIOTECA_ITEMS = useLivros();
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("Todos");

  const filtered = BIBLIOTECA_ITEMS.filter(
    (item) =>
      (activeType === "Todos" || item.type === activeType) &&
      (item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.author.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-[#2b0101]">
      <section className="bg-[#a7922c] py-16 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-10 xl:pr-[210px]">
          <p className="text-[12px] uppercase text-[#2e0e15] mb-4 tracking-widest font-medium">BIBLIOTECA</p>
          <h1 className="font-['Inter'] font-semibold text-[56px] lg:text-[64px] text-[#2e0e15] leading-tight max-w-xl">
            Biblioteca de Cultura Popular
          </h1>
          <p className="text-[#2e0e15] text-xl mt-4">Livros, artigos, cordéis e materiais de consulta.</p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-[183px] hidden xl:block overflow-hidden pointer-events-none">
          <img src={img1} alt="" className="w-full h-full object-cover" style={{ mixBlendMode: "multiply", opacity: 0.6 }} />
          <div className="absolute inset-0 bg-[#a5912c]/80" style={{ mixBlendMode: "multiply" }} />
        </div>
      </section>

      <ColorBar />

      <section className="bg-[#fbdfb5] pt-10 pb-6">
        <div className="max-w-[1440px] mx-auto px-10">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center bg-white border-2 border-[#2e0e15] max-w-xl w-full">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por título ou autor..."
                className="flex-1 px-4 py-3 text-base text-[#2e0e15] outline-none bg-transparent placeholder-[#2e0e15]/50"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {BIBLIOTECA_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`text-[12px] uppercase px-4 py-2 tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a5912c] ${
                  activeType === t
                    ? "bg-[#a7922c] text-[#2e0e15]"
                    : "bg-[#2e0e15] text-[#f3d7af] hover:bg-[#a7922c] hover:text-[#2e0e15]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbdfb5] pb-20 pt-6">
        <div className="max-w-[1440px] mx-auto px-10">
          <p className="text-[#2e0e15] text-[12px] uppercase mb-6 tracking-wide">
            {filtered.length} ITEM{filtered.length !== 1 ? "S" : ""} ENCONTRADO{filtered.length !== 1 ? "S" : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate("biblioteca-item")}
                className="bg-[#a7922c] text-left overflow-hidden hover:scale-[1.01] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2e0e15] group"
              >
                <div className="h-[200px] overflow-hidden relative">
                  <ImgPlaceholder className="w-full h-full" label="capa em breve" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#2e0e15] text-[#f3d7af] text-[11px] uppercase px-2 py-0.5 tracking-wide">
                      {item.type}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-['Inter'] font-medium text-[17px] text-[#2e0e15] leading-snug mb-1">{item.title}</h3>
                  <p className="text-[#2f0f16] text-[12px]">{item.author} · {item.year}</p>
                  <span className="inline-block mt-4 text-[#2e0e15] text-[11px] font-extrabold underline">VER DETALHES</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function PageBibliotecaItem({ onNavigate }: { onNavigate: (p: Page) => void }) {
const BIBLIOTECA_ITEMS = useLivros();
    const item = BIBLIOTECA_ITEMS[0];
    if (!item) {
    return <div className="bg-[#2b0101] text-[#f3e0b7] p-10">Carregando...</div>;
    }
  return (
    <div className="bg-[#2b0101]">
      <div className="max-w-[1440px] mx-auto px-10 py-5">
        <div className="flex items-center gap-2 text-[12px] font-['Inter'] flex-wrap">
          <button onClick={() => onNavigate("home")} className="text-[#f3d7af] hover:text-[#ffb928] transition-colors">Início</button>
          <ChevronRight size={12} className="text-[#f3d7af]" />
          <button onClick={() => onNavigate("biblioteca")} className="text-[#f3d7af] hover:text-[#ffb928] transition-colors">Biblioteca</button>
          <ChevronRight size={12} className="text-[#f3d7af]" />
          <span className="text-[#ffb928]">{item.title}</span>
        </div>
      </div>

      <section className="py-10">
        <div className="max-w-[1440px] mx-auto px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12 items-start">
            <div>
              <div className="bg-[#a7922c] p-2">
                <ImgPlaceholder className="w-full h-[420px]" label="capa do livro" />
              </div>
            </div>
            <div>
              <span className="bg-[#2e0e15] text-[#f3d7af] text-[11px] uppercase px-2 py-0.5 tracking-wide">
                {item.type}
              </span>
              <h1 className="font-['Inter'] font-semibold text-[40px] text-[#f3e0b7] leading-tight mt-4 mb-4">
                {item.title}
              </h1>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: "Autor", value: item.author },
                  { label: "Ano", value: item.year },
                  { label: "Tipo", value: item.type },
                  { label: "Acervo", value: "LabSul — Quixadá, CE" },
                ].map((field) => (
                  <div key={field.label} className="border-b border-[#3f0a0e] pb-3">
                    <p className="text-[#f53c25] text-[11px] uppercase tracking-wide">{field.label}</p>
                    <p className="text-[#f3e0b7] text-base mt-1">{field.value}</p>
                  </div>
                ))}
              </div>
              <p className="text-[12px] uppercase text-[#f53c25] mb-3 tracking-widest font-medium">DESCRIÇÃO</p>
              <p className="text-[#f3d7af] text-base leading-relaxed mb-8">{item.desc}</p>
              <div className="flex flex-wrap gap-4">
                <BtnPrimary className="text-sm">SOLICITAR ACESSO</BtnPrimary>
                <button className="border border-[#f3e0b7] text-[#f3e0b7] uppercase text-sm px-6 py-3 rounded-lg hover:bg-[#f3e0b7]/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb928]">
                  COMPARTILHAR
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ColorBar />

      <section className="bg-[#fbdfb5] py-16">
        <div className="max-w-[1440px] mx-auto px-10">
          <p className="text-[12px] uppercase text-[#9b2220] mb-4 tracking-widest font-medium">RELACIONADOS</p>
          <h2 className="font-['Inter'] font-medium text-[32px] text-[#2e0e15] mb-8">Outros livros e materiais</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BIBLIOTECA_ITEMS.slice(1, 5).map((b) => (
              <button
                key={b.id}
                onClick={() => onNavigate("biblioteca-item")}
                className="bg-[#a7922c] text-left overflow-hidden hover:scale-[1.01] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2e0e15] group"
              >
                <div className="h-[160px]">
                  <ImgPlaceholder className="w-full h-full" label="capa em breve" />
                </div>
                <div className="p-4">
                  <p className="text-[#2e0e15] text-base font-medium leading-snug">{b.title}</p>
                  <p className="text-[#2f0f16] text-[12px] mt-0.5">{b.author}</p>
                  <span className="text-[#2e0e15] text-[11px] underline font-bold mt-2 block">VER DETALHES</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function PageNoticias({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const NOTICIAS_ITEMS = useNoticias();
  const categories = ["Todos", "Exposição", "Oficina", "Digital", "Pesquisa", "Formação", "Instituição"];
  const [activeFilter, setActiveFilter] = useState("Todos");
  const filtered = NOTICIAS_ITEMS.filter((n) => activeFilter === "Todos" || n.category === activeFilter);

  return (
    <div className="bg-[#2b0101]">
      <section className="bg-[#ffb928] py-16">
        <div className="max-w-[1440px] mx-auto px-10">
          <p className="text-[12px] uppercase text-[#2b0101] mb-4 tracking-widest font-medium">PUBLICAÇÕES</p>
          <h1 className="font-['Inter'] font-semibold text-[56px] lg:text-[64px] text-[#2b0101] leading-tight">
            Notícias e Projetos
          </h1>
        </div>
      </section>

      <ColorBar />

      <section className="bg-[#ffb928] pt-8 pb-4">
        <div className="max-w-[1440px] mx-auto px-10">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`text-[12px] uppercase px-4 py-2 tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ca1419] ${
                  activeFilter === cat
                    ? "bg-[#9b2220] text-[#f3e0b7]"
                    : "bg-[#2b0101] text-[#f3d7af] hover:bg-[#9b2220] hover:text-[#f3e0b7]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#ffb928] pb-20 pt-8">
        <div className="max-w-[1440px] mx-auto px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate("noticia-item")}
                className="bg-[#9b2220] text-left overflow-hidden hover:scale-[1.01] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-black group"
              >
                <div className="h-[200px] overflow-hidden relative">
                  <ImgPlaceholder className="w-full h-full" label="foto em breve" />
                  <div className="absolute top-3 left-3">
                    <Tag label={item.category} />
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-[#f3e0b7] text-[12px] mb-2">{item.date}</p>
                  <h3 className="font-['Inter'] font-medium text-[22px] text-[#f3e0b7] leading-tight mb-3">{item.title}</h3>
                  <p className="text-[#f3d7af] text-sm leading-relaxed mb-4">{item.excerpt}</p>
                  <span className="text-[#f3e0b7] text-[12px] font-extrabold underline">LER MAIS</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function PageNoticiaItem({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const NOTICIAS_ITEMS = useNoticias(); const item = NOTICIAS_ITEMS[0]; if (!item) { return <div className="bg-[#2b0101] text-[#f3e0b7] p-10">Carregando...</div>; }
  return (
    <div className="bg-[#2b0101]">
      <div className="max-w-[1440px] mx-auto px-10 py-5">
        <div className="flex items-center gap-2 text-[12px] font-['Inter'] flex-wrap">
          <button onClick={() => onNavigate("home")} className="text-[#f3d7af] hover:text-[#ffb928] transition-colors">Início</button>
          <ChevronRight size={12} className="text-[#f3d7af]" />
          <button onClick={() => onNavigate("noticias")} className="text-[#f3d7af] hover:text-[#ffb928] transition-colors">Notícias</button>
          <ChevronRight size={12} className="text-[#f3d7af]" />
          <span className="text-[#ffb928]">{item.title}</span>
        </div>
      </div>

      <section className="py-10">
        <div className="max-w-[800px] mx-auto px-10">
          <Tag label={item.category} />
          <h1 className="font-['Inter'] font-semibold text-[44px] text-[#f3e0b7] leading-tight mt-5 mb-4">{item.title}</h1>
          <p className="text-[#f3d7af] text-base mb-10">{item.date} · Por Equipe LabSul</p>
          <div className="mb-10">
            <ImgPlaceholder className="w-full h-[350px]" label="foto em breve" />
          </div>
          <div className="text-[#f3d7af] text-lg leading-relaxed space-y-6">
            <p>A exposição "Matrizes do Sertão" reúne mais de 80 obras de artistas do sertão nordestino, explorando a rica tradição da xilogravura e do cordel como formas de resistência e identidade cultural.</p>
            <p>A mostra apresenta obras de mestres como J. Borges, Dila e outros xilogravuristas que mantêm viva a tradição gráfica popular nordestina, ao lado de cordéis que registram a história oral do povo sertanejo.</p>
            <p>A curadoria é assinada pelo Prof. Rodrigo Marques e o projeto conta com apoio do Ministério da Cultura e da Prefeitura de Quixadá.</p>
            <blockquote className="border-l-4 border-[#f53c25] pl-6 italic text-[#f3e0b7] text-xl">
              "A xilogravura é a língua visual do Nordeste. Cada linha cortada na madeira é uma palavra de resistência." — Mestre Dila
            </blockquote>
            <p>A visitação é gratuita e acontece de terça a domingo, das 10h às 18h, no espaço cultural do LabSul em Quixadá, Ceará.</p>
          </div>
          <div className="mt-12 pt-8 border-t border-[#3f0a0e]">
            <BtnPrimary onClick={() => onNavigate("noticias")} className="text-sm">← VOLTAR PARA NOTÍCIAS</BtnPrimary>
          </div>
        </div>
      </section>

      <ColorBar />

      <section className="bg-[#ffb928] py-16">
        <div className="max-w-[1440px] mx-auto px-10">
          <p className="text-[#2b0101] text-[12px] uppercase mb-6 tracking-widest font-medium">OUTRAS NOTÍCIAS</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {NOTICIAS_ITEMS.slice(1, 4).map((n) => (
              <button
                key={n.id}
                onClick={() => onNavigate("noticia-item")}
                className="bg-[#9b2220] text-left overflow-hidden hover:scale-[1.01] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-black group"
              >
                <div className="h-[160px] overflow-hidden">
                  <ImgPlaceholder className="w-full h-full" label="foto em breve" />
                </div>
                <div className="p-5">
                  <p className="text-[#f3d7af] text-[11px] mb-1">{n.date}</p>
                  <h3 className="font-['Inter'] font-medium text-[18px] text-[#f3e0b7] leading-tight">{n.title}</h3>
                  <span className="block mt-3 text-[#f3e0b7] text-[11px] font-bold underline">LER MAIS</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function PageEntrevistas({ onNavigate }: { onNavigate: (p: Page) => void }) {
const ENTREVISTAS_ITEMS = useEntrevistas();
  return (
    <div className="bg-[#2b0101]">
      <section className="bg-[#d9b244] py-16 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-10 xl:pr-[210px]">
          <p className="text-[12px] uppercase text-[#2e0e15] mb-4 tracking-widest font-medium">ENTREVISTAS</p>
          <h1 className="font-['Inter'] font-semibold text-[56px] lg:text-[64px] text-[#2e0e15] leading-tight max-w-xl">
            Vozes que contam histórias
          </h1>
          <p className="text-[#2e0e15] text-xl mt-4">Conversas com pesquisadores, mestres, artistas e educadores.</p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-[183px] hidden xl:block overflow-hidden pointer-events-none">
          <img src={img3} alt="" className="w-full h-full object-cover opacity-70" />
        </div>
      </section>

      <ColorBar />

      <section className="bg-[#2b0101] py-16">
        <div className="max-w-[1440px] mx-auto px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ENTREVISTAS_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate("entrevista-item")}
                className="bg-[#3f0a0e] overflow-hidden group hover:bg-[#4a0e12] transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9b244]"
              >
                <div className="relative h-[240px] overflow-hidden">
                  <ImgPlaceholder className="w-full h-full" label="foto em breve" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#f53c25] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Play size={20} fill="white" className="text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-[#2b0101]/80 text-[#f3e0b7] text-[11px] px-2 py-1 uppercase tracking-wide">
                    {item.duration}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.map((tag) => <Tag key={tag} label={tag} />)}
                  </div>
                  <h3 className="font-['Inter'] font-medium text-[20px] text-[#f3e0b7]">{item.name}</h3>
                  <p className="text-[#f3d7af] text-sm mt-1">{item.role}</p>
                  <span className="block mt-4 text-[#f3e0b7] text-[11px] font-bold underline uppercase tracking-wide">OUVIR ENTREVISTA</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function PageEntrevistaItem({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const ENTREVISTAS_ITEMS = useEntrevistas(); const item = ENTREVISTAS_ITEMS[0]; if (!item) { return <div className="bg-[#2b0101] text-[#f3e0b7] p-10">Carregando...</div>; }
  return (
    <div className="bg-[#2b0101]">
      <div className="max-w-[1440px] mx-auto px-10 py-5">
        <div className="flex items-center gap-2 text-[12px] font-['Inter'] flex-wrap">
          <button onClick={() => onNavigate("home")} className="text-[#f3d7af] hover:text-[#ffb928] transition-colors">Início</button>
          <ChevronRight size={12} className="text-[#f3d7af]" />
          <button onClick={() => onNavigate("entrevistas")} className="text-[#f3d7af] hover:text-[#ffb928] transition-colors">Entrevistas</button>
          <ChevronRight size={12} className="text-[#f3d7af]" />
          <span className="text-[#ffb928]">{item.name}</span>
        </div>
      </div>

      <section className="py-10">
        <div className="max-w-[1440px] mx-auto px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 items-start">
            <div>
              <div className="bg-[#3f0a0e] relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                <ImgPlaceholder className="w-full h-full" label="foto em breve" />
                <div className="absolute inset-0 flex items-end justify-center pb-8">
                  <div className="bg-[#2b0101]/80 px-6 py-4 flex items-center gap-4 w-full mx-4">
                    <div className="w-12 h-12 rounded-full bg-[#f53c25] flex items-center justify-center flex-shrink-0 hover:bg-[#ca1419] transition-colors cursor-pointer">
                      <Play size={18} fill="white" className="text-white ml-0.5" />
                    </div>
                    <div>
                      <p className="text-[#f3e0b7] text-[12px] uppercase tracking-wide font-medium">Reproduzir entrevista</p>
                      <p className="text-[#f3d7af] text-[11px]">{item.duration}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-1 mb-4">
                {item.tags.map((tag) => <Tag key={tag} label={tag} />)}
              </div>
              <h1 className="font-['Inter'] font-semibold text-[40px] text-[#f3e0b7] leading-tight mb-2">{item.name}</h1>
              <p className="text-[#f3d7af] text-xl mb-1">{item.role}</p>
              <p className="text-[#f3d7af] text-[12px] uppercase tracking-wide mb-8">{item.date} · {item.duration}</p>

              <div className="border-b border-[#3f0a0e] pb-6 mb-6">
                <p className="text-[12px] uppercase text-[#f53c25] mb-3 tracking-widest font-medium">SOBRE A ENTREVISTA</p>
                <p className="text-[#f3d7af] text-base leading-relaxed">{item.desc}</p>
              </div>

              <div>
                <p className="text-[12px] uppercase text-[#f53c25] mb-4 tracking-widest font-medium">CONTEÚDO</p>
                <div className="text-[#f3d7af] text-base leading-relaxed space-y-4">
                  {item.content.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-[#3f0a0e]">
                <BtnPrimary onClick={() => onNavigate("entrevistas")} className="text-sm">← VOLTAR PARA ENTREVISTAS</BtnPrimary>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ColorBar />

      <section className="bg-[#d9b244] py-16">
        <div className="max-w-[1440px] mx-auto px-10">
          <p className="text-[12px] uppercase text-[#2e0e15] mb-4 tracking-widest font-medium">OUTRAS ENTREVISTAS</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {ENTREVISTAS_ITEMS.slice(1, 4).map((e) => (
              <button
                key={e.id}
                onClick={() => onNavigate("entrevista-item")}
                className="bg-[#2e0e15] text-left overflow-hidden hover:scale-[1.01] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9b244] group"
              >
                <div className="relative h-[180px] overflow-hidden">
                  <ImgPlaceholder className="w-full h-full" label="foto em breve" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#f53c25] flex items-center justify-center">
                      <Play size={14} fill="white" className="text-white ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-['Inter'] font-medium text-[18px] text-[#f3e0b7]">{e.name}</h3>
                  <p className="text-[#f3d7af] text-sm mt-0.5">{e.role}</p>
                  <span className="block mt-3 text-[#f3e0b7] text-[11px] font-bold underline">OUVIR</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function PageGaleria() {
  const images: (string | null)[] = [imgHero, imgNews, imgP1, imgP2, imgP3, imgP4, imgP5, null, imgHero, imgP3, null, imgP5];
  const categories = ["Todas", "Exposições", "Oficinas", "Eventos", "Acervo"];
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <div className="bg-[#2b0101]">
      <section className="bg-[#d65e84] py-16 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-10">
          <p className="text-[12px] uppercase text-[#2e0e15] mb-4 tracking-widest font-medium">GALERIA</p>
          <h1 className="font-['Inter'] font-semibold text-[56px] lg:text-[64px] text-[#2e0e15] leading-tight">Imagens do LabSul</h1>
          <p className="text-[#2e0e15] text-xl mt-4">Registros fotográficos das nossas atividades e acervo</p>
        </div>
      </section>

      <ColorBar />

      <section className="bg-[#2b0101] py-10">
        <div className="max-w-[1440px] mx-auto px-10">
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`text-[12px] uppercase px-4 py-2 tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d75f85] ${
                  activeFilter === cat
                    ? "bg-[#d75f85] text-[#2e0e15]"
                    : "bg-[#3f0a0e] text-[#f3d7af] hover:bg-[#d75f85] hover:text-[#2e0e15]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="columns-2 md:columns-3 lg:columns-4 gap-2 space-y-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => { if (img) setLightbox(i); }}
                className="block w-full overflow-hidden bg-[#3f0a0e] group break-inside-avoid focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d75f85]"
                style={{ height: i % 3 === 0 ? "280px" : "180px" }}
              >
                {img
                  ? <img src={img} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                  : <ImgPlaceholder className="w-full h-full" label="foto em breve" />
                }
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightbox !== null && images[lightbox] && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button
            className="absolute top-6 right-6 text-white p-2 hover:text-[#ffb928] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb928]"
            onClick={() => setLightbox(null)}
            aria-label="Fechar"
          >
            <X size={32} />
          </button>
          <img src={images[lightbox]!} alt="" className="max-w-full max-h-[80vh] object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

function PageAtelie({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="bg-[#2b0101]">
      <section className="relative overflow-hidden bg-[#2b0101] py-20">
        <div className="max-w-[1440px] mx-auto px-10 xl:pr-[400px]">
          <p className="text-[12px] uppercase text-[#f53c25] mb-4 tracking-widest font-medium">FORMAÇÃO</p>
          <h1 className="font-['Inter'] font-semibold text-[56px] lg:text-[64px] text-[#f3e0b7] leading-tight max-w-2xl">
            Ateliê de Cultura Popular
          </h1>
          <p className="text-[#f3d7af] text-xl mt-6 max-w-lg leading-relaxed">
            Programas de formação presencial em Quixadá, Ceará, para quem quer aprender com os mestres da cultura nordestina.
          </p>
        </div>
        <div className="absolute right-[183px] top-0 bottom-0 w-[183px] hidden xl:block bg-[#94231f] overflow-hidden pointer-events-none">
          <img src={imgP1} alt="" className="w-full h-full object-cover opacity-50" />
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-[183px] hidden xl:block bg-[#a5912c] overflow-hidden pointer-events-none">
          <img src={imgP2} alt="" className="w-full h-full object-cover opacity-60" />
        </div>
      </section>

      <ColorBar />

      <section className="bg-[#fbdfb5] py-16">
        <div className="max-w-[1440px] mx-auto px-10">
          <p className="text-[12px] uppercase text-[#9b2220] mb-4 tracking-widest font-medium">PROGRAMAÇÃO</p>
          <h2 className="font-['Inter'] font-medium text-[40px] text-[#2e0e15] leading-tight mb-12">
            Oficinas em andamento
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WORKSHOPS.map((w) => (
              <div key={w.id} className="bg-[#9b2220] overflow-hidden flex flex-col sm:flex-row">
                <div className="w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
                  <img src={w.img} alt={w.title} className="w-full h-full object-cover opacity-70" />
                </div>
                <div className="p-6 flex flex-col justify-between gap-4">
                  <div>
                    <Tag label={w.level} />
                    <h3 className="font-['Inter'] font-medium text-[22px] text-[#f3e0b7] leading-tight mt-3 mb-2">{w.title}</h3>
                    <p className="text-[#f3d7af] text-sm">{w.dates}</p>
                    <p className="text-[#f3d7af]/70 text-[12px] mt-1">{w.schedule} · {w.local}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#ffb928] text-[12px] uppercase tracking-wide font-medium">{w.spots}</span>
                    <button
                      onClick={() => onNavigate("atelie-inscricao")}
                      className="text-[#f3e0b7] text-[12px] font-bold underline hover:text-[#ffb928] transition-colors uppercase tracking-wide"
                    >
                      INSCREVER-SE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#2b0101] py-16">
        <div className="max-w-[1440px] mx-auto px-10">
          <p className="text-[12px] uppercase text-[#f53c25] mb-10 tracking-widest font-medium">METODOLOGIA</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Aprendizado com Mestres", desc: "Todas as oficinas são conduzidas por mestres e detentores do saber tradicional, garantindo autenticidade e profundidade." },
              { label: "Prática Imersiva", desc: "Metodologia baseada na experiência direta com os materiais e técnicas tradicionais, conectando corpo e saber." },
              { label: "Troca de Saberes", desc: "Ambiente colaborativo onde o conhecimento flui entre gerações e tradições, fortalecendo vínculos culturais." },
            ].map((item) => (
              <div key={item.label} className="border-t-2 border-[#f53c25] pt-6">
                <p className="font-['Inter'] font-medium text-[24px] text-[#f3e0b7] mb-3">{item.label}</p>
                <p className="text-[#f3d7af] text-base leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function PageAtelieInscricao({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const workshop = WORKSHOPS[0];
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="bg-[#2b0101]">
      <div className="max-w-[1440px] mx-auto px-10 py-5">
        <div className="flex items-center gap-2 text-[12px] font-['Inter'] flex-wrap">
          <button onClick={() => onNavigate("home")} className="text-[#f3d7af] hover:text-[#ffb928] transition-colors">Início</button>
          <ChevronRight size={12} className="text-[#f3d7af]" />
          <button onClick={() => onNavigate("atelie")} className="text-[#f3d7af] hover:text-[#ffb928] transition-colors">Ateliê</button>
          <ChevronRight size={12} className="text-[#f3d7af]" />
          <span className="text-[#ffb928]">Inscrição</span>
        </div>
      </div>

      <ColorBar />

      <section className="bg-[#fbdfb5] py-16 pb-20">
        <div className="max-w-[1440px] mx-auto px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Informações do ateliê */}
            <div>
              <p className="text-[12px] uppercase text-[#9b2220] mb-4 tracking-widest font-medium">INSCRIÇÃO</p>
              <h1 className="font-['Inter'] font-semibold text-[40px] text-[#2e0e15] leading-tight mb-6">{workshop.title}</h1>

              <div className="bg-[#9b2220] p-2 mb-8 overflow-hidden" style={{ maxWidth: "420px" }}>
                <img src={workshop.img} alt={workshop.title} className="w-full object-cover opacity-80" style={{ maxHeight: "260px" }} />
              </div>

              <p className="text-[#2f0f16] text-base leading-relaxed mb-8">{workshop.desc}</p>

              <div className="space-y-4">
                {[
                  { label: "Período", value: workshop.dates },
                  { label: "Nível", value: workshop.level },
                  { label: "Carga horária", value: workshop.duration },
                  { label: "Horário", value: workshop.schedule },
                  { label: "Local", value: workshop.local },
                  { label: "Vagas disponíveis", value: workshop.spots },
                ].map((field) => (
                  <div key={field.label} className="flex gap-4 border-b border-[#2e0e15]/20 pb-4">
                    <p className="text-[#9b2220] text-[12px] uppercase tracking-widest font-medium w-44 flex-shrink-0">{field.label}</p>
                    <p className="text-[#2e0e15] text-base">{field.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulário */}
            <div>
              <p className="text-[12px] uppercase text-[#9b2220] mb-8 tracking-widest font-medium">PREENCHA O FORMULÁRIO</p>

              {sent ? (
                <div className="bg-[#a7922c] p-8">
                  <p className="font-['Inter'] font-semibold text-[28px] text-[#2e0e15] mb-2">Inscrição recebida!</p>
                  <p className="text-[#2f0f16] text-base leading-relaxed mb-4">
                    Obrigado pelo interesse no ateliê do LabSul. Nossa equipe entrará em contato pelo e-mail informado para confirmar sua inscrição.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="text-[#2e0e15] text-[12px] uppercase font-bold underline tracking-wide hover:text-[#9b2220] transition-colors"
                  >
                    NOVA INSCRIÇÃO
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="ins-name" className="block text-[#2e0e15] text-[12px] font-medium mb-2 uppercase tracking-widest">Nome completo</label>
                    <input
                      id="ins-name"
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      placeholder="Seu nome"
                      className="w-full border-2 border-[#2e0e15] bg-transparent px-4 py-3 text-base text-[#2e0e15] outline-none focus:border-[#ca1419] transition-colors placeholder-[#2e0e15]/40"
                    />
                  </div>
                  <div>
                    <label htmlFor="ins-email" className="block text-[#2e0e15] text-[12px] font-medium mb-2 uppercase tracking-widest">E-mail</label>
                    <input
                      id="ins-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      placeholder="seu@email.com"
                      className="w-full border-2 border-[#2e0e15] bg-transparent px-4 py-3 text-base text-[#2e0e15] outline-none focus:border-[#ca1419] transition-colors placeholder-[#2e0e15]/40"
                    />
                  </div>
                  <div>
                    <label htmlFor="ins-phone" className="block text-[#2e0e15] text-[12px] font-medium mb-2 uppercase tracking-widest">Telefone</label>
                    <input
                      id="ins-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="(00) 00000-0000"
                      className="w-full border-2 border-[#2e0e15] bg-transparent px-4 py-3 text-base text-[#2e0e15] outline-none focus:border-[#ca1419] transition-colors placeholder-[#2e0e15]/40"
                    />
                  </div>
                  <div>
                    <label htmlFor="ins-message" className="block text-[#2e0e15] text-[12px] font-medium mb-2 uppercase tracking-widest">Mensagem (opcional)</label>
                    <textarea
                      id="ins-message"
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Conte um pouco sobre você e sua motivação para participar..."
                      className="w-full border-2 border-[#2e0e15] bg-transparent px-4 py-3 text-base text-[#2e0e15] outline-none focus:border-[#ca1419] transition-colors placeholder-[#2e0e15]/40 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#9b2220] text-[#f3deb7] text-base uppercase py-4 rounded-lg hover:bg-[#ca1419] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2e0e15] tracking-wide"
                  >
                    ENVIAR INSCRIÇÃO
                  </button>
                  <p className="text-[#2e0e15]/60 text-[12px] text-center">
                    Ao enviar, você concorda com o contato da equipe LabSul para confirmação da vaga.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PageContato() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="bg-[#2b0101]">
      <section className="bg-[#2b0101] py-16">
        <div className="max-w-[1440px] mx-auto px-10">
          <p className="text-[12px] uppercase text-[#f53c25] mb-4 tracking-widest font-medium">FALE CONOSCO</p>
          <h1 className="font-['Inter'] font-semibold text-[56px] lg:text-[64px] text-[#f3e0b7] leading-tight">Contato</h1>
        </div>
      </section>

      <ColorBar />

      <section className="bg-[#fbdfb5] py-16 pb-20">
        <div className="max-w-[1440px] mx-auto px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="text-[12px] uppercase text-[#9b2220] mb-8 tracking-widest font-medium">ENVIE UMA MENSAGEM</p>
              {sent ? (
                <div className="bg-[#a7922c] p-8">
                  <p className="font-['Inter'] font-medium text-[24px] text-[#2e0e15] mb-2">Mensagem enviada!</p>
                  <p className="text-[#2f0f16] text-base">Entraremos em contato em breve. Obrigado pelo interesse no LabSul.</p>
                  <button onClick={() => setSent(false)} className="mt-6 text-[#2e0e15] text-[12px] uppercase font-bold underline tracking-wide hover:text-[#9b2220] transition-colors">
                    ENVIAR NOVA MENSAGEM
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="cnt-name" className="block text-[#2e0e15] text-[12px] font-medium mb-2 uppercase tracking-widest">Nome completo</label>
                    <input id="cnt-name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full border-2 border-[#2e0e15] bg-transparent px-4 py-3 text-base text-[#2e0e15] outline-none focus:border-[#ca1419] transition-colors placeholder-[#2e0e15]/40" placeholder="Seu nome" />
                  </div>
                  <div>
                    <label htmlFor="cnt-email" className="block text-[#2e0e15] text-[12px] font-medium mb-2 uppercase tracking-widest">E-mail</label>
                    <input id="cnt-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full border-2 border-[#2e0e15] bg-transparent px-4 py-3 text-base text-[#2e0e15] outline-none focus:border-[#ca1419] transition-colors placeholder-[#2e0e15]/40" placeholder="seu@email.com" />
                  </div>
                  <div>
                    <label htmlFor="cnt-subject" className="block text-[#2e0e15] text-[12px] font-medium mb-2 uppercase tracking-widest">Assunto</label>
                    <select id="cnt-subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full border-2 border-[#2e0e15] bg-[#fbdfb5] px-4 py-3 text-base text-[#2e0e15] outline-none focus:border-[#ca1419] transition-colors">
                      <option value="">Selecione um assunto</option>
                      <option>Consulta ao acervo</option>
                      <option>Oficinas e formação</option>
                      <option>Pesquisa e parcerias</option>
                      <option>Imprensa</option>
                      <option>Outro</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="cnt-message" className="block text-[#2e0e15] text-[12px] font-medium mb-2 uppercase tracking-widest">Mensagem</label>
                    <textarea id="cnt-message" rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required className="w-full border-2 border-[#2e0e15] bg-transparent px-4 py-3 text-base text-[#2e0e15] outline-none focus:border-[#ca1419] transition-colors placeholder-[#2e0e15]/40 resize-none" placeholder="Sua mensagem..." />
                  </div>
                  <button type="submit" className="w-full bg-[#9b2220] text-[#f3deb7] text-base uppercase py-4 rounded-lg hover:bg-[#ca1419] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2e0e15] tracking-wide">
                    ENVIAR MENSAGEM
                  </button>
                </form>
              )}
            </div>

            <div>
              <p className="text-[12px] uppercase text-[#9b2220] mb-8 tracking-widest font-medium">INFORMAÇÕES</p>
              <div className="space-y-8">
                {[
                  { icon: <MapPin size={18} className="text-[#f3deb7]" />, label: "Endereço", value: "Rua da Cultura Popular, 123\nCentro, Quixadá – CE\nCEP 63900-000" },
                  { icon: <Phone size={18} className="text-[#f3deb7]" />, label: "Telefone", value: "(88) 3000-0000" },
                  { icon: <Mail size={18} className="text-[#f3deb7]" />, label: "E-mail", value: "labsul@culturapopular.br" },
                ].map((info) => (
                  <div key={info.label} className="flex gap-4">
                    <div className="w-10 h-10 bg-[#9b2220] flex items-center justify-center flex-shrink-0">{info.icon}</div>
                    <div>
                      <p className="text-[#2e0e15] font-medium uppercase text-[12px] mb-1 tracking-widest">{info.label}</p>
                      <p className="text-[#2f0f16] text-base leading-relaxed whitespace-pre-line">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 bg-[#9b2220] p-8">
                <p className="text-[#f3e0b7] text-[12px] uppercase mb-3 tracking-widest font-medium">HORÁRIO DE FUNCIONAMENTO</p>
                <p className="text-[#f3d7af] text-base leading-relaxed">
                  Segunda a sexta: 9h às 18h<br />
                  Sábado: 10h às 14h<br />
                  Domingo: fechado
                </p>
              </div>
              <div className="mt-6 bg-[#a7922c] p-8">
                <p className="text-[12px] uppercase text-[#2e0e15] mb-3 tracking-widest font-medium">COMO CHEGAR</p>
                <p className="text-[#2f0f16] text-base leading-relaxed">
                  Quixadá fica a 170 km de Fortaleza. Acesso pela CE-060. Há linhas de ônibus intermunicipais partindo do Terminal Rodoviário de Fortaleza.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":             return <PageHome onNavigate={navigate} />;
      case "sobre":            return <PageSobre onNavigate={navigate} />;
      case "acervo":           return <PageAcervo onNavigate={navigate} />;
      case "acervo-item":      return <PageAcervoItem onNavigate={navigate} />;
      case "biblioteca":       return <PageBiblioteca onNavigate={navigate} />;
      case "biblioteca-item":  return <PageBibliotecaItem onNavigate={navigate} />;
      case "noticias":         return <PageNoticias onNavigate={navigate} />;
      case "noticia-item":     return <PageNoticiaItem onNavigate={navigate} />;
      case "entrevistas":      return <PageEntrevistas onNavigate={navigate} />;
      case "entrevista-item":  return <PageEntrevistaItem onNavigate={navigate} />;
      case "galeria":          return <PageGaleria />;
      case "atelie":           return <PageAtelie onNavigate={navigate} />;
      case "atelie-inscricao": return <PageAtelieInscricao onNavigate={navigate} />;
      case "contato":          return <PageContato />;
    }
  };

  return (
    <div className="min-h-screen font-['Inter',sans-serif]">
      <Header currentPage={currentPage} onNavigate={navigate} />
      <main>{renderPage()}</main>
      <Footer onNavigate={navigate} />
    </div>
  );
}
