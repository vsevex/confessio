import { Composer } from "telegraf";
import commands from "./commands";

const userComposer = new Composer();

userComposer.hears(commands.helpRegex, commands.helpCommand);
userComposer.command(commands.helpRegex, commands.helpCommand);
userComposer.action(commands.helpRegex, commands.helpCommand);

userComposer.hears(commands.infoRegex, commands.infoCommand);
userComposer.command(commands.infoRegex, commands.infoCommand);
userComposer.action(commands.infoRegex, commands.infoCommand);

export default userComposer;
