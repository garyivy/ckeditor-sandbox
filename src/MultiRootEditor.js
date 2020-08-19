import Editor from "@ckeditor/ckeditor5-core/src/editor/editor";
import DataApiMixin from "@ckeditor/ckeditor5-core/src/editor/utils/dataapimixin";
import HtmlDataProcessor from "@ckeditor/ckeditor5-engine/src/dataprocessor/htmldataprocessor";
import getDataFromElement from "@ckeditor/ckeditor5-utils/src/dom/getdatafromelement";
import setDataInElement from "@ckeditor/ckeditor5-utils/src/dom/setdatainelement";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
import Heading from "@ckeditor/ckeditor5-heading/src/heading";
import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote";
import Image from "@ckeditor/ckeditor5-image/src/image";
import ImageCaption from "@ckeditor/ckeditor5-image/src/imagecaption";
import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar";
import ImageUpload from "@ckeditor/ckeditor5-image/src/imageupload";
import Link from "@ckeditor/ckeditor5-link/src/link";
import List from "@ckeditor/ckeditor5-list/src/list";
import Table from "@ckeditor/ckeditor5-table/src/table";
import TableToolbar from "@ckeditor/ckeditor5-table/src/tabletoolbar";
import Comments from "@ckeditor/ckeditor5-comments/src/comments";
import mix from "@ckeditor/ckeditor5-utils/src/mix";
import MultirootEditorUI from "./MultiRootEditorUI";
import MultirootEditorUIView from "./MultiRootEditorUIView";

/**
 * The multi-root editor implementation. It provides inline editables and a single toolbar.
 *
 * Unlike other editors, the toolbar is not rendered automatically and needs to be attached to the DOM manually.
 *
 * This type of an editor is dedicated to integrations which require a customized UI with an open
 * structure, allowing developers to specify the exact location of the interface.
 *
 * @mixes module:core/editor/utils/dataapimixin~DataApiMixin
 * @implements module:core/editor/editorwithui~EditorWithUI
 * @extends module:core/editor/editor~Editor
 */
class MultirootEditor extends Editor {
  /**
   * Creates an instance of the multi-root editor.
   *
   * **Note:** Do not use the constructor to create editor instances. Use the static `MultirootEditor.create()` method instead.
   *
   * @protected
   * @param {Object.<String,HTMLElement>} sourceElements The list of DOM elements that will be the source
   * for the created editor (on which the editor will be initialized).
   * @param {module:core/editor/editorconfig~EditorConfig} config The editor configuration.
   */
  constructor(sourceElements, config) {
    super(config);

    this.data.processor = new HtmlDataProcessor(this.data.viewDocument);

    // Create root and UIView element for each editable container.
    for (const rootName of Object.keys(sourceElements)) {
      this.model.document.createRoot("$root", rootName);
    }

    this.ui = new MultirootEditorUI(
      this,
      new MultirootEditorUIView(this.locale, this.editing.view, sourceElements)
    );
  }

  /**
   * @inheritDoc
   */
  destroy() {
    // Cache the data and editable DOM elements, then destroy.
    // It's safe to assume that the model->view conversion will not work after super.destroy(),
    // same as `ui.getEditableElement()` method will not return editables.
    const data = {};
    const editables = {};
    const editablesNames = Array.from(this.ui.getEditableElementsNames());

    for (const rootName of editablesNames) {
      data[rootName] = this.getData({ rootName });
      editables[rootName] = this.ui.getEditableElement(rootName);
    }

    this.ui.destroy();

    return super.destroy().then(() => {
      for (const rootName of editablesNames) {
        setDataInElement(editables[rootName], data[rootName]);
      }
    });
  }

  /**
   * Creates a multi-root editor instance.
   *
   * @param {Object.<String,HTMLElement>} sourceElements The list of DOM elements that will be the source
   * for the created editor (on which the editor will be initialized).
   * @param {module:core/editor/editorconfig~EditorConfig} config The editor configuration.
   * @returns {Promise} A promise resolved once the editor is ready. The promise returns the created multi-root editor instance.
   */
  static create(sourceElements, customConfig, sidebar) {
    class CommentsAdapter {
      constructor(editor) {
        this.editor = editor;
      }

      init() {
        const usersPlugin = this.editor.plugins.get("Users");
        usersPlugin.addUser({
          id: "user-id",
          name: "John Smith",
        });
        usersPlugin.defineMe("user-id");

        const commentsRepositoryPlugin = this.editor.plugins.get(
          "CommentsRepository"
        );

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

    const config = {
      ...customConfig,
      licenseKey:
        "20ZeuBr7spjWzxHl2NW3ehNqTRrzb8pyGhsEjVeGlHRIgkbAa7FWTremqthRJPMBA84I5hNTZ5eQeFkT93A=",
      extraPlugins: [CommentsAdapter],
      plugins: [
        Paragraph,
        Heading,
        Bold,
        Italic,
        List,
        Link,
        BlockQuote,
        Image,
        ImageCaption,
        ImageStyle,
        ImageToolbar,
        ImageUpload,
        Table,
        TableToolbar,
        Comments,
      ],
      toolbar: [
        "heading",
        "|",
        "bold",
        "italic",
        "link",
        "bulletedList",
        "numberedList",
        "imageUpload",
        "blockQuote",
        "insertTable",
        "comment",
      ],
      image: {
        toolbar: [
          "imageTextAlternative",
          "|",
          "imageStyle:alignLeft",
          "imageStyle:full",
          "imageStyle:alignRight",
        ],
        styles: ["full", "alignLeft", "alignRight"],
      },
      table: {
        contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
      },
      sidebar: {
        container: sidebar,
      },
    };

    return new Promise((resolve) => {
      const editor = new this(sourceElements, config);

      resolve(
        editor
          .initPlugins()
          .then(() => editor.ui.init())
          .then(() => {
            const initialData = {};

            // Create initial data object containing data from all roots.
            for (const rootName of Object.keys(sourceElements)) {
              initialData[rootName] = getDataFromElement(
                sourceElements[rootName]
              );
            }

            return editor.data.init(initialData);
          })
          .then(() => editor.fire("ready"))
          .then(() => editor)
      );
    });
  }
}

mix(MultirootEditor, DataApiMixin);

export default MultirootEditor;
