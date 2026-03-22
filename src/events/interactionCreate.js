const {
  ACCEPT_RULES,
  APPLICATION_CONTACT_PREFIX,
  APPLICATION_INTERVIEW_PREFIX,
  APPLICATION_OPEN,
  APPLICATION_REVIEW_PREFIX,
  NEED_HELP,
  TICKET_CLAIM,
  TICKET_CLOSE,
  TICKET_CLOSE_CONFIRM,
  TICKET_DELETE,
  TICKET_MEMBER_ADD,
  TICKET_MEMBER_REMOVE,
  TICKET_RECRUITMENT_FORM,
  TICKET_SELECT,
  TICKET_TRANSCRIPT
} = require("../constants/customIds");
const {
  contactApplicant,
  createInterviewTicket,
  createRecruitmentPortalPayload,
  reviewApplication,
  submitApplication,
  submitRecruitmentTicketForm
} = require("../modules/recruitment");
const { acceptRules } = require("../modules/rules");
const {
  claimTicket,
  closeTicket,
  confirmCloseTicket,
  createTicketForMember,
  createMemberTicketModal,
  createTicket,
  deleteTicket,
  sendTranscript,
  updateTicketMember
} = require("../modules/tickets");
const { logCommand } = require("../services/commandLogService");
const { sendErrorLog } = require("../services/logService");
const { createLogger } = require("../utils/logger");

const logger = createLogger("Interaction");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isButton()) {
      if (interaction.customId === ACCEPT_RULES) {
        await acceptRules(interaction, client.runtimeConfig);
        return;
      }

      if (interaction.customId === NEED_HELP) {
        await createTicketForMember({
          guild: interaction.guild,
          user: interaction.user,
          client,
          selectedType: "support",
          replyTarget: (payload) => interaction.reply(payload)
        });
        return;
      }

      if (interaction.customId === TICKET_CLAIM) {
        await claimTicket(interaction, client);
        return;
      }

      if (interaction.customId === TICKET_CLOSE) {
        await closeTicket(interaction, client);
        return;
      }

      if (interaction.customId === TICKET_TRANSCRIPT) {
        await sendTranscript(interaction);
        return;
      }

      if (interaction.customId === TICKET_DELETE) {
        await deleteTicket(interaction, client);
        return;
      }

      if (interaction.customId === TICKET_CLOSE_CONFIRM) {
        await confirmCloseTicket(interaction, client);
        return;
      }

      if (interaction.customId === TICKET_MEMBER_ADD || interaction.customId === TICKET_MEMBER_REMOVE) {
        await interaction.showModal(createMemberTicketModal(interaction.customId));
        return;
      }

      if (interaction.customId === APPLICATION_OPEN) {
        await interaction.reply({
          ...createRecruitmentPortalPayload(),
          ephemeral: true
        });
        return;
      }

      if (interaction.customId.startsWith(APPLICATION_CONTACT_PREFIX)) {
        await contactApplicant(interaction);
        return;
      }

      if (interaction.customId.startsWith(APPLICATION_INTERVIEW_PREFIX)) {
        await createInterviewTicket(interaction, client);
        return;
      }

      if (interaction.customId.startsWith(APPLICATION_REVIEW_PREFIX)) {
        const status = interaction.customId.split(":")[3];
        await reviewApplication(interaction, status);
        return;
      }
    }

    if (interaction.isStringSelectMenu() && interaction.customId === TICKET_SELECT) {
      await createTicket(interaction, client, interaction.values[0]);
      return;
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === APPLICATION_OPEN) {
        await submitApplication(interaction, client);
        return;
      }

      if (interaction.customId === TICKET_RECRUITMENT_FORM) {
        await submitRecruitmentTicketForm(interaction, client);
        return;
      }

      if (interaction.customId === TICKET_MEMBER_ADD || interaction.customId === TICKET_MEMBER_REMOVE) {
        await updateTicketMember(interaction, interaction.customId);
        return;
      }
    }

    if (!interaction.isChatInputCommand()) {
      return;
    }

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      return;
    }

    try {
      await command.execute(interaction, client);
      await logCommand(interaction, client);
    } catch (error) {
      logger.error(`Command failure: ${interaction.commandName}`, error);
      await sendErrorLog(
        interaction.guild,
        "Erreur de commande",
        `La commande /${interaction.commandName} a échoué pendant son exécution.`,
        error,
        {
          category: "command",
          scope: "interactionCreate",
          fields: [
            { name: "Utilisateur", value: `${interaction.user}`, inline: true },
            { name: "Salon", value: `${interaction.channel}`, inline: true }
          ]
        }
      );

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: "Une erreur est survenue.", ephemeral: true });
        return;
      }

      await interaction.reply({ content: "Une erreur est survenue.", ephemeral: true });
    }
  }
};
