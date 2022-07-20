export {};

declare global {
    namespace ig {
        namespace EVENT_STEP {
            namespace OPEN_EL_COLOR_PICKER {
                interface Settings {
                    varPath: string;
                    title: ig.LangLabel.Data;
                }
    
                interface Data {
                    done: boolean
                }
            }
            interface OPEN_EL_COLOR_PICKER extends ig.EventStepBase {
                varPath: string;
                title: ig.LangLabel.Data;
    
                start(this: this, data: OPEN_EL_COLOR_PICKER.Data): void;
                run(this: this, data: OPEN_EL_COLOR_PICKER.Data): boolean;
            }
            interface OPEN_EL_COLOR_PICKER_CONSTRUCTOR extends ImpactClass<OPEN_EL_COLOR_PICKER> {
                new (settings: OPEN_EL_COLOR_PICKER.Settings): OPEN_EL_COLOR_PICKER;
            }
            let OPEN_EL_COLOR_PICKER: OPEN_EL_COLOR_PICKER_CONSTRUCTOR;
    
        }
    }
    
    namespace sc {
        namespace EL_ModalColorPicker {
            interface Color {
                red: number;
                green: number;
                blue: number;
            }

            interface Slider extends ig.GuiElementBase {
                nameText: sc.TextGui;
                slider: sc.OptionFocusSlider;
                value: number;
                callback: () => void;

                setValue(value: number): void;
            }

            interface SliderConstructor extends ImpactClass<Slider> {
                new (colorName: string, initialValue: number): Slider;
            }

            interface ColorSquare extends ig.GuiElementBase {
                color: string;
                setColor(this: this, color: sc.EL_ModalColorPicker.Color): void;
            }

            interface ColorSquareConstructor extends ImpactClass<ColorSquare> {
                new (w: number, h: number, color: EL_ModalColorPicker.Color): ColorSquare
            }
        }

        interface EL_ModalColorPicker extends sc.ModalButtonInteract {
            colors: EL_ModalColorPicker.Color
            varPath: string;
            sliderRed: sc.EL_ModalColorPicker.Slider;
            sliderGreen: sc.EL_ModalColorPicker.Slider;
            sliderBlue: sc.EL_ModalColorPicker.Slider;
            colorSquare: sc.EL_ModalColorPicker.ColorSquare;

            onChange(this: this): void;
        }
        interface EL_ModalColorPickerConstructor extends ImpactClass<EL_ModalColorPicker> {
            new (varPath: string, label?: ig.LangLabel.Data, callback?: () => void): EL_ModalColorPicker;

            Slider: EL_ModalColorPicker.SliderConstructor;
            ColorSquare: EL_ModalColorPicker.ColorSquareConstructor;
        }
        let EL_ModalColorPicker: EL_ModalColorPickerConstructor;
    }
}