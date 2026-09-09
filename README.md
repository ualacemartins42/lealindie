# Leal Indie

Hub pessoal e vitrine de projetos feitos por hobby. Sem captação de clientes.

## Começar

```bash
npm install
cp .env.example .env
npm run dev
```

## Métricas

No SQL Editor, rode `supabase/schema.sql`. Depois preencha no `.env`:

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_GITHUB_URL=https://github.com/seu-usuario
```

Sem essas variáveis o site abre normalmente; visitas e likes ficam pausados.

| Recurso | RPC | Comportamento |
|---|---|---|
| Visualizações | `register_page_view` | Dedup de 30 min por visitante |
| Curtidas | `toggle_project_like` | 1 like por projeto e por visitante |
| Totais | `get_site_metrics` | Contagens agregadas |

## Estrutura visível

Hero → Sobre → Vitrine de projetos → Footer (visitas)

```
src/components/{ui,layout,sections,projects}
src/data/projects.ts
src/hooks/
src/services/supabase/
```
