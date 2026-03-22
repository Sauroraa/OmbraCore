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
const { FIXED_LOG_CHANNEL_ID, sendLog } = require("../services/logService");
const { addMemberToTicket, getActiveTicketByChannel, removeMemberFromTicket } = require("../services/ticketService");

function createTicketPanel(config) {
  const options = Object.entries(config.tickets?.types || {}).map(([value, item]) => ({
    label: item.label,
    value,
    description: `Canal privé pour ${item.label.toLowerCase()}`
  }));

  const introEmbed = createBaseEmbed({
    title: "Cellule de contact sécurisée",
    description:
      "Sélectionne la nature de ta demande pour ouvrir un canal privé, discret et traité par l’équipe concernée.\n\nChaque dossier est encadré, journalisé et réservé aux personnes autorisées.",
    fields: [
      { name: "Traitement", value: "Prise en charge nette par le pôle adapté.", inline: true },
      { name: "Confidentialité", value: "Salon privé à accès strictement limité.", inline: true },
      { name: "Cadre", value: "Suivi sérieux, réponse claire, dossier propre.", inline: true }
    ],
    color: 0x111111
  });

  const detailEmbed = createBaseEmbed({
    title: "Procédure d’ouverture",
    description:
      "Choisis simplement un motif ci-dessous.\nOmbraCore crée ensuite un espace réservé entre toi et l’équipe concernée.",
    fields: [
      { name: "Support général", value: "Aide serveur, question, problème technique.", inline: true },
      { name: "Direction & signalement", value: "Contact sensible, plainte, situation interne.", inline: true },
      { name: "Contact externe", value: "Business, partenariat, prise de contact propre.", inline: true }
    ],
    color: 0x1a1a1a
  });

  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(TICKET_SELECT)
      .setPlaceholder("Choisir un motif de prise de contact")
      .addOptions(options.slice(0, 25))
  );

  return { embeds: [introEmbed, detailEmbed], components: [row] };
}

async function getNextTicketNumberFromGuild(guildId) {
  const latestTicket = await Ticket.findOne({ guildId }).sort({ ticketNumber: -1 }).lean();
  return latestTicket ? latestTicket.ticketNumber + 1 : 1;
}

async function createTicketChannel(guild, config, user, selectedType) {
  const typeConfig = config.tickets?.types?.[selectedType];

  if (!typeConfig) {
    throw new Error("Invalid ticket type.");
  }

  const existingTicket = await Ticket.findOne({
    guildId: guild.id,
    authorId: user.id,
    type: selectedType,
    status: "open"
  });

  if (existingTicket) {
    const existingChannel = await guild.channels.fetch(existingTicket.channelId).catch(() => null);
    return { existingTicket, existingChannel, typeConfig };
  }

  const ticketNumber = await getNextTicketNumberFromGuild(guild.id);
  const channelName = `ticket-${String(ticketNumber).padStart(4, "0")}`;
  const categoryId = typeConfig.categoryId || config.categories?.supportTickets || null;

  const channel = await guild.channels.create({
    name: channelName,
    type: ChannelType.GuildText,
    parent: categoryId || undefined,
    permissionOverwrites: [
      {
        id: guild.roles.everyone.id,
        deny: [PermissionFlagsBits.ViewChannel]
      },
      {
        id: user.id,
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

  const ticket = await Ticket.create({
    guildId: guild.id,
    channelId: channel.id,
    ticketNumber,
    authorId: user.id,
    type: selectedType,
    priority: selectedType === "direction" ? "high" : "medium",
    members: [user.id]
  });

  return { ticket, channel, ticketNumber, typeConfig };
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

  const { existingTicket, existingChannel, ticketNumber, channel } = await createTicketChannel(
    interaction.guild,
    config,
    interaction.user,
    selectedType
  );

  if (existingTicket) {
    await interaction.reply({
      content: existingChannel ? `Tu as deja un ticket ouvert pour ce motif : ${existingChannel}.` : "Tu as deja un ticket ouvert pour ce motif.",
      ephemeral: true
    });
    return;
  }

  const embed = createBaseEmbed({
    title: "Bureau de liaison • Dossier actif",
    description:
      `${interaction.user}, ton espace privé est désormais ouvert.\nLe dossier peut maintenant être pris en charge par le pôle concerné dans un cadre discret, structuré et propre.`,
    fields: [
      { name: "Motif", value: typeConfig.label, inline: true },
      { name: "Référence", value: `#${String(ticketNumber).padStart(4, "0")}`, inline: true },
      { name: "Statut", value: "En attente de prise en charge", inline: true }
    ],
    color: 0x121212
  });

  const guideEmbed = createBaseEmbed({
    title: "Cadre de traitement",
    description:
      "Expose ta demande de manière claire, complète et concise.\nÉvite les messages inutiles afin de conserver un traitement rapide, discret et parfaitement lisible.",
    fields: [
      { name: "Détail utile", value: "Présente les faits, les noms utiles et le contexte exact.", inline: false },
      { name: "Gestion", value: "Le staff peut prendre, fermer, archiver ou compléter le dossier.", inline: false }
    ],
    color: 0x1d1d1d
  });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(TICKET_CLAIM).setLabel("Prendre en charge").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId(TICKET_CLOSE).setLabel("Clore").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId(TICKET_DELETE).setLabel("Supprimer").setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId(TICKET_MEMBER_ADD).setLabel("Ajouter un accès").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId(TICKET_MEMBER_REMOVE).setLabel("Retirer un accès").setStyle(ButtonStyle.Secondary)
  );
  const rowTwo = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(TICKET_TRANSCRIPT).setLabel("Transcript").setStyle(ButtonStyle.Secondary)
  );

  await channel.send({ embeds: [embed, guideEmbed], components: [row, rowTwo] });

  await sendLog(
    interaction.guild,
    config.channels?.ticketsLog,
    "Ticket ouvert",
    `Ticket #${ticketNumber} cree par ${interaction.user.tag}.`,
    [{ name: "Type", value: typeConfig.label, inline: true }],
    { category: "ticket", level: "success" }
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

  const responseMinutes = Math.max(1, Math.round((ticket.claimedAt.getTime() - ticket.openedAt.getTime()) / 60000));

  const claimEmbed = createBaseEmbed({
    title: "Dossier pris en charge",
    description: `${interaction.user} assure désormais le suivi principal de ce dossier.`,
    fields: [{ name: "Temps de réponse", value: `${responseMinutes} minute(s)`, inline: true }],
    color: 0x24301f
  });

  await interaction.reply({ embeds: [claimEmbed] });
  await sendLog(
    interaction.guild,
    client.runtimeConfig.channels?.ticketsLog,
    "Ticket pris en charge",
    `Le ticket #${ticket.ticketNumber} est maintenant gere par ${interaction.user.tag}.`,
    [{ name: "Temps de reponse", value: `${responseMinutes} minute(s)`, inline: true }],
    { category: "ticket", level: "info" }
  );
}

async function closeTicket(interaction, client) {
  const ticket = await getActiveTicketByChannel(interaction.channelId);
  if (!ticket) {
    await interaction.reply({ content: "Aucun ticket actif dans ce salon.", ephemeral: true });
    return;
  }

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(TICKET_CLOSE_CONFIRM).setLabel("Confirmer la clôture").setStyle(ButtonStyle.Danger)
  );

  const closePromptEmbed = createBaseEmbed({
    title: "Confirmation requise",
    description: "Confirme la clôture du dossier. Cette action met fin au traitement actif et prépare l’archivage.",
    color: 0x2a1a1a
  });

  await interaction.reply({ embeds: [closePromptEmbed], components: [row], ephemeral: true });
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

  await sendLog(
    interaction.guild,
    client.runtimeConfig.channels?.ticketsLog,
    "Ticket ferme",
    `Le ticket #${ticket.ticketNumber} a ete ferme par ${interaction.user.tag}.`,
    [],
    { category: "ticket", level: "warning" }
  );
  const closedEmbed = createBaseEmbed({
    title: "Dossier clôturé",
    description: "Le traitement actif est terminé.\nLe salon peut désormais être archivé ou supprimé selon le besoin du staff.",
    fields: [{ name: "Décision", value: `Clôturé par ${interaction.user.tag}`, inline: true }],
    color: 0x1b2230
  });

  await interaction.reply({ embeds: [closedEmbed] });
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
    [{ name: "Type", value: ticket.type, inline: true }],
    { category: "ticket", level: "warning" }
  );
  {
    const channel = await interaction.guild.channels.fetch(FIXED_LOG_CHANNEL_ID).catch(() => null);
    if (channel?.isTextBased() && transcript.trim()) {
      await channel.send({
        files: [{ attachment: Buffer.from(transcript, "utf8"), name: `transcript-ticket-${ticket.ticketNumber}.txt` }]
      }).catch(() => null);
    }
  }
  const deleteEmbed = createBaseEmbed({
    title: "Suppression engagée",
    description: "Le dossier est marqué comme supprimé. Le salon va maintenant être retiré proprement.",
    color: 0x301616
  });

  await interaction.reply({ embeds: [deleteEmbed] });
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
  createTicketChannel,
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
