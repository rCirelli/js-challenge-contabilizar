function recuperarDigitosVerificadores(digitosPrincipais) {
   const principais = digitosPrincipais.split("").map(d => parseInt(d, 10));
   const multiplicadoresD1 = Array.from({ length: 9 }, (_, i) => 10 - i);
   const multiplicadoresD2 = Array.from({ length: 10 }, (_, i) => 11 - i);

   const produtosD1 = multiplicadoresD1.map((multiplicador, i) => multiplicador * principais[i]);
   let d1 = 11 - (produtosD1.reduce((total, valor) => total + valor) % 11);
   if (d1 >= 10) {
      d1 = 0;
   }

   const principaisD1 = [...principais, d1];
   const produtosD2 = multiplicadoresD2.map((multiplicador, i) => multiplicador * principaisD1[i]);
   let d2 = 11 - (produtosD2.reduce((total, valor) => total + valor) % 11);
   if (d2 >= 10) {
      d2 = 0;
   }

   return [d1, d2]
}

function validarCPF(cpf) {
   const digitosPrincipais = cpf.slice(0, 9);
   const [d1, d2] = cpf.slice(9, 11);

   const [calculoD1, calculodD2] = recuperarDigitosVerificadores(digitosPrincipais);

   return calculoD1 === Number(d1) && calculodD2 === Number(d2);
}

const validarEntradaDeDados = (lancamento) => {
   const { cpf, valor } = lancamento;
   const cpfEhNumerico = /^[0-9]+$/.test(cpf);
   const cpfEhValido = validarCPF(cpf);
   const valorEhNumerico = /^-?\d+(?:\,\d{2})?$/.test(valor);
   const valorEhValido = Number(valor) <= 15000 && Number(valor) >= -2000;

   if (!cpfEhNumerico) {
      return "CPF deve conter apenas caracteres numéricos."
   }
   if (!cpfEhValido) {
      return "Os dígitos verificadores do CPF devem ser válido."
   }
   if (!valorEhNumerico) {
      return "Valor deve ser numérico."
   }
   if (!valorEhValido) {
      return "Valor deve estar entre -2000,00 e 15000,00"
   }
   return null
}

const recuperarSaldosPorConta = (lancamentos) => {
   const resultado = {};
   lancamentos.forEach(({ cpf, valor }) => {
      if (!resultado.cpf) {
         resultado[cpf] = { cpf, valor: Number(valor)};
      } else {
         resultado[cpf] = { cpf, valor: resultado[cpf][valor] += Number(valor)};
      }
   })
   return Object.values(resultado);
}

const recuperarMaiorMenorLancamentos = (cpf, lancamentos) => {
   const lancamentosCpf = lancamentos.filter((lancamento) => lancamento.cpf === cpf);
   const qtdLancamentos = lancamentosCpf.length;

   if (qtdLancamentos === 0) {
      return []
   }
   if (qtdLancamentos === 1) {
      return [ ...lancamentosCpf, ...lancamentosCpf];
   }

   const menorLancamento = { index: 0, lancamento: lancamentosCpf[0] };
   const maiorLancamento = { index: 0, lancamento: lancamentosCpf[0] };
   lancamentosCpf.forEach(({ valor }, index) => {
      if (valor > maiorLancamento.lancamento.valor) {
         maiorLancamento.index = index;
         maiorLancamento.lancamento.valor = valor;
      }
      if (valor < menorLancamento.lancamento.valor) {
         menorLancamento.index = index;
         menorLancamento.lancamento.valor = valor;
      }
   });

   return [menorLancamento.lancamento, maiorLancamento.lancamento]
}

const recuperarMaioresSaldos = (lancamentos) => {
   const saldos = recuperarSaldosPorConta(lancamentos).sort((a, b) => b.valor - a.valor);
   return saldos.slice(0, 3);
}

const recuperarMaioresMedias = (lancamentos) => {
   const mediasPorCpf = {}
   lancamentos.forEach((lancamento) => {
      if (!mediasPorCpf[lancamento.cpf]) {
         mediasPorCpf[lancamento.cpf] = { ...lancamento, qtd: 1};
      } else {
         valorAnterior = mediasPorCpf[lancamento.cpf].valor;
         qtd = mediasPorCpf[lancamento.cpf].qtd;
         mediasPorCpf[lancamento.cpf] = {
            ...lancamento,
            valor: (valorAnterior + lancamento.valor) / qtd,
            qtd: qtd + 1,
         }
      }
   });

   const resultado = Object.values(mediasPorCpf).sort((a, b) => b.valor - a.valor)
      .map(({ cpf, valor }) => ({ cpf, valor }));
      
   if (resultado.length === 0) {
      return [];
   }
   return resultado;
}
