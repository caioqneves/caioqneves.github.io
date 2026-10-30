import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { AREA_IDS } from './data/areas';

/*
  Cada projeto é uma PASTA em src/content/projetos/:
    nome-do-projeto/index.md   → versão em português (obrigatória)
    nome-do-projeto/en.md      → versão em inglês   (opcional)
    nome-do-projeto/capa.jpg   → capa do card
    nome-do-projeto/01.jpg …   → galeria (automática, em ordem)
  Pastas que começam com "_" são ignoradas (ex.: _modelo).
*/
const projetos = defineCollection({
  loader: glob({ pattern: ['*/{index,en}.md', '!_*/**'], base: './src/content/projetos' }),   // '!_*/**' ignora pastas como _modelo
  schema: z.object({
    titulo: z.string(),
    categoria: z.string().optional(),
    resumo: z.string().optional(),
    funcao: z.string().optional(),
    // — os campos abaixo só precisam existir no index.md (PT) —
    area: z.enum(AREA_IDS).default(AREA_IDS[0]),   // as opções vêm de src/data/areas.ts
    ano: z.coerce.number().optional(),
    cliente: z.string().optional(),
    ferramentas: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    links: z.array(z.object({ rotulo: z.string(), url: z.string().url() })).default([]),
    destaque: z.boolean().default(false),   // true = grande no topo da home (só 1)
    rascunho: z.boolean().default(false),   // true = some do site publicado (aparece no preview local)
    galeria: z.boolean().default(true),     // false = não listar as imagens da pasta no fim da página
    ordem: z.number().optional(),           // opcional: menor número aparece primeiro
  }),
});

export const collections = { projetos };
