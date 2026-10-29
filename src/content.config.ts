import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/*
  Cada projeto é uma PASTA em src/content/projetos/:
    nome-do-projeto/index.md   → versão em português (obrigatória)
    nome-do-projeto/en.md      → versão em inglês   (opcional)
    nome-do-projeto/capa.jpg   → capa do card
    nome-do-projeto/01.jpg …   → galeria (automática, em ordem)
  Pastas que começam com "_" são ignoradas (ex.: _modelo).
*/
const projetos = defineCollection({
  loader: glob({ pattern: '*/{index,en}.md', base: './src/content/projetos' }),
  schema: z.object({
    titulo: z.string(),
    categoria: z.string().optional(),
    resumo: z.string().optional(),
    funcao: z.string().optional(),
    // — os campos abaixo só precisam existir no index.md (PT) —
    area: z.enum(['grafico', 'ux']).default('grafico'),
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
