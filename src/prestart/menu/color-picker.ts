sc.EL_ModalColorPicker = sc.ModalButtonInteract.extend({
    colors: {
        red: 15,
        green: 15,
        blue: 15,
    },
    varPath: "",
    sliderRed: null,
    sliderGreen: null,
    sliderBlue: null,
    colorSquare: null,
    
    init(varPath, label, callback) {
        let text = label ? ig.LangLabel.getText(label) : ig.lang.get(label || "sc.gui.menu.colorPicker.title");
        this.parent(
            text,
            null,
            [ig.lang.get("sc.gui.menu.colorPicker.exit")],
            callback || (() => {})
        )
        this.textGui.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_TOP)

        this.varPath = varPath;
        let storedColors: sc.EL_ModalColorPicker.Color = ig.vars.get(this.varPath) as any;
        //ensure that the values are set properly
        this.colors = {
            red: storedColors?.red ?? 15,
            green: storedColors?.green ?? 15,
            blue: storedColors?.blue ?? 15,
        };

        if(!storedColors) {
            varPath && ig.vars.set(varPath, this.colors as any)
        }

        this.content.setSize(225, 121);
        let offset = 20;
        //#region sliders
        this.sliderRed = new sc.EL_ModalColorPicker.Slider("red", this.colors.red);
        this.sliderRed.hook.pos.y = offset;
        this.sliderRed.callback = this.onChange.bind(this);
        offset += this.sliderRed.hook.size.y;

        this.sliderGreen = new sc.EL_ModalColorPicker.Slider("green", this.colors.green);
        this.sliderGreen.hook.pos.y = offset;
        this.sliderGreen.callback = this.onChange.bind(this);
        offset += this.sliderGreen.hook.size.y;
        
        this.sliderBlue = new sc.EL_ModalColorPicker.Slider("blue", this.colors.blue);
        this.sliderBlue.hook.pos.y = offset;
        this.sliderBlue.callback = this.onChange.bind(this);
        offset += this.sliderBlue.hook.size.y;
        //#endregion sliders

        this.colorSquare = new sc.EL_ModalColorPicker.ColorSquare(37, 72, this.colors)
        this.colorSquare.setPos(this.sliderRed.hook.size.x + 7, 20)

        this.content.addChildGui(this.sliderRed);
        this.content.addChildGui(this.sliderGreen);
        this.content.addChildGui(this.sliderBlue);
        this.content.addChildGui(this.colorSquare);
        this.msgBox.resize();
    },

    onChange() {
        this.colors = {
            red: this.sliderRed.value,
            green: this.sliderGreen.value,
            blue: this.sliderBlue.value,
        }
        
        this.varPath && ig.vars.set(this.varPath, this.colors as any)
        this.colorSquare.setColor(this.colors);
    }
}),

sc.EL_ModalColorPicker.Slider = ig.GuiElementBase.extend({
    slider: null,
    nameText: null,
    value: 0,

    init(color, initValue) {
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
        this.slider.setMinMaxValue(0, 15);
        this.slider.setSize(130, 21, 9);
        this.slider.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_CENTER)
        this.slider.setValue(initValue);
        this.addChildGui(this.slider);

        this.value = initValue;
    },
})

sc.EL_ModalColorPicker.ColorSquare = ig.GuiElementBase.extend({
    color: "#ffffff",
    
    init(w, h, color) {
        this.parent();
        this.setSize(w, h);
        this.setColor(color);
    },

    setColor(color) {
        this.color = `#${color.red.toString(16)}${color.green.toString(16)}${color.blue.toString(16)}`
    },

    updateDrawables(renderer) {
        let {x: w, y: h} = this.hook.size
        renderer.addColor("#fff", -1, -1, w+2, h+2)
        renderer.addColor(this.color, 0, 0, w, h)
    }
})

ig.EVENT_STEP.OPEN_EL_COLOR_PICKER = ig.EventStepBase.extend({
    varPath: "",
    title: null,

    init(settings) {
        this.varPath = settings.varPath;
        this.title = settings.title;
    },

    start(data) {
        let gui = new sc.EL_ModalColorPicker(this.varPath, this.title, () => {data.done = true;})
        ig.gui.addGuiElement(gui);
        gui.show();
    },

    run(data) {
        return data.done;
    }
})