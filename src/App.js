import React, { useEffect, useState } from "react";
import MultirootEditor from "./MultiRootEditor";
import "./App.css";

function App() {
  const [sidebar, setSidebar] = useState();

  useEffect(() => {
    setSidebar(document.querySelector("#sidebar"));
    if (sidebar) {
      MultirootEditor.create(
        {
          header: document.querySelector("#header"),
          content: document.querySelector("#content"),
          footerleft: document.querySelector("#footer-left"),
          footerright: document.querySelector("#footer-right"),
        },
        {
          placeholder: {
            header: "Header text goes here",
            content: "Type content here",
            footerleft: "Left footer content",
            footerright: "Right footer content",
          },
        },
        sidebar
      )
        .then((newEditor) => {
          document
            .querySelector("#toolbar")
            .appendChild(newEditor.ui.view.toolbar.element);
          window.editor = newEditor;
        })
        .catch((err) => {
          console.error(err.stack);
        });
    }
  }, [sidebar]);

  return (
    <div className="App">
      <div id="container">
        <div id="toolbar" />
        <header id="header">
          <h2>Gone traveling</h2>
          <h3>Monthly travel news and inspiration</h3>
        </header>

        <div id="content">
          <h3>Destination of the Month</h3>

          <h4>Valletta</h4>

          <p>
            The capital city of{" "}
            <a
              href="https://en.wikipedia.org/wiki/Malta"
              // eslint-disable-next-line react/jsx-no-target-blank
              target="_blank"
              rel="external"
            >
              Malta
            </a>{" "}
            is the top destination this summer. It’s home to a cutting-edge
            contemporary architecture, baroque masterpieces, delicious local
            cuisine and at least 8 months of sun. It’s also a top destination
            for filmmakers, so you can take a tour through locations familiar to
            you from Game of Thrones, Gladiator, Troy and many more.
          </p>
        </div>

        <div className="demo-row">
          <div className="demo-row__half">
            <div id="footer-left">
              <h3>The three greatest things you learn from traveling</h3>
              <p>
                <button>Find out more</button>
              </p>
            </div>
          </div>

          <div className="demo-row__half">
            <div id="footer-right">
              <h3>Walking the capitals of Europe: Warsaw</h3>
              <p>
                <button href="#">Find out more</button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div id="sidebar" />
    </div>
  );
}

export default App;
