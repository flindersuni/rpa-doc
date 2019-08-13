import { XamlProcessor } from "../app/XamlProcessor.js";
import { WorkflowMetadata } from "../app/WorkflowMetadata.js";

import { DOMParser } from "xmldom";

import * as assert from "assert";
import * as fs from "fs";

/**
 * Test the XamlProcessor object.
 */
describe( "XamlProcessor", function() {

  /**
   * Test constructing a new instance of the class.
   */
  describe( "#constructor", function() {
    it( "should not throw any errors", function() {
      new XamlProcessor();
    } );

    it( "should return an object of the right type", function() {
      let processor = new XamlProcessor();

      assert.ok(
        processor instanceof  XamlProcessor
      );
    } );
  } );

  /**
   * Test extracting metadata from a XAML file.
   */
  describe( "#getMetadata", function() {
    it( "should throw an error if the parameter is not supplied", function() {
      assert.throws( function() {
        let processor = new XamlProcessor();

         processor.getMetadata();

      }, TypeError );
    } );

    it( "should throw an error if the parameter is not a string", function() {
      assert.throws( function() {
        let processor = new XamlProcessor();

        processor.getMetadata( new Object() );

      }, TypeError );
    } );

    it( "should throw an error if the parameter is an empty string", function() {
      assert.throws( function() {
        let processor = new XamlProcessor();

        processor.getMetadata( "" );

      }, TypeError );
    } );

    it( "should not throw an error if the parameter is a non empty string", function() {
      assert.doesNotThrow( function() {
        let processor = new XamlProcessor();

        processor.getMetadata( "./test/artefacts/uno.xaml" );

      }, TypeError );
    } );

    it( "should return a WorkflowMetadata object", function() {
      let processor = new XamlProcessor();

      let metadata = processor.getMetadata( "./test/artefacts/uno.xaml" );

      assert.ok( metadata instanceof WorkflowMetadata );
    } );

    it( "should return a WorkflowMetadata object with the correct information", function() {
      let processor = new XamlProcessor();

      let metadata = processor.getMetadata( "./test/artefacts/uno.xaml" );

      assert.strictEqual( "uno", metadata.getWorkflowName() );

      assert.strictEqual(
        "This test XAML file is used as an artefact for the majority of unit tests",
        metadata.getWorkflowAnnotation()
      );

      let argMap = metadata.getArguments();

      assert.ok( argMap.size === 4 );

      // Define the expected arguments.
      let expectedArgs = [
        {
          "name": "Ichi",
          "direction": "InArgument",
          "type": "String",
          "annotation": "First argument using Japanese numbers.",
          "defaultValue": "A default string value"
        },
        {
          "name": "Ni",
          "direction": "InArgument",
          "type": "String",
          "annotation": "Second argument using Japanese numbers.",
          "defaultValue": ""
        },
        {
          "name": "San",
          "direction": "InArgument",
          "type": "String",
          "annotation": "Third argument using Japanese numbers.",
          "defaultValue": ""
        },
        {
          "name": "Shi",
          "direction": "InArgument",
          "type": "DataTable",
          "annotation": "Fourth argument using Japanese numbers.",
          "defaultValue": ""
        }
      ];

      expectedArgs.forEach( function( expectedArg ) {

        assert.ok( argMap.has( expectedArg.name ) );

        let testArg = argMap.get( expectedArg.name );

        assert.strictEqual( testArg.name, expectedArg.name );
        assert.strictEqual( testArg.direction, expectedArg.direction );
        assert.strictEqual( testArg.type, expectedArg.type );
        assert.strictEqual( testArg.annotation, expectedArg.annotation );
        assert.strictEqual( testArg.defaultValue, expectedArg.defaultValue );

      } );

    } );
  } );

  /**
   * Test getting the name of a workflow.
   */
  describe( "#getWorkflowName", function() {
    it( "should throw an error if the parameter is not supplied", function() {
      assert.throws( function() {
        let processor = new XamlProcessor();

         processor.getWorkflowName();

      }, TypeError );
    } );

    it( "should throw an error if the parameter is not the correct type", function() {
      assert.throws( function() {
        let processor = new XamlProcessor();

        processor.getWorkflowName( "xamlDocument" );

      }, TypeError );
    } );

    it( "should not throw an error if the parameter is not the correct type", function() {
      assert.doesNotThrow( function() {
        let processor = new XamlProcessor();

        let xamlContent = fs.readFileSync( "./test/artefacts/uno.xaml" );
        xamlContent = xamlContent.toString();

        const doc = new DOMParser().parseFromString( xamlContent );

        processor.getWorkflowName( doc );

      }, TypeError );
    } );

    it( "should return the correct workflow name", function() {

      let processor = new XamlProcessor();

      let xamlContent = fs.readFileSync( "./test/artefacts/uno.xaml" );
      xamlContent = xamlContent.toString();

      let doc = new DOMParser().parseFromString( xamlContent );

      assert.strictEqual( "uno", processor.getWorkflowName( doc ) );

      xamlContent = fs.readFileSync( "./test/artefacts/sub-folder/dos.xaml" );
      xamlContent = xamlContent.toString();

      doc = new DOMParser().parseFromString( xamlContent );

      assert.strictEqual( "dos", processor.getWorkflowName( doc ) );

    } );
  } );

  /**
   * Test getting the annotation of a workflow.
   */
  describe( "#getWorkflowAnnotation", function() {
    it( "should throw an error if the parameter is not supplied", function() {
      assert.throws( function() {
        let processor = new XamlProcessor();

         processor.getWorkflowAnnotation();

      }, TypeError );
    } );

    it( "should throw an error if the parameter is not the correct type", function() {
      assert.throws( function() {
        let processor = new XamlProcessor();

        processor.getWorkflowAnnotation( "xamlDocument" );

      }, TypeError );
    } );

    it( "should not throw an error if the parameter is not the correct type", function() {
      assert.doesNotThrow( function() {
        let processor = new XamlProcessor();

        let xamlContent = fs.readFileSync( "./test/artefacts/uno.xaml" );
        xamlContent = xamlContent.toString();

        const doc = new DOMParser().parseFromString( xamlContent );

        processor.getWorkflowAnnotation( doc );

      }, TypeError );
    } );

    it( "should return the correct workflow annotation", function() {

      let processor = new XamlProcessor();

      let xamlContent = fs.readFileSync( "./test/artefacts/uno.xaml" );
      xamlContent = xamlContent.toString();

      let doc = new DOMParser().parseFromString( xamlContent );

      assert.strictEqual(
        "This test XAML file is used as an artefact for the majority of unit tests",
        processor.getWorkflowAnnotation( doc )
      );

      xamlContent = fs.readFileSync( "./test/artefacts/sub-folder/dos.xaml" );
      xamlContent = xamlContent.toString();

      doc = new DOMParser().parseFromString( xamlContent );

      assert.strictEqual( "", processor.getWorkflowAnnotation( doc ) );

    } );
  } );

  /**
   * Test getting the list of arguments.
   */
  describe( "#getWorkflowArguments", function() {
    it( "should throw an error if the parameter is not supplied", function() {
      assert.throws( function() {
        let processor = new XamlProcessor();

         processor.getWorkflowArguments();

      }, TypeError );
    } );

    it( "should throw an error if the parameter is not the correct type", function() {
      assert.throws( function() {
        let processor = new XamlProcessor();

        processor.getWorkflowArguments( "xamlDocument" );

      }, TypeError );
    } );

    it( "should not throw an error if the parameter is the correct type", function() {
      assert.doesNotThrow( function() {
        let processor = new XamlProcessor();

        let xamlContent = fs.readFileSync( "./test/artefacts/uno.xaml" );
        xamlContent = xamlContent.toString();

        const doc = new DOMParser().parseFromString( xamlContent );

        processor.getWorkflowArguments( doc );

      }, TypeError );
    } );

    it( "should return the correct number of arguments", function() {

      let processor = new XamlProcessor();

      let xamlContent = fs.readFileSync( "./test/artefacts/uno.xaml" );
      xamlContent = xamlContent.toString();

      let doc = new DOMParser().parseFromString( xamlContent );

      let xamlArguments = processor.getWorkflowArguments( doc );

      assert.ok( xamlArguments.length === 4 );

    } );

    it( "should return the correct arguments", function() {
      let processor = new XamlProcessor();

      let xamlContent = fs.readFileSync( "./test/artefacts/uno.xaml" );
      xamlContent = xamlContent.toString();

      let doc = new DOMParser().parseFromString( xamlContent );

      let xamlArguments = processor.getWorkflowArguments( doc );

      assert.deepStrictEqual(
        xamlArguments[ 0 ],
        {
          "name": "Ichi",
          "direction": "InArgument",
          "type": "String",
          "annotation": "First argument using Japanese numbers.",
          "defaultValue": "A default string value"
        }
      );

      assert.deepStrictEqual(
        xamlArguments[ 1 ],
        {
          "name": "Ni",
          "direction": "InArgument",
          "type": "String",
          "annotation": "Second argument using Japanese numbers.",
          "defaultValue": ""
        }
      );

      assert.deepStrictEqual(
        xamlArguments[ 2 ],
        {
          "name": "San",
          "direction": "InArgument",
          "type": "String",
          "annotation": "Third argument using Japanese numbers.",
          "defaultValue": ""
        }
      );

      assert.deepStrictEqual(
        xamlArguments[ 3 ],
        {
          "name": "Shi",
          "direction": "InArgument",
          "type": "DataTable",
          "annotation": "Fourth argument using Japanese numbers.",
          "defaultValue": ""
        }
      );
    } );

  } );

  /**
   * Test parsing arguments to determine the type and direction.
   */
  describe( "#parseArgumentTypeAttribute", function() {
    it( "should throw an error if the parameter is not supplied", function() {
      assert.throws( function() {
        let processor = new XamlProcessor();

        processor.parseArgumentTypeAttribute();

      }, TypeError );
    } );

    it( "should throw an error if the parameter is the wrong type", function() {
      assert.throws( function() {
        let processor = new XamlProcessor();

        processor.parseArgumentTypeAttribute( new Object() );

      }, TypeError );
    } );

    it( "should return an array of two elements", function() {
      let processor = new XamlProcessor();

      let elements = processor.parseArgumentTypeAttribute( "InArgument(sd:DataTable)" );

      assert.ok( Array.isArray( elements ) );

      assert.strictEqual( elements.length, 2 );
    } );

    it( "should extract the right information", function() {
      let processor = new XamlProcessor();

      let elements = processor.parseArgumentTypeAttribute( "InArgument(sd:DataTable)" );

      assert.strictEqual( elements[ 0 ], "InArgument" );
      assert.strictEqual( elements[ 1 ], "DataTable" );

      elements = processor.parseArgumentTypeAttribute( "InArgument(x:String)" );

      assert.strictEqual( elements[ 0 ], "InArgument" );
      assert.strictEqual( elements[ 1 ], "String" );

      elements = processor.parseArgumentTypeAttribute( "OutArgument(x:Boolean)" );

      assert.strictEqual( elements[ 0 ], "OutArgument" );
      assert.strictEqual( elements[ 1 ], "Boolean" );

      elements = processor.parseArgumentTypeAttribute( "InOutArgument(x:String)" );

      assert.strictEqual( elements[ 0 ], "InOutArgument" );
      assert.strictEqual( elements[ 1 ], "String" );
    } );
  } );

  /**
   * Test getting the name of the underlying CLR class.
   */
  describe( "#getClassName", function() {
    it( "should throw an error if the parameter is not supplied", function() {
      assert.throws( function() {
        let processor = new XamlProcessor();

         processor.getClassName();

      }, TypeError );
    } );

    it( "should throw an error if the parameter is not the correct type", function() {
      assert.throws( function() {
        let processor = new XamlProcessor();

        processor.getClassName( "xamlDocument" );

      }, TypeError );
    } );

    it( "should not throw an error if the parameter is the correct type", function() {
      assert.doesNotThrow( function() {
        let processor = new XamlProcessor();

        let xamlContent = fs.readFileSync( "./test/artefacts/uno.xaml" );
        xamlContent = xamlContent.toString();

        const doc = new DOMParser().parseFromString( xamlContent );

        processor.getClassName( doc );

      }, TypeError );
    } );

    it( "should return the correct class name", function() {
      let processor = new XamlProcessor();

        let xamlContent = fs.readFileSync( "./test/artefacts/uno.xaml" );
        xamlContent = xamlContent.toString();

        let doc = new DOMParser().parseFromString( xamlContent );

        let className = processor.getClassName( doc );

        assert.strictEqual( className, "uno" );

        xamlContent = fs.readFileSync( "./test/artefacts/sub-folder/dos.xaml" );
        xamlContent = xamlContent.toString();

        doc = new DOMParser().parseFromString( xamlContent );

        className = processor.getClassName( doc );

        assert.strictEqual( className, "dos" );
    } );
  } );

  /**
   * Test getting the default value for an argument.
   */
  describe( "#getArgumentDefaultValue", function() {
    it( "should throw an error if the xamlDoc parameter is not supplied", function() {
      assert.throws( function() {
        let processor = new XamlProcessor();

         processor.getArgumentDefaultValue();

      }, TypeError );
    } );

    it( "should throw an error if the xamlDoc parameter is not the correct type", function() {
      assert.throws( function() {
        let processor = new XamlProcessor();

        processor.getArgumentDefaultValue( "xamlDocument" );

      }, TypeError );
    } );

    it( "should throw an error if the argumentName parameter is not supplied", function() {
      assert.throws( function() {
        let processor = new XamlProcessor();

        let xamlContent = fs.readFileSync( "./test/artefacts/uno.xaml" );
        xamlContent = xamlContent.toString();

        const doc = new DOMParser().parseFromString( xamlContent );

        processor.getArgumentDefaultValue( doc );

      }, TypeError );
    } );

    it( "should throw an error if the argumentName parameter is not the correct type", function() {
      assert.throws( function() {
        let processor = new XamlProcessor();

        let xamlContent = fs.readFileSync( "./test/artefacts/uno.xaml" );
        xamlContent = xamlContent.toString();

        const doc = new DOMParser().parseFromString( xamlContent );

        processor.getArgumentDefaultValue( doc, new Object() );

      }, TypeError );
    } );

    it( "should not throw an error if the parameters are correct", function() {
      assert.doesNotThrow( function() {
        let processor = new XamlProcessor();

        let xamlContent = fs.readFileSync( "./test/artefacts/uno.xaml" );
        xamlContent = xamlContent.toString();

        const doc = new DOMParser().parseFromString( xamlContent );

        processor.getArgumentDefaultValue( doc, "ArgumentName" );

      }, TypeError );
    } );

    it( "should return the default value for an argument when one is specified", function() {
      let processor = new XamlProcessor();

        let xamlContent = fs.readFileSync( "./test/artefacts/uno.xaml" );
        xamlContent = xamlContent.toString();

        const doc = new DOMParser().parseFromString( xamlContent );

        let defaultValue = processor.getArgumentDefaultValue( doc, "Ichi" );

        assert.strictEqual( defaultValue, "A default string value" );
    } );

    it( "should return an empty string for an argument when a default value is not specified", function() {
      let processor = new XamlProcessor();

        let xamlContent = fs.readFileSync( "./test/artefacts/uno.xaml" );
        xamlContent = xamlContent.toString();

        const doc = new DOMParser().parseFromString( xamlContent );

        let defaultValue = processor.getArgumentDefaultValue( doc, "Ni" );

        assert.strictEqual( defaultValue, "" );
    } );
  } );
} );
