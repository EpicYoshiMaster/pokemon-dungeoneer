import { FloorProperties, Dungeon, GenerationConstants, AdvancedGenerationSettings, FloorLayout, HiddenStairsType, MissionType, DungeonObjectiveType } from 'dungeon-mystery';
import { prepareContextualReducer } from '../../utils/hooks'
import { DungeoneerReducerAction, DungeoneerReducerState, RESET_STATE, SET_CURRENT_STATE } from './types';

const defaultState: DungeoneerReducerState = {
	floor_props: {
		layout: FloorLayout.LAYOUT_LARGE,
		room_density: 6,
		item_density: 5,
		buried_item_density: 10,
		enemy_density: 10,
		trap_density: 5,
		floor_connectivity: 15,
		num_extra_hallways: 10,
		kecleon_shop_chance: 20,
		monster_house_chance: 20,
		itemless_monster_house_chance: 0,
		maze_room_chance: 0,
		allow_dead_ends: false,
		room_flags: {
			f_room_imperfections: false,
			f_secondary_terrain_generation: true,
		},
		secondary_terrain_density: 5,
		secondary_structures_budget: 0,
		floor_number: 0,
		fixed_room_id: 0,
		hidden_stairs_type: HiddenStairsType.HIDDEN_STAIRS_NONE,
		hidden_stairs_spawn_chance: 0,
	},
	dungeon_data: {
		id: 0,
		floor: 0,
		n_floors_plus_one: 5,
		rescue_floor: 0,
		nonstory_flag: true,
		mission_destination:
		{
			is_destination_floor: false,
			mission_type: MissionType.MISSION_RESCUE_CLIENT,
			mission_subtype: 0,
		},
		dungeon_objective: DungeonObjectiveType.OBJECTIVE_NORMAL,
		guaranteed_item_id: 0,

		num_items: 0,
		kecleon_shop_min_x: 0,
		kecleon_shop_min_y: 0,
		kecleon_shop_max_x: 0,
		kecleon_shop_max_y: 0,
		list_tiles: [...Array(56)].map(a => Array(32)),
		fixed_room_tiles: [...Array(8)].map(a => Array(8)),
		active_traps: new Array(64),
	},
	generation_constants: new GenerationConstants(),
	advanced_generation_settings: new AdvancedGenerationSettings(),
};

const reducer = (state: DungeoneerReducerState, action: DungeoneerReducerAction): DungeoneerReducerState => {

	switch(action.type)
	{
		case RESET_STATE:
			return { ...defaultState };
		case SET_CURRENT_STATE:
			return { ...state, 
					floor_props: 
					{
						...state.floor_props,
						...action.payload.floor_props
					},
					dungeon_data:
					{
						...state.dungeon_data,
						...action.payload.dungeon_data,
					},
					generation_constants:
					{
						...state.generation_constants,
						...action.payload.generation_constants,
					},
					advanced_generation_settings:
					{
						...state.advanced_generation_settings,
						...action.payload.advanced_generation_settings,
					}};
		default:
			return state;
	}
}

export const DungeoneerContext = prepareContextualReducer(reducer, defaultState);

export function resetState(): DungeoneerReducerAction {
	return {
		type: RESET_STATE,
	};
}

export function setCurrentState(state: Partial<DungeoneerReducerState>): DungeoneerReducerAction {
	return {
		type: SET_CURRENT_STATE,
		payload: state,
	};
}