
const button = document.querySelector('#prepareButton');

button.addEventListener('click', prepareTransaction);

function prepareTransaction(e) {

  e.preventDefault();

  const fileName = document.querySelector('#fileName').value || ' ';
  const mimeType = document.querySelector('#mimeType').value || ' ';
  const encoding = document.querySelector('#encoding').value || ' ';
  const txIdTextArea = document.querySelector('#txIds').value;

  const txIds = txIdTextArea.match(/[0-9A-Fa-f]{64}/g);

  console.log(txIds);

  if (!txIds) {
    alert(`No transaction ids entered`);
    return;
  }

  const script = [
    '15DHFxWZJT58f9nhyGnsRBqrgwK4W6h4Up',
    ' ',
    mimeType,
    encoding,
    fileName,
    ' ',
    ...txIds.map(txId => bsv.deps.Buffer.from(txId, 'hex'))
  ]

  const asm = bsv.Script.buildSafeDataOut(script).toASM();

  const moneyButtonDiv = document.querySelector('#bcat-money-button');

  moneyButton.render(moneyButtonDiv, {
    label: "Send",
    clientIdentifier: "3fb24dea420791729b4d9b39703c6339",
    type: "buy",
    outputs: [{ 
      script: asm, 
      amount: 0, 
      currency: 'BSV' 
    }],
    onPayment: onPayment,
    onError: onError
  });

}

function onPayment(arg) {
  console.log(`Payment successful, txid: ${arg.txid}`);
  const pTxId = document.querySelector('#txId');

  pTxId.innerHTML = `<a href="https://bico.media/${arg.txid}" target='_blank'>${arg.txid}</a>`;
}

function onError(arg) {
  console.log('Payment error', arg);
  alert('Payment error');
}
