import { WorkflowMetadata } from "../app/WorkflowMetadata.js";

import * as assert from "assert";

/**
 * Test the WorkflowMetadata object.
 */
describe( "WorkflowMetadata", function() {

  /**
   * Test constructing a new instance of the class.
   */
  describe( "#constructor", function() {
    it( "should throw an error if the parameter is not supplied", function() {
      assert.throws( function() {
        new WorkflowMetadata();

      }, TypeError );
    } );

    it( "should throw an error if the parameter is not a string", function() {
      assert.throws( function() {
        new WorkflowMetadata( new Object() );
      }, TypeError );
    } );

    it( "should throw an error if the parameter is an empty string", function() {
      assert.throws( function() {
        new WorkflowMetadata( "" );
      }, TypeError );
    } );

    it( "should return an object of the right type", function() {
      let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );

      assert.ok(
        metadata instanceof  WorkflowMetadata
      );
    } );
  } );

  /**
   * Test getting the file path.
   */
  describe( "#getFilePath", function() {
    it( "should return a string", function() {
      let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );

      assert.strictEqual( typeof metadata.getFilePath(), "string" );
    } );

    it( "should return a string matching what was supplied to the constructor", function() {
      let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );

      assert.strictEqual( metadata.getFilePath(), "./test/artefacts/uno.xaml" );
    } );
  } );

  /**
   * Test getting the file name.
   */
  describe( "#getFileName", function() {
    it( "should return a string", function() {
      let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );

      assert.strictEqual( typeof metadata.getFileName(), "string" );
    } );

    it( "should return a string matching the file supplied to the constructor", function() {
      let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );

      assert.strictEqual( metadata.getFileName(), "uno.xaml" );
    } );
  } );

  /**
   * Test setting the name of the workflow.
   */
  describe( "#setWorkflowName", function() {
    it( "should throw an error if the parameter is not supplied", function() {
      assert.throws( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.setWorkflowName();

      }, TypeError );
    } );

    it( "should throw an error if the parameter is not a string", function() {
      assert.throws( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.setWorkflowName( new Object() );
      }, TypeError );
    } );

    it( "should throw an error if the parameter is an empty string", function() {
      assert.throws( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.setWorkflowName( "" );
      }, TypeError );
    } );
  } );

  /**
   * Test getting the name of the workflow.
   */
  describe( "#getWorkflowName", function() {
    it( "should throw an error if the workflow name has not been set", function() {
      assert.throws( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.getWorkflowName();
      }, ReferenceError );
    } );

    it( "should return the same workflow name that is set", function() {
      let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
      const testWorkflowName = "This is a test workflow name.";
      metadata.setWorkflowName( testWorkflowName );
      assert.strictEqual( testWorkflowName, metadata.getWorkflowName() );
    } );
  } );

  /**
   * Test adding an argument.
   */
  describe( "#addArgument", function() {
    it( "should throw an error if the name parameter is not provided", function() {
      assert.throws( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.addArgument();
      }, TypeError );

      assert.throws( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.addArgument();
      }, /^TypeError: name/ );

      assert.throws( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.addArgument( "" );
      }, /^TypeError: name/ );
    } );

    it( "should throw an error if the direction parameter is not provided", function() {
      assert.throws( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.addArgument( "Name" );
      }, TypeError );

      assert.throws( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.addArgument( "Name" );
      }, /^TypeError: direction/ );

      assert.throws( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.addArgument( "Name", new Object() );
      }, /^TypeError: direction/ );
    } );

    it( "should throw an error if the direction parameter is invalid", function() {
      assert.throws( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.addArgument( "Name", "both" );
      }, TypeError );

      assert.throws( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.addArgument( "Name", "both" );
      }, /^TypeError: direction parameter must be one of/ );


      assert.doesNotThrow( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.addArgument( "Name", "InArgument", "type", "annotation", "defaultValue" );
      }, TypeError );

      assert.doesNotThrow( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.addArgument( "Name", "OutArgument", "type", "annotation", "defaultValue" );
      }, TypeError );

      assert.doesNotThrow( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.addArgument( "Name", "InOutArgument", "type", "annotation", "defaultValue" );
      }, TypeError );
    } );

    it( "should throw an error if the type parameter is not provided", function() {
      assert.throws( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.addArgument( "Name", "InArgument" );
      }, TypeError );

      assert.throws( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.addArgument( "Name", "InArgument" );
      }, /^TypeError: type/ );

      assert.throws( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.addArgument( "Name", "InArgument", new Object() );
      }, /^TypeError: type/ );
    } );

    it( "should throw an error if the annotation parameter is not provided", function() {
      assert.throws( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.addArgument( "Name", "InArgument", "string" );
      }, TypeError );

      assert.throws( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.addArgument( "Name", "InArgument", "string" );
      }, /^TypeError: annotation/ );

      assert.throws( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.addArgument( "Name", "InArgument", "string", new Object() );
      }, /^TypeError: annotation/ );

      assert.doesNotThrow( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.addArgument( "Name", "InArgument", "string", "", "" );
      }, /^TypeError: annotation/ );
    } );

    it( "should throw an error if the defaultValue parameter is not provided", function() {
      assert.throws( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.addArgument( "Name", "InArgument", "string", "" );
      }, TypeError );

      assert.throws( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.addArgument( "Name", "InArgument", "string", "" );
      }, /^TypeError: defaultValue/ );

      assert.throws( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.addArgument( "Name", "InArgument", "string", "", new Object() );
      }, /^TypeError: defaultValue/ );

      assert.doesNotThrow( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.addArgument( "Name", "InArgument", "string", "", "", "" );
      }, /^TypeError: defaultValue/ );
    } );

    it( "should store the new argument", function() {
      let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
      metadata.addArgument( "testArgument", "InArgument", "string", "An argument for testing", "Hello World!" );

      assert.strictEqual( metadata.arguments.size, 1 );

      assert.deepStrictEqual( metadata.arguments.get( "testArgument" ), {
        "name": "testArgument",
        "direction": "InArgument",
        "type": "string",
        "annotation": "An argument for testing",
        "defaultValue": "Hello World!"
      } );
    } );
  } );

  /**
   * Test adding an argument.
   */
  describe( "#getArguments", function() {
    it( "should return an empty map by default", function() {
      let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
      let workflowArguments = metadata.getArguments();

      assert.ok( workflowArguments instanceof Map );
      assert.strictEqual( workflowArguments.size, 0 );

    } );

    it( "should return a map of arguments that were added", function() {
      let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
      metadata.addArgument( "testArgument", "InArgument", "string", "An argument for testing", "Hello World!" );
      let workflowArguments = metadata.getArguments();

      assert.ok( workflowArguments instanceof Map );
      assert.strictEqual( workflowArguments.size, 1 );

      assert.deepStrictEqual( workflowArguments.get( "testArgument" ), {
        "name": "testArgument",
        "direction": "InArgument",
        "type": "string",
        "annotation": "An argument for testing",
        "defaultValue": "Hello World!"
      } );
    } );
  } );

  /**
   * Test setting the name of the workflow.
   */
  describe( "#setWorkflowAnnotation", function() {
    it( "should throw an error if the parameter is not supplied", function() {
      assert.throws( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.setWorkflowAnnotation();

      }, TypeError );
    } );

    it( "should throw an error if the parameter is not a string", function() {
      assert.throws( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.setWorkflowAnnotation( new Object() );
      }, TypeError );
    } );

    it( "should throw an error if the parameter is an empty string", function() {
      assert.throws( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.setWorkflowAnnotation( "" );
      }, TypeError );
    } );
  } );

  /**
   * Test getting the name of the workflow.
   */
  describe( "#getWorkflowAnnotation", function() {
    it( "should throw an error if the workflow name has not been set", function() {
      assert.throws( function() {
        let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
        metadata.getWorkflowAnnotation();
      }, ReferenceError );
    } );

    it( "should return the same workflow name that is set", function() {
      let metadata = new WorkflowMetadata( "./test/artefacts/uno.xaml" );
      const testWorkflowAnnotation = "This is a test workflow annotation.";
      metadata.setWorkflowAnnotation( testWorkflowAnnotation );
      assert.strictEqual( testWorkflowAnnotation, metadata.getWorkflowAnnotation() );
    } );
  } );
} );
