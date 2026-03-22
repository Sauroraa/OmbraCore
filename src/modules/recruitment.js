const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ModalBuilder,
  PermissionFlagsBits,
  TextInputBuilder,
  TextInputStyle
} = require("discord.js");

const Application = require("../models/Application");
const Ticket = require("../models/Ticket");
const UserProfile = require("../models/UserProfile");
const {
  APPLICATION_CONTACT_PREFIX,
  APPLICATION_INTERVIEW_PREFIX,
  APPLICATION_OPEN,
  APPLICATION_REVIEW_PREFIX,
  TICKET_RECRUITMENT_FORM
} = require("../constants/customIds");
const { createBaseEmbed } = require("../utils/embeds");
const { sendLog } = require("../services/logService");
const { applyApplicationStatus } = require("../services/recruitmentDecisionService");
const { createTicketChannel, getNextTicketNumberFromGuild } = require("./tickets");

function createRecruitmentPanel() {
  const embed = createBaseEmbed({
    title: "Portail de recrutement Ombra",
    description:
      "Lance une candidature sérieuse et complète via le portail sécurisé.\nUne fois le questionnaire finalisé, OmbraCore ouvre automatiquement ton ticket recrutement avec l’intégralité des réponses.",
    color: 0x2a2415
  });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(APPLICATION_OPEN).setLabel("Commencer la procédure").setStyle(ButtonStyle.Success)
  );

  return { embeds: [embed], components: [row] };
}

function getRecruitmentPortalUrl() {
  const baseUrl = process.env.WEB_BASE_URL || "https://societa.univers-bot.fr";
  return `${baseUrl.replace(/\/$/, "")}/recruitment`;
}

function createRecruitmentPortalPayload() {
  const introEmbed = createBaseEmbed({
    title: "Portail de recrutement sécurisé",
    description:
      "Le recrutement complet se déroule désormais sur le portail OmbraCore.\nConnecte-toi avec Discord, remplis l’intégralité du questionnaire, puis le ticket recrutement sera créé automatiquement avec ton dossier déjà injecté pour le staff.",
    fields: [
      { name: "Étape 1", value: "Connexion Discord sur le portail", inline: true },
      { name: "Étape 2", value: "Formulaire complet et structuré", inline: true },
      { name: "Étape 3", value: "Création automatique du ticket", inline: true }
    ],
    color: 0x171310
  });

  const detailEmbed = createBaseEmbed({
    title: "Traitement du dossier",
    description:
      "Aucune réponse n’est perdue. Le bot construit ensuite un salon privé dédié avec tes réponses, la référence du dossier et les actions staff prêtes à l’emploi.",
    fields: [
      { name: "Accès", value: "Portail privé relié à ton compte Discord.", inline: true },
      { name: "Confidentialité", value: "Lecture staff uniquement dans le ticket.", inline: true },
      { name: "Résultat", value: "Ticket recrutement créé à la fin du formulaire.", inline: true }
    ],
    color: 0x1d1815
  });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("Accéder au portail recrutement")
      .setStyle(ButtonStyle.Link)
      .setURL(getRecruitmentPortalUrl())
  );

  return { embeds: [introEmbed, detailEmbed], components: [row] };
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

function createRecruitmentTicketModal() {
  const modal = new ModalBuilder().setCustomId(TICKET_RECRUITMENT_FORM).setTitle("Formulaire Recrutement Ombra");

  modal.addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("recruitment_identity")
        .setLabel("Identité RP")
        .setPlaceholder("Nom RP | Prénom RP | Âge RP | Origine | Profession RP")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("recruitment_player_profile")
        .setLabel("Profil joueur")
        .setPlaceholder("Âge IRL | Pseudo Discord | Temps en RP | Serveurs précédents | Expérience criminelle")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("recruitment_experience")
        .setLabel("Expérience RP")
        .setPlaceholder("RP sérieux | Rôle important | Réaction en tension | Exemple de scène vécue")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("recruitment_motivation")
        .setLabel("Motivation")
        .setPlaceholder("Pourquoi Ombra | Ce qui t’attire | Ce que tu apportes | Pourquoi toi")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("recruitment_commitment")
        .setLabel("Comportement et engagement")
        .setPlaceholder("Sanctions | Gestion des conflits | Hiérarchie | Disponibilités | Confidentialité | Mise en situation")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
    )
  );

  return modal;
}

function createApplicationReviewRow(applicationId) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`${APPLICATION_REVIEW_PREFIX}${applicationId}:accepted`)
      .setLabel("Accepter")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`${APPLICATION_REVIEW_PREFIX}${applicationId}:refused`)
      .setLabel("Refuser")
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId(`${APPLICATION_REVIEW_PREFIX}${applicationId}:on_hold`)
      .setLabel("En attente")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`${APPLICATION_CONTACT_PREFIX}${applicationId}`)
      .setLabel("Contacter")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`${APPLICATION_INTERVIEW_PREFIX}${applicationId}`)
      .setLabel("Entretien")
      .setStyle(ButtonStyle.Secondary)
  );
}

function createRecruitmentSubmissionEmbeds({ userMention, ticketNumber, typeLabel, score, answers, sourceLabel }) {
  const coverEmbed = createBaseEmbed({
    title: "Dossier de recrutement • Società Ombra",
    description:
      `${userMention}, ton dossier a été enregistré et transmis dans un salon privé.\nChaque réponse a été structurée automatiquement par OmbraCore pour une lecture propre par le staff.`,
    fields: [
      { name: "Référence", value: `#${String(ticketNumber).padStart(4, "0")}`, inline: true },
      { name: "Motif", value: typeLabel, inline: true },
      { name: "Évaluation", value: `Score initial ${score}`, inline: true },
      { name: "Source", value: sourceLabel, inline: true }
    ],
    color: 0x16120f
  });

  const sectionEmbeds = answers.map((item) =>
    createBaseEmbed({
      title: item.question,
      description: item.answer.slice(0, 4096),
      color: 0x1c1a18
    })
  );

  return [coverEmbed, ...sectionEmbeds];
}

function chunkEmbeds(embeds, size = 10) {
  const chunks = [];

  for (let index = 0; index < embeds.length; index += size) {
    chunks.push(embeds.slice(index, index + size));
  }

  return chunks;
}

async function sendEmbedsInChunks(channel, embeds, components = []) {
  const chunks = chunkEmbeds(embeds, 10);

  for (const [index, chunk] of chunks.entries()) {
    await channel.send({
      embeds: chunk,
      components: index === 0 ? components : []
    });
  }
}

async function dispatchRecruitmentSubmission({
  guild,
  member,
  client,
  application,
  answers,
  score,
  sourceLabel
}) {
  const config = client.runtimeConfig;
  const { existingTicket, existingChannel, ticketNumber, channel, typeConfig } = await createTicketChannel(
    guild,
    config,
    member.user,
    "recruitment"
  );

  if (existingTicket) {
    return { existingTicket, existingChannel };
  }

  const embeds = createRecruitmentSubmissionEmbeds({
    userMention: `${member}`,
    ticketNumber,
    typeLabel: typeConfig.label,
    score,
    answers,
    sourceLabel
  });
  const reviewRow = createApplicationReviewRow(application.id);

  await sendEmbedsInChunks(channel, embeds, [reviewRow]);

  if (config.channels?.applicationsLog) {
    const logChannel = await guild.channels.fetch(config.channels.applicationsLog).catch(() => null);
    if (logChannel?.isTextBased()) {
      await sendEmbedsInChunks(logChannel, embeds, [reviewRow]);
    }
  }

  return { channel, ticketNumber, typeConfig, embeds };
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

  const reviewRow = createApplicationReviewRow(application.id);

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

  await applyApplicationStatus({
    client: interaction.client,
    guild: interaction.guild,
    application,
    status,
    actorId: interaction.user.id,
    actorLabel: interaction.user.tag
  });
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

async function submitRecruitmentTicketForm(interaction, client) {
  const config = client.runtimeConfig;
  const profile = await UserProfile.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });

  if (!profile?.rulesAcceptedAt) {
    await interaction.reply({ content: "Tu dois accepter le règlement avant de déposer une candidature.", ephemeral: true });
    return;
  }

  const sections = [
    { name: "Informations personnelles", answer: interaction.fields.getTextInputValue("recruitment_identity") },
    { name: "Profil joueur", answer: interaction.fields.getTextInputValue("recruitment_player_profile") },
    { name: "Expérience RP", answer: interaction.fields.getTextInputValue("recruitment_experience") },
    { name: "Motivation", answer: interaction.fields.getTextInputValue("recruitment_motivation") },
    { name: "Comportement et engagement", answer: interaction.fields.getTextInputValue("recruitment_commitment") }
  ];

  const score = sections.reduce((total, item) => total + Math.min(item.answer.length, 250), 0);

  const application = await Application.create({
    guildId: interaction.guild.id,
    userId: interaction.user.id,
    answers: sections.map((section) => ({ question: section.name, answer: section.answer })),
    score
  });

  const { existingTicket, existingChannel, ticketNumber, channel } = await dispatchRecruitmentSubmission({
    guild: interaction.guild,
    member: interaction.member,
    client,
    application,
    answers: sections.map((section) => ({ question: section.name, answer: section.answer })),
    score,
    sourceLabel: "Formulaire Discord"
  });

  if (existingTicket) {
    await interaction.reply({
      content: existingChannel ? `Tu as déjà un ticket recrutement ouvert : ${existingChannel}.` : "Tu as déjà un ticket recrutement ouvert.",
      ephemeral: true
    });
    return;
  }

  await sendLog(
    interaction.guild,
    config.channels?.applicationsLog,
    "Ticket recrutement créé",
    `${interaction.user.tag} a soumis un recrutement complet avant ouverture du ticket.`,
    [{ name: "Référence", value: `#${String(ticketNumber).padStart(4, "0")}`, inline: true }]
  );

  await interaction.reply({ content: `Dossier enregistré. Ton ticket recrutement est prêt : ${channel}`, ephemeral: true });
}

module.exports = {
  createRecruitmentPanel,
  createRecruitmentModal,
  createRecruitmentTicketModal,
  createRecruitmentPortalPayload,
  dispatchRecruitmentSubmission,
  submitApplication,
  submitRecruitmentTicketForm,
  reviewApplication,
  contactApplicant,
  createInterviewTicket
};
