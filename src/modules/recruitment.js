const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ModalBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle } = require("discord.js");

const Application = require("../models/Application");
const Ticket = require("../models/Ticket");
const UserProfile = require("../models/UserProfile");
const {
  APPLICATION_CONTACT_PREFIX,
  APPLICATION_INTERVIEW_PREFIX,
  APPLICATION_OPEN,
  APPLICATION_REVIEW_PREFIX
} = require("../constants/customIds");
const { createBaseEmbed } = require("../utils/embeds");
const { sendLog } = require("../services/logService");
const { getNextTicketNumberFromGuild } = require("./tickets");

function createRecruitmentPanel() {
  const embed = createBaseEmbed({
    title: "Recrutement Societa Ombra",
    description: "Lance une candidature serieuse et detaillee. Ton dossier sera envoye a l'equipe staff.",
    color: 0x2a2415
  });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(APPLICATION_OPEN).setLabel("Envoyer ma candidature").setStyle(ButtonStyle.Success)
  );

  return { embeds: [embed], components: [row] };
}

function createRecruitmentModal(config) {
  const questions = config.recruitment?.questions || [];
  const modal = new ModalBuilder().setCustomId(APPLICATION_OPEN).setTitle("Candidature OmbraCore");

  const selectedQuestions = [questions[0], questions[1], questions[7], questions[8], questions[9]].filter(Boolean);

  for (const [index, question] of selectedQuestions.entries()) {
    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId(`application_answer_${index}`)
          .setLabel(question.slice(0, 45))
          .setStyle(index >= 2 ? TextInputStyle.Paragraph : TextInputStyle.Short)
          .setRequired(true)
      )
    );
  }

  return modal;
}

async function submitApplication(interaction, client) {
  const config = client.runtimeConfig;
  const profile = await UserProfile.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });

  if (!profile?.rulesAcceptedAt) {
    await interaction.reply({ content: "Tu dois accepter le reglement avant de candidater.", ephemeral: true });
    return;
  }

  const questions = [config.recruitment.questions[0], config.recruitment.questions[1], config.recruitment.questions[7], config.recruitment.questions[8], config.recruitment.questions[9]];

  const answers = questions.map((question, index) => ({
    question,
    answer: interaction.fields.getTextInputValue(`application_answer_${index}`)
  }));

  const score = answers.reduce((total, item) => total + Math.min(item.answer.length, 250), 0);

  const application = await Application.create({
    guildId: interaction.guild.id,
    userId: interaction.user.id,
    answers,
    score
  });

  const embed = createBaseEmbed({
    title: "Nouvelle candidature",
    description: `Candidat : ${interaction.user}`,
    fields: answers.map((item) => ({
      name: item.question,
      value: item.answer.slice(0, 1024)
    })).concat([{ name: "Score automatique", value: `${score}`, inline: true }]),
    color: 0xc9a227
  });

  const reviewRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(`${APPLICATION_REVIEW_PREFIX}${application.id}:accepted`).setLabel("Accepter").setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId(`${APPLICATION_REVIEW_PREFIX}${application.id}:refused`).setLabel("Refuser").setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId(`${APPLICATION_REVIEW_PREFIX}${application.id}:on_hold`).setLabel("En attente").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId(`${APPLICATION_CONTACT_PREFIX}${application.id}`).setLabel("Contacter").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId(`${APPLICATION_INTERVIEW_PREFIX}${application.id}`).setLabel("Ouvrir entretien").setStyle(ButtonStyle.Secondary)
  );

  if (config.channels?.applicationsLog) {
    const channel = await interaction.guild.channels.fetch(config.channels.applicationsLog).catch(() => null);
    if (channel?.isTextBased()) {
      await channel.send({ embeds: [embed], components: [reviewRow] });
    }
  }

  await sendLog(interaction.guild, config.channels?.applicationsLog, "Candidature recue", `${interaction.user.tag} a soumis une candidature.`);
  await interaction.reply({ content: "Candidature envoyee au staff.", ephemeral: true });
}

async function reviewApplication(interaction, status) {
  const applicationId = interaction.customId.split(":")[2];
  const application = await Application.findById(applicationId);

  if (!application) {
    await interaction.reply({ content: "Candidature introuvable.", ephemeral: true });
    return;
  }

  application.status = status;
  application.reviewedBy = interaction.user.id;
  application.reviewedAt = new Date();
  await application.save();

  const member = await interaction.guild.members.fetch(application.userId).catch(() => null);
  if (member) {
    if (status === "accepted" && interaction.client.runtimeConfig.recruitment?.acceptedRoleId) {
      await member.roles.add(interaction.client.runtimeConfig.recruitment.acceptedRoleId).catch(() => null);
    }

    if (status === "refused" && interaction.client.runtimeConfig.recruitment?.refusedRoleId) {
      await member.roles.add(interaction.client.runtimeConfig.recruitment.refusedRoleId).catch(() => null);
    }

    await member.send(`Ta candidature Societa Ombra est maintenant : ${status}.`).catch(() => null);
  }

  await sendLog(interaction.guild, interaction.client.runtimeConfig.channels?.applicationsLog, "Candidature traitee", `La candidature ${application.id} est definie comme ${status} par ${interaction.user.tag}.`);
  await interaction.reply({ content: `Candidature definie comme : ${status}.`, ephemeral: true });
}

async function contactApplicant(interaction) {
  const applicationId = interaction.customId.split(":")[2];
  const application = await Application.findById(applicationId);

  if (!application) {
    await interaction.reply({ content: "Candidature introuvable.", ephemeral: true });
    return;
  }

  const user = await interaction.client.users.fetch(application.userId).catch(() => null);
  if (!user) {
    await interaction.reply({ content: "Candidat introuvable.", ephemeral: true });
    return;
  }

  const contactMessage =
    interaction.client.runtimeConfig.recruitment?.contactMessage ||
    "Le staff Societa Ombra souhaite echanger avec toi au sujet de ta candidature.";
  await user.send(`${contactMessage}\nReference candidature: ${application.id}.`).catch(() => null);
  await interaction.reply({ content: "Le candidat a ete contacte en DM si possible.", ephemeral: true });
}

async function createInterviewTicket(interaction, client) {
  const applicationId = interaction.customId.split(":")[2];
  const application = await Application.findById(applicationId);

  if (!application) {
    await interaction.reply({ content: "Candidature introuvable.", ephemeral: true });
    return;
  }

  const member = await interaction.guild.members.fetch(application.userId).catch(() => null);
  if (!member) {
    await interaction.reply({ content: "Le candidat a quitte le serveur.", ephemeral: true });
    return;
  }

  const ticketNumber = await getNextTicketNumberFromGuild(interaction.guild.id);
  const channel = await interaction.guild.channels.create({
    name: `entretien-${String(ticketNumber).padStart(4, "0")}`,
    type: ChannelType.GuildText,
    parent: client.runtimeConfig.recruitment?.interviewCategoryId || client.runtimeConfig.categories?.recruitmentTickets || undefined,
    permissionOverwrites: [
      { id: interaction.guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
      { id: member.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
      ...(client.runtimeConfig.roles?.staff
        ? [{
            id: client.runtimeConfig.roles.staff,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
          }]
        : [])
    ]
  });

  await Ticket.create({
    guildId: interaction.guild.id,
    channelId: channel.id,
    ticketNumber,
    authorId: member.id,
    type: "recruitment",
    priority: "high"
  });

  await channel.send(`Entretien cree pour ${member}. Staff responsable: ${interaction.user}.`);
  await interaction.reply({ content: `Salon d'entretien cree : ${channel}`, ephemeral: true });
}

module.exports = {
  createRecruitmentPanel,
  createRecruitmentModal,
  submitApplication,
  reviewApplication,
  contactApplicant,
  createInterviewTicket
};
