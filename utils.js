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

export function validarCPF(cpf) {
  const digitosPrincipais = cpf.slice(0, 9);
  const [d1, d2] = cpf.slice(9, 11);

  const [calculoD1, calculodD2] = recuperarDigitosVerificadores(digitosPrincipais);

  return calculoD1 === Number(d1) && calculodD2 === Number(d2);
}
