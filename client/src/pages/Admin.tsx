import { ChangeEvent, useMemo, useState } from "react";
import { ArrowLeft, Check, Download, ImagePlus, RotateCcw, Upload } from "lucide-react";
import { Link } from "wouter";
import { coverKey, getCoverSource, loadCoverOverrides, saveCoverOverrides, type CoverOverrides } from "@/lib/coverOverrides";
import { products } from "@/lib/catalog";



function Brand() {
  return <span className="admin-brand"><span className="admin-brand-mark">D</span> Digital<span>Quintino</span></span>;
}

function toWebp(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Formato de imagem não suportado."));
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 900;
        const ratio = Math.min(1, maxWidth / image.naturalWidth);
        canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
        const context = canvas.getContext("2d");
        if (!context) return reject(new Error("Seu navegador não suporta conversão de imagem."));
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/webp", 0.82));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export default function Admin() {
  const [overrides, setOverrides] = useState<CoverOverrides>(() => loadCoverOverrides());
  const [status, setStatus] = useState("");
  const customizedCount = useMemo(() => Object.keys(overrides).length, [overrides]);

  const updateCover = async (title: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const webp = await toWebp(file);
      const next = { ...overrides, [coverKey(title)]: webp };
      setOverrides(next);
      saveCoverOverrides(next);
      setStatus(`Capa de “${title}” atualizada em WebP.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Não foi possível atualizar a capa.");
    }
  };

  const resetCover = (title: string) => {
    const next = { ...overrides };
    delete next[coverKey(title)];
    setOverrides(next);
    saveCoverOverrides(next);
    setStatus(`Capa original de “${title}” restaurada.`);
  };

  const resetAll = () => {
    setOverrides({});
    saveCoverOverrides({});
    setStatus("Todas as capas originais foram restauradas.");
  };

  const exportCatalog = () => {
    const blob = new Blob([JSON.stringify(overrides, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "digitalquintino-capas.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus("Configuração exportada.");
  };

  const importCatalog = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(String(reader.result)) as CoverOverrides;
        setOverrides(imported);
        saveCoverOverrides(imported);
        setStatus("Configuração importada com sucesso.");
      } catch {
        setStatus("Arquivo inválido. Use um JSON exportado por este painel.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <main className="admin-page">
      <header className="admin-header"><Link href="/"><Brand /></Link><Link className="admin-back" href="/"><ArrowLeft size={14} /> Voltar para a página</Link></header>
      <section className="admin-hero"><span className="eyebrow">PAINEL DE CONTEÚDO</span><h1>Atualize suas <em>capas.</em></h1><p>Envie uma imagem oficial licenciada para qualquer e-book. O painel converte o arquivo para WebP e salva a configuração neste navegador.</p><div className="admin-note"><strong>Modo estático</strong><span>As alterações ficam salvas no localStorage deste navegador. Para sincronizar entre dispositivos, exporte o catálogo e importe o JSON no outro navegador.</span></div></section>
      <section className="admin-toolbar"><div><strong>{customizedCount}</strong><span> capas personalizadas</span></div><div className="admin-actions"><label className="admin-button admin-button-light"><Upload size={15} /> Importar JSON<input hidden type="file" accept="application/json" onChange={importCatalog} /></label><button className="admin-button admin-button-light" type="button" onClick={exportCatalog}><Download size={15} /> Exportar JSON</button><button className="admin-button admin-button-danger" type="button" onClick={resetAll}><RotateCcw size={15} /> Restaurar tudo</button></div></section>
      {status && <p className="admin-status" role="status"><Check size={15} /> {status}</p>}
      <section className="admin-grid" aria-label="Capas do catálogo">
        {products.map((product) => {
          const title = product.title;
          const defaultImage = product.image;
          const image = getCoverSource(title, defaultImage, overrides);
          const customized = Boolean(overrides[coverKey(title)]);
          return <article className="admin-card" key={title}><div className="admin-card-image"><img src={image} alt={`Capa atual de ${title}`} /></div><div className="admin-card-content"><span className="eyebrow">{customized ? "PERSONALIZADA" : "CAPA ATUAL"}</span><h2>{title}</h2><div className="admin-card-actions"><label className="admin-button admin-button-dark"><ImagePlus size={14} /> Trocar capa<input hidden type="file" accept="image/*" onChange={(event) => updateCover(title, event)} /></label>{customized && <button className="admin-reset" type="button" onClick={() => resetCover(title)}>Restaurar original</button>}</div></div></article>;
        })}
      </section>
    </main>
  );
}
