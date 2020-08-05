import React, { useEffect, useState } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";

import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
import Heading from "@ckeditor/ckeditor5-heading/src/heading";
import Comments from "@ckeditor/ckeditor5-comments/src/comments";
import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment";
import Autoformat from "@ckeditor/ckeditor5-autoformat/src/autoformat";
import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote";
import CKFinder from "@ckeditor/ckeditor5-ckfinder/src/ckfinder";
import FontFamily from "@ckeditor/ckeditor5-font/src/fontfamily";
import FontSize from "@ckeditor/ckeditor5-font/src/fontsize";
import Highlight from "@ckeditor/ckeditor5-highlight/src/highlight";
import Image from "@ckeditor/ckeditor5-image/src/image";
import ImageCaption from "@ckeditor/ckeditor5-image/src/imagecaption";
import ImageResize from "@ckeditor/ckeditor5-image/src/imageresize";
import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar";
import ImageUpload from "@ckeditor/ckeditor5-image/src/imageupload";
import Link from "@ckeditor/ckeditor5-link/src/link";
import List from "@ckeditor/ckeditor5-list/src/list";
import MediaEmbed from "@ckeditor/ckeditor5-media-embed/src/mediaembed";
import PasteFromOffice from "@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice";
import RemoveFormat from "@ckeditor/ckeditor5-remove-format/src/removeformat";
import Strikethrough from "@ckeditor/ckeditor5-basic-styles/src/strikethrough";
import Table from "@ckeditor/ckeditor5-table/src/table";
import TableToolbar from "@ckeditor/ckeditor5-table/src/tabletoolbar";
import Underline from "@ckeditor/ckeditor5-basic-styles/src/underline";
import UploadAdapter from "@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter";
// import IFrame from "./IFrameModule";

function Editor({ users, currentUser, content }) {
  class CommentsAdapter {
    constructor(editor) {
      this.editor = editor;
    }

    init() {
      const usersPlugin = this.editor.plugins.get("Users");
      const commentsRepositoryPlugin = this.editor.plugins.get(
        "CommentsRepository"
      );

      // Load the users data.
      users.forEach((_) => usersPlugin.addUser(_));

      // Set the current user.
      usersPlugin.defineMe(currentUser.id);

      // Set the adapter on the `CommentsRepository#adapter` property.
      commentsRepositoryPlugin.adapter = {
        addComment(data) {
          console.log("Comment added", data);

          return Promise.resolve({
            createdAt: new Date(),
          });
        },

        updateComment(data) {
          console.log("Comment updated", data);
          return Promise.resolve();
        },

        removeComment(data) {
          console.log("Comment removed", data);
          return Promise.resolve();
        },

        getCommentThread(data) {
          console.log("Getting comment thread", data);

          return Promise.resolve({
            threadId: data.threadId,
            comments: [
              {
                commentId: "comment-1",
                authorId: "user-2",
                content:
                  "<p>Are we sure we want to use a made-up disorder name?</p>",
                createdAt: new Date(),
              },
              {
                commentId: "comment-2",
                authorId: "user-1",
                content: "<p>no</p>",
                createdAt: new Date(Date.now() - 1000000000),
              },
            ],
            isFromAdapter: true,
          });
        },
      };
    }
  }

  // We have to do this because CKEditor will try to
  // use the sidebar *before* it's been rendered :(
  const [sidebar, setSidebar] = useState();
  useEffect(() => {
    setSidebar(document.querySelector("#sidebar"));
    window.WEBSPELLCHECKER_CONFIG = {
      autoSearch: true,
      enableGrammar: false,
      serviceId: "AmJd3U0G8aJ6HWZ",
    };

    const script = document.createElement("script");
    script.src =
      "https://svc.webspellchecker.net/spellcheck31/wscbundle/wscbundle.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div id="container">
      {sidebar !== undefined && (
        <CKEditor
          onInit={(editor) => {
            const annotations = editor.plugins.get("Annotations");
            console.log(annotations);
            annotations.switchTo("wideSidebar");
          }}
          editor={ClassicEditor}
          config={{
            licenseKey:
              "c7CjCHxcAFFzChrLYIB2zj+3bV3ZuSUSQ1oflip2BDr8XBbWudoUQ6s=",
            extraPlugins: [CommentsAdapter],
            plugins: [
              Alignment,
              Autoformat,
              BlockQuote,
              Bold,
              CKFinder,
              Essentials,
              FontFamily,
              FontSize,
              Heading,
              Highlight,
              Image,
              ImageCaption,
              ImageResize,
              ImageStyle,
              ImageToolbar,
              ImageUpload,
              Italic,
              Link,
              List,
              MediaEmbed,
              Paragraph,
              PasteFromOffice,
              RemoveFormat,
              Strikethrough,
              Table,
              TableToolbar,
              Underline,
              UploadAdapter,
              Comments,
              // IFrame,
            ],
            toolbar: {
              items: [
                "heading",
                "|",
                "fontsize",
                "fontfamily",
                "|",
                "bold",
                "italic",
                "underline",
                "strikethrough",
                "removeFormat",
                "highlight",
                "|",
                "alignment",
                "|",
                "numberedList",
                "bulletedList",
                "|",
                "link",
                "blockquote",
                "imageUpload",
                "insertTable",
                "mediaEmbed",
                "|",
                "undo",
                "redo",
                "|",
                "comment",
                "|",
                "trackChanges",
                "iframe",
              ],
            },
            sidebar: {
              container: sidebar,
            },
          }}
          data={content}
        />
      )}
      <div id="sidebar" />
    </div>
  );
}

export default Editor;
