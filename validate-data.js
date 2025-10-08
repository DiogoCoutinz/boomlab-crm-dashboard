// Validação de Dados - Dashboard vs Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uvvxvqrymdywxoqgnnvd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2dnh2cXJ5bWR5d3hvcWdubnZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODM3NDAsImV4cCI6MjA3NDY1OTc0MH0.3vNlo61Yl4c3XG7-8yDCKVBO4-f0iNMJeHXSSgzAI5w';

const supabase = createClient(supabaseUrl, supabaseKey);

// Período atual (último mês)
const dateFrom = '2024-09-08';
const dateTo = '2024-10-08';

console.log('\n🔍 VALIDAÇÃO DE DADOS - Dashboard BoomLab CRM\n');
console.log(`📅 Período: ${dateFrom} até ${dateTo}\n`);
console.log('='.repeat(70));

async function validateData() {
  try {
    // 1. CONTACTOS
    console.log('\n📊 TABELA: contactos');
    console.log('-'.repeat(70));
    
    const { data: contacts, error: contactsError } = await supabase
      .from('contactos')
      .select('*')
      .gte('data_criacao', dateFrom)
      .lte('data_criacao', dateTo + 'T23:59:59')
      .order('data_criacao', { ascending: false });

    if (contactsError) throw contactsError;

    console.log(`✅ Total de Contactos no período: ${contacts.length}`);
    console.log(`   → Query: SELECT * FROM contactos WHERE data_criacao BETWEEN '${dateFrom}' AND '${dateTo}'`);
    
    // Por origem
    const byOrigin = {};
    contacts.forEach(c => {
      const origin = c.origem || 'Desconhecido';
      byOrigin[origin] = (byOrigin[origin] || 0) + 1;
    });
    console.log(`\n   📍 Por Origem:`);
    Object.entries(byOrigin).sort((a, b) => b[1] - a[1]).forEach(([origin, count]) => {
      console.log(`      - ${origin}: ${count}`);
    });

    // 2. REUNIÕES
    console.log('\n\n📊 TABELA: meetings');
    console.log('-'.repeat(70));
    
    const { data: meetings, error: meetingsError } = await supabase
      .from('meetings')
      .select('*')
      .gte('date_created', dateFrom)
      .lte('date_created', dateTo + 'T23:59:59')
      .order('date_created', { ascending: false });

    if (meetingsError) throw meetingsError;

    console.log(`✅ Total de Reuniões no período: ${meetings.length}`);
    console.log(`   → Query: SELECT * FROM meetings WHERE date_created BETWEEN '${dateFrom}' AND '${dateTo}'`);
    
    // Por status
    const byStatus = {
      confirmed: 0,
      completed: 0,
      noshow: 0,
      pending: 0,
      cancelled: 0
    };
    meetings.forEach(m => {
      const status = m.status || 'pending';
      byStatus[status] = (byStatus[status] || 0) + 1;
    });

    console.log(`\n   📍 Por Status:`);
    console.log(`      ✅ Confirmadas/Concluídas: ${byStatus.confirmed + byStatus.completed}`);
    console.log(`      ⏳ Pendentes: ${byStatus.pending}`);
    console.log(`      ❌ No-shows: ${byStatus.noshow}`);
    console.log(`      🚫 Canceladas: ${byStatus.cancelled}`);
    
    const noshowRate = meetings.length > 0 ? (byStatus.noshow / meetings.length) * 100 : 0;
    console.log(`      📊 Taxa de No-show: ${noshowRate.toFixed(1)}%`);

    // 3. POR CONSULTOR
    console.log('\n\n📊 RANKING DE CONSULTORES');
    console.log('-'.repeat(70));
    
    const byConsultant = {};
    meetings.forEach(m => {
      const consultant = m.created_by || 'Unknown';
      if (!byConsultant[consultant]) {
        byConsultant[consultant] = { total: 0, confirmed: 0, noshows: 0 };
      }
      byConsultant[consultant].total++;
      if (m.status === 'confirmed' || m.status === 'completed') {
        byConsultant[consultant].confirmed++;
      }
      if (m.status === 'noshow') {
        byConsultant[consultant].noshows++;
      }
    });

    const sorted = Object.entries(byConsultant)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.total - a.total);

    sorted.forEach((c, idx) => {
      const noshowRate = c.total > 0 ? (c.noshows / c.total) * 100 : 0;
      const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '  ';
      console.log(`   ${medal} #${idx + 1} ${c.name}`);
      console.log(`      → Total: ${c.total} | Confirmadas: ${c.confirmed} | No-shows: ${c.noshows} (${noshowRate.toFixed(1)}%)`);
    });

    // 4. PERÍODO ANTERIOR (para comparação)
    console.log('\n\n📊 COMPARAÇÃO COM PERÍODO ANTERIOR');
    console.log('-'.repeat(70));
    
    const daysInPeriod = Math.floor((new Date(dateTo) - new Date(dateFrom)) / (1000 * 60 * 60 * 24)) + 1;
    const prevFrom = new Date(dateFrom);
    prevFrom.setDate(prevFrom.getDate() - daysInPeriod);
    const prevTo = new Date(dateFrom);
    prevTo.setDate(prevTo.getDate() - 1);

    const prevFromStr = prevFrom.toISOString().split('T')[0];
    const prevToStr = prevTo.toISOString().split('T')[0];

    console.log(`   Período Anterior: ${prevFromStr} até ${prevToStr} (${daysInPeriod} dias)`);

    const { data: prevContacts } = await supabase
      .from('contactos')
      .select('*')
      .gte('data_criacao', prevFromStr)
      .lte('data_criacao', prevToStr + 'T23:59:59');

    const { data: prevMeetings } = await supabase
      .from('meetings')
      .select('*')
      .gte('date_created', prevFromStr)
      .lte('date_created', prevToStr + 'T23:59:59');

    const contactDelta = contacts.length - prevContacts.length;
    const meetingDelta = meetings.length - prevMeetings.length;
    const contactDeltaPct = prevContacts.length > 0 ? ((contactDelta / prevContacts.length) * 100) : 0;
    const meetingDeltaPct = prevMeetings.length > 0 ? ((meetingDelta / prevMeetings.length) * 100) : 0;

    console.log(`\n   👥 Contactos:`);
    console.log(`      Período Atual: ${contacts.length}`);
    console.log(`      Período Anterior: ${prevContacts.length}`);
    console.log(`      Delta: ${contactDelta >= 0 ? '+' : ''}${contactDelta} (${contactDeltaPct >= 0 ? '+' : ''}${contactDeltaPct.toFixed(1)}%)`);

    console.log(`\n   📅 Reuniões:`);
    console.log(`      Período Atual: ${meetings.length}`);
    console.log(`      Período Anterior: ${prevMeetings.length}`);
    console.log(`      Delta: ${meetingDelta >= 0 ? '+' : ''}${meetingDelta} (${meetingDeltaPct >= 0 ? '+' : ''}${meetingDeltaPct.toFixed(1)}%)`);

    // 5. VERIFICAÇÃO CRUZADA
    console.log('\n\n✅ VALIDAÇÃO CRUZADA');
    console.log('-'.repeat(70));
    
    console.log(`\n   Dashboard deveria mostrar:`);
    console.log(`      📊 KPI "Total de Contactos": ${contacts.length}`);
    console.log(`      📊 KPI "Total de Reuniões": ${meetings.length}`);
    console.log(`      📊 KPI Delta Contactos: ${contactDeltaPct >= 0 ? '↑' : '↓'} ${Math.abs(contactDeltaPct).toFixed(1)}%`);
    console.log(`      📊 Top Consultor: ${sorted[0]?.name} com ${sorted[0]?.total} reuniões`);
    console.log(`      📊 Taxa No-show Global: ${noshowRate.toFixed(1)}%`);

    console.log(`\n   ✅ TUDO CORRETO SE:`);
    console.log(`      - Dashboard mostrar ${contacts.length} contactos`);
    console.log(`      - Dashboard mostrar ${meetings.length} reuniões`);
    console.log(`      - Top 3: ${sorted.slice(0, 3).map(c => c.name).join(', ')}`);

    console.log('\n' + '='.repeat(70));
    console.log('✅ Validação concluída com sucesso!\n');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

validateData();

