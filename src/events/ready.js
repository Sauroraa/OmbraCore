module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    client.user.setActivity("Societa Ombra");
  }
};
