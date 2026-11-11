
const form = document.querySelector("#registration-form");
const success = document.querySelector("#success");
const again = document.querySelector("#again");
const cpf = document.querySelector("#cpf");
const submitButton = form.querySelector('button[type="submit"]');

// COLE A URL DO SEU GOOGLE APPS SCRIPT AQUI
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwkeKex1qXWw6UMJF9l9eizwv-4ExneSchG11MgglThnmY6m7WblK--aDm6pW_Jrpc/exec";

// Máscara automática do CPF
cpf.addEventListener("input", (event) => {
  let value = event.target.value.replace(/\D/g, "").slice(0, 11);

  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  event.target.value = value;
});

// Criamos um iframe oculto para receber o retorno do Google
const iframe = document.createElement("iframe");
iframe.name = "google-response";
iframe.title = "Resposta do formulário";
iframe.hidden = true;

let iframeReady = false;
let sending = false;

iframe.addEventListener("load", () => {
  if (!iframeReady) {
    iframeReady = true;
    return;
  }

  if (!sending) return;

  sending = false;
  form.hidden = true;
  success.hidden = false;
});

document.body.appendChild(iframe);

// Envio da inscrição
form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.reportValidity()) return;

  if (GOOGLE_SCRIPT_URL.startsWith("COLE_AQUI")) {
    alert("Configure a URL do Google Apps Script primeiro.");
    return;
  }

  if (!iframeReady) {
    alert("Aguarde um instante e tente novamente.");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Enviando...";

  const envio = document.createElement("form");

  envio.method = "POST";
  envio.action = GOOGLE_SCRIPT_URL;
  envio.target = iframe.name;
  envio.hidden = true;

  new FormData(form).forEach((value, key) => {
    const campo = document.createElement("input");

    campo.type = "hidden";
    campo.name = key;
    campo.value = value;

    envio.appendChild(campo);
  });

  document.body.appendChild(envio);

  sending = true;
  envio.submit();

  setTimeout(() => envio.remove(), 1000);
});

// Permite fazer outra inscrição
again.addEventListener("click", () => {
  form.reset();

  success.hidden = true;
  form.hidden = false;

  submitButton.disabled = false;
  submitButton.innerHTML =
    'Confirmar inscrição <span aria-hidden="true">→</span>';
});
