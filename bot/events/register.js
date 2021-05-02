const Discord = require("discord.js")
const bot = require("../../index")
const db = require('../../db/database')
const Users = require('../../db/Usuarios')
const { where } = require("sequelize")

bot.on("guildMemberAdd", async (membro) => {
    let findU = await Users.findOne({
        where: {
        id: membro.user.id
    }})

    if(findU) return;

    
    else {
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

        let enviar = await membro.send(new Discord.MessageEmbed().setTitle(`Email`).setDescription(`Por favor, me indique seu e-mail!`).setColor(bot.cor))
        .catch(e => {throw e})

        let filtro = m => m.content.includes('@');

        let colector = enviar.channel.createMessageCollector(filtro, { max: 1})

        colector.on('collect', async (e_mail) => {

            let email = e_mail.content;

            let findE = await Users.findOne({
                where: {
                email: email
            }})
            if(findE) return message.channel.send(`Esse email já está registrado no meu banco de dados!`)
            
            await Users.create({
                id: membro.user.id,
                email: email,
                senha: password
            })

            enviar.channel.send(new Discord.MessageEmbed().setTitle(`Sucesso`).setDescription(`Você foi registrado com sucesso!`)
    .addField("Email:", `${email}`)
    .addField("Senha:", `${password}`)
    .setColor(client.cor))

        })   
        colector.on('end', async ()=>{
            setTimeout(async () => {
                await enviar.channel.send(new Discord.MessageEmbed().setTitle(`Registro [Termos]`).setDescription(`Leia nossos termos de uso!`)
                .addField("Ao registrar em nosso site você autaticamente aceita!", "[Leia-me](https://drive.google.com/file/d/1-ESmgAA2ly7KKzW1UVgyRlUgJoprVZS9/view?usp=drivesdk)").setColor(bot.cor)).then(msg => {
                msg.react('✅')
                const filter = (reaction, user) => {
                    return reaction.emoji.name === '✅' && user.id === membro.user.id;
                };
                
                const collector = msg.createReactionCollector(filter, { time: 15000 });
                
                collector.on('collect', () => {
                    msg.react('👍')
                    membro.roles.add('730301892814438430')
                    console.log(`[BOT] ${membro.user.username} registrado no discord e no site!`)
                });
            })
    

            }, 5000)
        })
    
    }
})