import { getCollection, type CollectionEntry } from 'astro:content';
import type { AreaId } from '../data/areas';

type Entry = CollectionEntry<'projetos'>;

// Todas as imagens que estiverem dentro das pastas de projeto (capa, 01, 02, …)
const imagens = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/projetos/*/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}',
  { eager: true },
);

export interface Projeto {
  slug: string;
  pt: Entry;
  en?: Entry;
  capa?: ImageMetadata;
  galeria: ImageMetadata[];
  area: AreaId;
}

const slugDe = (e: Entry) => (e.filePath ?? '').split('/').slice(-2)[0];
const arquivoDe = (e: Entry) => (e.filePath ?? '').split('/').slice(-1)[0];

export async function getProjetos(): Promise<Projeto[]> {
  const todos = await getCollection('projetos');
  const grupos = new Map<string, { pt?: Entry; en?: Entry }>();
  for (const e of todos) {
    const g = grupos.get(slugDe(e)) ?? {};
    if (arquivoDe(e) === 'en.md') g.en = e; else g.pt = e;
    grupos.set(slugDe(e), g);
  }

  const lista: Projeto[] = [];
  for (const [slug, g] of grupos) {
    if (!g.pt || slug.startsWith('_')) continue;                                        // en.md sem index.md: ignora
    if (g.pt.data.rascunho && !import.meta.env.DEV) continue;   // rascunho só aparece no "npm run dev"
    const fotos = Object.entries(imagens)
      .filter(([caminho]) => caminho.startsWith(`/src/content/projetos/${slug}/`))
      .map(([caminho, mod]) => ({ nome: caminho.split('/').pop()!, img: mod.default }));
    const capa = fotos.find((f) => f.nome.toLowerCase().startsWith('capa.'))?.img;
    const galeria = fotos
      .filter((f) => !f.nome.toLowerCase().startsWith('capa.'))
      .sort((a, b) => a.nome.localeCompare(b.nome, undefined, { numeric: true }))
      .map((f) => f.img);
    lista.push({ slug, pt: g.pt, en: g.en, capa, galeria: g.pt.data.galeria ? galeria : [], area: g.pt.data.area });
  }

  // "ordem" (menor primeiro) e, sem ela, o ano mais recente primeiro
  return lista.sort((a, b) => {
    const oa = a.pt.data.ordem ?? Infinity, ob = b.pt.data.ordem ?? Infinity;
    if (oa !== ob) return oa - ob;
    return (b.pt.data.ano ?? 0) - (a.pt.data.ano ?? 0);
  });
}
