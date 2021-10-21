import { convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

EditorField.propTypes = {
  onEditorStateChange: PropTypes.func
};

function EditorField({ onEditorStateChange = null }) {
  const editorState = EditorState.createEmpty()
  let [editor, setEditor] = useState(editorState)

  function onChangeEditorState(editorState) {
    if (!onEditorStateChange) return;

    setEditor(editorState)
    const value = (draftToHtml(convertToRaw(editor.getCurrentContent())))

    onEditorStateChange(value)
  }

  return <Editor
    editorState={editor}
    toolbarClassName="toolbarClassName"
    wrapperClassName="wrapperClassName"
    editorClassName="editorClassName"
    onEditorStateChange={onChangeEditorState}
  />;
}

export default EditorField;
