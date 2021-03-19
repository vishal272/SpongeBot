require('dotenv').config();
const discord = require('discord.js');
const client = new discord.Client();
const Prefix = process.env.Prefix;
const MemberRole = process.env.MemberRole;
const WelcomeChannelid = process.env.WelcomeChannel;
const EventChannelid = process.env.EventChannelid;
const EventCommandsChannelid = process.env.EventCommandsChannelid;
var activeevent = " "
var eventhost = " "
client.login(process.env.Bot_Token);

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in`);
});

const isValidCommand = (message, cmdName) => message.content.toLowerCase().startsWith(Prefix + cmdName)


async function sendTempMessage(message, time, messagechannel) {
    temp = await messagechannel.send(message)
    setTimeout(() => {
        temp.delete();
    }, time * 1000);
}

Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) { s = "0" + s; }
    return s;
}

//Enforce Nickname On Welcome
client.on('message', async message => {
    if (message.author.bot) return;

    //Enforce Nickname On Welcome
    if (message.channel.id == WelcomeChannelid) {
        if (!message.guild.me.hasPermission('MANAGE_NICKNAMES')) return message.channel.send('I don\'t have permission to change your nickname!');
        message.member.setNickname(message.author.username + " | " + message.content, " ").catch(err => console.log(err));
        let { cache } = message.guild.roles;
        let role = cache.find(role => role.name.toLowerCase() === MemberRole);
        if (role) {
            if (message.member.roles.cache.has(role.id)) {
                message.channel.send("Why are u here? You should have done this already!");
                setTimeout(() => {
                    message.channel.bulkDelete(100);
                }, 2000);
                setTimeout(() => {
                    message.channel.send("Please enter your IGN to have full access of the server!:heart:")
                }, 4000);
            }
            else {
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
        else {
            message.channel.send("Role not found!")
        }
    }

    
    else if (isValidCommand(message, "startevent") && message.channel.id == EventCommandsChannelid) {
        let arglines = message.content.substring(12).split('\n');
        let args = arglines[0].split(' ')
        let eventchannel = client.channels.cache.get(EventChannelid);
        if (eventchannel && activeevent == " ") {
            eventchannel.bulkDelete(100);
            message.channel.bulkDelete(100);
            if (args[0] === 'hidenseek') {
                activeevent = "hidenseek";
                let clues = arglines;
                clues.shift()
                let eventduration = args[1] * 60;
                let clueinterval = args[1] * 60 / clues.length;
                console
                let countdown = 5 * 60;
                let r = 0
                let c = 0
                let cluestring = clues[c]
                c = c + 1
                eventhost = args[2];
                if (!isNaN(clueinterval) && Number.isInteger(clues.length) && clues.length > 0 && clueinterval >= 1) {
                    let timetonextclue = clueinterval;
                    hours = Math.floor(countdown / 60 / 60);
                    minutes = Math.floor(countdown / 60 - hours * 60);
                    seconds = Math.floor(countdown - minutes * 60 - hours * 60 * 60);
                    const eventcountdownembed = new discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Hide and Seek')
                        .setURL('https://discord.js.org/')
                        .setAuthor(message.author.username, message.author.displayAvatarURL())
                        .setDescription('Event Will Start in')
                        .setThumbnail('https://i.imgur.com/Qn1UD4m.png')
                        .addFields(
                            { name: hours.pad(2) + ':' + minutes.pad(2) + ":" + seconds.pad(2), value: '\u200B' },
                        )
                        .setTimestamp()
                        .setFooter('Bot by Fish');

                    hours = Math.floor(eventduration / 60 / 60);
                    minutes = Math.floor(eventduration / 60 - hours * 60);
                    seconds = Math.floor(eventduration - minutes * 60 - hours * 60 * 60);
                    minutes2 = Math.floor(timetonextclue / 60);
                    seconds2 = Math.floor(timetonextclue - minutes2 * 60);

                    const eventrunningembed = new discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Hide and Seek')
                        .setURL('https://discord.js.org/')
                        .setAuthor(message.author.username, message.author.displayAvatarURL())
                        .setDescription('Find' + eventhost)
                        .setThumbnail('https://i.imgur.com/Qn1UD4m.png')
                        .addFields(
                            { name: "Time Left", value: hours.pad(2) + ':' + minutes.pad(2) + ":" + seconds.pad(2), inline: true },
                            { name: "Time to next clue", value: minutes2.pad(2) + ":" + seconds2.pad(2), inline: true },
                            { name: "Clues left", value: clues.length  - c, inline: true },
                            { name: "Clues", value: cluestring },
                        )
                        .setTimestamp()
                        .setFooter('Bot by Fish');

                    msg = await eventchannel.send(eventcountdownembed);
                    var hidenseek = setInterval(function () {

                        if (activeevent == " " || eventduration == 0) {// change the n
                            clearInterval(hidenseek);
                            activeevent = " ";
                        }
                        else if (countdown !== 0) {//consider modification such that they can input date of event
                            countdown = countdown - 10
                            hours = Math.floor(countdown / 60 / 60);
                            minutes = Math.floor(countdown / 60 - hours * 60);
                            seconds = Math.floor(countdown - minutes * 60 - hours * 60 * 60);
                            eventcountdownembed.spliceFields(0, 1,
                                { name: hours.pad(2) + ':' + minutes.pad(2) + ":" + seconds.pad(2), value: '\u200B' },
                            )
                            eventcountdownembed.setTimestamp
                            msg.edit(eventcountdownembed);
                            if (countdown == 0) {
                                msg.edit(eventrunningembed);
                                sendTempMessage("@everyone\nEvent Starting!", 20, eventchannel)
                            }
                        }
                        else {
                            eventduration = eventduration - 10
                            timetonextclue = timetonextclue + r - 10
                            r = 0
                            if (timetonextclue < 10 && c  != clues.length) {
                                r = timetonextclue
                                cluestring += "\n" + clues[c]
                                c = c + 1
                                console.log(cluestring)
                                timetonextclue = clueinterval
                                eventrunningembed.spliceFields(3, 1,
                                    { name: "Clues", value: cluestring },
                                )
                                sendTempMessage("@everyone\nNew Clue!", 20, eventchannel)
                            }
                            hours = Math.floor(eventduration / 60 / 60);
                            minutes = Math.floor(eventduration / 60 - hours * 60);
                            seconds = Math.floor(eventduration - minutes * 60 - hours * 60 * 60);
                            minutes2 = Math.floor(timetonextclue / 60);
                            seconds2 = Math.floor(timetonextclue - minutes2 * 60);
                            eventrunningembed.spliceFields(0, 3,
                                { name: "Time Left", value: hours.pad(2) + ':' + minutes.pad(2) + ":" + seconds.pad(2), inline: true },
                                { name: "Time to next clue", value: minutes2.pad(2) + ":" + seconds2.pad(2), inline: true },
                                { name: "Clues left", value: clues.length - c, inline: true },
                            )
                            if (c == clues.length) {
                                console.log("no clue")
                                eventrunningembed.spliceFields(1, 1,
                                    { name: "Time to next clue", value: "00:00", inline: true },
                                )
                            }
                            eventrunningembed.setTimestamp
                            msg.edit(eventrunningembed);
                        }
                    }, 10000)
                }
                else {
                    message.channel.send("Use this command correctly...........")
                    setTimeout(() => {
                        message.channel.send("Please :slight_smile:")
                    }, 10000);
                }
            }
            else if (activeevent != " ") {
                message.channel.send("Not sure if you noticed but there is already an event running")
                setTimeout(() => {
                    message.channel.send(":thinking:")
                }, 10000);
            }
            else {
                message.channel.send("This event doesn't exist :upside_down:")
            }
        }
    }
    else if (isValidCommand(message, "endevent") && message.channel.id == EventCommandsChannelid) {
        let args = message.content.split(" ");
        let eventchannel = client.channels.cache.get(EventChannelid);
        console.log(args[1])
        console.log(args[2])
        console.log(args[3])

        if (eventchannel) {
            if (activeevent === "hidenseek") {
                eventchannel.send("Congratulations " + args[1] + ", " + args[2] + " and " + args[3] + "! You found " + eventhost + "! :smile:");
            }
            else {
                message.channel.send("This event doesn't exist :upside_down:")
            }
            eventchannel.bulkDelete(100);
        }
        activeevent = " ";
    }
});
