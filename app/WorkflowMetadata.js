import * as path from "path";

/**
 * Store the documentation extracted from a XAML file.
 */
export class WorkflowMetadata {

  /**
   * Construct a new object.
   *
   * @param {string} filePath Path to the root directory of the UiPath project.
   * @throws {TypeError} Parameter projectPath is required and must be a string.
   *
   * @since 1.0.0
   */
  constructor( filePath ) {

    if ( !filePath || typeof filePath !== "string" ) {
      throw new TypeError( "filePath parameter is required and must be a string" );
    }

    this.filePath = filePath;

    this.validArgumentDirections = [
      "InArgument",
      "OutArgument",
      "InOutArgument"
    ];

    this.arguments = new Map();

  }

  /**
   * Get the path to the XAML file.
   *
   * @returns {string} The full path to the XAML file.
   *
   * @since 1.0.0
   */
  getFilePath() {
    return this.filePath;
  }

  /**
   * Get the name of the XAML file.
   *
   * @returns {string} The file name component of the path to the XAML file.
   *
   * @since 1.0.0
   */
  getFileName() {
    return path.basename( this.filePath );
  }

  /**
   * Add the name of the workflow to the metadata.
   *
   * @param {string} workflowName The name of the workflow.
   *
   * @since 1.0.0
   */
  setWorkflowName( workflowName ) {
    if ( !workflowName || typeof workflowName !== "string" ) {
      throw new TypeError( "workflowName parameter is required and must be a string" );
    }

    this.workflowName = workflowName;
  }

  /**
   * Return the name of the workflow.
   *
   * @returns {string} The name of the workflow.
   * @throws {ReferenceError} If the workflow name has not been set.
   * @since 1.0.0
   */
  getWorkflowName() {
    if ( typeof this.workflowName === "undefined" ) {
      throw new ReferenceError( "The workflowName property has not been set." );
    }
    return this.workflowName;
  }

  /**
   * Add an argument to the list of arguments defined in the workflow.
   *
   * @param {string} name The name of the argument.
   * @param {string} direction The direction of the argument (in|out|in/out).
   * @param {string} type The data type of the argument.
   * @param {string} annotation The annotation describing the argument.
   * @param {string} defaultValue The default value.
   */
  addArgument( name, direction, type, annotation, defaultValue ) {

    if ( !name || typeof name !== "string" ) {
      throw new TypeError( "name parameter is required and must be a string" );
    }

    if ( !direction || typeof direction !== "string" ) {
      throw new TypeError( "direction parameter is required and must be a string" );
    }

    if ( !this.validArgumentDirections.includes( direction ) ) {
      throw new TypeError(
        "direction parameter must be one of " + this.validArgumentDirections.join( "|" )
      );
    }

    if ( !type || typeof type !== "string" ) {
      throw new TypeError( "type parameter is required and must be a string" );
    }

    if ( typeof annotation !== "string" ) {
      throw new TypeError( "annotation parameter is required and must be a string" );
    }

    if ( typeof defaultValue !== "string" ) {
      throw new TypeError( "defaultValue parameter is required and must be a string" );
    }

    this.arguments.set( name, {
      "name": name,
      "direction": direction,
      "type": type,
      "annotation": annotation,
      "defaultValue": defaultValue
    } );
  }

  /**
   * Get the list of arguments.
   *
   * @returns {Map} A map of argument objects.
   */
  getArguments() {
    return this.arguments;
  }

  /**
   * Add the annotation / description of the workflow to the metadata.
   *
   * @param {string} workflowAnnotation The annotation for the workflow.
   *
   * @since 1.0.0
   */
  setWorkflowAnnotation( workflowAnnotation ) {
    if ( !workflowAnnotation || typeof workflowAnnotation !== "string" ) {
      throw new TypeError( "workflowAnnotation parameter is required and must be a string" );
    }

    this.workflowAnnotation = workflowAnnotation;
  }

  /**
   * Return the annotation of the workflow.
   *
   * @returns {string} The annotation of the workflow.
   * @throws {ReferenceError} If the workflow annotation has not been set.
   * @since 1.0.0
   */
  getWorkflowAnnotation() {
    if ( typeof this.workflowAnnotation === "undefined" ) {
      throw new ReferenceError( "The workflowAnnotation property has not been set." );
    }
    return this.workflowAnnotation;
  }

}
