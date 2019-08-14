import { OutputMarkdown } from "../app/OutputMarkdown.js";
import { XamlProcessor } from "../app/XamlProcessor.js";

import * as assert from "assert";
import * as fs from "fs";

/**
 * Test the UiPathProject object.
 */
describe( "OutputMarkdown", function() {

  /**
   * Test constructing a new instance of the class.
   */
  describe( "#constructor", function() {
    it( "should throw an error if the parameter is not supplied", function() {
      assert.throws( function() {
        new OutputMarkdown();
      }, TypeError );
    } );

    it( "should throw an error if the parameter is not a string", function() {
      assert.throws( function() {
        new OutputMarkdown( new Object );
      }, TypeError );
    } );

    it( "should throw an error if the output path does not exist", function() {
      assert.throws( function() {
        new OutputMarkdown( "./test/does-not-exist" );
      }, /The output path .* does not exist$/ );
    } );

    it( "should throw an error if the output path is not a directory", function() {
      assert.throws( function() {
        new OutputMarkdown( "./test/TestOutputMarkdown.js" );
      }, /The output path .* is not a directory$/ );
    } );

    it( "should throw an error if the output path contains files", function() {
      assert.throws( function() {
        new OutputMarkdown( "./test/artefacts" );
      }, /The output path .* is not an empty directory$/ );
    } );

    it( "should return an object when no errors are detected", function() {
      let output = new OutputMarkdown( "./test/artefacts/output" );
      assert.strictEqual( typeof( output ), "object" );
    } );
  } );

  /**
   * Test writing a file.
   */
  describe( "#writeFile", function() {
    it( "should throw an error if the parameter is not supplied", function() {
      let output = new OutputMarkdown( "./test/artefacts/output" );
      assert.throws( function() {
        output.writeFile();
      }, TypeError );
    } );

    it( "should throw an error if the parameter is the wrong type", function() {
      let output = new OutputMarkdown( "./test/artefacts/output" );
      assert.throws( function() {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        output.writeFile( new Object() );
      }, TypeError );
    } );

    it( "should write a file when all of the parameters are correct", function() {
      let processor = new XamlProcessor();

      let metadata = processor.getMetadata( "./test/artefacts/uno.xaml" );

      let output = new OutputMarkdown( "./test/artefacts/output" );

      // eslint-disable-next-line security/detect-non-literal-fs-filename
      output.writeFile( metadata );

      assert.ok( fs.existsSync( "./test/artefacts/output/uno.md" ) );

      fs.unlinkSync( "./test/artefacts/output/uno.md" );

    } );
  } );
} );
