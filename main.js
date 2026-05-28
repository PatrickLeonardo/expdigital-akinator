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

const choiceRandomQuestion = () => {
    const random = parseInt(Math.random() * vetAtributos.length);
    const choiced = vetAtributos[random];

    return { "idx": random, "question": choiced };    
}

const answerOfQuestion = (answer, atributo) => {
    
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

const removeAttributeByQuestionAndAnswer = (question, answer) => {
    
    const atributosDistintos = [
        ["adulto", "crianca"],
        ["masculino", "feminino"],
        ["humano", "animal", "sobrenatural"],
        ["vive_na_pre_historia", "vive_no_espaco", "mora_na_roca"]
    ]
    
    let buffVetAtributos = false;

    atributosDistintos.map(atributos => {
        if(atributos.includes(question)) {
            buffVetAtributos = atributos;
        }
    });
     
    if(buffVetAtributos) {
        
        buffVetAtributos.forEach(atributo => {
            
            if(question == atributo) {
                if(!answer) {
                    buffVetAtributos = [atributo];
                }
            }
            
        });
        
        buffVetAtributos.forEach(atributo => {
            const idxToRemove = vetAtributos.findIndex(a => a["atributo"] == atributo);
            vetAtributos.splice(idxToRemove, 1);
        });
        
        return true;
    }

    return false;
}

const startLoop = () => {
    
    while(vetPersonagens.length != 1) {
        
        const choiced = choiceRandomQuestion();
        const answer = confirm(choiced["question"]["pergunta"]);
        
        if(!removeAttributeByQuestionAndAnswer(choiced["question"]["atributo"], answer)) {
            vetAtributos.splice(choiced["idx"], 1);
        }

        answerOfQuestion(answer, choiced["question"]["atributo"]);
        
        if(vetPersonagens.length == 0) {
            alert("Personagem não encontrado...");
            break;
        } else if(vetPersonagens.length == 1) {
            alert("Seu Personagem é " + vetPersonagens[0]["nome"])
        }
        
    }

}

startLoop();
