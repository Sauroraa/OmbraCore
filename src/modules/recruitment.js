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

function createRecruitmentReviewComponents(applicationId) {
  const detailsUrl = `${getRecruitmentPortalUrl().replace(/\/recruitment$/, "")}/admin/recruitment/${applicationId}`;

  return [
    createApplicationReviewRow(applicationId),
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Consulter le dossier complet")
        .setStyle(ButtonStyle.Link)
        .setURL(detailsUrl)
    )
  ];
}

function truncateField(value, max = 1024) {
  if (!value) {
    return "Non renseigné";
  }

  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

function chunkArray(items, size) {
  const chunks = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

function splitOverviewAnswers(answers = []) {
  return {
    identity: answers.slice(0, 5),
    profile: answers.slice(5, 11),
    rp: answers.slice(11, 19),
    quiz: answers.slice(19)
  };
}

function createFieldSectionEmbed(title, description, color, answers) {
  return createBaseEmbed({
    title,
    description,
    fields: answers.map((item) => ({
      name: item.question.slice(0, 256),
      value: truncateField(item.answer),
      inline: false
    })),
    color
  });
}

function buildAnswerBlock(item, index, answerLimit = 700) {
  const answer = truncateField(item.answer, answerLimit);
  return `**${index + 1}. ${item.question}**\n${answer}`;
}

function createDescriptionSectionEmbeds(title, description, color, answers, answerLimit = 700) {
  const embeds = [];
  const blocks = answers.map((item, index) => buildAnswerBlock(item, index, answerLimit));
  let currentBlocks = [];
  let currentLength = description.length;

  for (const block of blocks) {
    const nextLength = currentLength + block.length + 2;

    if (currentBlocks.length && nextLength > 3900) {
      embeds.push(
        createBaseEmbed({
          title: embeds.length === 0 ? title : `${title} • Suite ${embeds.length + 1}`,
          description: [description, ...currentBlocks].join("\n\n"),
          color
        })
      );
      currentBlocks = [block];
      currentLength = description.length + block.length + 2;
      continue;
    }

    currentBlocks.push(block);
    currentLength = nextLength;
  }

  if (currentBlocks.length) {
    embeds.push(
      createBaseEmbed({
        title: embeds.length === 0 ? title : `${title} • Suite ${embeds.length + 1}`,
        description: [description, ...currentBlocks].join("\n\n"),
        color
      })
    );
  }

  return embeds;
}

function createRecruitmentSubmissionEmbeds({ userMention, ticketNumber, typeLabel, score, answers, sourceLabel }) {
  const groupedEmbeds = [];
  const { identity, profile, rp, quiz } = splitOverviewAnswers(answers);
  const scoreValue = Number.isFinite(score) ? score : 0;
  const scoreTone =
    scoreValue >= 20
      ? "Seuil de validation atteint pour la transmission."
      : "Score sous le seuil automatique, lecture staff recommandée.";
  const dossierUrl = `${getRecruitmentPortalUrl().replace(/\/recruitment$/, "")}/admin/recruitment/__APPLICATION_ID__`;
  const quickRead = [...identity.slice(0, 5), ...profile.slice(0, 3)];

  const coverEmbed = createBaseEmbed({
    title: "Dossier de recrutement • Società Ombra",
    description:
      `${userMention}, le dossier a été transmis dans le circuit recrutement.\nLe ticket conserve un résumé staff propre. La lecture complète se fait depuis le portail sécurisé.`,
    fields: [
      { name: "Référence", value: `#${String(ticketNumber).padStart(4, "0")}`, inline: true },
      { name: "Motif", value: typeLabel, inline: true },
      { name: "Score questionnaire", value: `${scoreValue}/25`, inline: true },
      { name: "Source", value: sourceLabel, inline: true },
      { name: "Questions transmises", value: `${answers.length}`, inline: true },
      { name: "Lecture complète", value: `[Ouvrir le dossier staff](${dossierUrl})`, inline: true },
      { name: "Évaluation", value: scoreTone, inline: false }
    ],
    color: 0x16120f
  });

  groupedEmbeds.push(coverEmbed);

  if (quickRead.length) {
    groupedEmbeds.push(
      createFieldSectionEmbed(
        "Synthèse candidat",
        "Vue rapide pour le ticket. Le détail complet est consultable sur le portail staff.",
        0x1a1816,
        quickRead
      )
    );
  }

  groupedEmbeds.push(
    createBaseEmbed({
      title: "Lecture staff recommandée",
      description:
        "Le ticket reste volontairement compact pour éviter le spam inutile.\nUtilise le bouton ou le lien portail pour consulter la candidature complète, les réponses détaillées et les actions staff en un seul endroit.",
      fields: [
        { name: "Portail admin", value: `[Consulter la candidature complète](${dossierUrl})`, inline: false },
        { name: "Résumé RP", value: `${rp.length} réponse(s) longues disponibles`, inline: true },
        { name: "Quiz Ombra", value: `${quiz.length} réponse(s) consultables sur le portail`, inline: true }
      ],
      color: 0x181716
    })
  );

  return groupedEmbeds;
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

async function injectRecruitmentSubmissionIntoChannel({
  guild,
  channel,
  application,
  ticketNumber,
  typeLabel,
  answers,
  score,
  sourceLabel,
  logChannelId
}) {
  const embeds = createRecruitmentSubmissionEmbeds({
    userMention: `<@${application.userId}>`,
    ticketNumber,
    typeLabel,
    score,
    answers,
    sourceLabel
  }).map((embed) => {
    if (embed.data?.fields) {
      embed.data.fields = embed.data.fields.map((field) => ({
        ...field,
        value: typeof field.value === "string" ? field.value.replace("__APPLICATION_ID__", application.id) : field.value
      }));
    }

    return embed;
  });
  const reviewComponents = createRecruitmentReviewComponents(application.id);

  await sendEmbedsInChunks(channel, embeds, reviewComponents);

  if (logChannelId) {
    const logChannel = await guild.channels.fetch(logChannelId).catch(() => null);
    if (logChannel?.isTextBased()) {
      await sendEmbedsInChunks(logChannel, embeds, reviewComponents);
    }
  }

  return { embeds };
}

async function dispatchRecruitmentSubmission({
  guild,
  member,
  client,
  application,
  answers,
  score,
  sourceLabel,
  forceIntoExisting = false,
  existingTicketRecord = null,
  existingChannel = null
}) {
  const config = client.runtimeConfig;
  const { existingTicket, existingChannel: foundExistingChannel, ticketNumber, channel, typeConfig } = await createTicketChannel(
    guild,
    config,
    member.user,
    "recruitment"
  );

  if (existingTicket && !forceIntoExisting) {
    return { existingTicket, existingChannel: foundExistingChannel };
  }

  if (existingTicket && forceIntoExisting && existingChannel) {
    const injected = await injectRecruitmentSubmissionIntoChannel({
      guild,
      channel: existingChannel,
      application,
      ticketNumber: existingTicket.ticketNumber,
      typeLabel: typeConfig.label,
      answers,
      score,
      sourceLabel: `${sourceLabel} • Réinjection`,
      logChannelId: config.channels?.applicationsLog
    });

    return {
      channel: existingChannel,
      ticketNumber: existingTicket.ticketNumber,
      typeConfig,
      embeds: injected.embeds,
      reusedExisting: true
    };
  }

  const injected = await injectRecruitmentSubmissionIntoChannel({
    guild,
    channel,
    application,
    ticketNumber,
    typeLabel: typeConfig.label,
    answers,
    score,
    sourceLabel,
    logChannelId: config.channels?.applicationsLog
  });

  return { channel, ticketNumber, typeConfig, embeds: injected.embeds };
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

async function resetRecruitmentTicketForApplication({
  client,
  guild,
  application,
  actorId = null,
  actorLabel = "Staff web"
}) {
  const member = await guild.members.fetch(application.userId).catch(() => null);
  if (!member) {
    throw new Error("Le candidat n'est plus présent sur le serveur Discord.");
  }

  const existingTickets = await Ticket.find({
    guildId: guild.id,
    authorId: application.userId,
    type: "recruitment",
    status: { $ne: "deleted" }
  });

  for (const ticket of existingTickets) {
    const channel = await guild.channels.fetch(ticket.channelId).catch(() => null);

    if (channel) {
      await channel.delete(`Réinitialisation recrutement par ${actorLabel}`).catch(() => null);
    }

    ticket.status = "deleted";
    ticket.closedAt = new Date();
    await ticket.save();
  }

  const answers = Array.isArray(application.answers) ? application.answers : [];
  if (!answers.length) {
    throw new Error("Cette candidature ne contient aucune réponse exploitable.");
  }

  const score = Number.isFinite(application.quizScore) ? application.quizScore : application.score || 0;
  const result = await dispatchRecruitmentSubmission({
    guild,
    member,
    client,
    application,
    answers,
    score,
    sourceLabel: `Portail admin • Réinitialisation`,
    forceIntoExisting: false
  });

  await member.send(
    `Ton ticket recrutement Società Ombra a été réinitialisé par le staff.\nNouvelle référence : #${String(result.ticketNumber).padStart(4, "0")}.`
  ).catch(() => null);

  await sendLog(
    guild,
    client.runtimeConfig.channels?.applicationsLog,
    "Ticket recrutement réinitialisé",
    `${actorLabel} a réinitialisé le circuit recrutement de ${member.user.tag}.`,
    [
      { name: "Candidat", value: `${member}`, inline: true },
      { name: "Nouvelle référence", value: `#${String(result.ticketNumber).padStart(4, "0")}`, inline: true },
      { name: "Canal", value: `${result.channel}`, inline: true }
    ]
  );

  return result;
}

async function manageRecruitmentTicketsForApplication({
  client,
  guild,
  application,
  mode,
  actorLabel = "Staff web"
}) {
  const tickets = await Ticket.find({
    guildId: guild.id,
    authorId: application.userId,
    type: "recruitment",
    status: { $ne: "deleted" }
  }).sort({ createdAt: 1 });

  if (!tickets.length) {
    throw new Error("Aucun ticket recrutement actif ou archivable n'est lié à cette candidature.");
  }

  const member = await guild.members.fetch(application.userId).catch(() => null);
  let processedCount = 0;

  for (const ticket of tickets) {
    const channel = await guild.channels.fetch(ticket.channelId).catch(() => null);

    if (mode === "archive") {
      ticket.status = "closed";
      ticket.closedAt = new Date();
      await ticket.save();

      if (channel && client.runtimeConfig.tickets?.closeArchiveCategoryId) {
        await channel.setParent(client.runtimeConfig.tickets.closeArchiveCategoryId).catch(() => null);
      }

      if (channel?.isTextBased()) {
        await channel.send({
          embeds: [
            createBaseEmbed({
              title: "Archivage staff appliqué",
              description: `Le circuit recrutement est maintenant archivé par ${actorLabel}.`,
              color: 0x1b2230
            })
          ]
        }).catch(() => null);
      }
    } else if (mode === "delete") {
      ticket.status = "deleted";
      ticket.closedAt = new Date();
      await ticket.save();

      if (channel) {
        await channel.delete(`Suppression recrutement par ${actorLabel}`).catch(() => null);
      }
    } else {
      throw new Error("Mode de gestion ticket invalide.");
    }

    processedCount += 1;
  }

  if (member) {
    const dmMessage =
      mode === "archive"
        ? `Le staff Società Ombra a archivé ton circuit recrutement (${processedCount} salon(s)).`
        : `Le staff Società Ombra a supprimé ton ancien circuit recrutement (${processedCount} salon(s)).`;
    await member.send(dmMessage).catch(() => null);
  }

  if (mode === "delete") {
    application.adminHidden = true;
    application.hiddenAt = new Date();
    await application.save();
  }

  await sendLog(
    guild,
    client.runtimeConfig.channels?.applicationsLog,
    mode === "archive" ? "Tickets recrutement archivés" : "Tickets recrutement supprimés",
    `${actorLabel} a ${mode === "archive" ? "archivé" : "supprimé"} ${processedCount} ticket(s) recrutement liés à la candidature ${application.id}.`,
    [
      { name: "Candidature", value: `${application.id}`, inline: true },
      { name: "Salons traités", value: `${processedCount}`, inline: true },
      { name: "Action", value: mode === "archive" ? "Archivage" : "Suppression", inline: true }
    ]
  );

  return { processedCount };
}

module.exports = {
  createRecruitmentPanel,
  createRecruitmentModal,
  createRecruitmentTicketModal,
  createRecruitmentPortalPayload,
  dispatchRecruitmentSubmission,
  injectRecruitmentSubmissionIntoChannel,
  submitApplication,
  submitRecruitmentTicketForm,
  reviewApplication,
  contactApplicant,
  createInterviewTicket,
  resetRecruitmentTicketForApplication,
  manageRecruitmentTicketsForApplication
};
