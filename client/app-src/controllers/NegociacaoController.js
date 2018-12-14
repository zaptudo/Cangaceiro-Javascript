import { Negociacoes, Negociacao } from '../domain';
import { NegociacoesView, MensagemView, Mensagem, DataInvalidaException, DateConverter } from '../ui';
import { getNegociacaoDao, Bind, getExceptionMessage, debounce, controller, bindEvent } from '../util';

@controller('#data', '#quantidade', '#valor')
export class NegociacaoController {

    constructor(_inputData, _inputQuantidade, _inputValor) {

        Object.assign(this, {_inputData, _inputQuantidade, _inputValor});

        this._negociacoes = new Bind(new Negociacoes(), new NegociacoesView('#negociacoes'), 'adiciona', 'esvazia');
        this._mensagem = new Bind(new Mensagem(), new MensagemView('#mensagemView'), 'texto');

        this._init();
    }

    async _init() {

        try {

            const dao = await getNegociacaoDao();
            const negociacoes = await dao.listarTodos();
            negociacoes.forEach(negociacao => this._negociacoes.adiciona(negociacao));

        } catch (err) {

            this._mensagem.texto = getExceptionMessage(err);
        }
    }

    @bindEvent('submit', '.form')
    @debounce()
    async adiciona(event) {

        event.preventDefault();

        try {

            const negociacao = this._criaNegociacao();

            const dao = await getNegociacaoDao();
            await dao.adiciona(negociacao);
            this._negociacoes.adiciona(negociacao);
            this._mensagem.texto = 'Negociação adicionada com sucesso';

        } catch (err) {

            this._mensagem.texto = getExceptionMessage(err);
        }
    }

    @bindEvent('click', '#botao-apaga')
    @debounce()
    async apaga() {

        try {

            const dao = await getNegociacaoDao();
            await dao.apagaTodos();
            this._negociacoes.esvazia();
            this._mensagem.texto = 'Negociações apagadas com sucesso';

        } catch (err) {

            this._mensagem.texto = getExceptionMessage(err);
        }
    }

    @bindEvent('click', '#botao-importa')
    @debounce()    
    async importaNegociacoes() {

        try {

            const { NegociacaoService } = await import('../domain/negociacao/NegociacaoService');

            const service = new NegociacaoService();

            const negociacoes = await service.obterNegociacoesDoPeriodo();
            negociacoes.filter(novaNegociacao => !this._negociacoes.paraArray().some(negociacaoExistente => novaNegociacao.equals(negociacaoExistente)))
                .forEach(negociacao => this._negociacoes.adiciona(negociacao));

            this._mensagem.texto = 'Negociações importadas com sucesso';

        } catch (err) {

            this._mensagem.texto = getExceptionMessage(err);
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