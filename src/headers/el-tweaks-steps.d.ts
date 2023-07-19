export {}

declare global {
    namespace ig.EVENT_STEP {
        namespace FOR_VAR {
            interface Settings {
                varName: string;
                values: ig.VarValue[];
                steps: unknown[];
            }
            interface Constructor extends ImpactClass<FOR_VAR> {
                new (settings: Settings): FOR_VAR;
            }
        }
        interface FOR_VAR extends EventStepBase, el.LoopStep {
            varName: string;
            values: ig.VarValue[];
            index: number;
        }
        let FOR_VAR: FOR_VAR.Constructor;

        namespace WHILE_TRUE {
            interface Settings {
                condition: string;
                steps: unknown[];
            }
            interface Constructor extends ImpactClass<WHILE_TRUE> {
                new (settings: Settings): WHILE_TRUE;
            }
        }
        interface WHILE_TRUE extends EventStepBase, el.LoopStep {
            condition: ig.VarCondition;
        }
        let WHILE_TRUE: WHILE_TRUE.Constructor;

        namespace __LoopEnd {
            interface Settings {
                parentStep: ig.ActionStepBase & el.LoopStep;
            }
            interface Constructor extends ImpactClass<__LoopEnd> {
                new(settings: Settings): __LoopEnd; 
            }
        }
        interface __LoopEnd extends ig.ActionStepBase {
            parentStep: ig.ActionStepBase & el.LoopStep;
        }
        let __LoopEnd: __LoopEnd.Constructor;

        //#region SWITCH_CASE
        namespace SWITCH_CASE {
            type CaseName = `_case_${string | number}`;

            interface Settings {
                var: string;
                cases: {[branch: string | number]: unknown};
                [branch: CaseName]: unknown;
            }
        }
        interface SWITCH_CASE extends ActionStepBase {
            cases: SWITCH_CASE.CaseName[];
            branches: Record<SWITCH_CASE.CaseName, ig.ActionStepBase>;
            var: string;
            namesToBranches: Record<string | number, SWITCH_CASE.CaseName>;
            hasDefault: boolean;
        }
        interface SWITCH_CASE_CONSTRUCTOR extends ImpactClass<SWITCH_CASE> {
            new (settings: SWITCH_CASE.Settings): SWITCH_CASE;
        }
        let SWITCH_CASE: SWITCH_CASE_CONSTRUCTOR;
        //#endregion
    }
    
    namespace ig.ACTION_STEP {
        //#region EL_SET_TARGET
        namespace EL_SET_TARGET {
            interface Settings {
                name: string
            }
        }
        interface EL_SET_TARGET extends ig.ActionStepBase {
            name: string;
            start(this: this, target: ig.ENTITY.Combatant): void
        }
        interface EL_SET_TARGET_CONSTRUCTOR extends ImpactClass<EL_SET_TARGET> {
            new (settings: EL_SET_TARGET.Settings): EL_SET_TARGET
        }
        var EL_SET_TARGET: EL_SET_TARGET_CONSTRUCTOR;
        //#endregion

        //#region EL_ELEMENT_IF
        interface EL_ELEMENT_IF extends ig.ActionStepBase {
            branches: Record<string, ig.ActionStepBase>;
            getBranchNames(this: this): string[];
            getNext(this: this, entity: ig.ENTITY.Combatant): ig.ActionStepBase
        }
        interface EL_ELEMENT_IF_CONSTRUCTOR extends ImpactClass<EL_ELEMENT_IF> {
            new (): EL_ELEMENT_IF;
        }
        var EL_ELEMENT_IF: EL_ELEMENT_IF_CONSTRUCTOR;
        //#endregion

        //#region GOTO_LABEL_WHILE
        namespace GOTO_LABEL_WHILE {
            interface Settings {
                name: string;
                condition: string;
            }
        }
        interface GOTO_LABEL_WHILE extends ig.ActionStepBase {
            name: string;
            condition: ig.VarCondition;

        }
        interface GOTO_LABEL_WHILE_CONSTRUCTOR extends ImpactClass<GOTO_LABEL_WHILE> {
            new (settings: GOTO_LABEL_WHILE.Settings): GOTO_LABEL_WHILE;
        }
        var GOTO_LABEL_WHILE: GOTO_LABEL_WHILE_CONSTRUCTOR
        //#endregion

        //#region SWITCH_CASE
        namespace SWITCH_CASE {
            type CaseName = `_case_${string | number}`;

            interface Settings {
                var: string;
                cases: {[branch: string | number]: unknown};
                [branch: CaseName]: unknown;
            }
        }
        interface SWITCH_CASE extends ActionStepBase {
            cases: SWITCH_CASE.CaseName[];
            branches: Record<SWITCH_CASE.CaseName, ig.ActionStepBase>;
            var: string;
            namesToBranches: Record<string | number, SWITCH_CASE.CaseName>;
            hasDefault: boolean;
        }
        interface SWITCH_CASE_CONSTRUCTOR extends ImpactClass<SWITCH_CASE> {
            new (settings: SWITCH_CASE.Settings): SWITCH_CASE;
        }
        let SWITCH_CASE: SWITCH_CASE_CONSTRUCTOR;
        //#endregion

        //#region FOR_VAR
        namespace FOR_VAR {
            interface Settings {
                varName: string;
                values: ig.VarValue[];
                steps: unknown[];
            }
            interface Constructor extends ImpactClass<FOR_VAR> {
                new (settings: Settings): FOR_VAR;
            }
        }
        interface FOR_VAR extends ActionStepBase, el.LoopStep {
            varName: string;
            values: ig.VarValue[];
            index: number;
        }
        let FOR_VAR: FOR_VAR.Constructor;
        //#endregion
        
        //#region FOR_ATTRIB
        namespace FOR_ATTRIB {
            interface Settings {
                attrib: string;
                values: ig.VarValue[];
                steps: unknown[];
            }
            interface Constructor extends ImpactClass<FOR_ATTRIB> {
                new (settings: Settings): FOR_ATTRIB;
            }
        }
        interface FOR_ATTRIB extends ActionStepBase, el.LoopStep {
            attrib: string;
            values: ig.VarValue[];
            index: number;
        }
        let FOR_ATTRIB: FOR_ATTRIB.Constructor;
        //#endregion
        
        //#region FOR_PARTY_MEMBERS
        namespace FOR_PARTY_MEMBERS {
            interface Settings {
                includePlayer?: boolean;
                includeSelf?: boolean;
                steps: unknown[];
            }
            interface Constructor extends ImpactClass<FOR_PARTY_MEMBERS> {
                new (settings: Settings): FOR_PARTY_MEMBERS;
            }
        }
        interface FOR_PARTY_MEMBERS extends ActionStepBase, el.LoopStep {
            includePlayer: boolean;
            values: sc.PartyMemberEntity[];
            index: number;
        }
        let FOR_PARTY_MEMBERS: FOR_PARTY_MEMBERS.Constructor;
        //#endregion

        //#region WHILE_TRUE
        namespace WHILE_TRUE {
            interface Settings {
                condition: string;
                steps: unknown[];
            }
            interface Constructor extends ImpactClass<WHILE_TRUE> {
                new (settings: Settings): WHILE_TRUE;
            }
        }
        interface WHILE_TRUE extends ActionStepBase, el.LoopStep {
            condition: ig.VarCondition;

            getNext(this: this): Optional<ig.ActionStepBase>;
        }
        let WHILE_TRUE: WHILE_TRUE.Constructor;
        //#endregion

        //#region __LoopEnd
        namespace __LoopEnd {
            interface Settings {
                parentStep: ig.ActionStepBase & el.LoopStep;
            }
            interface Constructor extends ImpactClass<__LoopEnd> {
                new(settings: Settings): __LoopEnd; 
            }
        }
        interface __LoopEnd extends ig.ActionStepBase {
            parentStep: ig.ActionStepBase & el.LoopStep;
        }
        let __LoopEnd: __LoopEnd.Constructor;
        //#endregion

        //#region SET_ATTRIB_CURRENT_POS
        namespace SET_ATTRIB_CURRENT_POS {
            interface Settings {
                attrib: string;
            }
        }
        interface SET_ATTRIB_CURRENT_POS extends ig.ActionStepBase {
            attrib: string;
        }
        interface SET_ATTRIB_CURRENT_POS_CONSTRUCTOR extends ImpactClass<SET_ATTRIB_CURRENT_POS> {
            new (settings: SET_ATTRIB_CURRENT_POS.Settings): SET_ATTRIB_CURRENT_POS;
        }
        var SET_ATTRIB_CURRENT_POS: SET_ATTRIB_CURRENT_POS_CONSTRUCTOR
        //#endregion

        //#region Injections
        namespace SET_CLOSE_TEMP_TARGET {
            interface Settings {
                customSearchType?: SearchType
            }
        }
        //#endregion
    }

    namespace ig.EFFECT_ENTRY {
        namespace SET_SHADOW  {
            type Settings = ig.ACTION_STEP.SET_SHADOW.Settings ;
        }
        interface SET_SHADOW extends ig.EffectStepBase {
            size: number;
            shadowType: ig.COLL_SHADOW_TYPE;
            shadowScaleY: number;
        }
        interface SET_SHADOW_CONSTRUCTOR extends ImpactClass<SET_SHADOW> {
            new (settings: SET_SHADOW.Settings): SET_SHADOW;
        }
        let SET_SHADOW: SET_SHADOW_CONSTRUCTOR
    }
}