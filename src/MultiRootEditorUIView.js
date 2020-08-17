import EditorUIView from "@ckeditor/ckeditor5-ui/src/editorui/editoruiview";
import InlineEditableUIView from "@ckeditor/ckeditor5-ui/src/editableui/inline/inlineeditableuiview";
import ToolbarView from "@ckeditor/ckeditor5-ui/src/toolbar/toolbarview";
import Template from "@ckeditor/ckeditor5-ui/src/template";

/**
 * The multi-root editor UI view. It is a virtual view providing an inline editable, but without
 * any specific arrangement of the components in the DOM.
 *
 * @extends module:ui/editorui/editoruiview~EditorUIView
 */
class MultirootEditorUIView extends EditorUIView {
  /**
   * Creates an instance of the multi-root editor UI view.
   *
   * @param {module:utils/locale~Locale} locale The locale instance.
   * @param {module:engine/view/view~View} editingView The editing view instance this view is related to.
   * @param {Object.<String,HTMLElement>} editableElements The list of editable elements, containing name and html element
   * for each editable.
   */
  constructor(locale, editingView, editableElements) {
    super(locale);

    /**
     * The main toolbar of the multi-root editor UI.
     *
     * @readonly
     * @member {module:ui/toolbar/toolbarview~ToolbarView}
     */
    this.toolbar = new ToolbarView(locale);

    /**
     * The editables of the multi-root editor UI.
     *
     * @readonly
     * @member {Array.<module:ui/editableui/inline/inlineeditableuiview~InlineEditableUIView>}
     */
    this.editables = [];

    // Create InlineEditableUIView instance for each editable.
    for (const editableName of Object.keys(editableElements)) {
      const editable = new InlineEditableUIView(
        locale,
        editingView,
        editableElements[editableName]
      );

      editable.name = editableName;
      this.editables.push(editable);
    }

    // This toolbar may be placed anywhere in the page so things like font size need to be reset in it.
    // Because of the above, make sure the toolbar supports rounded corners.
    // Also, make sure the toolbar has the proper dir attribute because its ancestor may not have one
    // and some toolbar item styles depend on this attribute.
    Template.extend(this.toolbar.template, {
      attributes: {
        class: ["ck-reset_all", "ck-rounded-corners"],
        dir: locale.uiLanguageDirection,
      },
    });
  }

  /**
   * @inheritDoc
   */
  render() {
    super.render();

    this.registerChild(this.editables);
    this.registerChild([this.toolbar]);
  }
}

export default MultirootEditorUIView;
