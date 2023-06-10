# EL's CrossCode Tweaks
*A collection of many small features combined into one convenient package.*

Contains additions/fixes that are helpful to both normal players and modders alike!

***Note: Support will not be provided unless you are using the [latest release](https://github.com/EL20202/el-crosscode-tweaks/releases/latest).***

*Readme is guaranteed accurate up to version 0.5.7. See changelog for more details.*

&nbsp;

# Table of Contents
* **[Additions For Users](#for-users)**
  * [Arena Tweaks](#arena-tweaks)
  * [Assist Mode Changes](#assist-mode)
  * [NG+ Perks](#ng-perks)
  * [Uncapped Stats](#uncapped-stats)
  * [Bug Fixes/Minor Additions](#bug-fixesother-miscellaneous-additions)
* **[Additions for Modders](#for-modders)**
  * [Action Steps](#action-steps)
  * [Color Picker](#color-picker)
&nbsp;

&nbsp;

# For Users
## Arena Tweaks

#### HP Recovered Bonus
![](/readme-imgs/arena-hp-recov.png)

Adds an HP Recovery bonus to arena rounds to help offset the damage penalty. 

*Can be disabled in options.*

#### Arena Item Refunding
![](/readme-imgs/arena-sandwich.png)

Any item that is used during an arena round will be automatically returned upon ending a round (regardless if you win, lose, or just exit the round in general).

*Can be disabled in options.*

## Assist Mode
![](/readme-imgs/assist-mode.png)

Adds an assist mode option to adjust timing windows of both perfect guards and perfect dashes.

**Note: Timing windows can be lowered without having assist mode considered to be enabled.**

## NG+ Perks
![](/readme-imgs/ng-perfectionist.png)

**Perfectionist** will make it so that any non-perfect guards will instantly cause a Guard Break. *However*, it also increases the perfect guard window threefold, while also automatically refreshing the shield on a perfect guard (effectively giving free Riposte).

Comparable to Dash Master, but for guarding instead of dashing.

![](/readme-imgs/ng-nudist.png)

Makes it so you cannot wear any equipment. Can you beat the game *naked*?

## Item Spawner

*Note: Must be enabled in the options menu to work.*

![](/readme-imgs/item-spawn-inventory.png)
*Where to access the menu, once enabled*

![](/readme-imgs/item-spawn-menu.png)
*The menu itself. Note that not all menu elements may be present depending on what other mods you have installed.*

An item spawn menu, allowing you to add any item in the game to your inventory. 

Item search functionality requires [CCInventorySearch](https://github.com/conorlawton/CCInventorySearch) (or any other mod adding the text input element) to be installed.

## Uncapped Stats
*Before*

![](/readme-imgs/uncapped-stats-before.png)

*After*

![](/readme-imgs/uncapped-stats-after.png)

Removes the visual stat cap present in many circumstances - allowing you to see what your stats really are! Allows the stat display to go up to 999999999, though it's incredibly unlikely for that limit ever to be reached.

**Warning**: If the standalone [Uncapped Stats](https://github.com/EL20202/cc-uncapped-stats) is installed, the this part of the mod will not function. Please remove the standalone version if installing this mod, as the standalone version will not be updated!

## Bug Fixes/Other Miscellaneous Additions

* **Flash Step Fix**: Prior to CrossCode version 1.4.2-3, the modifier *Flash Step* had neglible effect on dash invincibility. This mod offers a fix to those who are playing older versions.
* **Element Aura Arena Bugfix**: Fixes the element aura not refreshing properly on starting a new round.
* **Arena Death Softlock Bugfix**: Fixes a potential softlock when restarting an arena round immediately after dying.


---
# For Modders
## Action Steps
Many new action steps that are designed to simplify the creation of various actions - both player and enemy!

**Note:** The examples will use comments as a way of filling in missing/"unneeded" data to illustrate how to use the action steps - though they WILL NOT work with comments in actual practice. Remember that JSON does not support comments, I'm merely using them here for demonstration purposes only.

Table of Contents:
* Flow Control:
  * [EL_ELEMENT_IF](#el_element_if)
  * [GOTO_LABEL_WHILE](#goto_label_while)
  * [SWITCH_CASE](#switch_case)
* Others

### EL_ELEMENT_IF
Allows branching based on the element of the user. Note that this has only been tested on player configs - no guarantees it will work with enemies that can change elements!

*Example:*
```jsonc
{
  "type": "EL_ELEMENT_IF",
  "neutral": [
    /*other steps here if user is in neutral*/
  ],
  "heat": [
    /*other steps here if user is in heat*/
  ],
  "cold": [
    /*other steps here if user is in cold*/
  ],
  "shock": [
    /*other steps here if user is in shock*/
  ],
  "wave": [
    /*other steps here if user is in wave*/
  ]
}
```

### GOTO_LABEL_WHILE
Jumps to a named label if a condition is met. This works the same as the event step version - there was just no action step variant is all! That is corrected by this.

```jsonc
{
  "type": "GOTO_LABEL_WHILE",
  "name": "end",
  "condition": "tmp.condition"
},
/*...*/
{
  "type": "LABEL",
  "name": "end"
}
```

## Color Picker
![](./readme-imgs/color-picker.png)

Adds a simple color picker for whatever color-picking needs you want. Originally just made to allow customizing an aura's color, but I thought - you never know, someone else might need one too!

To open up the color picker through an event - simply have the below event step in some relevant event:
```jsonc
{
  "type": "OPEN_EL_COLOR_PICKER",
  "varPath": "el.colors.test",
  "title": {
      "en_US": "Color Picker"
  }
}
```
The `title` will be a langlabel of the gui popup, and if left blank it will default to just "Color Picker". `varPath` dictates which variable the color will be stored, and the variable will look something like this: `{"red": 243, "green": 143, "blue": 6, "colorString": "#F38F06"}`. All color components will be in the range of 0-255, inclusive.

