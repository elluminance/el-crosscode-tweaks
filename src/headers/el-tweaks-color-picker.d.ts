export {};

declare global {
    namespace ig {
        namespace EVENT_STEP {
            namespace OPEN_EL_COLOR_PICKER {
                interface Settings {
                    varPath: string;
                    title: ig.LangLabel.Data;
                    use255?: boolean;
                }
    
                interface Data {
                    done: boolean
                }
            }
            interface OPEN_EL_COLOR_PICKER extends ig.EventStepBase {
                varPath: string;
                title: ig.LangLabel.Data;
                use255: boolean;
    
                start(this: this, data: OPEN_EL_COLOR_PICKER.Data): void;
                run(this: this, data: OPEN_EL_COLOR_PICKER.Data): boolean;
            }
            interface OPEN_EL_COLOR_PICKER_CONSTRUCTOR extends ImpactClass<OPEN_EL_COLOR_PICKER> {
                new (settings: OPEN_EL_COLOR_PICKER.Settings): OPEN_EL_COLOR_PICKER;
            }
            let OPEN_EL_COLOR_PICKER: OPEN_EL_COLOR_PICKER_CONSTRUCTOR;
    
        }
    }
    
    namespace el {
        namespace ModalColorPicker {
            interface Color {
                red: number;
                green: number;
                blue: number;

                colorString: string;
            }

            interface Slider extends ig.GuiElementBase {
                nameText: sc.TextGui;
                slider: sc.OptionFocusSlider;
                value: number;
                callback: () => void;

                setValue(value: number): void;
            }

            interface SliderConstructor extends ImpactClass<Slider> {
                new (colorName: string, initialValue: number, use255?: boolean): Slider;
            }

            interface ColorSquare extends ig.GuiElementBase {
                color: string;
                setColor(this: this, color: el.ModalColorPicker.Color): void;
            }

            interface ColorSquareConstructor extends ImpactClass<ColorSquare> {
                new (w: number, h: number, color: ModalColorPicker.Color): ColorSquare
            }

            interface ColorDisplay extends ig.GuiElementBase {
                img: ig.Image;
                redText: sc.TextGui;
                greenText: sc.TextGui;
                blueText: sc.TextGui;

                setColor(this: this, color: Color): void;
            }
            interface ColorDisplayConstructor extends ImpactClass<ColorDisplay> {
                new (color: Color): ColorDisplay;
            }
        }

        interface ModalColorPicker extends sc.ModalButtonInteract {
            colors: ModalColorPicker.Color
            varPath: string;
            sliderRed: el.ModalColorPicker.Slider;
            sliderGreen: el.ModalColorPicker.Slider;
            sliderBlue: el.ModalColorPicker.Slider;
            colorSquare: el.ModalColorPicker.ColorSquare;
            colorDisplay: el.ModalColorPicker.ColorDisplay;
            use255: boolean;

            onChange(this: this): void;
        }
        interface ModalColorPickerConstructor extends ImpactClass<ModalColorPicker> {
            new (varPath: string, label?: ig.LangLabel.Data, callback?: () => void, use255?: boolean): ModalColorPicker;

            Slider: ModalColorPicker.SliderConstructor;
            ColorSquare: ModalColorPicker.ColorSquareConstructor;
            ColorDisplay: ModalColorPicker.ColorDisplayConstructor;
        }
        let ModalColorPicker: ModalColorPickerConstructor;
    }
}