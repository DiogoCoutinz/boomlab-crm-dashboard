# 🧩 Resumo Técnico - BoomLab CRM Dashboard

## 📋 Visão Geral

Sistema de CRM analítico que integra **GHL (GoHighLevel)**, **n8n**, **Supabase** e um **dashboard web** para análise em tempo real de contactos e reuniões comerciais.

---

## 🔁 Como Funciona

### Fluxo de Dados
1. **GHL** envia webhooks quando há novos contactos ou reuniões
2. **n8n** recebe, normaliza dados (JavaScript) e envia para Supabase via REST API
3. **Supabase** armazena em PostgreSQL com deduplicação automática por ID
4. **Dashboard** consulta Supabase e apresenta métricas em tempo real

### Deduplicação
- Cada registo tem `id` único (UUID)
- n8n usa `?on_conflict=id` + header `Prefer: resolution=merge-duplicates`
- Se ID existe → **update**, se novo → **insert**
- Zero duplicados garantidos

---

## 🗄️ Base de Dados (Supabase)

**Tabela `contactos`**: nome, email, país, origem, data_criacao, empresa  
**Tabela `meetings`**: contact_email, created_by, status, start_time, date_created, notes

Ambas com chave primária `id` (UUID) e queries otimizadas com filtros temporais.

---

## ⚙️ Automação n8n

**Workflow**:
- Webhook node → recebe JSON do GHL
- Code node → normaliza datas, remove espaços, valida campos
- HTTP Request → POST para Supabase com upsert automático

**Header crítico**: `Prefer: resolution=merge-duplicates` garante que IDs duplicados fazem update em vez de erro.

---

## 🎨 Dashboard Frontend

### Stack
- **HTML5 + Tailwind CSS** (tema dark, responsivo)
- **JavaScript vanilla** (sem frameworks)
- **Chart.js** - gráficos de linha
- **FullCalendar** - calendário interativo
- **Day.js** - manipulação de datas/timezones
- **Supabase Client** - queries diretas via JavaScript

### Arquitetura
Ficheiro único (`index.html`) com tudo embutido:
- Styles inline (Tailwind + custom CSS)
- Libs via CDN
- Lógica JavaScript inline
- Self-contained, só precisa de browser

---

## 📊 Funcionalidades Principais

### 1. KPIs (Layout 2+1)
**Esquerda** - Total no Período:
- Contactos totais (com delta % vs período anterior)
- Reuniões totais (com delta %)

**Direita** - KPIs de Hoje (destaque azul):
- Contactos hoje, Reuniões hoje, Confirmadas, No-shows

### 2. Filtros Temporais
- Botões: Hoje, Semana, Mês, 3 Meses (mudam datas automaticamente)
- Date pickers manuais (De/Até)
- Vista: Por Dia, Por Semana, Por Mês

### 3. Gráficos
- **Contactos**: linha verde, evolução temporal
- **Reuniões**: linha azul, evolução temporal
- Ordenados cronologicamente (antigo → esquerda, recente → direita)
- Por semana mostra intervalo: `16/07 - 22/07`

### 4. Tabs
- **Contactos**: gráfico + tabela pesquisável (50 registos)
- **Reuniões**: calendário FullCalendar + stats
- **Departamento Comercial**: pódio top 3 + ranking completo

### 5. Calendário
- Cores por status: verde (confirmed), vermelho (noshow), amarelo (pending)
- Horário 06:00-22:00 (sem madrugada)
- Click abre modal com detalhes: email, comercial, link, notas, status

### 6. Ranking Comerciais
- **Pódio**: 🥇🥈🥉 com alturas diferentes (#1 maior no centro)
- **Lista**: todos ordenados, mostra total, confirmadas, no-shows, taxa %
- **Stats**: ativos, média, mediana, top performer, delta período anterior

### 7. Insights Automáticos
Frases geradas dinamicamente:
- "💡 -7.0% de contactos criados face ao período anterior"
- "💡 A equipa marcou +34 reuniões neste período"
- "💡 Taxa de no-show reduziu 2.6%"

---

## 🧮 Lógica Técnica

### Comparação Temporal
```javascript
// Calcula período anterior com mesma duração
const duration = 31; // dias do período atual
const prevFrom = dataInicio - 31 dias;
const prevTo = dataInicio - 1 dia;
delta = ((atual - anterior) / anterior) * 100;
```

### Agrupamento
```javascript
// Por semana: agrupa por início/fim da semana
// Por dia: agrupa por DD/MM
// Por mês: agrupa por MMM/YY
// Depois ordena cronologicamente por sortKey
```

### Queries Supabase
```javascript
await supabase
  .from('contactos')
  .select('*')
  .gte('data_criacao', '2024-09-08')
  .lte('data_criacao', '2024-10-08');
```

---

## ✅ Validação

Testes manuais confirmaram:
- Total contactos: Supabase = 107 | Dashboard = 107 ✅
- Total reuniões: Supabase = 201 | Dashboard = 201 ✅
- Delta %: cálculo manual = -7.0% | Dashboard = -7.0% ✅
- Ranking: ordem e valores idênticos ✅
- Zero duplicados ✅

---

## 🚀 Como Executar

**Windows**:
```powershell
python -m http.server 8000
# Abrir: http://localhost:8000
```

**Linux/Mac**:
```bash
python3 -m http.server 8000
```

**VS Code**: instalar extensão "Live Server" e clicar direito → "Open with Live Server"

---

## 🔧 Configuração

**Supabase**:
- URL: `https://uvvxvqrymdywxoqgnnvd.supabase.co`
- Timezone: `Europe/Lisbon (UTC+1)`
- RLS: desativado (acesso via anon key)

**Day.js**: plugins UTC, timezone, weekOfYear, isBetween para manipulação de datas

---

## 🎯 Performance

- Ficheiro único: ~80KB
- Carregamento: < 2s (CDNs)
- Tabela limitada a 50 registos (lazy rendering)
- Charts destroem instância anterior antes de re-render
- Modal com animação suave + blur backdrop

---

## 📁 Estrutura

```
contactomeetdashbaord/
├── index.html       # Dashboard completo
├── contactmeet.md   # Esta documentação
└── README.md        # Guia rápido
```

---

## 💡 Resultado Final

Um CRM analítico completo em **1 ficheiro HTML**:
- ✅ Sincronização automática GHL → n8n → Supabase
- ✅ Zero duplicados (upsert por ID)
- ✅ Análise temporal com comparação entre períodos
- ✅ Visualização moderna (gráficos + calendário + rankings)
- ✅ Responsivo e rápido
- ✅ Sem dependências de backend (exceto Supabase)

**Stack**: HTML5 + Tailwind + Chart.js + FullCalendar + Day.js + Supabase Client  
**Deploy**: qualquer servidor HTTP (Python, Vercel, Netlify, Apache, etc.)

---

**BoomLab** | Outubro 2024

