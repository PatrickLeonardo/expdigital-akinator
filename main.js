import atributos from './atributos.js'
import personagens from './personagens.js'

const vetAtributos = [];

for(let key in atributos) {
    vetAtributos.push(atributos[key]);
}

let vetPersonagens = []

for(let key in personagens) {
    vetPersonagens.push(personagens[key]);
}

const escolherPerguntaAleatoria = () => {
    const idxAleatorio = parseInt(Math.random() * vetAtributos.length);
    const escolha = vetAtributos[idxAleatorio];

    return { "idx": idxAleatorio, "question": escolha };    
}

const aplicarRespostaNaPergunta = (answer, atributo) => {
    
    const buff = [];

    vetPersonagens.map(personagem => {
        
        if(answer && personagem[atributo]) {
            buff.push(personagem);
        } else if(!answer && !personagem[atributo]) {
            buff.push(personagem);
        }

    });

    vetPersonagens = buff;

}

const removerAtributosPorPerguntaEResposta = (question, answer) => {
    
    const atributosDistintos = [
        ["adulto", "crianca"],
        ["masculino", "feminino"],
        ["humano", "animal", "sobrenatural"],
        ["vive_na_pre_historia", "vive_no_espaco", "mora_na_roca"]
    ]
    
    let buffVetAtributos = [];
    let thisQuestionRemoved = false;

    atributosDistintos.map(atributos => {
        if(atributos.includes(question)) {
            buffVetAtributos = atributos;
            thisQuestionRemoved = true;
        }
    });
     
    if(buffVetAtributos.length) {
        buffVetAtributos.forEach(atributo => {
            
            if(question == atributo) {
                if(!answer) {
                    if(!buffVetAtributos.length == 2) buffVetAtributos = [atributo]; 
                }
            }
            
        }); 
    }

    vetAtributos.forEach(atributo => {

        let atributoExiste = false;

        vetPersonagens.forEach(personagem => {

            if(personagem[atributo["atributo"]] && !atributoExiste) {
                atributoExiste = true;
            }

        });

        if(!atributoExiste) buffVetAtributos.push(atributo["atributo"]);

    });

    buffVetAtributos.forEach(atributo => {
        const idxParaRemover = vetAtributos.findIndex(a => a["atributo"] == atributo);
        vetAtributos.splice(idxParaRemover, 1);
    });

    return thisQuestionRemoved;
}

async function processarResposta(answer, escolha, msgBox) { 
    
    if(!removerAtributosPorPerguntaEResposta(escolha["question"]["atributo"], answer)) {
        vetAtributos.splice(escolha["idx"], 1);
    }
    
    aplicarRespostaNaPergunta(answer, escolha["question"]["atributo"]);
    
    if(vetPersonagens.length == 0) {
        
        msgBox.innerHTML = ("Personagem não encontrado...");    
        return true;

    } else if(vetPersonagens.length == 1) {

        msgBox.innerHTML = ("Seu Personagem é " + vetPersonagens[0]["nome"])
        return true;

    } else if(vetAtributos.length == 0) {

        let idx = 0;
        answer = false;
        const yesBtn = document.getElementById("yesBtn");
        const noBtn = document.getElementById("noBtn");

        while(!answer && idx < vetPersonagens.length) {
             
            msgBox.innerHTML = `Seu personagem é ${vetPersonagens[idx]["nome"]}?`;
            
            await (async () => {
                
                return new Promise((resolve) => {
                    
                    yesBtn.onclick = () => {
                        answer = true;
                        resolve(true);
                    }

                    noBtn.onclick = () => {
                        resolve(true);
                    }

                });
                
            })();
            
            idx ++;
            
        }
        
        if(answer == false) {
            msgBox.innerHTML = ("Personagem não encontrado...");
            yesBtn.style.visibility = "hidden";
            noBtn.style.visibility = "hidden";
            restartBtn.style.visibility = "visible"; 
        }
        
    }
    
}

async function iniciarJogo () {

    const msgBox = document.getElementById("question");
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const restartBtn = document.getElementById("restart");
    
    restartBtn.style.visibility = "hidden";
    restartBtn.addEventListener("click", () => location.reload())

    while(vetAtributos.length != 0 && vetPersonagens.length != 1) {

        const escolha = escolherPerguntaAleatoria();
        question.innerHTML = escolha["question"]["pergunta"];
        
        await (async () => {
            
            return new Promise((resolve) => {
                
                yesBtn.onclick = async () => {
                    await processarResposta(true, escolha, msgBox); 
                    resolve(true);
                }

                noBtn.onclick = async () => {
                    await processarResposta(false, escolha, msgBox);        
                    resolve(true);
                }

            });
            
        })();
        
    }
    
    yesBtn.style.visibility = "hidden";
    noBtn.style.visibility = "hidden";
    restartBtn.style.visibility = "visible";

}

iniciarJogo();