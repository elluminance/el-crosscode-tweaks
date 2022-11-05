export {}

declare global {
    namespace ig.ACTION_STEP {
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


        interface EL_ELEMENT_IF extends ig.ActionStepBase {
            branches: Record<string, ig.ActionStepBase>;
            getBranchNames(this: this): string[];
            getNext(this: this, entity: ig.ENTITY.Combatant): ig.ActionStepBase
        }
        interface EL_ELEMENT_IF_CONSTRUCTOR extends ImpactClass<EL_ELEMENT_IF> {
            new (): EL_ELEMENT_IF;
        }
        var EL_ELEMENT_IF: EL_ELEMENT_IF_CONSTRUCTOR;


        namespace GOTO_LABEL_WHILE {
            interface Settings {
                name: string;
                condition: string;
            }
        }
        interface GOTO_LABEL_WHILE extends ig.ActionStepBase {
            name: string;
            condition: ig.VarCondition;

            getJumpLabelName(this: this): string | null;
        }
        interface GOTO_LABEL_WHILE_CONSTRUCTOR extends ImpactClass<GOTO_LABEL_WHILE> {
            new (settings: GOTO_LABEL_WHILE.Settings): GOTO_LABEL_WHILE;
        }
        var GOTO_LABEL_WHILE: GOTO_LABEL_WHILE_CONSTRUCTOR


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


        namespace SET_CLOSE_TEMP_TARGET {
            interface Settings {
                customSearchType?: SearchType
            }
        }
    }
}