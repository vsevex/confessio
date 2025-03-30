import helpCommand from "./help";
import infoCommand from "./info";

const helpRegex = /^(whelp|help)$/i;
const infoRegex = /^(info|about)$/i;

const myCommands = [
  { command: "info", description: "Get information about the bot" },
  {
    command: "help",
    description: "Show help menu",
  },
];

export default { helpRegex, helpCommand, infoRegex, infoCommand, myCommands };
