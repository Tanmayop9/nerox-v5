import { createContext } from '../../functions/contextFrom/message.js';
import { addMessageCount } from '../../utils/messageCount.js';
import moment from 'moment';

const event = 'messageCreate';

export default class MessageCreate {
	constructor() {
		this.name = event;
		this.execute = async (client, message) => {
			if (!message.author || message.author.bot) return;
			if (message.content.includes('jsk')) return void (await client.dokdo?.run(message));

			await addMessageCount(client, message.guildId, message.author.id);

			// Check if user is AFK and remove AFK status
			const afkData = await client.db.afk.get(message.author.id);
			if (afkData) {
				await client.db.afk.delete(message.author.id);
				const duration = moment.duration(Date.now() - afkData.timestamp);
				const timeString = duration.asMinutes() < 1 
					? client.t('afk.lessThanMinute')
					: duration.format('d[d] h[h] m[m]', { trim: 'all' });
				
				await message.reply({
					embeds: [
						client
							.embed()
							.desc(
								`${client.emoji.check} **${client.t('afk.welcomeBack', { user: message.author.username })}**\n\n` +
								`${client.emoji.info} ${client.t('afk.wasAfkFor', { time: timeString })}`
							),
					],
				}).catch(() => {});
			}

			// Check if any mentioned users are AFK
			if (message.mentions.users.size > 0) {
				for (const [userId, user] of message.mentions.users) {
					if (user.bot || userId === message.author.id) continue;
					
					const mentionedAfk = await client.db.afk.get(userId);
					if (mentionedAfk) {
						const duration = moment.duration(Date.now() - mentionedAfk.timestamp);
						const timeString = duration.asMinutes() < 1 
							? client.t('afk.lessThanMinute')
							: duration.format('d[d] h[h] m[m]', { trim: 'all' });
						
						await message.reply({
							embeds: [
								client
									.embed()
									.desc(
										`${client.emoji.info} ${client.t('afk.userAfk', { user: user.username })}\n\n` +
										`${client.emoji.info1} ${client.t('afk.reason', { reason: mentionedAfk.reason })}\n` +
										`${client.emoji.info1} ${client.t('afk.durationLabel', { time: timeString })}`
									),
							],
						}).catch(() => {});
						break; // Only show one AFK notification per message
					}
				}
			}

			// Emit context creation
			client.emit('ctxCreate', await createContext(client, message));
		};
	}
}
/**@codeStyle - https://google.github.io/styleguide/tsguide.html */