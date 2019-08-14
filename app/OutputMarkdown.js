import { WorkflowMetadata } from "./WorkflowMetadata.js";

import * as fs from "fs";
import * as path from "path";
import * as util from "util";

/**
 * Output the extracted metadata as a markdown formatted text file.
 */
export class OutputMarkdown {

  /**
   * Construct a new object.
   *
   * @param {string} outputPath Path to the root directory of the output folder.
   *
   * @throws {TypeError} Parameter outputPath is required and must be a string.
   * @throws {Error} If the output path does not exist.
   * @throws {Error} If the output path is not a directory.
   * @throws {Error} If the output path is not empty.
   *
   * @since 1.0.0
   */
  constructor( outputPath ) {

    if ( !outputPath || typeof outputPath !== "string" ) {
      throw new TypeError( "outputPath parameter is required and must be a string" );
    }

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if ( !fs.existsSync( outputPath ) ) {
      throw new Error( util.format( "The output path '%s' does not exist", outputPath ) );
    }

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    let fstat = fs.statSync( outputPath );
    if ( !fstat.isDirectory() ) {
      throw new Error( util.format( "The output path '%s' is not a directory", outputPath ) );
    }

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    let fileList = fs.readdirSync( outputPath );

    // Filter out hidden files like .gitignore
    fileList = fileList.filter( item => !( /(^|\/)\.[^/.]/g ).test( item ) );

    if ( fileList.length > 0 ) {
      throw new Error( util.format( "The output path '%s' is not an empty directory", outputPath ) );
    }

    this.outputPath = outputPath;

  }

  /**
   * Output the metadata as a markdown file.
   *
   * @param {WorkflowMetadata} metadata The metadata extracted from a workflow.
   *
   * @throws {TypeError} Parameter metadata is required and must be a WorkflowMetadata object.
   *
   * @since 1.0.0
   */
  writeFile( metadata ) {

    if ( !metadata || !( metadata instanceof WorkflowMetadata ) ) {
      throw new TypeError( "metadata parameter is required and must be a WorkflowMetadata object" );
    }

    let outputFilePath = path.join( this.outputPath, metadata.getWorkflowName() + ".md" );

    const content = [];

    // Build the content of the markdown file.
    content.push( util.format( "# %s\n\n", metadata.getWorkflowName() ) );
    content.push( util.format( "%s\n\n", metadata.getWorkflowAnnotation() ) );
    content.push( util.format( "## Arguments\n\n" ) );

    let workflowArguments = metadata.getArguments();

    if ( workflowArguments.size === 0 ) {
      content.push( "This activity does not define any arguments.\n" );
    } else {
      content.push( "| Name | Purpose | Direction | Type | Default Value |\n" );
      content.push( "| ---- | ------- | --------- | ---- | ------------- |\n" );

      workflowArguments.forEach( function( arg ) {
        content.push(
          util.format(
            "|%s|%s|%s|%s|%s|\n",
            arg.name,
            arg.annotation,
            arg.direction.replace( "Argument", "" ),
            arg.type,
            arg.defaultValue
          )
        );
      } );
    }

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.writeFileSync( outputFilePath, content.join( "" ) );
  }

}
