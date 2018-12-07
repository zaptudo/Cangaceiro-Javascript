export function controller(...seletores) {

    const elements = seletores.map(seletor => document.querySelector(seletor));

    return function(contructor) {

        const contructorOriginal = contructor;
        
        const constructorNovo = function() {

            return new contructorOriginal(...elements);   
        }

        constructorNovo.prototype = contructorOriginal.prototype;

        return constructorNovo;
    }
}