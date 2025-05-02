// Seleção de elementos DOM
const tabEstacas = document.getElementById('tabEstacas');
const tabComprimento = document.getElementById('tabComprimento');
const estacasMode = document.getElementById('estacasMode');
const comprimentoMode = document.getElementById('comprimentoMode');
const calcularBtn = document.getElementById('calcularBtn');
const exportExcelBtn = document.getElementById('exportExcelBtn');
const resultsSection = document.getElementById('resultsSection');
const resultsTableBody = document.getElementById('resultsTableBody');
const numDelineadores = document.getElementById('numDelineadores');
const numEspacamentos = document.getElementById('numEspacamentos');
const sobraTotal = document.getElementById('sobraTotal');
const distribuicaoSobra = document.getElementById('distribuicaoSobra');

// Gerenciamento das abas
tabEstacas.addEventListener('click', () => {
    tabEstacas.classList.add('active');
    tabComprimento.classList.remove('active');
    estacasMode.classList.remove('hidden');
    comprimentoMode.classList.add('hidden');
});

tabComprimento.addEventListener('click', () => {
    tabComprimento.classList.add('active');
    tabEstacas.classList.remove('active');
    comprimentoMode.classList.remove('hidden');
    estacasMode.classList.add('hidden');
});

// Função para calcular a distribuição dos delineadores
calcularBtn.addEventListener('click', () => {
    let comprimento;
    let estacaInicial = { numero: 0, metros: 0 };
    
    // Determinar o modo e obter os valores
    if (tabEstacas.classList.contains('active')) {
        // Modo Estacas
        const estacaInicialNumero = parseInt(document.getElementById('estacaInicialNumero').value) || 0;
        const estacaInicialMetros = parseFloat(document.getElementById('estacaInicialMetros').value) || 0;
        const estacaFinalNumero = parseInt(document.getElementById('estacaFinalNumero').value) || 0;
        const estacaFinalMetros = parseFloat(document.getElementById('estacaFinalMetros').value) || 0;
        
        // Converter estacas para metros
        const posicaoInicial = estacaInicialNumero * 20 + estacaInicialMetros;
        const posicaoFinal = estacaFinalNumero * 20 + estacaFinalMetros;
        
        comprimento = posicaoFinal - posicaoInicial;
        estacaInicial = { numero: estacaInicialNumero, metros: estacaInicialMetros };
    } else {
        // Modo Comprimento
        comprimento = parseFloat(document.getElementById('comprimentoTotal').value) || 0;
        estacaInicial.numero = parseInt(document.getElementById('estacaInicialNumeroOpt').value) || 0;
        estacaInicial.metros = parseFloat(document.getElementById('estacaInicialMetrosOpt').value) || 0;
    }
    
    // Validar comprimento
    if (comprimento <= 0) {
        alert('O comprimento deve ser maior que zero!');
        return;
    }
    
    // Obter opção de distribuição
    const opcaoDistribuicao = parseInt(document.getElementById('opcaoDistribuicao').value);
    
    // Calcular distribuição
    const espacamentoCentral = 15;
    const numEspacamentosTotal = Math.floor(comprimento / espacamentoCentral);
    const comprimentoRegular = numEspacamentosTotal * espacamentoCentral;
    const sobraMetros = comprimento - comprimentoRegular;
    
    // Calcular número de delineadores
    const numDelineadoresTotal = numEspacamentosTotal + 1;
    
    // Determinar a distribuição da sobra
    let espacamentosModificados = [];
    let descricaoDistribuicao = '';
    let posicoes = [];
    
    // Posição inicial em metros e estaca
    const posicaoInicialMetros = estacaInicial.numero * 20 + estacaInicial.metros;
    
    // Lógica de distribuição baseada na opção escolhida
    switch (opcaoDistribuicao) {
        case 1: // Concentrar no início
            // Determinar quantos espaçamentos de 16m são necessários
            const numEspacamentos16m_op1 = Math.min(Math.ceil(sobraMetros), numEspacamentosTotal);
            
            // Calcular posições
            posicoes.push({
                posicaoMetros: posicaoInicialMetros,
                espacamento: 0,
                tipo: 'Início'
            });
            
            for (let i = 1; i < numDelineadoresTotal; i++) {
                let espacamento = espacamentoCentral;
                let tipo = 'Central';
                
                if (i <= numEspacamentos16m_op1) {
                    espacamento = 16; // Espaçamento aumentado no início
                    tipo = 'Início +1m';
                }
                
                const posicaoMetros = posicoes[i-1].posicaoMetros + espacamento;
                posicoes.push({
                    posicaoMetros,
                    espacamento,
                    tipo
                });
            }
            
            descricaoDistribuicao = `${numEspacamentos16m_op1} espaçamentos de 16m no início`;
            break;
            
        case 2: // Concentrar no final
            // Determinar quantos espaçamentos de 16m são necessários
            const numEspacamentos16m_op2 = Math.min(Math.ceil(sobraMetros), numEspacamentosTotal);
            
            // Calcular posições
            posicoes.push({
                posicaoMetros: posicaoInicialMetros,
                espacamento: 0,
                tipo: 'Início'
            });
            
            for (let i = 1; i < numDelineadoresTotal; i++) {
                let espacamento = espacamentoCentral;
                let tipo = 'Central';
                
                if (i > (numDelineadoresTotal - 1 - numEspacamentos16m_op2)) {
                    espacamento = 16; // Espaçamento aumentado no final
                    tipo = 'Final +1m';
                }
                
                const posicaoMetros = posicoes[i-1].posicaoMetros + espacamento;
                posicoes.push({
                    posicaoMetros,
                    espacamento,
                    tipo
                });
            }
            
            descricaoDistribuicao = `${numEspacamentos16m_op2} espaçamentos de 16m no final`;
            break;
            
        case 3: // Distribuir no início e final
        default:
            // Determinar quantos espaçamentos de 16m são necessários
            const numEspacamentos16m_op3 = Math.min(Math.ceil(sobraMetros), numEspacamentosTotal);
            
            // Calcular quantos no início e quantos no final
            const numInicio = Math.ceil(numEspacamentos16m_op3 / 2);
            const numFinal = numEspacamentos16m_op3 - numInicio;
            
            // Calcular posições
            posicoes.push({
                posicaoMetros: posicaoInicialMetros,
                espacamento: 0,
                tipo: 'Início'
            });
            
            for (let i = 1; i < numDelineadoresTotal; i++) {
                let espacamento = espacamentoCentral;
                let tipo = 'Central';
                
                if (i <= numInicio) {
                    espacamento = 16; // Espaçamento aumentado no início
                    tipo = 'Início +1m';
                } else if (i > (numDelineadoresTotal - 1 - numFinal)) {
                    espacamento = 16; // Espaçamento aumentado no final
                    tipo = 'Final +1m';
                }
                
                const posicaoMetros = posicoes[i-1].posicaoMetros + espacamento;
                posicoes.push({
                    posicaoMetros,
                    espacamento,
                    tipo
                });
            }
            
            descricaoDistribuicao = `${numInicio} espaçamentos de 16m no início e ${numFinal} no final`;
            break;
    }
    
    // Converter posições em metros para estacas
    posicoes.forEach(pos => {
        const estacaNumero = Math.floor(pos.posicaoMetros / 20);
        const estacaMetros = (pos.posicaoMetros % 20).toFixed(2);
        pos.estaca = `${estacaNumero}+${estacaMetros.padStart(2, '0')}`;
    });
    
    // Atualizar a interface com os resultados
    numDelineadores.textContent = numDelineadoresTotal;
    numEspacamentos.textContent = numEspacamentosTotal;
    sobraTotal.textContent = `${sobraMetros.toFixed(2)} m`;
    distribuicaoSobra.textContent = descricaoDistribuicao;
    
    // Limpar a tabela anterior
    resultsTableBody.innerHTML = '';
    
    // Preencher a tabela com os resultados
    posicoes.forEach((pos, index) => {
        const row = document.createElement('tr');
        
        // Nº do delineador
        const cellNum = document.createElement('td');
        cellNum.textContent = index;
        row.appendChild(cellNum);
        
        // Posição em metros
        const cellPos = document.createElement('td');
        cellPos.textContent = pos.posicaoMetros.toFixed(2) + ' m';
        row.appendChild(cellPos);
        
        // Estaca
        const cellEstaca = document.createElement('td');
        cellEstaca.textContent = pos.estaca;
        row.appendChild(cellEstaca);
        
        // Espaçamento
        const cellEspacamento = document.createElement('td');
        cellEspacamento.textContent = pos.espacamento ? pos.espacamento.toFixed(2) + ' m' : '-';
        if (pos.espacamento === 16) {
            cellEspacamento.classList.add('cell-espacamento-16');
        } else if (pos.espacamento === 14) {
            cellEspacamento.classList.add('cell-espacamento-14');
        }
        row.appendChild(cellEspacamento);
        
        // Tipo
        const cellTipo = document.createElement('td');
        cellTipo.textContent = pos.tipo;
        cellTipo.classList.add('cell-tipo');
        row.appendChild(cellTipo);
        
        resultsTableBody.appendChild(row);
    });
    
    // Mostrar a seção de resultados
    resultsSection.classList.remove('hidden');
});

// Função para exportar para Excel
exportExcelBtn.addEventListener('click', () => {
    // Criar workbook e worksheet
    const wb = XLSX.utils.book_new();
    
    // Obter dados da tabela
    const data = [];
    
    // Cabeçalho
    data.push(['Nº', 'Posição (m)', 'Estaca', 'Espaçamento', 'Tipo']);
    
    // Linhas de dados
    const rows = resultsTableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const rowData = [];
        row.querySelectorAll('td').forEach(cell => {
            rowData.push(cell.textContent);
        });
        data.push(rowData);
    });
    
    // Adicionar resumo
    data.push([]);
    data.push(['Resumo:']);
    data.push(['Número de delineadores:', numDelineadores.textContent]);
    data.push(['Número de espaçamentos:', numEspacamentos.textContent]);
    data.push(['Sobra total (metros):', sobraTotal.textContent]);
    data.push(['Distribuição da sobra:', distribuicaoSobra.textContent]);
    
    // Criar worksheet e adicionar ao workbook
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Distribuição Delineadores');
    
    // Salvar arquivo
    const today = new Date();
    const filename = `Distribuicao_Delineadores_${today.getFullYear()}${(today.getMonth()+1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}.xlsx`;
    XLSX.writeFile(wb, filename);
});
