require('dotenv').config();
const discord = require('discord.js');
const client = new discord.Client();
const Prefix = process.env.Prefix;
const MemberRole = process.env.MemberRole;
//var hidenseek =
client.login(process.env.Bot_Token);

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in`);
});

const isValidCommand = (message, cmdName) => message.content.toLowerCase().startsWith(Prefix + cmdName)


//Enforce Nickname On Welcome
client.on('message', function(message) {
    if(message.author.bot) return;

    //Enforce Nickname On Welcome
    if(message.channel.id == 698669941506703501){
        if (!message.guild.me.hasPermission('MANAGE_NICKNAMES')) return message.channel.send('I don\'t have permission to change your nickname!');
        message.member.setNickname( message.author.username + " | " + message.content , " ").catch(err=>console.log(err));
        let { cache } = message.guild.roles;
            let role = cache.find(role => role.name.toLowerCase() === MemberRole);
        if(role) {
            if(message.member.roles.cache.has(role.id)){
            message.channel.send("Why are u here? You should have done this already!");
            setTimeout(() => {
                message.channel.bulkDelete(100);
            }, 2000);
            setTimeout(() => {
                message.channel.send("Please enter your IGN to have full access of the server!:heart:")
            }, 4000);
            }
            else{
                message.channel.send("IGN added!")
                setTimeout(() => {
                    message.channel.bulkDelete(100);
                    message.member.roles.add(role);
                }, 2000);
                setTimeout(() => {
                    message.channel.send("Please enter your IGN to have full access of the server!:heart:")
                }, 4000);
            }
       }
        else{
            message.channel.send("Role not found!")
        }
    }



});
