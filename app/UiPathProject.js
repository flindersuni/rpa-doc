import * as path from "path";
import * as fs from "fs";

/**
 * Represents the information contained in the UiPath project.json file.
 * [UiPath documentation]{@link https://studio.uipath.com/docs/about-the-projectjson-file} on this file.
 */
export class UiPathProject {

  /**
   * Construct a new object.
   *
   * Parse the project.json file that contains information about the UiPath project. To be exposed by the methods of this class.
   *
   * @param {string} projectPath Path to the root directory of the UiPath project.
   * @throws {TypeError} Parameter projectPath is required and must be a string.
   * @throws {Error} Reading or parsing the project.json file fails.
   * @since 1.0.0
   */
  constructor( projectPath ) {
    if ( !projectPath || typeof projectPath !== "string" ) {
      throw new TypeError( "projectPath parameter is required and must be a string" );
    }

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    this.fileContents = JSON.parse( fs.readFileSync( path.join( projectPath, "project.json" ) ) );

    this.projectPath = projectPath;
  }

  /**
   * Return the name of the UiPath project.
   *
   * @returns {string} The Name of the UiPath project or an empty string if it is not found.
   * @since 1.0.0
   */
  getName() {
    if ( typeof( this.fileContents.name ) === "undefined" ) {
      return "";
    } else {
      return this.fileContents.name.toString();
    }
  }

  /**
   * Return the description of the UiPath project.
   *
   * @returns {string} The description of the UiPath project or an empty string if it is not found.
   * @since 1.0.0
   */
  getDescription() {
    if ( typeof( this.fileContents.description ) === "undefined" ) {
      return "";
    } else {
      return this.fileContents.description.toString();
    }
  }

  /**
   * Return the project version of the UiPath project.
   *
   * @returns {string} The project version of the UiPath project or an empty string if it is not found.
   * @since 1.0.0
   */
  getVersion() {
    if ( typeof( this.fileContents.projectVersion ) === "undefined" ) {
      return "";
    } else {
      return this.fileContents.projectVersion.toString();
    }
  }

  /**
   * Return a flag indicating if this project is a library or not.
   *
   * @returns {boolean} True if the project is a library, false if it is not.
   * @since 1.0.0
   */
  isLibrary() {
    if ( typeof( this.fileContents.projectType ) === "undefined" ) {
      return false;
    } else if ( this.fileContents.projectType === "Library" ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Return an array of workflows that have been marked as private.
   * These workflows are not exposed by a library.
   *
   * @returns {Array} An array of workflow file names.
   * @since 1.0.0
   */
  getPrivateWorkflows() {
    if ( typeof( this.fileContents.libraryOptions ) === "undefined" ) {
      return [];
    } else if (  typeof( this.fileContents.libraryOptions.privateWorkflows ) === "undefined" ) {
      return [];
    } else if ( !Array.isArray( this.fileContents.libraryOptions.privateWorkflows ) ) { // eslint-disable-line max-len
      return [];
    } else {
      return this.fileContents.libraryOptions.privateWorkflows;
    }
  }

  /**
   * Return a map of NuGet packages that are dependencies for the UiPath project.
   *
   * @returns {Map} A map of project dependencies.
   * @since 1.0.0
   */
  getDependencies() {
    return new Map( Object.entries( this.fileContents.dependencies ) );
  }

  /**
   * Return the full project path.
   *
   * @returns {string} The full normalised project path.
   * @since 1.0.0
   */
  getProjectPath() {

    // Cache the full project path for performance reasons.
    if ( typeof this.fullProjectPath === "undefined" ) {
      this.fullProjectPath = path.resolve( this.projectPath );
    }

    return this.fullProjectPath;
  }

  /**
   * Return an array of XAML files found in the UiPath project folder.
   *
   * @param {boolean} recursive Find XAML files in the project folder and sub folders.
   * @param {boolean} publicOnly Only return public files.
   *
   * @returns {Array} An array of XAML files.
   * @since 1.0.0
   */
  getXamlFiles( recursive = false, publicOnly = false ) {

    // Get a list of files in the target directory.
    let fileList = [];

    if ( recursive === false ) {

      // Only get the top level workflows.

      fileList = fs.readdirSync( this.projectPath ); // eslint-disable-line security/detect-non-literal-fs-filename

      fileList = fileList.map( f => path.join( this.getProjectPath(), f ) );
    } else {

      // Get all workflows.

      let tmp = [ this.projectPath ];

      do {
        let filePath = tmp.pop();
        let fileStat = fs.lstatSync( filePath ); // eslint-disable-line security/detect-non-literal-fs-filename

        if ( fileStat.isDirectory() ) {
          fs // eslint-disable-line security/detect-non-literal-fs-filename
            .readdirSync( filePath )
            .forEach( f => tmp.push( path.join( filePath, f ) ) );
        } else if ( fileStat.isFile() ) {
          fileList.push( path.join( this.projectPath, filePath ) );
        }
      } while ( tmp.length !== 0 );
    }

    // Filter the list of files to only XAML files.
    fileList = fileList.filter( function( element ) {
      return path.extname( element ) === ".xaml" && path.basename( element ).startsWith( "~" ) === false;
    } );

    // Only return XAML files for public workflows if required.
    if ( publicOnly === true ) {
      let privateWorkflows = this.getPrivateWorkflows();

      privateWorkflows.forEach( function( privateWorkflow ) {
        fileList = fileList.filter( function( xamlFile ) {
          return !xamlFile.endsWith( privateWorkflow );
        } );
      } );
    }

    return fileList;
  }
}
