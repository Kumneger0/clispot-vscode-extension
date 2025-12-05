
//@ts-ignore
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
//@ts-ignore
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';
//@ts-ignore
suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage("Start all tests.");

  //@ts-ignore
  test("Sample test", () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
  });
});
