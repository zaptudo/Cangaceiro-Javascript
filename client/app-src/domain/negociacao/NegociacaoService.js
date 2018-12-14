import { HttpService } from '../../util/HttpService';
import { Negociacao } from './Negociacao';
import { ApplicationException } from '../../util'


export class NegociacaoService {

    constructor() {

        this._http = new HttpService();
    }

    obterNegociacoesDaSemana() {

        return this._http.get('http://localhost:3000/negociacoes/semana')
            .then(

            dados => dados.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor))
            ,
            err => {

                throw new ApplicationException('Não foi possível obter as negociações da semana');
            });
    }

    obterNegociacoesDaSemanaAnterior() {

        return this._http.get('http://localhost:3000/negociacoes/anterior')
            .then(

            dados => dados.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor))
            ,
            err => {

                throw new ApplicationException('Não foi possível obter as negociações da semana anterior');
            });
    }

    obterNegociacoesDaSemanaRetrasada() {

        return this._http.get('http://localhost:3000/negociacoes/retrasada')
            .then(

            dados => dados.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor))
            ,
            err => {

                throw new ApplicationException('Não foi possível obter as negociações da semana retrasada');
            });
    }

    async obterNegociacoesDoPeriodo() {

        try {

            let periodo = await Promise.all([
                this.obterNegociacoesDaSemana(),
                this.obterNegociacoesDaSemanaAnterior(),
                this.obterNegociacoesDaSemanaRetrasada()
            ]);

            return periodo.reduce((novoArray, item) => novoArray.concat(item), [])
                .sort((a, b) => b.data.getTime() - a.data.getTime());

        } catch (err) {

            console.log(err);
            throw new ApplicationException('Não foi possível obter as negociações do periodo');
        }

    }
}