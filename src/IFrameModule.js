// This SVG file import will be handled by webpack's raw-text loader.
// This means that imageIcon will hold the source SVG.
import imageIcon from "@ckeditor/ckeditor5-core/theme/icons/image.svg";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";

export default class IFrame extends Plugin {
  constructor(editor) {
    super();
    this.editor = editor;
  }

  init() {
    const editor = this.editor;

    editor.ui.componentFactory.add("iframe", (locale) => {
      const view = new ButtonView(locale);

      view.set({
        label: "Insert IFrame",
        icon: imageIcon,
        tooltip: true,
      });

      view.on("execute", () => {
        const src = prompt("IFrame URL");

        editor.model.change((writer) => {
          const iframeElement = writer.createElement("iframe", { src });

          editor.model.insertContent(
            iframeElement,
            editor.model.document.selection
          );
        });
      });

      return view;
    });
  }
}
