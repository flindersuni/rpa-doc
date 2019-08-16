const startTime = process.hrtime.bigint();

import { UiPathProject } from "./app/UiPathProject.js";

import commander from "commander";
import chalk from "chalk";
import path from "path";
import prettyMS from "pretty-ms";
import { XamlProcessor } from "./app/XamlProcessor.js";
import { OutputMarkdown } from "./app/OutputMarkdown.js";

const appPackage = require( "./package.json" );

const program = new commander.Command();
const log = console.log;

const error = chalk.bold.red;
const warn = chalk.bold.yellow;
const success = chalk.bold.green;

// Define basic program metadata.
program.version( appPackage.version, "-v, --version" )
  .description( "Generate documentation for UiPath projects developed by the Flinders RPA team" )
  .option( "-i, --input <required>", "Path to UiPath project directory" )
  .option( "-o, --output <required>", "Path to the documentation directory" )
  .option( "-c, --clean", "Clean output directory prior to writing new files" )
  .option( "-x, --xaml-names", "Use XAML file name to derive document file name" );

// Parse the command line parameters.
program.parse( process.argv );

// Check for required input path option.
// If missing assume current working directory.
if ( typeof( program.input ) === "undefined" ) {
  program.input = process.cwd();
}

// Check for the required output path option.
if ( typeof( program.output ) === "undefined" ) {
  log( error( "Error: " ) + "The --output option is required." );
  program.outputHelp();
  process.exit( 1 );
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

if ( !path.isAbsolute( program.output ) ) {
  program.output = path.resolve( process.cwd().toString(), program.output );
} else {

  // Normalise the path for sanity.
  program.output = path.normalize( program.output );
}

// Get some information about the project.
let projectInfo = null;
try {
  projectInfo = new UiPathProject( program.input );
} catch ( err ) {
  log( error( "Error: " ) + "Unable to read 'project.json' file." );
  process.exit( 1 );
}

// Output some helpful information.
log( "INFO: Project name: %s", projectInfo.getName() );
log( "INFO: Project version: %s", projectInfo.getVersion() );

if ( projectInfo.isLibrary() !== true ) {
  log( warn( "WARN:" ) + " This app works best with UiPath Library projects" );
}

// Collect all of the metadata.
let workflowMeta = [];
let workflowFiles = projectInfo.getXamlFiles( true, true );
let processor = new XamlProcessor();

workflowFiles.forEach( function( workflowFile ) {
  let meta = processor.getMetadata( workflowFile );

  // Use file names derived from the UiPath project path.
  if ( program.xamlNames ) {
    meta.setProjectFilePath( projectInfo.getProjectPath() );
  }

  workflowMeta.push( meta );
} );

log( "INFO: Metadata collected on %s public workflow files.", workflowMeta.length );

let output = null;
try {
  output = new OutputMarkdown( program.output, program.clean );
} catch ( err ) {
  log( error( "Error: " ) + err.message );
  process.exit( 1 );
}

// Write the documentation.
workflowMeta.forEach( function( meta ) {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  output.writeFile( meta );
} );

const endTime = process.hrtime.bigint();
const totalTime = Number( endTime - startTime ) * 1e-6;

log( "INFO: Elapsed time:", prettyMS( totalTime ) );
log( success( "Markdown files successfully created." ) );
