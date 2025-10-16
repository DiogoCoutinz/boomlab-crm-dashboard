📞 Resumo do Sistema de CRM – BoomLab

📅 Início da recolha de dados: início da BoomLab (histórico completo disponível)
🕒 Frequência: atualização em tempo real (via webhooks GoHighLevel → n8n)
🌍 Timezone: Europe/Lisbon

🔢 Métricas Principais

Total de Contactos: número total de leads criados

Total de Reuniões: reuniões agendadas via GoHighLevel

Formulários Preenchidos: envios de formulários associados a campanhas

Taxa de Confirmação: % de reuniões confirmadas

Taxa de No-Show: % de reuniões não realizadas

Origem dos Contactos: canal de entrada (ex: formulário mentoria, ads, nps, etc.)

⚙️ Arquitetura e Fluxo

GoHighLevel (GHL)

Envia dados de contactos, reuniões e formulários por webhook

n8n (ETL em tempo real)

Recebe cada webhook e normaliza os campos em JavaScript

Exemplo: id, nome_completo, email, telefone, empresa, origem, pais, data_criacao, data_atualizacao

Supabase (Base de Dados)

Tabelas principais:

contactos → todos os leads com metadados

reunioes → agendamentos e confirmações

formularios → envios de formulários online

Gravação via HTTP POST com on_conflict=id (evita duplicados)

Registos com atualização automática (data_atualizacao)

Dashboard CRM (Frontend)

Interface web com KPIs, gráficos e tabelas interativas

Tabs: Contactos, Reuniões, Departamento Comercial, Formulários

Cálculo automático de variações (% vs período anterior)

🔄 Trocas e Configuração

Nova conta GoHighLevel: atualizar URLs dos webhooks nas automações do GHL.

Nova base de dados: alterar endpoint e headers das requisições HTTP no n8n.

Campos adicionais: podem ser adicionados facilmente ao JavaScript e mapeados no Supabase.

🧩 Resumo rápido:
O sistema de CRM recolhe contactos, reuniões e formulários em tempo real via GoHighLevel.
Os dados são tratados no n8n, guardados no Supabase e visualizados no Dashboard CRM BoomLab, que mostra performance comercial, origens de leads e métricas de conversão.