// --- Consulta CNPJ ---

async function consultaCnpj(cnpj) {
  const mensagem = document.getElementById('mensagem');
  const resultadoSection = document.getElementById('resultado');
  mensagem.textContent = '';
  resultadoSection.classList.add('collapsed');
  resultadoSection.hidden = true;

  if (!cnpj.match(/^\d{14}$/)) {
    mensagem.textContent = 'CNPJ deve conter 14 dígitos numéricos.';
    return;
  }

  try {
    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
    if (!res.ok) throw new Error(`Erro na requisição: ${res.status}`);

    const data = await res.json();

    document.getElementById('cnpj').textContent = data.cnpj || '';
    document.getElementById('razao_social').textContent = data.razao_social || '';
    document.getElementById('nome_fantasia').textContent = data.nome_fantasia || '';
    document.getElementById('natureza_juridica').textContent = data.natureza_juridica || '';
    document.getElementById('data_inicio_atividade').textContent = data.data_inicio_atividade || '';
    document.getElementById('logradouro').textContent = `${data.descricao_tipo_de_logradouro || ''} ${data.logradouro || ''}`.trim();
    document.getElementById('numero').textContent = data.numero || '';
    document.getElementById('complemento').textContent = data.complemento || '';
    document.getElementById('bairro').textContent = data.bairro || '';
    document.getElementById('municipio').textContent = data.municipio || '';
    document.getElementById('uf').textContent = data.uf || '';
    document.getElementById('cep').textContent = data.cep || '';
    document.getElementById('email').textContent = data.email || '';
    document.getElementById('cnae_fiscal').textContent = data.cnae_fiscal || '';
    document.getElementById('cnae_fiscal_descricao').textContent = data.cnae_fiscal_descricao || '';

    const cnaesSec = document.getElementById('cnaes_secundarios');
    cnaesSec.innerHTML = '';
    if (Array.isArray(data.cnaes_secundarios)) {
      data.cnaes_secundarios.forEach(cnae => {
        const li = document.createElement('li');
        li.textContent = `${cnae.codigo} - ${cnae.descricao}`;
        cnaesSec.appendChild(li);
      });
    }

    const qsaList = document.getElementById('qsa');
    qsaList.innerHTML = '';
    if (Array.isArray(data.qsa)) {
      data.qsa.forEach(socio => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>Nome:</strong> ${socio.nome_socio || 'N/A'} <br/>
          <strong>Qualificação:</strong> ${socio.qualificacao_socio || 'N/A'} <br/>
          <strong>Data Entrada:</strong> ${socio.data_entrada_sociedade || 'N/A'}
        `;
        qsaList.appendChild(li);
      });
    }

    const regimeList = document.getElementById('regime_tributario');
    regimeList.innerHTML = '';
    if (Array.isArray(data.regime_tributario)) {
      data.regime_tributario.forEach(regime => {
        const li = document.createElement('li');
        li.textContent = `${regime.ano}: ${regime.forma_de_tributacao}`;
        regimeList.appendChild(li);
      });
    }

    document.getElementById('descricao_situacao_cadastral').textContent =
      data.descricao_situacao_cadastral || '';

    resultadoSection.classList.remove('collapsed');
    resultadoSection.hidden = false;
  } catch (error) {
    mensagem.textContent = `Erro na consulta: ${error.message}`;
  }
}

// --- Consulta CEP ---

async function consultaCep(cep) {
  const mensagemCep = document.getElementById('mensagemCep');
  const resultadoCep = document.getElementById('resultadoCep');
  mensagemCep.textContent = '';
  resultadoCep.classList.add('collapsed');
  resultadoCep.hidden = true;

  if (!cep.match(/^\d{8}$/)) {
    mensagemCep.textContent = 'CEP deve conter 8 dígitos numéricos.';
    return;
  }

  try {
    const res = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);
    if (!res.ok) throw new Error(`CEP não encontrado ou inválido`);

    const data = await res.json();

    document.getElementById('cepResultado').textContent = data.cep || '';
    document.getElementById('logradouroCep').textContent = data.street || '';
    document.getElementById('bairroCep').textContent = data.neighborhood || '';
    document.getElementById('cidadeCep').textContent = data.city || '';
    document.getElementById('ufCep').textContent = data.state || '';

    resultadoCep.classList.remove('collapsed');
    resultadoCep.hidden = false;
  } catch (error) {
    mensagemCep.textContent = `Erro na consulta CEP: ${error.message}`;
  }
}

// --- Consulta NCM ---

async function consultaNcm(codigo) {
  const mensagemNcm = document.getElementById('mensagemNcm');
  const resultadoNcm = document.getElementById('resultadoNcm');
  const listaNcm = document.getElementById('listaNcm');
  mensagemNcm.textContent = '';
  resultadoNcm.classList.add('collapsed');
  resultadoNcm.hidden = true;
  listaNcm.innerHTML = '';

  try {
    const res = await fetch('https://brasilapi.com.br/api/ncm/v1');
    if (!res.ok) throw new Error(`Erro na requisição NCM: ${res.status}`);

    const data = await res.json();

    let resultados = data;
    if (codigo) {
      resultados = data.filter(ncm => ncm.codigo.startsWith(codigo));
      if (resultados.length === 0) {
        mensagemNcm.textContent = 'Nenhum NCM encontrado com esse código.';
        return;
      }
    }

    resultados.forEach(ncm => {
      const li = document.createElement('li');
      li.textContent = `${ncm.codigo} - ${ncm.descricao}`;
      listaNcm.appendChild(li);
    });

    resultadoNcm.classList.remove('collapsed');
    resultadoNcm.hidden = false;
  } catch (error) {
    mensagemNcm.textContent = `Erro na consulta NCM: ${error.message}`;
  }
}

// --- Eventos ---

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('cnpjForm').addEventListener('submit', e => {
    e.preventDefault();
    const cnpj = document.getElementById('cnpjInput').value.trim();
    consultaCnpj(cnpj);
  });

  document.getElementById('cepForm').addEventListener('submit', e => {
    e.preventDefault();
    const cep = document.getElementById('cepInput').value.trim();
    consultaCep(cep);
  });

  document.getElementById('ncmForm').addEventListener('submit', e => {
    e.preventDefault();
    const ncm = document.getElementById('ncmInput').value.trim();
    consultaNcm(ncm);
  });

  // Limpar
  document.getElementById('limparCNPJ').onclick = () => {
    document.getElementById('cnpjInput').value = '';
    const resultado = document.getElementById('resultado');
    resultado.classList.add('collapsed');
    resultado.hidden = true;
    document.querySelector('#mensagem').textContent = '';
  };
  document.getElementById('limparCEP').onclick = () => {
    document.getElementById('cepInput').value = '';
    const resultadoCep = document.getElementById('resultadoCep');
    resultadoCep.classList.add('collapsed');
    resultadoCep.hidden = true;
    document.querySelector('#mensagemCep').textContent = '';
  };
  document.getElementById('limparNCM').onclick = () => {
    document.getElementById('ncmInput').value = '';
    const resultadoNcm = document.getElementById('resultadoNcm');
    resultadoNcm.classList.add('collapsed');
    resultadoNcm.hidden = true;
    document.querySelector('#mensagemNcm').textContent = '';
  };

  // Expandir / recolher
  document.getElementById('toggleCNPJ').onclick = () => {
    const resultado = document.getElementById('resultado');
    resultado.classList.toggle('collapsed');
    resultado.hidden = resultado.classList.contains('collapsed');
  };
  document.getElementById('toggleCEP').onclick = () => {
    const resultadoCep = document.getElementById('resultadoCep');
    resultadoCep.classList.toggle('collapsed');
    resultadoCep.hidden = resultadoCep.classList.contains('collapsed');
  };
  document.getElementById('toggleNCM').onclick = () => {
    const resultadoNcm = document.getElementById('resultadoNcm');
    resultadoNcm.classList.toggle('collapsed');
    resultadoNcm.hidden = resultadoNcm.classList.contains('collapsed');
  };
});
