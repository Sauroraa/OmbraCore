require("dotenv").config();

const mongoose = require("mongoose");

function isSnowflake(value) {
  return /^\d{17,20}$/.test(value || "");
}

async function runDoctor() {
  const checks = [
    ["DISCORD_TOKEN present", Boolean(process.env.DISCORD_TOKEN)],
    ["CLIENT_ID valid", isSnowflake(process.env.CLIENT_ID)],
    ["GUILD_ID valid", isSnowflake(process.env.GUILD_ID)],
    ["MONGODB_URI present", Boolean(process.env.MONGODB_URI)]
  ];

  for (const [label, ok] of checks) {
    console.log(`${ok ? "OK" : "FAIL"} - ${label}`);
  }

  if (!process.env.MONGODB_URI) {
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("OK - MongoDB connection");
    await mongoose.disconnect();
  } catch (error) {
    console.log("FAIL - MongoDB connection");
    console.log(error.message);
    process.exit(1);
  }
}

runDoctor().catch((error) => {
  console.error(error);
  process.exit(1);
});
