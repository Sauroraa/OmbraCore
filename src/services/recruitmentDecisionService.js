const { createBaseEmbed } = require("../utils/embeds");
const { sendLog } = require("./logService");

function getStatusMeta(status) {
  switch (status) {
    case "accepted":
      return {
        label: "Acceptée",
        color: 0x214428,
        description:
          "Ton dossier a été validé par le staff Società Ombra. Reste attentif à tes messages privés pour la suite du circuit interne."
      };
    case "refused":
      return {
        label: "Refusée",
        color: 0x5a1f1f,
        description:
          "Ton dossier n’a pas été retenu par le staff Società Ombra. La décision a été enregistrée sur ton suivi candidat."
      };
    case "on_hold":
    default:
      return {
        label: "En étude",
        color: 0x5a4a1f,
        description:
          "Ton dossier est actuellement maintenu en étude par le staff Società Ombra. Reste disponible pour une éventuelle suite."
      };
  }
}

async function fetchApplicantUser(client, guild, userId) {
  const member = await guild.members.fetch(userId).catch(() => null);
  const user = member?.user || (await client.users.fetch(userId).catch(() => null));
  return { member, user };
}

async function sendApplicantEmbed(user, payload) {
  if (!user) {
    return false;
  }

  await user.send(payload).catch(() => null);
  return true;
}

async function syncDecisionRoles(member, config, status) {
  if (!member) {
    return;
  }

  if (status === "accepted" && config.recruitment?.acceptedRoleId) {
    await member.roles.add(config.recruitment.acceptedRoleId).catch(() => null);
  }

  if (status === "refused" && config.recruitment?.refusedRoleId) {
    await member.roles.add(config.recruitment.refusedRoleId).catch(() => null);
  }
}

async function applyApplicationStatus({
  client,
  guild,
  application,
  status,
  actorId,
  actorLabel,
  note = ""
}) {
  const config = client.runtimeConfig;
  const { member, user } = await fetchApplicantUser(client, guild, application.userId);
  const meta = getStatusMeta(status);

  application.status = status;
  application.reviewedBy = actorId || null;
  application.reviewedAt = new Date();
  if (note.trim()) {
    application.notes = note.trim();
  }
  await application.save();

  await syncDecisionRoles(member, config, status);

  const fields = [
    { name: "Statut", value: meta.label, inline: true },
    { name: "Référence", value: application.id, inline: true }
  ];

  if (note.trim()) {
    fields.push({ name: "Note staff", value: note.trim().slice(0, 1024), inline: false });
  }

  await sendApplicantEmbed(user, {
    embeds: [
      createBaseEmbed({
        title: "Mise à jour du dossier • Società Ombra",
        description: meta.description,
        fields,
        color: meta.color
      })
    ]
  });

  await sendLog(
    guild,
    config.channels?.applicationsLog,
    "Candidature traitée",
    `${actorLabel || "Staff"} a défini la candidature ${application.id} sur ${meta.label.toLowerCase()}.`,
    [
      { name: "Candidat", value: user ? `${user.tag}` : `\`${application.userId}\``, inline: true },
      { name: "Statut", value: meta.label, inline: true },
      ...(note.trim() ? [{ name: "Note", value: note.trim().slice(0, 1024), inline: false }] : [])
    ],
    { category: "recruitment", level: status === "accepted" ? "success" : status === "refused" ? "warning" : "info" }
  );

  return application;
}

async function scheduleApplicationInterview({
  client,
  guild,
  application,
  scheduledFor,
  note = "",
  actorId,
  actorLabel
}) {
  const config = client.runtimeConfig;
  const { user } = await fetchApplicantUser(client, guild, application.userId);
  const when = new Date(scheduledFor);

  application.status = "on_hold";
  application.reviewedBy = actorId || null;
  application.reviewedAt = new Date();
  application.interviewScheduledFor = when;
  application.interviewMessage = note.trim();
  if (note.trim()) {
    application.notes = note.trim();
  }
  await application.save();

  const unix = Math.floor(when.getTime() / 1000);
  const fields = [
    { name: "Convocation", value: `<t:${unix}:F>`, inline: true },
    { name: "Présence", value: "Ta présence est attendue à l’horaire indiqué.", inline: true },
    { name: "Référence", value: application.id, inline: true }
  ];

  if (note.trim()) {
    fields.push({ name: "Instruction", value: note.trim().slice(0, 1024), inline: false });
  }

  await sendApplicantEmbed(user, {
    embeds: [
      createBaseEmbed({
        title: "Convocation recrutement • Società Ombra",
        description:
          "Le staff t’a fixé un horaire de recrutement. Merci d’être présent, disponible et attentif sur Discord au moment indiqué.",
        fields,
        color: 0x5a4a1f
      })
    ]
  });

  await sendLog(
    guild,
    config.channels?.applicationsLog,
    "Horaire recrutement fixé",
    `${actorLabel || "Staff"} a fixé un horaire pour la candidature ${application.id}.`,
    [
      { name: "Candidat", value: user ? `${user.tag}` : `\`${application.userId}\``, inline: true },
      { name: "Date", value: `<t:${unix}:F>`, inline: true },
      ...(note.trim() ? [{ name: "Instruction", value: note.trim().slice(0, 1024), inline: false }] : [])
    ],
    { category: "recruitment", level: "info" }
  );

  return application;
}

module.exports = {
  applyApplicationStatus,
  scheduleApplicationInterview
};
