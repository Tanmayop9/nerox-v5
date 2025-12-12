import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { filter } from '../../utils/filter.js';
import { Command } from '../../classes/abstract/command.js';

export default class Help extends Command {
	constructor() {
		super(...arguments);
		this.aliases = ['h'];
		this.description = 'Displays the command list.';
	}

	async execute(client, ctx) {
		const allCommands = client.commands.reduce((acc, cmd) => {
			if (['owner', 'mod', 'debug'].includes(cmd.category)) return acc;
			acc[cmd.category] ||= [];
			acc[cmd.category].push({
				name: cmd.name,
				description: cmd.description?.length > 30 
					? cmd.description.substring(0, 27) + '...' 
					: cmd.description || 'No description',
			});
			return acc;
		}, {});

		const categories = client.categories
			.sort((b, a) => b.length - a.length)
			.filter(category => !['owner', 'mod', 'debug'].includes(category));

		const totalCommands = client.commands.filter(cmd => !['owner', 'mod', 'debug'].includes(cmd.category)).size;

		const embed = client.embed('#2B2D31')
			.setAuthor({ 
				name: `${client.user.username} - ${await client.t(ctx.author.id, 'help.title')}`,
				iconURL: client.user.displayAvatarURL()
			})
			.desc(
				`${await client.t(ctx.author.id, 'help.prefix')}: \`${client.prefix}\`\n` +
				`${await client.t(ctx.author.id, 'help.commands')}: \`${totalCommands}\` across \`${categories.length}\` ${await client.t(ctx.author.id, 'help.categories')}\n\n` +
				`${await client.t(ctx.author.id, 'help.useGuide', { prefix: client.prefix })}\n` +
				`${await client.t(ctx.author.id, 'help.requireOptional')}`
			)
			.footer({ 
				text: await client.t(ctx.author.id, 'help.serversCount', { count: client.guilds.cache.size }),
				iconURL: ctx.author.displayAvatarURL()
			});

		const menu = new StringSelectMenuBuilder()
			.setCustomId('menu')
			.setPlaceholder(await client.t(ctx.author.id, 'help.selectCategory'))
			.setMaxValues(1)
			.addOptions([
				{
					label: await client.t(ctx.author.id, 'help.home'),
					value: 'home',
					description: await client.t(ctx.author.id, 'help.homeDesc'),
				},
				...categories.map(category => ({
					label: category.charAt(0).toUpperCase() + category.slice(1),
					value: category,
					description: `${allCommands[category]?.length || 0} ${await client.t(ctx.author.id, 'help.commands').toLowerCase()}`,
				})),
				{
					label: await client.t(ctx.author.id, 'help.allCommands'),
					value: 'all',
					description: await client.t(ctx.author.id, 'help.allCommandsDesc'),
				},
			]);

		const reply = await ctx.reply({
			embeds: [embed],
			components: [new ActionRowBuilder().addComponents(menu)],
		});

		const collector = reply.createMessageComponentCollector({
			idle: 60000,
			filter: i => filter(i, ctx),
		});

		collector.on('collect', async interaction => {
			await interaction.deferUpdate();
			const selected = interaction.values[0];

			switch (selected) {
				case 'home':
					await reply.edit({ embeds: [embed] });
					break;

				case 'all':
					const allEmbed = client.embed('#2B2D31')
						.setAuthor({ 
							name: `${client.user.username} - ${await client.t(ctx.author.id, 'help.allCommands')}`,
							iconURL: client.user.displayAvatarURL()
						})
						.desc(
							Object.entries(allCommands)
								.sort((a, b) => a[0].localeCompare(b[0]))
								.map(([cat, cmds]) =>
									`**${cat.charAt(0).toUpperCase() + cat.slice(1)}** (${cmds.length})\n` +
									`${cmds.map(cmd => `\`${cmd.name}\``).join(' ')}`
								).join('\n\n')
						)
						.footer({ 
							text: await client.t(ctx.author.id, 'help.totalCommands', { count: totalCommands }),
							iconURL: ctx.author.displayAvatarURL()
						});
					await reply.edit({ embeds: [allEmbed] });
					break;

				default:
					const selectedCommands = allCommands[selected] || [];
					const categoryEmbed = client.embed('#2B2D31')
						.setAuthor({ 
							name: `${client.user.username} - ${selected.charAt(0).toUpperCase() + selected.slice(1)}`,
							iconURL: client.user.displayAvatarURL()
						})
						.desc(
							selectedCommands.length
								? selectedCommands.map(cmd =>
									`\`${client.prefix}${cmd.name}\` - ${cmd.description}`
								  ).join('\n')
								: await client.t(ctx.author.id, 'help.noCommands')
						)
						.footer({ 
							text: `${selectedCommands.length} ${await client.t(ctx.author.id, 'help.commands').toLowerCase()}`,
							iconURL: ctx.author.displayAvatarURL()
						});

					await reply.edit({ embeds: [categoryEmbed] });
					break;
			}
		});

		collector.on('end', async () => {
			menu.setDisabled(true);
			await reply.edit({ 
				components: [new ActionRowBuilder().addComponents(menu)] 
			}).catch(() => null);
		});
	}
}
