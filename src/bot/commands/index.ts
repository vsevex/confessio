import startCommand from "./start";
import helpCommand from "./help";
import infoCommand from "./info";

const submitRegex = /^(submit|confess)$/i;
const helpRegex = /^(whelp|help)$/i;
const infoRegex = /^(info|about)$/i;
const myConfessionsRegex = /^(myconfessions|myconfessions)$/i;

const myCommands = [
  { command: "info", description: "Get information about the bot" },
  {
    command: "help",
    description: "Show help menu",
  },
  { command: "submit", description: "Submit a confession" },
  {
    command: "myconfessions",
    description: "View, manage, or delete your past confessions",
  },
];

export default {
  startCommand,
  helpRegex,
  helpCommand,
  infoRegex,
  infoCommand,
  myCommands,
  submitRegex,
  myConfessionsRegex,
};
