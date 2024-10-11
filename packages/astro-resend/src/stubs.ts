import astroDtsBuilder from "@matthiesenxyz/astrodtsbuilder";
import { name } from "../package.json";

// Create the config DTS file
const config = astroDtsBuilder();

// Add a note to the top of the file
config.addSingleLineNote(
	`This file is generated by '${name}' and should not be modified manually.`,
);

// Add the module to the file
config.addModule("virtual:astro-resend/config", {
	defaultExport: {
		typeDef: `import("${name}/schema").ResendConfig`,
		singleLineDescription: "The Resend configuration options",
	},
});

// Export the DTS files
export default {
	config: config.makeAstroInjectedType("config.d.ts"),
};