require('dotenv').config();
const discord = require('discord.js');
const client = new discord.Client();
const Prefix = process.env.Prefix;
const WelcomeChannel = process.env.WelcomeChannel;
const MemberRole = process.env.MemberRole;
client.login(process.env.Bot_Token);

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in`);
});

const isValidCommand = (message, cmdName) => message.content.toLowerCase().startsWith(Prefix + cmdName)


//Enforce Nickname On Welcome
client.on('message', function(message) {


    if (!message.guild.me.hasPermission('MANAGE_NICKNAMES')) return message.channel.send('I don\'t have permission to change your nickname!');
    message.member.setNickname( message.author.username + " | " + message.content , " ").catch(err=>console.log(err));
    let { cache } = message.guild.roles;
    let role = cache.find(role => role.name.toLowerCase() === MemberRole);
    if(role) {
        if(message.member.roles.cache.has(role.id)){
            message.channel.send("You already have this role!");
        }
        else{
            message.channel.send("IGN added!")
            setTimeout(() => {
                message.channel.bulkDelete(100);
                message.member.roles.add(role);
            }, 2000);
            setTimeout(() => {
                message.channel.send("Please enter your IGN to have full access of the server!<33")
            }, 4000);
        }
    }
    else{
        message.channel.send("Role not found!")
    }
});
