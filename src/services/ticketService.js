const Ticket = require("../models/Ticket");

async function getActiveTicketByChannel(channelId) {
  return Ticket.findOne({ channelId, status: "open" });
}

async function addMemberToTicket(ticket, userId) {
  if (!ticket.members.includes(userId)) {
    ticket.members.push(userId);
    await ticket.save();
  }
}

async function removeMemberFromTicket(ticket, userId) {
  ticket.members = ticket.members.filter((memberId) => memberId !== userId);
  await ticket.save();
}

module.exports = {
  getActiveTicketByChannel,
  addMemberToTicket,
  removeMemberFromTicket
};
