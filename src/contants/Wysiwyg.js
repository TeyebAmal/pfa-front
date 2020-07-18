import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import es from 'react-draft-wysiwyg/src/i18n/es.js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default class EditorConvertToHTML extends Component {
  constructor(props) {
    super(props);
    const html = props.value;
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.
      createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        editorState,
      };
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.value !== this.props.value){
      const contentBlock = htmlToDraft(nextProps.value);
      if (contentBlock) {
        const contentState = ContentState.
        createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        this.setState({editorState});
      }
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    },()=>{
      this.props.onChange &&
      this.props.onChange(draftToHtml(
        convertToRaw(editorState.getCurrentContent())));
    });
  };

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          localization={{
            locale: 'es',
            translations: es
          }}
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onEditorStateChange}
        >
          <textarea
            disabled
            value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
          />
        </Editor>
      </div>
    );
  }
}
