# 📊 BoomLab CRM Dashboard

Dashboard analítico para gestão de contactos e reuniões, integrado com GHL, n8n e Supabase.

## 🚀 Como Executar

### Windows (Python)
```powershell
python -m http.server 8000
```
Depois abrir: **http://localhost:8000**

### Linux/Mac
```bash
python3 -m http.server 8000
```

### Alternativa: Live Server (VS Code)
1. Instalar extensão "Live Server"
2. Right-click em `index.html` → "Open with Live Server"

## 📁 Ficheiros

- **`index.html`** - Dashboard completo (único ficheiro necessário)
- **`contactmeet.md`** - Documentação técnica detalhada
- **`README.md`** - Este ficheiro

## ✨ Funcionalidades

- 📊 KPIs em tempo real (contactos, reuniões, no-shows)
- 📈 Gráficos de evolução temporal
- 📅 Calendário interativo de reuniões
- 💼 Ranking de desempenho comercial
- 🔍 Pesquisa de contactos
- 📱 Design responsivo (mobile-friendly)

## 🛠️ Stack Tecnológica

- **Frontend**: HTML5 + Tailwind CSS + JavaScript
- **Gráficos**: Chart.js
- **Calendário**: FullCalendar
- **Backend**: Supabase (PostgreSQL)
- **Automação**: n8n (webhooks do GHL)

## 📖 Documentação

Ver `contactmeet.md` para documentação técnica completa.

## 🔗 Ligações

- **Supabase Project**: uvvxvqrymdywxoqgnnvd
- **Timezone**: Europe/Lisbon (UTC+1)
- **Locale**: pt-PT

## 📝 Uso

1. Abrir dashboard no browser
2. Selecionar período (atalhos: Hoje, Semana, Mês, 3 Meses)
3. Navegar entre tabs (Contactos, Reuniões, Departamento Comercial)
4. Clicar em reuniões no calendário para ver detalhes

---

**BoomLab** | Outubro 2024


