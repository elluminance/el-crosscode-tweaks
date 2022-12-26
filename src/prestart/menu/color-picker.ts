//assumes all are in valid range
function genColorString(color: el.ModalColorPicker.Color): string {
    //let {red, green, blue} = color;
    let red = color.red.toString(16);
    let green = color.green.toString(16);
    let blue = color.blue.toString(16);

    return `#${red.padStart(2, "0")}${green.padStart(2, "0")}${blue.padStart(2, "0")}`
}

el.ModalColorPicker = sc.ModalButtonInteract.extend({
    colors: {
        red: 0,
        green: 0,
        blue: 0,

        colorString: "#000000"
    },
    varPath: "",
    sliderRed: null,
    sliderGreen: null,
    sliderBlue: null,
    colorSquare: null,
    use255: true,
    
    init(varPath, label, callback, use255 = true) {
        let text = label ? ig.LangLabel.getText(label) : ig.lang.get(label || "sc.gui.menu.colorPicker.title");
        this.parent(
            text,
            null,
            [ig.lang.get("sc.gui.menu.colorPicker.exit")],
            () => {
                if(this.varPath) ig.vars.set(this.varPath, this.colors);
                callback?.();
            }
        )
        this.textGui.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_TOP)

        this.use255 = use255;
        let maxValue = use255 ? 255 : 15;

        this.varPath = varPath;
        let storedColors: el.ModalColorPicker.Color = ig.vars.get(this.varPath);
        //ensure that the values are set properly
        this.colors = storedColors ?? {
            red: maxValue,
            green: maxValue,
            blue: maxValue,

            colorString: "#ffffff"
        };

        if(!storedColors) {
            varPath && ig.vars.set(varPath, this.colors)
        }
        
        //assume it's an old style color if this is missing
        if(!(this.colors.colorString)) {
            this.colors.red += this.colors.red << 4;
            this.colors.green += this.colors.green << 4;
            this.colors.blue += this.colors.blue << 4;

            this.colors.colorString = genColorString(this.colors)
        }

        this.content.setSize(225, 121);

        let container = new ig.GuiElementBase;
        container.setSize(230, 72);
        container.setPos(0, 20);

        let offset = 0;
        //#region sliders
        this.sliderRed = new el.ModalColorPicker.Slider("red", this.colors.red, this.use255);
        this.sliderRed.hook.pos.y = offset;
        this.sliderRed.callback = this.onChange.bind(this);
        offset += this.sliderRed.hook.size.y;

        this.sliderGreen = new el.ModalColorPicker.Slider("green", this.colors.green, this.use255);
        this.sliderGreen.hook.pos.y = offset;
        this.sliderGreen.callback = this.onChange.bind(this);
        offset += this.sliderGreen.hook.size.y;
        
        this.sliderBlue = new el.ModalColorPicker.Slider("blue", this.colors.blue, this.use255);
        this.sliderBlue.hook.pos.y = offset;
        this.sliderBlue.callback = this.onChange.bind(this);
        offset += this.sliderBlue.hook.size.y;
        //#endregion sliders

        let elem = new ig.GuiElementBase;

        this.colorSquare = new el.ModalColorPicker.ColorSquare(36, 36, this.colors)
        this.colorSquare.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_TOP);

        this.colorDisplay = new el.ModalColorPicker.ColorDisplay(this.colors);
        this.colorDisplay.setAlign(ig.GUI_ALIGN.X_LEFT, ig.GUI_ALIGN.Y_BOTTOM);

        elem.addChildGui(this.colorSquare);
        elem.addChildGui(this.colorDisplay);
        elem.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_CENTER);
        elem.setSize(36, 58);
        elem.setPos(6, 0);

        container.addChildGui(this.sliderRed);
        container.addChildGui(this.sliderGreen);
        container.addChildGui(this.sliderBlue);
        container.addChildGui(elem);

        this.content.addChildGui(container);
        this.msgBox.resize();
    },

    onChange() {
        this.colors = {
            red: this.sliderRed.value + (!this.use255 ? this.sliderRed.value << 4 : 0),
            green: this.sliderGreen.value + (!this.use255 ? this.sliderGreen.value << 4 : 0),
            blue: this.sliderBlue.value + (!this.use255 ? this.sliderBlue.value << 4 : 0),

            colorString: ""
        }

        this.colors.colorString = genColorString(this.colors);
        this.colorSquare.setColor(this.colors);
        this.colorDisplay.setColor(this.colors);
    }
}),

el.ModalColorPicker.Slider = ig.GuiElementBase.extend({
    slider: null,
    nameText: null,
    value: 0,

    init(color, initValue, use255 = false) {
        this.parent();
        this.setSize(180, 24)

        this.nameText = new sc.TextGui(ig.lang.get(`sc.gui.menu.colorPicker.colors.${color}`));
        this.nameText.setAlign(ig.GUI_ALIGN.X_LEFT, ig.GUI_ALIGN.Y_CENTER)
        this.addChildGui(this.nameText);
        
        this.slider = new sc.OptionFocusSlider(value => {
            this.value = value;
            this.callback?.();
        })
        this.slider.setPreferredThumbSize(10, 21)
        this.slider.setMinMaxValue(0, use255 ? 255 : 15);
        this.slider.setSize(130, 21, 9);
        this.slider.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_CENTER)
        this.slider.setValue(initValue);
        this.addChildGui(this.slider);

        this.value = initValue;
    },
})

el.ModalColorPicker.ColorSquare = ig.GuiElementBase.extend({
    color: "#ffffff",
    
    init(w, h, color) {
        this.parent();
        this.setSize(w, h);
        this.setColor(color);
    },

    setColor(color) {
        this.color = color.colorString;
    },

    updateDrawables(renderer) {
        let {x: w, y: h} = this.hook.size
        renderer.addColor("#fff", -1, -1, w+2, h+2)
        renderer.addColor(this.color, 0, 0, w, h)
    }
})

el.ModalColorPicker.ColorDisplay = ig.GuiElementBase.extend({
    img: new ig.Image("media/gui/el/el-tweaks-gui.png"),
    redText: null,
    greenText: null,
    blueText: null,

    init(color) {
        this.parent();
        this.setSize(22, 19)
        this.redText = new sc.TextGui("", {
            font: sc.fontsystem.tinyFont
        });
        this.greenText = new sc.TextGui("", {
            font: sc.fontsystem.tinyFont
        });
        this.blueText = new sc.TextGui("", {
            font: sc.fontsystem.tinyFont
        });

        this.redText.setPos(9, 0);
        this.greenText.setPos(9, 6);
        this.blueText.setPos(9, 12);

        this.addChildGui(this.redText);
        this.addChildGui(this.greenText);
        this.addChildGui(this.blueText);
        this.setColor(color);
    },

    setColor(color) {
        this.redText.setText(color.red.toString());
        this.greenText.setText(color.green.toString());
        this.blueText.setText(color.blue.toString());
    },

    updateDrawables(renderer) {
        renderer.addGfx(this.img, 0, 0, 0, 76, 8, 19);
    }
})

ig.EVENT_STEP.OPEN_EL_COLOR_PICKER = ig.EventStepBase.extend({
    varPath: "",
    title: null,
    use255: false,

    init(settings) {
        this.varPath = settings.varPath;
        this.title = settings.title;
        this.use255 = settings.use255 || true;
    },

    start(data) {
        let gui = new el.ModalColorPicker(this.varPath, this.title, () => {data.done = true;}, this.use255)
        ig.gui.addGuiElement(gui);
        gui.show();
    },

    run(data) {
        return data.done;
    }
})