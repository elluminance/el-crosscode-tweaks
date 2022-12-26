declare namespace ig {
    namespace GuiTextInputField {
        interface InputFieldType {}
    }
    interface GuiTextInputField extends ig.FocusGui {
        onCharacterInput(): void;
        getValueAsString(this: this): string;
    }
    interface GuiTextInputFieldConstructor extends ImpactClass<GuiTextInputField> {
        new (width: number, height: number, inputField_type?: GuiTextInputField.InputFieldType): ig.GuiTextInputField
    }
    var GuiTextInputField: GuiTextInputFieldConstructor
}