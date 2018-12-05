System.register([], function (_export, _context) {
    "use strict";

    return {
        setters: [],
        execute: function () {
            class HttpService {

                get(url) {

                    return new Promise((resouve, reject) => {

                        const xhr = new XMLHttpRequest();
                        xhr.open('GET', url);

                        xhr.onreadystatechange = () => {

                            if (xhr.readyState == 4) {

                                if (xhr.status == 200) {

                                    const dados = JSON.parse(xhr.responseText);

                                    resouve(dados);
                                } else {

                                    console.log(xhr.responseText);

                                    reject(xhr.responseText);
                                }
                            }
                        };

                        xhr.send();
                    });
                }
            }

            _export('HttpService', HttpService);
        }
    };
});
//# sourceMappingURL=HttpService.js.map