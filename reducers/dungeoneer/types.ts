import { FloorProperties, Dungeon, AdvancedGenerationSettings, GenerationConstants } from 'dungeon-mystery'

export const RESET_STATE = 'RESET_STATE';
export const SET_CURRENT_STATE = 'SET_CURRENT_STATE';

export interface DungeoneerReducerState {
	floor_props: FloorProperties,
	dungeon_data: Dungeon,
	generation_constants: GenerationConstants,
	advanced_generation_settings: AdvancedGenerationSettings,
}

type ResetStateAction = {
	type: typeof RESET_STATE;
}

type SetCurrentStateAction = {
	type: typeof SET_CURRENT_STATE,
	payload: Partial<DungeoneerReducerState>;
}

export type DungeoneerReducerAction = 
	ResetStateAction |
	SetCurrentStateAction;