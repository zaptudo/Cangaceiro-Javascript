export function controller(...seletores) {

    const elements = seletores.map(seletor => document.querySelector(seletor));

    return function(contructor) {

        const constructorOriginal = contructor;
        
        const constructorNovo = function() {

            const instance = new constructorOriginal(...elements);   

            Object.getOwnPropertyNames(constructorOriginal.prototype)
                .forEach(property => {

                    if (Reflect.hasMetadata('bindEvent', instance, property)) {

                        associaEvento(instance, Reflect.getMetadata('bindEvent', instance, property));
                    }
                });            
        }

        constructorNovo.prototype = constructorOriginal.prototype;

        return constructorNovo;
    }
}

function associaEvento(instance, metadado) {

    debugger;

    document.querySelector(metadado.selector)
        .addEventListener(metadado.event, event => {

            if(metadado.prevent) {

                event.preventDefault();
            }

            instance[metadado.propertyKey](event);
        });
}