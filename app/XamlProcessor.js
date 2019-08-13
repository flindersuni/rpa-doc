import { WorkflowMetadata } from "./WorkflowMetadata.js";

import { DOMParser } from "xmldom";
import * as xpath from "xpath";
import * as fs from "fs";
import * as util from "util";

/**
 * The DomParser object as part of the [xmldom]{@link https://www.npmjs.com/package/xmldom} package.
 *
 * @typedef {object} DomParser
 */

/**
 * Contains a variety of functions to extract information from the XAML files.
 */
export class XamlProcessor {

  /**
   * Construct a new object.
   *
   * @since 1.0.0
   */
  constructor() {

    this.xamlNamespaces = {
      "xaml": "http://schemas.microsoft.com/netfx/2009/xaml/activities",
      "x": "http://schemas.microsoft.com/winfx/2006/xaml",
      "sap2010": "http://schemas.microsoft.com/netfx/2010/xaml/activities/presentation",
      "ui": "http://schemas.uipath.com/workflow/activities",
      "this": "clr-namespace:"
    };

    this.xpath = xpath.useNamespaces(
      this.xamlNamespaces
    );
  }

  /**
   * Get the metadata defined in the XAML file.
   *
   * @param {string} filePath The path to the XAML file.
   *
   * @returns {WorkflowMetadata} A new workflow metadata object.
   *
   * @throws {TypeError} Parameter filePath is required and must be a string.
   * @since 1.0.0
   */
  getMetadata( filePath ) {

    if ( !filePath || typeof( filePath ) !== "string" ) {
      throw new TypeError( "filePath parameter is required and must be a string" );
    }

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    let xamlContent = fs.readFileSync( filePath );
    xamlContent = xamlContent.toString();

    // Parse the XML into a document for processing.
    const doc = new DOMParser().parseFromString( xamlContent );

    // Initialise a new workflow metadata object.
    let metadata = new WorkflowMetadata( filePath );

    // Add the workflow name.
    metadata.setWorkflowName( this.getWorkflowName( doc ) );

    // Add the workflow annotation.
    metadata.setWorkflowAnnotation( this.getWorkflowAnnotation( doc ) );

    // Add the workflow arguments.
    let workflowArguments = this.getWorkflowArguments( doc );

    workflowArguments.forEach( function( arg ) {
      metadata.addArgument(
        arg.name,
        arg.direction,
        arg.type,
        arg.annotation,
        arg.defaultValue
      );
    } );

    return metadata;
  }

  /**
   * Get the name of the workflow from the XAML code.
   *
   * @param {DomParser} xamlDoc The XAML code represented as an XML DOMParser object.
   *
   * @returns {string} The name of the workflow.
   * @throws {TypeError} Parameter xamlDoc is required and must be a DomParser object.
   * @since 1.0.0
   */
  getWorkflowName( xamlDoc ) {

    if ( !xamlDoc || typeof( xamlDoc ) !== "object" ) {
      throw new TypeError( "xamlDoc parameter is required and must be an instance of DOMParser object" );
    }

    // Get the name of the workflow
    let workflowElements = this.xpath( "/xaml:Activity/xaml:Flowchart", xamlDoc );

    if ( workflowElements.length === 0 ) {
      workflowElements = this.xpath( "/xaml:Activity/xaml:Sequence", xamlDoc );
    }

    return workflowElements[ 0 ].getAttribute( "DisplayName" );
  }

  /**
   * Get the annotation of the workflow from the XAML code.
   *
   * @param {DomParser} xamlDoc The XAML code represented as an XML DOMParser object.
   *
   * @returns {string} The annotation of the workflow.
   * @throws {TypeError} Parameter xamlDoc is required and must be a DomParser object.
   * @since 1.0.0
   */
  getWorkflowAnnotation( xamlDoc ) {

    if ( !xamlDoc || typeof( xamlDoc ) !== "object" ) {
      throw new TypeError( "xamlDoc parameter is required and must be an instance of DOMParser object" );
    }

    // Get the name of the workflow
    let workflowElements = this.xpath( "/xaml:Activity/xaml:Flowchart", xamlDoc );

    if ( workflowElements.length === 0 ) {
      workflowElements = this.xpath( "/xaml:Activity/xaml:Sequence", xamlDoc );
    }

    if ( workflowElements[ 0 ].hasAttribute( "sap2010:Annotation.AnnotationText" ) === true ) {
      return workflowElements[ 0 ].getAttribute( "sap2010:Annotation.AnnotationText" );
    } else {
      return "";
    }
  }

  /**
   * Get the list of arguments from the XAML code.
   *
   * @param {DomParser} xamlDoc The XAML code represented as an XML DOMParser object.
   *
   * @returns {Array} The list of arguments defined in the workflow.
   * @throws {TypeError} Parameter xamlDoc is required and must be a DomParser object.
   * @since 1.0.0
   */
  getWorkflowArguments( xamlDoc ) {

    if ( !xamlDoc || typeof( xamlDoc ) !== "object" ) {
      throw new TypeError( "xamlDoc parameter is required and must be an instance of DOMParser object" );
    }

    let xamlArguments = [];

    let workflowArgumentElements = this.xpath( "/xaml:Activity/x:Members/x:Property", xamlDoc );

    let self = this;

    if ( workflowArgumentElements.length > 0 ) {
      workflowArgumentElements.forEach( function( argument ) {

        // Get the name of the argument which is always available.
        let argumentName = argument.getAttribute( "Name" );

        // Get the type attribute which is always available.
        let typeAttribute = argument.getAttribute( "Type" );
        let argumentTypeInfo = self.parseArgumentTypeAttribute( typeAttribute );

        // Get the annotation for the argument, which may not be available.
        let argumentAnnotation = "";

        if ( argument.hasAttribute( "sap2010:Annotation.AnnotationText" ) ) {
          argumentAnnotation = argument.getAttribute( "sap2010:Annotation.AnnotationText" );
        }

        // Get the default value if one has been specified.
        let defaultValue = self.getArgumentDefaultValue( xamlDoc, argumentName );

        let argumentMeta = {
          "name": argumentName,
          "direction": argumentTypeInfo[ 0 ],
          "type": argumentTypeInfo[ 1 ],
          "annotation": argumentAnnotation,
          "defaultValue": defaultValue
        };

        xamlArguments.push( argumentMeta );
      } );
    }

    return xamlArguments;

  }

  /**
   * Parse the argument type XAML element attribute.
   *
   * @param {string} argumentType The string contained in the element attribute.
   *
   * @returns {Array} The list of elements parse from the attribute string.
   * @throws {TypeError} Parameter argumentType is required and must be a DomParser object.
   * @since 1.0.0
   */
  parseArgumentTypeAttribute( argumentType ) {

    if ( !argumentType || typeof( argumentType ) !== "string" ) {
      throw new TypeError( "argumentType parameter is required and must be a string" );
    }

    // Determine the direction of the argument.
    let direction = argumentType.slice( 0, argumentType.indexOf( "(" ) );

    // Determine the data type of the argument.
    let dataType = argumentType.slice( ( argumentType.indexOf( ":" ) + 1 ), argumentType.indexOf( ")" ) );

    let data = [ direction, dataType ];

    return data;
  }

  /**
   * Get the name of the underlying class for this activity.
   *
   * @param {DomParser} xamlDoc The XAML code represented as an XML DOMParser object.
   *
   * @returns {string} The name of the underlying CLR class.
   * @throws {TypeError} Parameter xamlDoc is required and must be a DomParser object.
   * @since 1.0.0
   */
  getClassName( xamlDoc ) {
    if ( !xamlDoc || typeof( xamlDoc ) !== "object" ) {
      throw new TypeError( "xamlDoc parameter is required and must be an instance of DOMParser object" );
    }

    let activityElement = this.xpath( "/xaml:Activity", xamlDoc )[ 0 ];

    return activityElement.getAttribute( "x:Class" );

  }

  /**
   * Get the name of the underlying class for this activity.
   *
   * @param {DomParser} xamlDoc The XAML code represented as an XML DOMParser object.
   * @param {string} argumentName The name of the argument.
   *
   * @returns {string} The default value for the argument if it is specified.
   * @throws {TypeError} Parameter xamlDoc is required and must be a DomParser object.
   * @since 1.0.0
   */
  getArgumentDefaultValue( xamlDoc, argumentName ) {

    if ( !xamlDoc || typeof( xamlDoc ) !== "object" ) {
      throw new TypeError( "xamlDoc parameter is required and must be an instance of DOMParser object" );
    }

    if ( !argumentName || typeof( argumentName ) !== "string" ) {
      throw new TypeError( "argumentName parameter is required and must be a string" );
    }

    let className = this.getClassName( xamlDoc );
    let activityElement = this.xpath( "/xaml:Activity", xamlDoc )[ 0 ];

    let attributeName = util.format( "this:%s.%s", className, argumentName );

    if ( activityElement.hasAttribute( attributeName ) ) {
      return activityElement.getAttribute( attributeName );
    } else {
      return "";
    }
  }

}
