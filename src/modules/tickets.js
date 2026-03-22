const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ModalBuilder,
  PermissionFlagsBits,
  StringSelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle
} = require("discord.js");

const Ticket = require("../models/Ticket");
const {
  TICKET_CLAIM,
  TICKET_CLOSE,
  TICKET_CLOSE_CONFIRM,
  TICKET_DELETE,
  TICKET_MEMBER_ADD,
  TICKET_MEMBER_REMOVE,
  TICKET_SELECT,
  TICKET_TRANSCRIPT
} = require("../constants/customIds");
const { createBaseEmbed } = require("../utils/embeds");
const { sendLog } = require("../services/logService");
const { addMemberToTicket, getActiveTicketByChannel, removeMemberFromTicket } = require("../services/ticketService");

function createTicketPanel(config) {
  const options = Object.entries(config.tickets?.types || {}).map(([value, item]) => ({
    label: item.label,
    value,
    description: `Ouvrir un ticket : ${item.label}`
  }));

  const embed = createBaseEmbed({
    title: "Ouvrir un ticket",
    description: "Choisis le type de demande pour creer un salon prive avec l'equipe concernee.",
    color: 0x232323
  });

  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(TICKET_SELECT)
      .setPlaceholder("Selectionne un type de ticket")
      .addOptions(options.slice(0, 25))
  );

  return { embeds: [embed], components: [row] };
}

async function getNextTicketNumberFromGuild(guildId) {
  const latestTicket = await Ticket.findOne({ guildId }).sort({ ticketNumber: -1 }).lean();
  return latestTicket ? latestTicket.ticketNumber + 1 : 1;
}

async function buildTranscript(channel) {
  const messages = await channel.messages.fetch({ limit: 100 });
  return [...messages.values()]
    .reverse()
    .map((message) => `[${message.createdAt.toISOString()}] ${message.author.tag}: ${message.content}`)
    .join("\n");
}

async function createTicket(interaction, client, selectedType) {
  const config = client.runtimeConfig;
  const typeConfig = config.tickets?.types?.[selectedType];

  if (!typeConfig) {
    await interaction.reply({ content: "Type de ticket invalide.", ephemeral: true });
    return;
  }

  const existingTicket = await Ticket.findOne({
    guildId: interaction.guild.id,
    authorId: interaction.user.id,
    type: selectedType,
    status: "open"
  });

  if (existingTicket) {
    const existingChannel = await interaction.guild.channels.fetch(existingTicket.channelId).catch(() => null);
    await interaction.reply({
      content: existingChannel ? `Tu as deja un ticket ouvert pour ce motif : ${existingChannel}.` : "Tu as deja un ticket ouvert pour ce motif.",
      ephemeral: true
    });
    return;
  }

  const ticketNumber = await getNextTicketNumberFromGuild(interaction.guild.id);
  const channelName = `ticket-${String(ticketNumber).padStart(4, "0")}`;
  const categoryId = typeConfig.categoryId || config.categories?.supportTickets || null;

  const channel = await interaction.guild.channels.create({
    name: channelName,
    type: ChannelType.GuildText,
    parent: categoryId || undefined,
    permissionOverwrites: [
      {
        id: interaction.guild.roles.everyone.id,
        deny: [PermissionFlagsBits.ViewChannel]
      },
      {
        id: interaction.user.id,
        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
      },
      ...(config.roles?.staff
        ? [
            {
              id: config.roles.staff,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
            }
          ]
        : [])
    ]
  });

  await Ticket.create({
    guildId: interaction.guild.id,
    channelId: channel.id,
    ticketNumber,
    authorId: interaction.user.id,
    type: selectedType,
    priority: selectedType === "direction" ? "high" : "medium",
    members: [interaction.user.id]
  });

  const embed = createBaseEmbed({
    title: `Ticket ${typeConfig.label}`,
    description: `${interaction.user} ton ticket a ete cree. Un membre du staff peut maintenant le prendre en charge.`,
    fields: [{ name: "Motif", value: typeConfig.label, inline: true }]
  });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(TICKET_CLAIM).setLabel("Prendre en charge").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId(TICKET_CLOSE).setLabel("Fermer").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId(TICKET_DELETE).setLabel("Supprimer").setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId(TICKET_MEMBER_ADD).setLabel("Ajouter membre").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId(TICKET_MEMBER_REMOVE).setLabel("Retirer membre").setStyle(ButtonStyle.Secondary)
  );
  const rowTwo = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(TICKET_TRANSCRIPT).setLabel("Transcript").setStyle(ButtonStyle.Secondary)
  );

  await channel.send({ embeds: [embed], components: [row, rowTwo] });

  await sendLog(
    interaction.guild,
    config.channels?.ticketsLog,
    "Ticket ouvert",
    `Ticket #${ticketNumber} cree par ${interaction.user.tag}.`,
    [{ name: "Type", value: typeConfig.label, inline: true }]
  );

  await interaction.reply({ content: `Ticket cree : ${channel}`, ephemeral: true });
}

async function createTicketForMember({ guild, user, client, selectedType, replyTarget = null }) {
  const fakeInteraction = {
    guild,
    user,
    reply: async (payload) => {
      if (replyTarget) {
        return replyTarget(payload);
      }

      return null;
    }
  };

  return createTicket(fakeInteraction, client, selectedType);
}

async function claimTicket(interaction, client) {
  const ticket = await getActiveTicketByChannel(interaction.channelId);
  if (!ticket) {
    await interaction.reply({ content: "Aucun ticket actif dans ce salon.", ephemeral: true });
    return;
  }

  ticket.claimedBy = interaction.user.id;
  ticket.claimedAt = new Date();
  await ticket.save();

  await interaction.reply({ content: `${interaction.user} prend ce ticket en charge.` });
  const responseMinutes = Math.max(1, Math.round((ticket.claimedAt.getTime() - ticket.openedAt.getTime()) / 60000));
  await sendLog(
    interaction.guild,
    client.runtimeConfig.channels?.ticketsLog,
    "Ticket pris en charge",
    `Le ticket #${ticket.ticketNumber} est maintenant gere par ${interaction.user.tag}.`,
    [{ name: "Temps de reponse", value: `${responseMinutes} minute(s)`, inline: true }]
  );
}

async function closeTicket(interaction, client) {
  const ticket = await getActiveTicketByChannel(interaction.channelId);
  if (!ticket) {
    await interaction.reply({ content: "Aucun ticket actif dans ce salon.", ephemeral: true });
    return;
  }

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(TICKET_CLOSE_CONFIRM).setLabel("Confirmer la fermeture").setStyle(ButtonStyle.Danger)
  );

  await interaction.reply({ content: "Confirmer la fermeture du ticket.", components: [row], ephemeral: true });
}

async function confirmCloseTicket(interaction, client) {
  const ticket = await getActiveTicketByChannel(interaction.channelId);
  if (!ticket) {
    await interaction.reply({ content: "Aucun ticket actif dans ce salon.", ephemeral: true });
    return;
  }

  ticket.status = "closed";
  ticket.closedAt = new Date();
  await ticket.save();

  if (client.runtimeConfig.tickets?.closeArchiveCategoryId) {
    await interaction.channel.setParent(client.runtimeConfig.tickets.closeArchiveCategoryId).catch(() => null);
  }

  await sendLog(interaction.guild, client.runtimeConfig.channels?.ticketsLog, "Ticket ferme", `Le ticket #${ticket.ticketNumber} a ete ferme par ${interaction.user.tag}.`);
  await interaction.reply({ content: "Ticket ferme. Le salon peut maintenant etre archive ou supprime." });
}

async function deleteTicket(interaction, client) {
  const ticket = await Ticket.findOne({ channelId: interaction.channelId });
  if (!ticket) {
    await interaction.reply({ content: "Ticket introuvable.", ephemeral: true });
    return;
  }

  ticket.status = "deleted";
  await ticket.save();
  const transcript = await buildTranscript(interaction.channel);
  const logChannel = client.runtimeConfig.channels?.ticketsLog;
  await sendLog(
    interaction.guild,
    logChannel,
    "Ticket supprime",
    `Le ticket #${ticket.ticketNumber} a ete supprime par ${interaction.user.tag}.`,
    [{ name: "Type", value: ticket.type, inline: true }]
  );
  if (logChannel) {
    const channel = await interaction.guild.channels.fetch(logChannel).catch(() => null);
    if (channel?.isTextBased() && transcript.trim()) {
      await channel.send({
        files: [{ attachment: Buffer.from(transcript, "utf8"), name: `transcript-ticket-${ticket.ticketNumber}.txt` }]
      }).catch(() => null);
    }
  }
  await interaction.reply({ content: "Suppression du salon en cours." });
  await interaction.channel.delete("Ticket supprime par OmbraCore").catch(() => null);
}

async function sendTranscript(interaction) {
  const transcript = await buildTranscript(interaction.channel);

  if (!transcript.trim()) {
    await interaction.reply({ content: "Aucun message a exporter.", ephemeral: true });
    return;
  }

  await interaction.reply({
    content: "Transcript genere.",
    files: [{ attachment: Buffer.from(transcript, "utf8"), name: `transcript-${interaction.channel.name}.txt` }],
    ephemeral: true
  });
}

function createMemberTicketModal(action) {
  return new ModalBuilder()
    .setCustomId(action)
    .setTitle(action === TICKET_MEMBER_ADD ? "Ajouter un membre" : "Retirer un membre")
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("member_id")
          .setLabel("ID du membre")
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
      )
    );
}

async function updateTicketMember(interaction, action) {
  const ticket = await getActiveTicketByChannel(interaction.channelId);
  if (!ticket) {
    await interaction.reply({ content: "Ticket actif introuvable.", ephemeral: true });
    return;
  }

  const memberId = interaction.fields.getTextInputValue("member_id").trim();
  const member = await interaction.guild.members.fetch(memberId).catch(() => null);
  if (!member) {
    await interaction.reply({ content: "Membre introuvable.", ephemeral: true });
    return;
  }

  if (action === TICKET_MEMBER_ADD) {
    await interaction.channel.permissionOverwrites.edit(member.id, {
      ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true
    });
    await addMemberToTicket(ticket, member.id);
    await interaction.reply({ content: `${member} a ete ajoute au ticket.`, ephemeral: true });
    return;
  }

  await interaction.channel.permissionOverwrites.delete(member.id).catch(() => null);
  await removeMemberFromTicket(ticket, member.id);
  await interaction.reply({ content: `${member.user.tag} a ete retire du ticket.`, ephemeral: true });
}

module.exports = {
  createTicketPanel,
  createTicket,
  claimTicket,
  closeTicket,
  confirmCloseTicket,
  deleteTicket,
  sendTranscript,
  createMemberTicketModal,
  updateTicketMember,
  getNextTicketNumberFromGuild,
  createTicketForMember
};
