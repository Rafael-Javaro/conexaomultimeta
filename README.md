# MultiMeta Admin Dashboard

Painel operacional para monitoramento da saúde da plataforma MultiMeta.

## O que este painel responde:

1. **Quantas vagas novas foram publicadas essa semana?**
2. **Quantas conversas estão acontecendo? Quantas viraram contratação?**
3. **Quanto tempo os experts demoram pra responder?**
4. **Tem expert ativo mas sem engajamento?**
5. **Tem closer engajado mas sem ser contratado?**

## Componentes

- **Métricas da Semana**: Cards com KPIs principais (vagas, conversas, contratações, latência de resposta)
- **Alertas Operacionais**: Três alertas prioritários
  - Conversas paradas > 72h
  - Experts lentos (> 48h sem responder)
  - Closers engajados mas sem contrato
- **Atividades Recentes**: Últimas 10 conversas com status e contexto

## Decisões de Escopo

### ✓ Entra no Dashboard
- Métricas que respondem perguntas operacionais reais
- Alertas que requerem ação imediata
- Atividades recentes para contexto
- Números grandes para decisão rápida em 3 segundos

### ✗ Fica de Fora
- Gráficos decorativos de trends
- Tabelas completas de todos os dados
- Detalhes individuais de cada expert/closer
- Informação que não dispara ação

## Rodar Local

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000` no navegador.

## Arquitetura

```
/app
  page.tsx          ← Dashboard principal
  layout.tsx        ← Root layout com estilos

/components
  MetricCard.tsx    ← Card com número grande
  AlertBadge.tsx    ← Alertas em badges
  RecentActivityTable.tsx  ← Tabela de conversas

/lib
  seed.ts           ← Carrega dados do seed.json
  metrics.ts        ← Calcula todas as métricas
```

## Design

Segue a paleta definida em `design.md`:
- Fundo: #F5F2ED (creme claro)
- Cards: #FCFAF8 (branco quente)
- Primário: #758E67 (verde oliva)
- Secundário: #C76E49 (terracota)
- Alertas: #E2B04B (amarelo mostarda), #B54A4B (vermelho)

Sem dependências de CSS library — tudo inline com style objects para máxima simplicidade.

## Próximos Passos

1. Integrar com backend real (substituir seed.json)
2. Adicionar refresh automático a cada 60s
3. Permitir drill-down em cada métrica
4. Exportar relatórios em PDF
