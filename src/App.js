import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Markdown from "markdown-to-jsx";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/theme-monokai";
import styled from "styled-components";
const { ipcRenderer } = window.require("electron");

function App() {
  const [state, setState] = useState({
    loadedFile: "#Upload a file to get started",
    newContent: ""
  });

  const handleNewContent = c => {
    setState({ loadedFile: c });
  };

  ipcRenderer.on("new-file", (event, fileContent) => {
    setState({ loadedFile: fileContent });
    console.log(event, fileContent);
  });
  return (
    <AppWrap>
      <Split>
        <CodeWindow>
          <AceEditor
            mode="markdown"
            theme="monokai"
            onChange={editedContent => handleNewContent(editedContent)}
            name="markdown_editor"
            value={state.loadedFile}
          />
        </CodeWindow>
        <RenderedWindow>
          <Markdown>{state.loadedFile && state.loadedFile}</Markdown>
        </RenderedWindow>
      </Split>
    </AppWrap>
  );
}

export default App;

const AppWrap = styled.div`
  margin-top: 23px;
`;

const Header = styled.header`
  background-color: #191324;
  color: #75717c;
  font-size: 0.8rem;
  height: 23px;
  text-align: center;
  position: fixed;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.2);
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  -webkit-app-region: drag;
`;

const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: #191324;
  height: 100vh;
`;

const Split = styled.div`
  display: flex;
  height: 100vh;
`;

const FilesWindow = styled.div`
  background: #140f1d;
  border-right: solid 1px #302b3a;
  position: relative;
  width: 20%;
  &:after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: none;
    box-shadow: -10px 0 20px rgba(0, 0, 0, 0.3) inset;
  }
`;

const CodeWindow = styled.div`
  flex: 1;
  padding-top: 2rem;
  background-color: #191324;
`;

const RenderedWindow = styled.div`
  background-color: #191324;
  width: 35%;
  padding: 20px;
  color: #fff;
  border-left: 1px solid #302b3a;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #82d8d8;
  }
  h1 {
    border-bottom: solid 3px #e54b4b;
    padding-bottom: 10px;
  }
  a {
    color: #e54b4b;
  }
`;
