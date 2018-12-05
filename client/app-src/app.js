import { NegociacaoController } from './controllers/NegociacaoController.js';
import { debounce } from './util/Debounce.js';


const controller = new NegociacaoController();

const $ = document.querySelector.bind(document);

$('.form')
        .addEventListener('submit', debounce(controller.adiciona.bind(controller), 1000));

$('#botao-apaga')
        .addEventListener('click', debounce(controller.apaga.bind(controller), 1000));

$('#botao-importa')
        .addEventListener('click', debounce(controller.importaNegociacoes.bind(controller), 1000));