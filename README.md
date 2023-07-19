# EL's CrossCode Tweaks
*A collection of many small features combined into one convenient package.*

Contains additions/fixes that are helpful to both normal players and modders alike!

***Note: Support will not be provided unless you are using the [latest release](https://github.com/EL20202/el-crosscode-tweaks/releases/latest).***

*Readme is guaranteed accurate up to version 0.5.9. See changelog for more details.*

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
  * [Commands](#commands)
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
* **Ball Autofiring**: By holding the `F` key, you can automatically fire balls using mouse and keyboard - something previously exclusive to controller controls. (***NOTE***: requires [input-api](https://github.com/CCDirectLink/input-api) to function properly.)

---
# For Modders
## Action Steps
Many new action steps that are designed to simplify the creation of various actions - both player and enemy!

**Note:** The examples will use comments as a way of filling in missing/"unneeded" data to illustrate how to use the action steps - though they WILL NOT work with comments in actual practice. Remember that JSON does not support comments, I'm merely using them here for demonstration purposes only.

Table of Contents:
* Flow Control:
  * [`EL_ELEMENT_IF`](#el_element_if)
  * [`GOTO_LABEL_WHILE`](#goto_label_while)
  * [`SWITCH_CASE`](#switch_case)
  * [`WHILE_TRUE`](#while_true)
  * [`FOR_VAR`](#for_var)
  * [`FOR_ATTRIB`](#for_attrib)
  * [`FOR_PARTY_MEMBERS`](#for_party_members)
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

### SWITCH_CASE
Allows you to have switch which branch of steps is executed depending on a var's value. If a case named `_default` is present, that will be selected if there is no match.

***Important thing to keep in mind*** - if you're testing for number, due to how both JSON and JS work - you *must* represent the number as a string. Don't worry - it will otherwise work as you expect. 
```jsonc
{
  "type": "SWITCH_CASE",
  "var": "tmp.somevarhere", //the variable you are testing.
  "cases": {
    "1": [{
      /*steps here*/
    }],
    "2": [{
      /*steps here*/
    }],
    "3": [{
      /*steps here*/
    }]
  }
}
```

### WHILE_TRUE
Will repeatedly execute steps until the condition is no longer met.
```jsonc
{
  "type": "WHILE_TRUE",
  "condition": "tmp.something <= 2",
  "steps": [{
    /*step*/
  },{
    /*step*/
  },{
    /*step*/
  }]
}
```

### FOR_VAR
Will loop over a finite set of values, setting a variable to the relevant value on every loop.

```jsonc
{
  "type": "FOR_VAR",
  "values": [1,2,3,4,5],
  "varName": "tmp.something",
  "steps": [{
    /*step*/
  },{
    /*step*/
  },{
    /*step*/
  }]
}
```

### FOR_ATTRIB
Works functionally the same as `FOR_VAR`, but instead of setting a var it will set an attribute on the entity in question.

```jsonc
{
  "type": "FOR_ATTRIB",
  "values": [1,2,3,4,5],
  "attrib": "something",
  "steps": [{
    /*step*/
  },{
    /*step*/
  },{
    /*step*/
  }]
}
```

### FOR_PARTY_MEMBERS
Will loop through all party members (and optionally the player) and set the entity's temp target to them.

```jsonc
{
  "type": "FOR_PARTY_MEMBERS",
  "includePlayer": true,
  "steps": [{
    /*step*/
  },{
    /*step*/
  },{
    /*step*/
  }]
}
```

## Event Steps
A few new event steps are added for ease of making custom events.
For [`SWITCH_CASE`](#switch_case), [`WHILE_TRUE`](#while_true), and [`FOR_VAR`](#for_var) - see their Action Step counterparts, as the syntax and functionality is identical.

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

## Custom Trophy Icons
*TODO*

## Custom Chest Tracking
*TODO*

## Custom Shop Currencies
*TODO*


## Commands
This tweak pack contains a variety of commands which are designed to help modders with deving - designed to be easy to use through the console.

**Table of Contents**:
- [Adding Items](#cmdadditemid-amount-hidemsg)
- [Adding Credits](#cmdaddcreditsamount)
- [Teleporting](#cmdteleportmapname-destination)
- [Reloading Player Configs](#cmdreloadplayerconfigsreloadeffects)
- [Reloading Effect Sheets](#cmdreloadeffectsheets)
- [Reloading an Enemy Type](#cmdreloadenemytypeenemyname-reloadeffects)
- [Spawning Enemies](#cmdspawnenemyenemyname-leveloverride-settings-pos)
- [Reloading the Current Map](#cmdreloadmap)
- [Resetting Map Variables](#cmdresetmapvarsincludetmp)
- [Resetting Temp Variables](#cmdresettmpvars)

### `cmd.addItem(id, amount?, hideMsg?)`
A safe version of `sc.model.player.addItem(...)`, not allowing you to add invalid items to the inventory (which can cause crashes).

Parameters:
- `id`: The item ID of the item you're trying to add. Can be a numeric ID or a string.
- `amount`: How many items to add to the inventory. Defaults to 1.
- `hideMsg`: Whether or not to show the message in the corner that you got a new item. Defaults to false.

### `cmd.addCredits(amount)`
Gives money to the player - should be self explanatory.

Parameters:
- `amount`: How many credits to add.

### `cmd.teleport(mapName, destination?)`
A shorthand version of `ig.game.teleport()`.

Parameters:
- `mapName`: The name of the map in question that you're teleporting to.
- `destination`: An object containing information about where to place the player upon teleportation. (todo: elaborate on this)

### `cmd.reloadPlayerConfigs(reloadEffects?)`
A way to quickly reload all player/party member configs, so you don't have to reload the game to see a change in effect. By default, will also reload all effects.

Parameters:
- `reloadEffects`: Whether or not to reload the effect sheets as well. Defaults to true.

### `cmd.reloadEffectSheets()`
Will cause all effects to be reloaded, allowing you to see any changes to effect sheets to be reflected without reloading the game.

### `cmd.reloadEnemyType(enemyName, reloadEffects?)`
Will cause a specific enemy file to be reloaded from disk, allowing any changes to be reflected in-game without having to restart. By default, reloads all effects as well.

Parameters:
- `enemyName`: The path to the enemy type that will be reloaded.
- `reloadEffects`: Whether or not to reload the effect sheets as well. Defaults to true.

### `cmd.spawnEnemy(enemyName, levelOverride?, settings?, pos?)`
Spawns the enemy specified by `enemyName`, defaulting to the player's position. Enemy level can be conveniently overridden if desired, as well as any other miscellaneous settings that you desire to change.

Parameters:
- `enemyName`: The path to the enemy that will be spawned.
- `levelOverride`: The level the enemy should be spawned in as - defaulting to their standard level if not specified and/or left as `undefined`/`null`.
- `settings`: An object containing the information related to the enemy type. 
- `pos`: A vec3 containing the position to spawn the enemy, defaulting to the player's position.

### `cmd.reloadMap()`
Reloads the current map the player is in, spawning you at the exact same position as you were pre-reloading.

### `cmd.resetMapVars(includeTmp?)`
Clears all the variables associated with the current map, and if specified the temporary variables in the current map as well.

Parameters:
- `includeTmp`: Whether or not to include the `tmp` namespace in map clearing as well.

### `cmd.resetTmpVars()`
Clears all temporary variables which are found in the `tmp` namespace.

