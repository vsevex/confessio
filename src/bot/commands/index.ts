import startCommand from "./start";
import helpCommand from "./help";
import infoCommand from "./info";

const submitRegex = /^(submit|confess)$/i;
const helpRegex = /^(whelp|help)$/i;
const infoRegex = /^(info|about)$/i;

const myCommands = [
  { command: "info", description: "Get information about the bot" },
  {
    command: "help",
    description: "Show help menu",
  },
  { command: "submit", description: "Submit a confession" },
];

export default {
  startCommand,
  helpRegex,
  helpCommand,
  infoRegex,
  infoCommand,
  myCommands,
  submitRegex,
};
