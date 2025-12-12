import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { Command } from '../../classes/abstract/command.js';
import { filter } from '../../utils/filter.js';
import { getLanguages, getLanguageName, isValidLanguage } from '../../functions/i18n.js';

export default class Language extends Command {
    constructor() {
        super(...arguments);
        this.aliases = ['lang', 'langue', 'idioma'];
        this.description = 'Change your language preference';
        this.usage = '[language_code]';
        this.options = [
            {
                name: 'language',
                opType: 'string',
                description: 'Language code (en, fr, es)',
                required: false,
                choices: [
                    { name: 'English', value: 'en' },
                    { name: 'Français', value: 'fr' },
                    { name: 'Español', value: 'es' },
                ],
            },
        ];
    }

    execute = async (client, ctx, args) => {
        const languages = getLanguages();
        const currentLang = await client.getUserLanguage(ctx.author.id);
        
        // If no argument provided, show current language and options
        if (!args.length) {
            const embed = client.embed('#2B2D31')
                .setAuthor({
                    name: await client.t(ctx.author.id, 'language.title'),
                    iconURL: client.user.displayAvatarURL()
                })
                .desc(
                    await client.t(ctx.author.id, 'language.current', { lang: getLanguageName(currentLang) }) + '\n\n' +
                    `**${await client.t(ctx.author.id, 'language.available')}:**\n` +
                    Object.entries(languages).map(([code, name]) => `\`${code}\` - ${name}`).join('\n')
                )
                .footer({
                    text: `${ctx.author.username}`,
                    iconURL: ctx.author.displayAvatarURL()
                });

            const menu = new StringSelectMenuBuilder()
                .setCustomId('language_select')
                .setPlaceholder(await client.t(ctx.author.id, 'language.selectLanguage'))
                .setMaxValues(1)
                .addOptions(
                    Object.entries(languages).map(([code, name]) => ({
                        label: name,
                        value: code,
                        description: `Change to ${name}`,
                        default: code === currentLang,
                    }))
                );

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
                const selectedLang = interaction.values[0];

                await client.setUserLanguage(ctx.author.id, selectedLang);

                const successEmbed = client.embed('#2B2D31')
                    .setAuthor({
                        name: await client.t(ctx.author.id, 'language.title'),
                        iconURL: client.user.displayAvatarURL()
                    })
                    .desc(
                        `${client.emoji.check} ${await client.t(ctx.author.id, 'language.changed', { 
                            lang: getLanguageName(selectedLang) 
                        })}`
                    )
                    .footer({
                        text: `${ctx.author.username}`,
                        iconURL: ctx.author.displayAvatarURL()
                    });

                await reply.edit({ embeds: [successEmbed], components: [] });
                collector.stop();
            });

            collector.on('end', async () => {
                menu.setDisabled(true);
                await reply.edit({
                    components: [new ActionRowBuilder().addComponents(menu)]
                }).catch(() => null);
            });

            return;
        }

        // If argument provided, validate and set language
        const newLang = args[0].toLowerCase();

        if (!isValidLanguage(newLang)) {
            await ctx.reply({
                embeds: [
                    client.embed().desc(
                        `${client.emoji.cross} ${await client.t(ctx.author.id, 'language.invalid', {
                            langs: Object.keys(languages).join(', ')
                        })}`
                    ),
                ],
            });
            return;
        }

        await client.setUserLanguage(ctx.author.id, newLang);

        await ctx.reply({
            embeds: [
                client.embed().desc(
                    `${client.emoji.check} ${await client.t(ctx.author.id, 'language.changed', { 
                        lang: getLanguageName(newLang) 
                    })}`
                ),
            ],
        });
    };
}
/**@codeStyle - https://google.github.io/styleguide/tsguide.html */
