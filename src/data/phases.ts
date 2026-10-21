/** Etapas do ciclo de um projeto, na ordem em que aparecem. */
export const phases = ['planejamento', 'design', 'desenvolvimento', 'testes', 'deploy', 'manutencao'] as const;
export type Phase = (typeof phases)[number];
