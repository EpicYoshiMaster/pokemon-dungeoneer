import { GenerationStepLevel, GenerationType, MajorGenerationType, MinorGenerationType } from "dungeon-mystery";
import React from "react";

export interface GenerationEvent
{
  level: GenerationStepLevel;
  type: GenerationType;
}

interface GenerationStepSelectorProps
{
	id: string,
	value: number,
	onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void,
	events: GenerationEvent[];
};

function GetEventText(level: GenerationStepLevel, type: GenerationType): string
{
	if(level == GenerationStepLevel.GEN_STEP_MINOR)
	{
		switch(type)
		{
			case MinorGenerationType.GEN_TYPE_CREATE_ROOM:
				return "Create Room";
			case MinorGenerationType.GEN_TYPE_CREATE_ANCHOR:
				return "Create Hallway Anchor";
			case MinorGenerationType.GEN_TYPE_CREATE_HALLWAY:
				return "Create Hallway";
			case MinorGenerationType.GEN_TYPE_MERGE_ROOM:
				return "Merge Rooms Together";
			case MinorGenerationType.GEN_TYPE_ENSURE_CONNECTED_HALLWAY:
				return "Add Hallway to Connect Room";
			case MinorGenerationType.GEN_TYPE_REMOVE_UNCONNECTED_ANCHOR:
				return "Remove Unconnected Hallway Anchor";
			case MinorGenerationType.GEN_TYPE_REMOVE_UNCONNECTED_ROOM:
				return "Remove Unconnected Room";
			case MinorGenerationType.GEN_TYPE_GENERATE_EXTRA_HALLWAY:
				return "Generate Extra Hallway";
			case MinorGenerationType.GEN_TYPE_GENERATE_ROOM_IMPERFECTION:
				return "Generate Imperfections on Room";
			case MinorGenerationType.GEN_TYPE_GENERATE_SECONDARY_STRUCTURE:
				return "Generate Secondary Structure";
			case MinorGenerationType.GEN_TYPE_MERGE_ROOM_VERTICALLY:
				return "Merge Room Vertically";
			case MinorGenerationType.GEN_TYPE_SECONDARY_TERRAIN_RIVER:
				return "Generate Secondary Terrain River";
			case MinorGenerationType.GEN_TYPE_SECONDARY_TERRAIN_RIVER_LAKE:
				return "Generate Secondary Terrain Lake on River";
			case MinorGenerationType.GEN_TYPE_SECONDARY_TERRAIN_STANDALONE_LAKE:
				return "Generate Secondary Terrain Standalone Lake";
			case MinorGenerationType.GEN_TYPE_SPAWN_STAIRS:
				return "Spawn the Stairs";
			case MinorGenerationType.GEN_TYPE_SPAWN_ITEMS:
				return "Spawn Items";
			case MinorGenerationType.GEN_TYPE_SPAWN_BURIED_ITEMS:
				return "Spawn Buried Items";
			case MinorGenerationType.GEN_TYPE_SPAWN_MONSTER_HOUSE_ITEMS_TRAPS:
				return "Spawn Items / Traps in the Monster House";
			case MinorGenerationType.GEN_TYPE_SPAWN_TRAPS:
				return "Spawn Traps";
			case MinorGenerationType.GEN_TYPE_SPAWN_PLAYER:
				return "Place the Player Spawn";
			case MinorGenerationType.GEN_TYPE_SPAWN_NON_MONSTER_HOUSE_ENEMIES:
				return "Spawn Standard Enemies";
			case MinorGenerationType.GEN_TYPE_SPAWN_MONSTER_HOUSE_EXTRA_ENEMIES:
				return "Spawn Extra Monster House Enemies";
		}
	}
	else
	{
		switch(type)
		{
			case MajorGenerationType.GEN_TYPE_RESET_FLOOR:
				return "Reset Floor";
			case MajorGenerationType.GEN_TYPE_INIT_DUNGEON_GRID:
				return "Initialize Dungeon Grid";
			case MajorGenerationType.GEN_TYPE_CREATE_ROOMS_AND_ANCHORS:
				return "Finish Creating Rooms and Hallway Anchors";
			case MajorGenerationType.GEN_TYPE_CREATE_GRID_CELL_CONNECTIONS:
				return "Finish Creating Grid Cell Connections";
			case MajorGenerationType.GEN_TYPE_ENSURE_CONNECTED_GRID:
				return "Finish Ensuring Grid is Connected";
			case MajorGenerationType.GEN_TYPE_GENERATE_MAZE_ROOM:
				return "Generate Maze Room";
			case MajorGenerationType.GEN_TYPE_GENERATE_KECLEON_SHOP:
				return "Generate Kecleon Shop";
			case MajorGenerationType.GEN_TYPE_GENERATE_MONSTER_HOUSE:
				return "Generate Monster House";
			case MajorGenerationType.GEN_TYPE_GENERATE_EXTRA_HALLWAYS:
				return "Finish Generating Extra Hallways";
			case MajorGenerationType.GEN_TYPE_GENERATE_ROOM_IMPERFECTIONS:
				return "Finish Generating Room Imperfections";
			case MajorGenerationType.GEN_TYPE_GENERATE_SECONDARY_STRUCTURES:
				return "Finish Generating Secondary Structures";
			case MajorGenerationType.GEN_TYPE_ONE_ROOM_MONSTER_HOUSE_FLOOR:
				return "Finish Setting Up One Room Monster House Floor";
			case MajorGenerationType.GEN_TYPE_OUTER_RING_FLOOR:
				return "Finish Setting Up Outer Ring Floor";
			case MajorGenerationType.GEN_TYPE_CROSSROADS_FLOOR:
				return "Finish Setting Up Crossroads Floor";
			case MajorGenerationType.GEN_TYPE_TWO_ROOMS_WITH_MONSTER_HOUSE_FLOOR:
				return "Finish Setting Up Two Rooms with Monster House Floor";
			case MajorGenerationType.GEN_TYPE_MERGE_ROOM_VERTICALLY:
				return "Finish Merging Center Column Rooms Vertically";
			case MajorGenerationType.GEN_TYPE_GENERATE_SECONDARY_TERRAIN:
				return "Finish Generating Secondary Terrain";
			case MajorGenerationType.GEN_TYPE_SPAWN_NON_ENEMIES:
				return "Finish Spawning Non-Enemy Entities";
			case MajorGenerationType.GEN_TYPE_SPAWN_ENEMIES:
				return "Finish Spawning Enemies";
			case MajorGenerationType.GEN_TYPE_GENERATE_FLOOR:
				return "Generation Complete!";
		}
	}

	return "Unknown Event";
}

export const GenerationStepSelector: React.FC<GenerationStepSelectorProps> = ({ id, value, onChange, events }) => {

	return (
		<select id={id} value={value} onChange={(event) => onChange(event)}>
			{
				events.map((event, i) => {
					{
						return <option value={i} key={i}>
							{
								(i + 1) + ". " + GetEventText(event.level, event.type)
							}
							</option>
					}
				})
			}
		</select>
	);
};