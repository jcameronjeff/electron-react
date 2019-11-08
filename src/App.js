import React, { useState, useEffect, useLayoutEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Markdown from "markdown-to-jsx";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/theme-monokai";
import styled from "styled-components";
const fs = window.require("fs");
const settings = window.require("electron-settings");
const { ipcRenderer } = window.require("electron");

function App() {
  const [state, setState] = useState({
    loadedFile: "#Upload a file to get started",
    newContent: "",
    directory: settings.get("directory") || null,
    filesData: [],
    loaded: false
  });

  const { directory, loadedFile, fileData } = state;
  const dir = settings.get("directory");

  const updateContent = c => {
    setState(state => ({ ...state.loadedFile, c }));
  };
  const updateDir = d => {
    settings.set("directory", d);
    setState(state => ({ ...state.directory, d }));
  };

  const handleLoadFiles = directory => {
    console.log("LOAD", directory);
    fs.readdir(directory, (err, files) => {
      const fileData = files.map(file => ({ path: `${directory}/${file}` }));
      setState(state => ({ ...state.filesData, fileData }));
      console.log(fileData);
    });
  };

  const loadFile = index => {
    console.log(state.filesData[index].path);
    const content = fs.readFileSync(state.filesData[index].path).toString();
    console.log(content);
    updateContent(content);
  };

  ipcRenderer.on("new-file", (event, fileContent) => {
    updateContent(fileContent);
    console.log(event, fileContent);
  });
  ipcRenderer.on("new-dir", (event, directory) => {
    console.log(event, directory);
    updateDir(directory);
    handleLoadFiles(directory);
  });

  useEffect(() => {}, []);

  return (
    <AppWrap>
      <Header>Journal</Header>

      {state.directory && state.filesData ? (
        <Split>
          <div className="files">
            {state.filesData.map((file, index) => (
              <button key={index} onClick={() => loadFile(index)}>
                {file.path}
              </button>
            ))}
          </div>
          <CodeWindow>
            <AceEditor
              mode="markdown"
              theme="monokai"
              onChange={editedContent => updateContent(editedContent)}
              name="markdown_editor"
              value={state.loadedFile}
            />
          </CodeWindow>
          <RenderedWindow>
            <Markdown>
              {state.loadedFile ? state.loadedFile : "#Add a file"}
            </Markdown>
          </RenderedWindow>
        </Split>
      ) : (
        <LoadingMessage>
          <h2>Use CMD + O to open a directory</h2>
        </LoadingMessage>
      )}
    </AppWrap>
  );
}

export default App;

const AppWrap = styled.div`
  margin-top: 23px;
`;

const Header = styled.header`
  background-color: #272822;
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
  background-color: #272822;
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
  background-color: #272822;
`;

const RenderedWindow = styled.div`
  background-color: #272822;
  width: 35%;
  padding: 20px;
  color: #fff;
  border-left: 3px solid #302b3a;
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
