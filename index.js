const express = require('express')
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json())

//middleeware é um INTERCEPTADOR, basicamente uma funcao que vai rodar antes das outras funcoes, caso voce chame ela na linha das rotas ou outras funcoes. E ali ela vai decidir se vai rodar aquela funcao ou nao, ou fazer alguma alteracao. 

//a gente pode usar um middleware pra fazer um filtro, pra verificar se as informacoes que estao chegando estao corretas

// e pra que o fluxo da aplicacao continue, é necessario que se utilize o "next()" no final da funcao middleware
const checkUserId = (request, response, next)=>{
    const {id} = request.params

    const index = users.findIndex(user => user.id === id)
    
    if(index<0){
        return response.status(404).json({message: "user not found"})
    }

    request.userIndex = index
    request.userId = id
    next()


}

//app.use(myFirstMiddleware)

const users = []

app.get('/users', (request, response) => {
    //ROUTE PARAMS - os rout params é uma variavel que se cria pela rota, logo depois de users a gente coloca uma "/ e um ":" e o nome da variavel no caso de um id ficaria assim... /users:id se nao colocar os 2 pontos a rota deixa de ser dinamica. porem quando se coloca os 2 pontos e o nome da variavel, tudo que for solicitado na query vai ser considerada como id

    //const name = request.query.name
    //const age = request.query.age

    //const {name, age} = request.query // padrao destructuring assignment - desconstruindo o objeto e criando variaveis
    //const {id} = request.params
    //console.log(name, age)
     //console.log(id)  // o request se refere a um objeto que é passado como parametro com uma funcao de callback(funcao chamada pelo metodo get path put delete) e esse objeto contem informacoes sobre a requisicao http que o cliente faz ao servidor 

     //se por ventura, voce quer o usuario de id 2 e voce joga pela query, voce vai pelos params e faz a solicitacao e devolve os dados pro cliente atravez do json
     

    return response.json(users)
})


app.post('/users', (request, response) =>{
    // vai chegar algumas informacoes pra mim que é o nome e a idade, e vai chegar pelo body entao a gente utiliza o request.body pra pegar essas informacoes
    const {name, age} = request.body
    // e ai a gente vai montar o usuario, pra poder conseguir adcionar ele no array de usuarios que foi criado la em cima, entao agora voce vai montar o usuario que vai ser um objeto
    
    const user = {id:uuid.v4(), name, age}

    //console.log(uuid.v4())

    // e pra adcionar nos banco de usuarios, no caso o array criado, nos temos de usar o push

    users.push(user)
    // e na hora de retornar a gente retorna apenas o usuario criado
    
    // e pelos estudos dos metodos http, pra ficar mais semantico, é bom a gente colocar no return o status da operacao
    return response.status(201).json(user)
})

app.put('/users/:id',checkUserId, (request,response) =>{
    //const {id} = request.params
    const {name, age} = request.body
    const index = request.userIndex
    const id = request.userId


    const updateUser = {id, name, age}
    
    //aqui a gente vai usar o findindex pra poder encontrar a posicao correta do usuario dentro do array caso ele encontre ele vai falar a posicao correta do usuario, caso nao, ele vai mostrar na tela um "-1"

    //o findindex ele vai percorrer pelo array, entao voce vai colocar um nome qualquer na hora de usar o findindex e ai ele vai interando item por item do array e ai voce vai pegar o item.ID e vai verificar se ele é igual ao id que vai ser mandado pelos routparams
    //const index = users.findIndex(user => user.id === id)

    //ao fazer a busca por um id que nao existe, na requisicao o status ainda se encontra em 200, com isso, temos que fazer uma verificacao pra poder corrigir isso e ele retornar um status diferente p deixar mais semantico

   //if(index < 0){
        //return response.status(404).json({message: "user not found"})
    //}

    users[index] = updateUser
    console.log(index)
  return response.json(updateUser)
})

//na hora de deletar o usuario, de cara a gente ja vai pegar pelo id no request.params por isso que a gente coloca logo o "/:id" logo depois de users.

app.delete('/users/:id',checkUserId, (request, response) =>{
    //const {id} = request.params
    const index = request.userIndex

    //para encontrar o usuario pelo id, a gente usa o findindex justamente pra procurar dentro da array qual id vai ser igual ao id utilizado no params

    //const index = users.findIndex(user => user.id === id)

    // e caso o id que foi enviado nao seja encontrado a gente faz um if

    // if(index<0){
    //     return response.status(404).json ({message: "User not found"})
    // }

    // caso ele tenha encontrado o usuario, ele vai passar pelo if e vai agora deletar apenas o 1 usuario do array, utilizando o splice. o splice consegue deletar itens do array no caso voce vai colocar o array desejado e ".slice(0,1) o a primeira casa dentro dos parenteses indica a casa que ele vai começar a deletar, se fosse (0,2) ele ia começar a deletar na casa 0 e a casa 1, ou seja, ele ia deletar 2 itens, o "0" e o item "1".

    // entao como a gente so que deletar a posicao exata do array entao a gente coloca a posicao, no caso o 'index' que vai indicar a posicao correta dentro da array e quantas casas a gente quer deletar, no caso 1 casa so, a casa escolhida dentro do array.
    users.splice(index, 1)

    // como agora a gente n quer retornar nada, a gente coloca um status de sem conteudo q é o status 204, so o status de sucesso msm
    return response.status(204).json({message: "User delete"})
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})