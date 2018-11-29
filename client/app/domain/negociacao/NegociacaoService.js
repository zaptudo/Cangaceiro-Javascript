class NegociacaoService {

    obterNegociacoesDaSemana(cb) {

        return new Promise((resouve, reject) => {

            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'negociacoes/xsemana');

            xhr.onreadystatechange = () => {

                if (xhr.readyState == 4) {

                    if (xhr.status == 200) {

                        const negociacoes = JSON.parse(xhr.responseText)
                            .map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));

                        resouve(negociacoes);

                    } else {

                        console.log(xhr.responseText);

                        reject('Não foi possível obter as negociações da semana');
                    }
                }
            };

            xhr.send();

        });
    }
}