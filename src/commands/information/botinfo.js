import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import os from 'os';
import moment from 'moment';
import { Command } from '../../classes/abstract/command.js';
import { filter } from '../../utils/filter.js';

export default class BotInfo extends Command {
	constructor() {
		super(...arguments);
		this.description = 'Peek behind the scenes of the bot\'s core.';
	}

	async execute(client, ctx) {
		const totalUsers = client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0);
		const uptime = moment.duration(client.uptime).humanize();
		const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
		const cpuModel = os.cpus()[0].model;
		const nodeVersion = process.version;
		const platform = os.platform();
		const architecture = os.arch();
		const ping = client.ws.ping;
		const totalGuilds = client.guilds.cache.size;
		const totalChannels = client.channels.cache.size;
		const commandsCount = client.commands.size;
		const activePlayers = client.manager?.players?.size || 0;
		const shardCount = client.options.shardCount || 1;

		const embed = client.embed('#FF69B4')
			.setAuthor({
				name: `${client.user.username} Info`,
				iconURL: client.user.displayAvatarURL()
			})
			.setThumbnail(client.user.displayAvatarURL())
			.desc(
				`<:icon_hearth:1446046384569585755> Hey there! I'm **${client.user.username}**, your friendly music companion!\n\n` +
				`<:neroxinfo:1446475383481303052> Currently, I'm vibing in **${totalGuilds.toLocaleString()} servers** with ` +
				`**${totalUsers.toLocaleString()} amazing users**! I've been running smoothly on ` +
				`**${shardCount} shard${shardCount > 1 ? 's' : ''}** and right now I have ` +
				`**${activePlayers} active player${activePlayers !== 1 ? 's' : ''}** jamming to music! \n\n` +
				`<:neroxinfo:1446475383481303052> My heart has been beating for **${uptime}** and I'm feeling great with a ` +
				`latency of just **${ping}ms**! ${ping < 100 ? '' : ping < 200 ? '' : ''}`
			)
			.footer({ text: 'Made with love by NeroX Studios', iconURL: ctx.author.displayAvatarURL() })
			.setTimestamp();

		const menu = new StringSelectMenuBuilder()
			.setCustomId('botinfo')
			.setPlaceholder(' Pick a section to explore!')
			.setMaxValues(1)
			.addOptions([
				{
					label: 'Overview',
					value: 'overview',
					description: 'See the big picture!',
				},
				{
					label: 'System',
					value: 'system',
					description: 'Technical stuff!',
				},
				{
					label: 'Developer',
					value: 'developer',
					description: 'Meet the creators!',
				},
				{
					label: 'Stats',
					value: 'stats',
					description: 'Numbers & metrics!',
				},
			]);

		const msg = await ctx.reply({
			embeds: [embed],
			components: [new ActionRowBuilder().addComponents(menu)],
		});

		const collector = msg.createMessageComponentCollector({
			idle: 30000,
			filter: i => filter(i, ctx),
		});

		collector.on('collect', async interaction => {
			await interaction.deferUpdate();
			const choice = interaction.values[0];

			let updatedEmbed;

			if (choice === 'overview') {
				updatedEmbed = client.embed('#FF69B4')
					.setAuthor({
						name: ` ${client.user.username} Overview`,
						iconURL: client.user.displayAvatarURL()
					})
					.setThumbnail(client.user.displayAvatarURL())
					.desc(
						`Hey there! I'm **${client.user.username}**, your friendly music companion! \n\n` +
						`<:neroxinfo:1446475383481303052> Currently, I'm vibing in **${totalGuilds.toLocaleString()} servers** with ` +
						`**${totalUsers.toLocaleString()} amazing users**! I've been running smoothly on ` +
						`**${shardCount} shard${shardCount > 1 ? 's' : ''}** and right now I have ` +
						`**${activePlayers} active player${activePlayers !== 1 ? 's' : ''}** jamming to music! \n\n` +
						`<:neroxinfo:1446475383481303052> My heart has been beating for **${uptime}** and I'm feeling great with a ` +
						`latency of just **${ping}ms**! ${ping < 100 ? '' : ping < 200 ? '' : ''}\n\n` +
						`<:neroxinfo:1446475383481303052> You can use my prefix \`${client.prefix}\` to command me, and I have ` +
						`**${totalChannels.toLocaleString()} channels** in my cache ready to serve! `
					)
					.footer({ text: ' Made with love by NeroX Studios' })
					.setTimestamp();
			} else if (choice === 'system') {
				updatedEmbed = client.embed('#FF69B4')
					.setAuthor({
						name: ` System Blueprint`,
						iconURL: client.user.displayAvatarURL()
					})
					.setThumbnail(client.user.displayAvatarURL())
					.desc(
						`Here's a peek under my hood! \n\n` +
						`<:neroxinfo:1446475383481303052> I'm powered by a **${cpuModel}** processor and currently using ` +
						`**${memoryUsage} MB** of memory to keep all your favorite tunes running! 💾\n\n` +
						`<:neroxinfo:1446475383481303052> I'm running on **${platform}** with **${architecture}** architecture, ` +
						`powered by **Node.js ${nodeVersion}**. Everything is optimized to ` +
						`give you the smoothest music experience possible! `
					)
					.footer({ text: ' System specs for the tech-curious!' })
					.setTimestamp();
			} else if (choice === 'developer') {
				updatedEmbed = client.embed('#FF69B4')
					.setAuthor({
						name: ` Crafted With Love`,
						iconURL: client.user.displayAvatarURL()
					})
					.setThumbnail(client.user.displayAvatarURL())
					.desc(
						`I was lovingly crafted by the amazing team at **NeroX Studios**! \n\n` +
						`I'm currently at **version 1.0.0**, built using the powerful **Discord.js v14** ` +
			
						`Need help or want to hang out? Join our cozy ` +
						`**[Support Server](https://discord.gg/duM4dkbz9N)** where our friendly ` +
						`team is always ready to help! We'd love to have you there~ `
					)
					.footer({ text: 'Thank you for using me!' })
					.setTimestamp();
			} else if (choice === 'stats') {
				updatedEmbed = client.embed('#FF69B4')
					.setAuthor({
						name: `Performance Metrics`,
						iconURL: client.user.displayAvatarURL()
					})
					.setThumbnail(client.user.displayAvatarURL())
					.desc(
						`Let's talk numbers! \n\n` +
						`I have **${commandsCount} commands** loaded and ready to serve you! ` +
						`Currently operating on **Shard 0/${shardCount}** with a sweet latency of ` +
						`**${ping}ms**! ${ping < 100 ? '(That\'s super fast!)' : ping < 200 ? '(Pretty good!)' : '(Working hard!)'}\n\n` +
						`My cache is holding **${client.users.cache.size} users** and I'm actively ` +
						`playing music in **${activePlayers} server${activePlayers !== 1 ? 's' : ''}** right now! `
					)
					.footer({ text: 'Stats updated in real-time!' })
					.setTimestamp();
			}

			await msg.edit({ embeds: [updatedEmbed] });
		});

		collector.on('end', async () => {
			await msg.edit({ components: [] }).catch(() => null);
		});
	}
}
