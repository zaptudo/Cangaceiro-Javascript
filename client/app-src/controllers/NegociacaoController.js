import { Negociacoes, NegociacaoService, Negociacao } from '../domain/index.js';
import { NegociacoesView, MensagemView, Mensagem, DataInvalidaException, DateConverter } from '../ui/index.js';
import { getNegociacaoDao, Bind } from '../util/index.js';


export class NegociacaoController {

    constructor() {

        const $ = document.querySelector.bind(document);
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');

        this._negociacoes = new Bind(new Negociacoes(), new NegociacoesView('#negociacoes'), 'adiciona', 'esvazia');
        this._mensagem = new Bind(new Mensagem(), new MensagemView('#mensagemView'), 'texto');

        this._service = new NegociacaoService();

        this._init();
    }

    async _init() {

        try {

            const dao = await getNegociacaoDao();
            const negociacoes = await dao.listarTodos();
            negociacoes.forEach(negociacao => this._negociacoes.adiciona(negociacao));

        } catch (err) {

            this._mensagem.texto = err.message;
        }
    }

    async adiciona(event) {

        try {

            event.preventDefault();

            const negociacao = this._criaNegociacao();

            try {

                const dao = await getNegociacaoDao();
                await dao.adiciona(negociacao);
                this._negociacoes.adiciona(negociacao);
                this._mensagem.texto = 'Negociação adicionada com sucesso';

            } catch (err) {

                this._mensagem.texto = err.message;
            }


        } catch (err) {

            console.log(err);
            console.log(err.stack);

            if (err instanceof DataInvalidaException) {

                this._mensagem.texto = err.message;

            } else {

                this._mensagem.texto = 'Um erro não esperado aconteceu. Entre em contato com o suporte';
            }
        }
    }

    async apaga() {

        try {

            const dao = await getNegociacaoDao();
            await dao.apagaTodos();
            this._negociacoes.esvazia();
            this._mensagem.texto = 'Negociações apagadas com sucesso';

        } catch (err) {

            this._mensagem.texto = err.message;
        }
    }

    async importaNegociacoes() {

        try {
            
            const negociacoes = await this._service.obterNegociacoesDoPeriodo();
            negociacoes.filter(novaNegociacao => !this._negociacoes.paraArray().some(negociacaoExistente => novaNegociacao.equals(negociacaoExistente)))
                .forEach(negociacao => this._negociacoes.adiciona(negociacao));

            this._mensagem.texto = 'Negociações importadas com sucesso';

        } catch (err) {

            this._mensagem.texto = err.message;
        }
    }

    _limpaFormulario() {

        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;
        this._inputData.focus();
    }

    _criaNegociacao() {

        return new Negociacao(
            DateConverter.paraData(this._inputData.value),
            parseInt(this._inputQuantidade.value),
            parseFloat(this._inputValor.value)
        );
    }
}