const startTime = process.hrtime.bigint();

import { UiPathProject } from "./app/UiPathProject.js";

import commander from "commander";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import prettyMS from "pretty-ms";

const appPackage = require( "./package.json" );

const program = new commander.Command();
const log = console.log;

const error = chalk.bold.red;
const warn = chalk.bold.yellow;
const success = chalk.bold.green;

// Define basic program metadata.
program.version( appPackage.version, "-v, --version" )
  .description( "Generate documentation for UiPath projects developed by the Flinders RPA team" )
  .option( "-i, --input <required>", "Path to UiPath project directory" );

// Parse the command line parameters.
program.parse( process.argv );

// Check for required input path option.
// If missing assume current working directory.
if ( typeof( program.input ) === "undefined" ) {
  program.input = process.cwd();
}

// Output some useful information.
log( chalk.bold( "RPA Doc - " + appPackage.version ) );

// Resolve a relative path if required.
if ( !path.isAbsolute( program.input ) ) {
  program.input = path.resolve( process.cwd().toString(), program.input );
} else {

  // Normalise the path for sanity.
  program.input = path.normalize( program.input );
}

// Get some information about the project.
const projectInfo = new UiPathProject( program.input );

log( "INFO: Project name: %s", projectInfo.getName() );
log( "INFO: Project version: %s", projectInfo.getVersion() );

if ( projectInfo.isLibrary() !== true ) {
  log( warn( "WARN:" ) + " This app works best with UiPath Library projects" );
}


const endTime = process.hrtime.bigint();
const totalTime = Number( endTime - startTime ) * 1e-6;

log( "INFO: Elapsed time:", prettyMS( totalTime ) );
