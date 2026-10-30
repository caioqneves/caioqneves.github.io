// As ÁREAS do portfólio. Para criar uma nova (ex.: "Motion"), basta acrescentar uma linha aqui:
// o filtro da home, os cartões, as páginas e a validação dos projetos se ajustam sozinhos.
export const AREAS = [
  { id: 'grafico', pt: 'Design Gráfico', en: 'Graphic Design' },
  { id: 'ux',      pt: 'UX/UI',          en: 'UX/UI' },
] as const;

export type AreaId = (typeof AREAS)[number]['id'];
export const AREA_IDS = AREAS.map((a) => a.id) as [AreaId, ...AreaId[]];
export const areaDe = (id: string) => AREAS.find((a) => a.id === id) ?? AREAS[0];
