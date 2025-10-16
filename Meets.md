📞 Módulo: Reuniões (Meets) — Dashboard CRM BoomLab

📅 Início da recolha de dados: histórico completo (sincronizado desde a criação da BoomLab)
🕒 Frequência: em tempo real (webhook GoHighLevel → n8n)
🌍 Timezone: Europe/Lisbon

🔢 Métricas Principais

Total de Reuniões: número total de agendamentos registados

Confirmadas: reuniões com status = confirmed ou booked

Canceladas / No-show: com status = cancelled ou sem presença registada

Taxa de Confirmação: % de reuniões confirmadas

Taxa de No-show: % de agendamentos não realizados

Origem / Responsável: created_by, owner, e calendar_name (tipo de reunião)

⚙️ Arquitetura e Fluxo

GoHighLevel (GHL)

Envia automaticamente dados de novos agendamentos e alterações de estado (booked, cancelled, completed, etc.).

n8n (ETL em tempo real)

Recebe o webhook e processa os campos relevantes em JavaScript.

Exemplo de mapeamento:

id (appointmentId)

contact_id, contact_email

calendar_name, created_by, owner

status, start_time, date_created, notes, tags

Normaliza e envia para o Supabase via HTTP.

Supabase (Base de Dados)

Tabela: meetings

Escrita via POST com on_conflict=id (evita duplicações).

Atualização incremental a cada webhook recebido.

Dashboard CRM (Frontend)

KPIs de reuniões filtráveis por período (ex: Hoje, Semana, Mês, 3 Meses).

Gráfico temporal de reuniões criadas.

Calendário interativo de agendamentos (cores por estado).

Integração direta com Contactos e Departamento Comercial.

🔄 Trocas e Configuração

Nova conta GoHighLevel: atualizar o URL do webhook nas automações de agendamento.

Nova base de dados: alterar endpoint e headers no nó HTTP Request do n8n.

Campos adicionais (ex. notas, duração, tipo de reunião): podem ser adicionados no JavaScript e refletidos no Supabase.

🧩 Resumo rápido:
As reuniões BoomLab são criadas e geridas no GoHighLevel e recebidas em tempo real no n8n.
Cada evento é tratado, normalizado e guardado no Supabase, permitindo ao Dashboard CRM apresentar métricas de desempenho, taxas de confirmação e evolução de reuniões de forma automática e filtrável por período.