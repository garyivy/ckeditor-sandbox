import React from "react";
import Editor from "./D3Editor";
import "./App.css";

function App() {
  const appData = {
    // Users data.
    users: [
      {
        id: "user-1",
        name: "Joe Doe",
        // Note that the avatar is optional.
        avatar: "https://randomuser.me/api/portraits/thumb/men/26.jpg",
      },
      {
        id: "user-2",
        name: "Ella Harper",
        avatar: "https://randomuser.me/api/portraits/thumb/women/65.jpg",
      },
    ],

    // The ID of the current user.
    userId: "user-1",

    // Editor initial data.
    initialData: `<h2>
             <comment id="thread-1" type="start"></comment>
             Bilingual Personality Disorder
             <comment id="thread-1" type="end"></comment>
         </h2>
         <p>
             This may be the first time you hear about this made-up disorder but it actually isn’t so far from the truth.
             As recent studies show, the language you speak has more effects on you than you realise.
             According to the studies, the language a person speaks affects their cognition,
             behaviour, emotions and hence <strong>their personality</strong>.
         </p>
         <p>
             This shouldn’t come as a surprise
             <a href="https://en.wikipedia.org/wiki/Lateralization_of_brain_function">since we already know</a>
             that different regions of the brain becomes more active depending on the activity.
             Since structure, information and especially <strong>the culture</strong> of languages varies substantially
             and the language a person speaks is a essential element of daily life.
         </p>`,
  };

  return (
    <div className="App">
      <Editor
        users={appData.users}
        currentUser={{ id: appData.userId }}
        content={appData.initialData}
      />
    </div>
  );
}

export default App;
