declare namespace ig {
    /*
     * While this is disingenuous of the input field's type...
     * The point is not to make it accurate.
     * It's to make it provide a minimum needed interface for the item spawner.
     * 
     */
    namespace GuiTextInputField {
        interface InputFieldType {}
    }
    interface GuiTextInputField extends ig.FocusGui {
        onCharacterInput: () => void;
        getValueAsString(this: this): string;
    }
    interface GuiTextInputFieldConstructor extends ImpactClass<GuiTextInputField> {
        new (width: number, height: number): GuiTextInputField
    }
    var GuiTextInputField: GuiTextInputFieldConstructor | undefined;
}
    
declare namespace nax.ccuilib {
    type InputField = ig.GuiTextInputField;
    type InputFieldConstructor = ig.GuiTextInputFieldConstructor;
    let InputField: InputFieldConstructor | undefined;
}