module.exports.help = {
    name: "register",
    aliases: ["registar", "registrar", "cadastrar"]
}    

exports.run = async (client, message, args, err) => {
const Users = require('../../db/Usuarios')
const discord = require('discord.js')

    let findU = await Users.findOne({
        where: {
        id: message.author.id
    }})

    if(findU) return message.channel.send(`Seu ID já está registrado no meu banco de dados!`)
    let email = args[0]
    if(!email) return message.channel.send(`Por favor, me indique seu e-mail!`)

    let findE = await Users.findOne({
        where: {
        email: email
    }})
    if(findE) return message.channel.send(`Esse email já está registrado no meu banco de dados!`)
    
    function pass(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }

    let password = pass(6)

    await Users.create({
        id: message.author.id,
        email: email,
        senha: password
    })
    message.delete()
    message.author.send(new discord.MessageEmbed().setTitle(`Sucesso`).setDescription(`Você foi registrado com sucesso!`)
    .addField("Email:", `${email}`)
    .addField("Senha:", `${password}`)
    .setColor(client.cor))
}