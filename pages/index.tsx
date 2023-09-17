import React, { useCallback, useContext, useMemo, useState } from 'react';
import styled, { ThemeContext, useTheme } from 'styled-components'
import { NextPage } from 'next';
import NonSSRWrapper from '../components/NonSSRWrapper';
import { InputSection, InputSubheader, InputRow, Checkbox, Button, HelpText, Header, ErrorText, LabelButton } from '../components/Layout'
import { Grid, LegendSquare, TileDisplayData, ToTileDisplayData } from '../components/Grid'
import { DungeoneerContext, setCurrentState } from '../reducers/dungeoneer/reducer'
import { GenerateDungeon, FloorLayout, HiddenStairsType, MissionType, MissionSubtypeChallenge, MissionSubtypeExplore, MissionSubtypeOutlaw, MissionSubtypeTakeItem, DungeonObjectiveType, Dungeon, DungeonGenerationInfo, FloorGenerationStatus, GenerationStepLevel, GenerationType, MajorGenerationType, TerrainType, Tile } from 'dungeon-mystery';
import { GenerationStepSelector } from '../components/GenerationStepSelector';
import { useDropzone } from 'react-dropzone';

export interface GenerationEvent 
{
	level: GenerationStepLevel;
	type: GenerationType;
}

interface GeneratedDungeonData
{
	events: GenerationEvent[];
	maps: TileDisplayData[][][];
};

const NUM_HELP_TEXT_BUTTONS = 40;
const helpTextInitialState: boolean[] = new Array(NUM_HELP_TEXT_BUTTONS).fill(false);

const Home: NextPage = () => {
	const state = DungeoneerContext.useState();
	const dispatch = DungeoneerContext.useDispatch();
	const theme = useTheme();

	const [importError, setImportError] = useState<string | null>(null);
	const [helpTextState, setHelpTextState] = useState(helpTextInitialState);

	const handleShowAllHelpText = () => {
		const newHelpTextState: boolean[] = helpTextState.map(() => {
			return true;
		});

		setHelpTextState(newHelpTextState);
	};

	const handleHideAllHelpText = () => {
		const newHelpTextState: boolean[] = helpTextState.map(() => {
			return false;
		});

		setHelpTextState(newHelpTextState);
	};

	const handleToggleHelpTextIndex = (help_index: number) => {
		const newHelpTextState: boolean[] = helpTextState.map((value, index) => {
			if(help_index == index)
			{
				return !value;
			}

			return value;
		});

		setHelpTextState(newHelpTextState);
	};
	
	//
	// Floor Properties
	//
	const [floor_props, setFloorProps] = useState(state.floor_props);
	const handleSetFloorProps = (event: any, value?: any) => {
		const id = event.target.id;

		value = (typeof value === 'undefined') ? Number(event.target.value) : value;

		setFloorProps({ ...floor_props, [id]: value });
	};

	const handleSetRoomFlags = (event: any, value?: any) => {
		const id = event.target.id;

		value = (typeof value === 'undefined') ? Number(event.target.value) : value;

		setFloorProps({ ...floor_props, room_flags: { ...floor_props.room_flags, [id]: value } });
	}

	//
	// Dungeon Properties
	//
	const [dungeon_data, setDungeonData] = useState(state.dungeon_data);
	const handleSetDungeonData = (event: any, value?: any) => {
		const id = event.target.id;

		value = (typeof value === 'undefined') ? Number(event.target.value) : value;

		setDungeonData({ ...dungeon_data, [id]: value });
	};

	const handleSetMissionDestination = (event: any, value?: any) => {
		const id = event.target.id;

		value = (typeof value === 'undefined') ? Number(event.target.value) : value;

		setDungeonData({ ...dungeon_data, mission_destination: { ...dungeon_data.mission_destination, [id]: value } });
	};

	//
	// Generation Constants
	//
	const [generation_constants, setGenerationConstants] = useState(state.generation_constants);
	const handleSetGenerationConstants = (event: any, value?: any) => {
		const id = event.target.id;

		value = (typeof value === 'undefined') ? Number(event.target.value) : value;

		setGenerationConstants({ ...generation_constants, [id]: value });
	};

	//
	// Advanced Generation Settings
	//
	const [advanced_generation_settings, setAdvancedGenerationSettings] = useState(state.advanced_generation_settings);
	const handleSetAdvancedGenerationSettings = (event: any, value?: any) => {
		const id = event.target.id;

		value = (typeof value === 'undefined') ? Number(event.target.value) : value;

		setAdvancedGenerationSettings({ ...advanced_generation_settings, [id]: value });
	};

	//
	// Dungeon Map
	//
	const [show_cell_boundary, setShowCellBoundary] = useState(true);
	const [show_entities, setShowEntities] = useState(true);
	const [current_map_index, setCurrentMapIndex] = useState(0);
	const handleSetCurrentMapIndex = (new_index: number) => {
		if(new_index < 0)
		{
			new_index = 0;
		}

		if(new_index >= generated_dungeon_data.maps.length)
		{
			new_index = generated_dungeon_data.maps.length - 1;
		}

		setCurrentMapIndex(new_index);
	};

	const unpushed_state = useMemo(() => {
		return { 
			floor_props: { ...floor_props },
			dungeon_data: { ...dungeon_data },
			generation_constants: { ...generation_constants },
			advanced_generation_settings: { ...advanced_generation_settings },
		}
	}, [floor_props, dungeon_data, generation_constants, advanced_generation_settings]);

	const handleImport = useCallback((acceptedFiles: File[]) => {
		if(acceptedFiles.length > 1)
		{
			setImportError("Only one settings file can be imported at a time.");
			return;
		}

		if(acceptedFiles.length == 0)
		{
			setImportError("An unknown issue occurred while trying to load the file.");
			return;
		}

		const [ file ] = acceptedFiles;

		if(!file.name.endsWith('.json'))
		{
			setImportError("Dungeoneer settings files must end in .json");
			return;
		}

		const reader = new FileReader();

		reader.onabort = () => {
			setImportError("The file read process was aborted.");
		}

		reader.onerror = () => {
			setImportError("An unknown issue occurred while trying to read the file. The file may be corrupted.");
		}

		reader.onload = () => {
			try {
				const importedJSON = JSON.parse(reader.result?.toString() ?? '');

				if(importedJSON.floor_props && importedJSON.dungeon_data && importedJSON.generation_constants && importedJSON.advanced_generation_settings)
				{
					setFloorProps(importedJSON.floor_props);
					setDungeonData(importedJSON.dungeon_data);
					setGenerationConstants(importedJSON.generation_constants);
					setAdvancedGenerationSettings(importedJSON.advanced_generation_settings);

					setImportError(null);
				}
				else
				{
					setImportError("The file provided failed to be matched as a dungeoneer settings file.");
				}
			} catch (error) {
				setImportError(`The dungeoneer settings file could not be read: ${error}.`);
			}
		}

		reader.readAsBinaryString(file);
	}, []);

	const { getRootProps, getInputProps, open } = useDropzone({ onDrop: handleImport, accept: { 'application/json': ['.json'] } , noClick: true, noDrag: true, noKeyboard: true, multiple: false });

	const handleExport = useCallback(() => {
		const a = document.createElement('a');

		a.href = URL.createObjectURL(new Blob([JSON.stringify(unpushed_state, null, 2)], { type: 'text/plain' }));

		a.setAttribute('download', 'dungeoneer-settings.json');

		document.body.appendChild(a);

		a.click();

		document.body.removeChild(a);
	}, [unpushed_state]);

	const handleSetCurrentState = useCallback(() => {
		dispatch(setCurrentState(unpushed_state));
	}, [dispatch, unpushed_state]);

	const generated_dungeon_data: GeneratedDungeonData = useMemo(() => {
		
		let generated_dungeon_data: GeneratedDungeonData = { events: [], maps: [] };

		function DungeonGenerationCallbackFunction(
			generation_step_level: GenerationStepLevel,
			generation_type: GenerationType,
			dungeon_data: Dungeon, 
			dungeon_generation_info: DungeonGenerationInfo, 
			floor_generation_status: FloorGenerationStatus, 
			grid_cell_start_x: number[],
			grid_cell_start_y: number[])
		{
			generated_dungeon_data.events.push({ level: generation_step_level, type: generation_type });

			let new_dungeon_map = ToTileDisplayData(
				theme,
				generation_step_level,
				generation_type,
				dungeon_data,
				dungeon_generation_info,
				floor_generation_status,
				grid_cell_start_x,
				grid_cell_start_y);
	
			generated_dungeon_data.maps.push(new_dungeon_map);
		}

		GenerateDungeon(state.floor_props, state.dungeon_data, state.generation_constants, state.advanced_generation_settings, DungeonGenerationCallbackFunction, GenerationStepLevel.GEN_STEP_MINOR);

		setCurrentMapIndex(generated_dungeon_data.maps.length - 1);

		return generated_dungeon_data;
	}, [state, theme]);

	return (
	<NonSSRWrapper>
    <Container>
		<div>
			<div {...getRootProps()}>
				<input {...getInputProps()} />
				<Header>
					Dungeon Generator

					<div>
						<Button onClick={open}>Import</Button>
						<Button onClick={handleExport}>Export</Button>

						{(helpTextState.some((element) => element) && (
							<Button onClick={handleHideAllHelpText}>Hide All Help Text</Button>
						)) || (
							<Button onClick={handleShowAllHelpText}>Show All Help Text</Button>
						)
						}
					</div>
				</Header>
			</div>

			<InputSection>
				{importError && (<ErrorText>Error: {importError}</ErrorText>)}
				<InputSubheader>Floor Properties</InputSubheader>

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(0)}>Layout</LabelButton>
					<select id="layout" value={floor_props.layout} onChange={handleSetFloorProps}>
						<option value={FloorLayout.LAYOUT_LARGE}>0 (Large)</option>
						<option value={FloorLayout.LAYOUT_SMALL}>1 (Small)</option>
						<option value={FloorLayout.LAYOUT_ONE_ROOM_MONSTER_HOUSE}>2 (One Room Monster House)</option>
						<option value={FloorLayout.LAYOUT_OUTER_RING}>3 (Outer Ring)</option>
						<option value={FloorLayout.LAYOUT_CROSSROADS}>4 (Crossroads)</option>
						<option value={FloorLayout.LAYOUT_TWO_ROOMS_WITH_MONSTER_HOUSE}>5 (Two Rooms with Monster House)</option>
						<option value={FloorLayout.LAYOUT_LINE}>6 (Line)</option>
						<option value={FloorLayout.LAYOUT_CROSS}>7 (Cross)</option>
						<option value={FloorLayout.LAYOUT_LARGE_0x8}>8 (Large 0x8)</option>
						<option value={FloorLayout.LAYOUT_BEETLE}>9 (Beetle)</option>
						<option value={FloorLayout.LAYOUT_OUTER_ROOMS}>10 (Outer Rooms)</option>
						<option value={FloorLayout.LAYOUT_MEDIUM}>11 (Medium)</option>
						<option value={FloorLayout.LAYOUT_UNUSED_0xC}>12 (Unused)</option>
						<option value={FloorLayout.LAYOUT_UNUSED_0xD}>13 (Unused)</option>
						<option value={FloorLayout.LAYOUT_UNUSED_0xE}>14 (Unused)</option>
						<option value={FloorLayout.LAYOUT_UNUSED_0xF}>15 (Unused)</option>
					</select>
					<HelpText show-text={helpTextState[0]}>
						The type of layout to generate. 
						Small, Medium, and Large are standard generators.
						The Large_0x8 layout is the same as Large but disallows generating a 6x4 grid.
						The Small layout uses only 50% of the available floor space, while Medium layout uses only 75%, with these generators both being limited to using either a 4x2 or 4x3 total grid size.
						The Unused Generators default to a Large layout.
						The rest are special, try them out!
					</HelpText>
				</InputRow>

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(1)}>Room Density</LabelButton>
					<input id="room_density" type="number" value={floor_props.room_density} onChange={handleSetFloorProps} />
					<HelpText show-text={helpTextState[1]}>
						The number of rooms to generate. 
						If positive, (Room Density + [0..2]) cells will become rooms.
						If negative, the number of rooms placed will be exact.
						If a cell selected to be a room is invalid, less rooms will be generated.
						The number of rooms assigned will always be at least 2 and no more than 36.
					</HelpText>
				</InputRow>

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(2)}>Item Density</LabelButton>
					<input id="item_density" type="number" value={floor_props.item_density} onChange={handleSetFloorProps} />
					<HelpText show-text={helpTextState[2]}>
						The number of items to spawn. 
						The actual number spawned will vary between (Item Density - 2) and (Item Density + 2).
						At least one item will always be spawned.
						If a guaranteed item ID is set, that item will also be spawned.
					</HelpText>
				</InputRow>

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(3)}>Buried Item Density</LabelButton>
					<input id="buried_item_density" type="number" value={floor_props.buried_item_density} onChange={handleSetFloorProps} />
					<HelpText show-text={helpTextState[3]}>
						The number of buried items to spawn in walls. 
						The actual number spawned will vary between (Buried Item Density - 2) and (Buried Item Density + 2).
						If 0 or less, no buried items will be spawned.
					</HelpText>
				</InputRow>

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(4)}>Enemy Density</LabelButton>
					<input id="enemy_density" type="number" value={floor_props.enemy_density} onChange={handleSetFloorProps} />
					<HelpText show-text={helpTextState[4]}>
						The number of enemies to spawn.
						If positive, the actual number spawned will vary between (Enemy Density / 2) and (Enemy Density).
						If negative, the number of enemies spawned will be exact.
						At least one enemy will always be spawned.
					</HelpText>
				</InputRow>

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(5)}>Trap Density</LabelButton>
					<input id="trap_density" type="number" value={floor_props.trap_density} onChange={handleSetFloorProps} />
					<HelpText show-text={helpTextState[5]}>
						The number of traps to spawn.
						The actual number spawned will vary between (Trap Density / 2) and (Trap Density).
						At most, 56 traps can spawn.
					</HelpText>
				</InputRow>

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(6)}>Floor Connectivity</LabelButton>
					<input id="floor_connectivity" type="number" value={floor_props.floor_connectivity} onChange={handleSetFloorProps} />
					<HelpText show-text={helpTextState[6]}>
						The number of primary connecting hallways to attempt to generate between rooms. 
						These connections are generated via a random walk starting from a random grid cell that roams across the floor.
						If the original selected cell was invalid (Small or Medium layout), this can sometimes result in no hallways being placed.
					</HelpText>
				</InputRow>

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(7)}>Number of Extra Hallways</LabelButton>
					<input id="num_extra_hallways" type="number" value={floor_props.num_extra_hallways} onChange={handleSetFloorProps} />
					<HelpText show-text={helpTextState[7]}>
						The number of extra hallways to attempt to generate. 
						These hallways consist of random momentum walks on the floor starting from a random room.
						They stop if they run into open terrain, out of bounds, an impassable tile, or would generate a 2x2 open square (that would be a room).
					</HelpText>
				</InputRow>

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(8)}>Kecleon Shop Chance</LabelButton>
					<input id="kecleon_shop_chance" type="number" value={floor_props.kecleon_shop_chance} onChange={handleSetFloorProps} />
					<HelpText show-text={helpTextState[8]}>
						The probability (0 to 100%) that a kecleon shop spawns on the floor.
						A kecleon shop cannot be spawned on a floor that has a monster house or is a rescue floor.
						The room a kecleon shop spawns in cannot have any special features (ex. merged or has a secondary structure) and must have dimensions of at least 5x4.
					</HelpText>
				</InputRow>

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(9)}>Monster House Chance</LabelButton>
					<input id="monster_house_chance" type="number" value={floor_props.monster_house_chance} onChange={handleSetFloorProps} />
					<HelpText show-text={helpTextState[9]}>
						The probability (0 to 100%) that a monster house spawns on the floor.
						A monster house cannot be spawned on a floor that has a kecleon shop, a non-monster house outlaw mission, or is a fixed floor or rescue floor.
						The room a monster house spawns in cannot have any special features (ex. merged or has a secondary structure).
					</HelpText>
				</InputRow>

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(10)}>Itemless Monster House Chance</LabelButton>
					<input id="itemless_monster_house_chance" type="number" value={floor_props.itemless_monster_house_chance} onChange={handleSetFloorProps} />
					<HelpText show-text={helpTextState[10]}>
						The probability (0 to 100%) that a monster house spawns without items or monster house-specific traps inside.
					</HelpText>
				</InputRow>

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(11)}>Maze Room Chance</LabelButton>
					<input id="maze_room_chance" type="number" value={floor_props.maze_room_chance} onChange={handleSetFloorProps} />
					<HelpText show-text={helpTextState[11]}>
						The probability (0 to 100%) that a maze room spawns on the floor. 
						The room a maze room spawns in cannot be merged, cannot have a monster house, and must have odd dimensions.
						You will need to enable the Allow Wall Maze Room Generation patch for this option to have any effect, as maze room generation is disabled in vanilla.
					</HelpText>
				</InputRow>

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(12)}>Allow Dead Ends</LabelButton>
					<Checkbox id="allow_dead_ends" data-checked={floor_props.allow_dead_ends} onClick={(event) => handleSetFloorProps(event, !floor_props.allow_dead_ends)} />
					<HelpText show-text={helpTextState[12]}>
						Whether or not to allow primary connecting hallways that lead to dead ends (rooms are not considered as dead ends).
						If this option is not checked, any hallway anchors with only one connection will attempt to be connected in a random direction to fix the dead end.
						This process continues until all dead ends are resolved or no additional connections were able to be added.
					</HelpText>
				</InputRow>

				
				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(13)}>Allow Room Imperfections</LabelButton>
					<Checkbox id="f_room_imperfections" data-checked={floor_props.room_flags.f_room_imperfections} onClick={(event) => handleSetRoomFlags(event, !floor_props.room_flags.f_room_imperfections)} />
					<HelpText show-text={helpTextState[13]}>
						Whether or not to allow rooms with non-rectangular shapes.
						Rooms with imperfections have tiles chipped away randomly from their corners.
					</HelpText>
				</InputRow>

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(14)}>Allow Secondary Terrain Generation</LabelButton>
					<Checkbox id="f_secondary_terrain_generation" data-checked={floor_props.room_flags.f_secondary_terrain_generation} onClick={(event) => handleSetRoomFlags(event, !floor_props.room_flags.f_secondary_terrain_generation)} />
					<HelpText show-text={helpTextState[14]}>
						Whether or not to allow generation of secondary terrain (water or lava).
						At minimum, this means 1 to 3 river + lake formations will attempt to generate.
					</HelpText>
				</InputRow>

				{(floor_props.room_flags.f_secondary_terrain_generation) && (
				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(15)}>Secondary Terrain Density</LabelButton>
					<input id="secondary_terrain_density" type="number" value={floor_props.secondary_terrain_density} onChange={handleSetFloorProps} />
					<HelpText show-text={helpTextState[15]}>
						The number of standalone lakes of secondary terrain to generate.
					</HelpText>
				</InputRow>)}

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(16)}>Secondary Structures Budget</LabelButton>
					<input id="secondary_structures_budget" type="number" value={floor_props.secondary_structures_budget} onChange={handleSetFloorProps} />
					<HelpText show-text={helpTextState[16]}>
						The number of secondary structure rooms that can be generated.
						Secondary structures are patterns of secondary terrain, like mazes, islands, and rooms chopped in half.
						If floor generation fails at least once, secondary structures will be disabled for future generations.
					</HelpText>
				</InputRow>

				{/* This doesn't actually do anything in the context of the algorithm right now
				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(17)}>Floor Number</LabelButton>
					<input id="floor_number" type="number" value={floor_props.floor_number} onChange={(event) => setFloorNumber(Number(event?.target.value))} />
				</InputRow>*/}

				{/* This doesn't actually do anything in the context of the algorithm right now
				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(18)}>Fixed Room ID</LabelButton>
					<input id="fixed_room_id" type="number" value={floor_props.fixed_room_id} onChange={(event) => setFixedRoomId(Number(event?.target.value))} />
				</InputRow>*/}

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(19)}>Hidden Stairs Type</LabelButton>
					<select id="hidden_stairs_type" value={floor_props.hidden_stairs_type} onChange={handleSetFloorProps}>
						<option value={HiddenStairsType.HIDDEN_STAIRS_NONE}>0 (None)</option>
						<option value={HiddenStairsType.HIDDEN_STAIRS_SECRET_BAZAAR}>1 (Secret Bazaar)</option>
						<option value={HiddenStairsType.HIDDEN_STAIRS_SECRET_ROOM}>2 (Secret Room)</option>
						<option value={HiddenStairsType.HIDDEN_STAIRS_RANDOM_SECRET_BAZAAR_OR_SECRET_ROOM}>255 (Random)</option>
					</select>
					<HelpText show-text={helpTextState[19]}>
						The type of hidden stairs to spawn on this floor.
						Hidden stairs cannot spawn on the last floor of a dungeon.
					</HelpText>
				</InputRow>

				{/* This doesn't actually do anything in the context of the algorithm right now
				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex()}>Hidden Stairs Spawn Chance</LabelButton>
					<input id="hidden_stairs_spawn_chance" type="number" value={floor_props.hidden_stairs_spawn_chance} onChange={(event) => setHiddenStairsSpawnChance(Number(event?.target.value))} />
				</InputRow>
				*/}
			</InputSection>

			<InputSection>
				<InputSubheader>Dungeon Properties</InputSubheader>

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(20)}>Dungeon ID</LabelButton>
					<input id="id" type="number" value={dungeon_data.id} onChange={handleSetDungeonData} />
					<HelpText show-text={helpTextState[20]}>
						The ID of the dungeon we are currently in. 
						Currently, this value is only relevant in determining whether we are far enough in the game for a monster house in story mode to spawn with traps inside.
					</HelpText>
				</InputRow>

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(21)}>Floor Number</LabelButton>
					<input id="floor" type="number" value={dungeon_data.floor} onChange={handleSetDungeonData} />
					<HelpText show-text={helpTextState[21]}>
						The floor number of the dungeon that we are on.
						This is used to determine if we are on a rescue floor, or if we are on the last floor of the dungeon.
					</HelpText>
				</InputRow>

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(22)}># Floors in Dungeon + 1</LabelButton>
					<input id="n_floors_plus_one" type="number" value={dungeon_data.n_floors_plus_one} onChange={handleSetDungeonData} />
					<HelpText show-text={helpTextState[22]}>
						The number of floors in the current dungeon + 1. 
						Why + 1? I have no clue, it wasn&apos;t my idea at least.
						This is used to check if we&apos;re on the last floor of the dungeon.
					</HelpText>
				</InputRow>

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(23)}>Non-Story Mode</LabelButton>
					<Checkbox id="nonstory_flag" data-checked={dungeon_data.nonstory_flag} onClick={(event) => handleSetDungeonData(event, !dungeon_data.nonstory_flag)} />
					<HelpText show-text={helpTextState[23]}>
						Whether or not we&apos;re clearing this dungeon as a story dungeon.
						If Non-Story Mode is checked, traps will always be allowed to spawn in monster houses.
						If unchecked, traps can only spawn in monster houses if we&apos;re in Dark Hill (Dungeon ID 28) or later in the game.
					</HelpText>
				</InputRow>

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(24)}>Mission Destination Floor</LabelButton>
					<Checkbox id="is_destination_floor" data-checked={dungeon_data.mission_destination.is_destination_floor} onClick={(event) => handleSetMissionDestination(event, !dungeon_data.mission_destination.is_destination_floor)} />
					<HelpText show-text={helpTextState[24]}>
						Whether or not we&apos;re on the destination floor for a mission.
					</HelpText>
				</InputRow>

				{(dungeon_data.mission_destination.is_destination_floor) && (
				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(25)}>Mission Type</LabelButton>
					<select id="mission_type" value={dungeon_data.mission_destination.mission_type} onChange={handleSetMissionDestination}>
						<option value={MissionType.MISSION_RESCUE_CLIENT}>0 (Rescue Client)</option>
						<option value={MissionType.MISSION_RESCUE_TARGET}>1 (Rescue Target)</option>
						<option value={MissionType.MISSION_ESCORT_TO_TARGET}>2 (Escort to Target)</option>
						<option value={MissionType.MISSION_EXPLORE_WITH_CLIENT}>3 (Explore with Client)</option>
						<option value={MissionType.MISSION_PROSPECT_WITH_CLIENT}>4 (Prospect with Client)</option>
						<option value={MissionType.MISSION_GUIDE_CLIENT}>5 (Guide Client)</option>
						<option value={MissionType.MISSION_FIND_ITEM}>6 (Find Item)</option>
						<option value={MissionType.MISSION_DELIVER_ITEM}>7 (Deliver Item)</option>
						<option value={MissionType.MISSION_SEARCH_FOR_TARGET}>8 (Search for Target)</option>
						<option value={MissionType.MISSION_TAKE_ITEM_FROM_OUTLAW}>9 (Take Item from Outlaw)</option>
						<option value={MissionType.MISSION_ARREST_OUTLAW}>10 (Arrest Outlaw)</option>
						<option value={MissionType.MISSION_CHALLENGE_REQUEST}>11 (Challenge Request)</option>
						<option value={MissionType.MISSION_TREASURE_MEMO}>12 (Treasure Memo)</option>
					</select>
					<HelpText show-text={helpTextState[25]}>
						The type of mission we have on this floor.
						Mission types with a target to find that aren&apos;t an outlaw monster house mission will prevent a monster house from spawning on the floor.
					</HelpText>
				</InputRow>)}

				{/* Certain mission types have subtypes within them */}
				{(dungeon_data.mission_destination.mission_type == MissionType.MISSION_CHALLENGE_REQUEST 
				|| dungeon_data.mission_destination.mission_type == MissionType.MISSION_EXPLORE_WITH_CLIENT 
				|| dungeon_data.mission_destination.mission_type == MissionType.MISSION_ARREST_OUTLAW
				|| dungeon_data.mission_destination.mission_type == MissionType.MISSION_TAKE_ITEM_FROM_OUTLAW) && dungeon_data.mission_destination.is_destination_floor && (
					<InputRow>
						<LabelButton onClick={() => handleToggleHelpTextIndex(26)}>Mission Subtype</LabelButton>

						{dungeon_data.mission_destination.mission_type == MissionType.MISSION_CHALLENGE_REQUEST && (
							<select id="mission_subtype" value={dungeon_data.mission_destination.mission_subtype} onChange={handleSetMissionDestination}>
								<option value={MissionSubtypeChallenge.MISSION_CHALLENGE_NORMAL}>0 (Normal)</option>
								<option value={MissionSubtypeChallenge.MISSION_CHALLENGE_MEWTWO}>1 (Mewtwo)</option>
								<option value={MissionSubtypeChallenge.MISSION_CHALLENGE_ENTEI}>2 (Entei)</option>
								<option value={MissionSubtypeChallenge.MISSION_CHALLENGE_RAIKOU}>3 (Raikou)</option>
								<option value={MissionSubtypeChallenge.MISSION_CHALLENGE_SUICUNE}>4 (Suicune)</option>
								<option value={MissionSubtypeChallenge.MISSION_CHALLENGE_JIRACHI}>5 (Jirachi)</option>
							</select>
						)}

						{dungeon_data.mission_destination.mission_type == MissionType.MISSION_EXPLORE_WITH_CLIENT && (
							<select id="mission_subtype" value={dungeon_data.mission_destination.mission_subtype} onChange={handleSetMissionDestination}>
								<option value={MissionSubtypeExplore.MISSION_EXPLORE_NORMAL}>0 (Normal)</option>
								<option value={MissionSubtypeExplore.MISSION_EXPLORE_SEALED_CHAMBER}>1 (Sealed Chamber)</option>
								<option value={MissionSubtypeExplore.MISSION_EXPLORE_GOLDEN_CHAMBER}>2 (Golden Chamber)</option>
								<option value={MissionSubtypeExplore.MISSION_EXPLORE_NEW_DUNGEON}>3 (New Dungeon)</option>
							</select>
						)}

						{dungeon_data.mission_destination.mission_type == MissionType.MISSION_ARREST_OUTLAW && (
							<select id="mission_subtype" value={dungeon_data.mission_destination.mission_subtype} onChange={handleSetMissionDestination}>
								<option value={MissionSubtypeOutlaw.MISSION_OUTLAW_NORMAL_0}>0 (Normal 0)</option>
								<option value={MissionSubtypeOutlaw.MISSION_OUTLAW_NORMAL_1}>1 (Normal 1)</option>
								<option value={MissionSubtypeOutlaw.MISSION_OUTLAW_NORMAL_2}>2 (Normal 2)</option>
								<option value={MissionSubtypeOutlaw.MISSION_OUTLAW_NORMAL_3}>3 (Normal 3)</option>
								<option value={MissionSubtypeOutlaw.MISSION_OUTLAW_ESCORT}>4 (Escort)</option>
								<option value={MissionSubtypeOutlaw.MISSION_OUTLAW_FLEEING}>5 (Fleeing)</option>
								<option value={MissionSubtypeOutlaw.MISSION_OUTLAW_HIDEOUT}>6 (Hideout)</option>
								<option value={MissionSubtypeOutlaw.MISSION_OUTLAW_MONSTER_HOUSE}>7 (Monster House)</option>						
							</select>
						)}

						{dungeon_data.mission_destination.mission_type == MissionType.MISSION_TAKE_ITEM_FROM_OUTLAW && (
							<select id="mission_subtype" value={dungeon_data.mission_destination.mission_subtype} onChange={handleSetMissionDestination}>
								<option value={MissionSubtypeTakeItem.MISSION_TAKE_ITEM_NORMAL_OUTLAW}>0 (Normal Outlaw)</option>
								<option value={MissionSubtypeTakeItem.MISSION_TAKE_ITEM_HIDDEN_OUTLAW}>1 (Hidden Outlaw)</option>
								<option value={MissionSubtypeTakeItem.MISSION_TAKE_ITEM_FLEEING_OUTLAW}>2 (Fleeing Outlaw)</option>
							
							</select>
						)}
						<HelpText show-text={helpTextState[26]}>
							The subtype of the mission we have on this floor, only applicable to certain types of missions.
						</HelpText>
					</InputRow>
				)}

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(27)}>Dungeon Objective</LabelButton>
					<select id="dungeon_objective" value={dungeon_data.dungeon_objective} onChange={handleSetDungeonData}>
							<option value={DungeonObjectiveType.OBJECTIVE_STORY}>0 (Story)</option>
							<option value={DungeonObjectiveType.OBJECTIVE_NORMAL}>1 (Normal)</option>
							<option value={DungeonObjectiveType.OBJECTIVE_RESCUE}>2 (Rescue)</option>
							<option value={DungeonObjectiveType.OBJECTIVE_UNK_GAMEMODE_5}>3 (Unknown Gamemode 5)</option>
					
					</select>
					<HelpText show-text={helpTextState[27]}>
						The objective of the dungeon we&apos;re in.
						If set to Rescue and while on the rescue floor, a monster house will spawn in the normal stairs room.
					</HelpText>
				</InputRow>

				{(dungeon_data.dungeon_objective == DungeonObjectiveType.OBJECTIVE_RESCUE) && (
				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(28)}>Rescue Floor</LabelButton>
					<input id="rescue_floor" type="number" value={dungeon_data.rescue_floor} onChange={handleSetDungeonData} />
					<HelpText show-text={helpTextState[28]}>
						If rescuing another player, the objective floor of the rescuer.
						If on a rescue floor, kecleon shops and regular monster houses won&apos;t spawn.
						However, the normal stairs room will instead become a monster house.
					</HelpText>
				</InputRow>)}

				{/* This property is derived from generation
				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(29)}>Number of Items</LabelButton>
					<input id="num_items" type="number" value={num_items} onChange={(event) => setNumItems(Number(event?.target.value))} />
				</InputRow>*/}

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(30)}>Guaranteed Item ID</LabelButton>
					<input id="guaranteed_item_id" type="number" value={dungeon_data.guaranteed_item_id} onChange={handleSetDungeonData} />
				</InputRow>
				<HelpText show-text={helpTextState[30]}>
					An item ID for an item which is guaranteed to spawn on this floor.
					If not set to 0, the number of items spawned on this floor will increase by 1 to account for this item.
				</HelpText>
			</InputSection>

			<InputSection>
				<InputSubheader>Generation Constants</InputSubheader>

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(31)}>Merge Rooms Chance</LabelButton>
					<input id="merge_rooms_chance" type="number" value={generation_constants.merge_rooms_chance} onChange={handleSetGenerationConstants} />
					<HelpText show-text={helpTextState[31]}>
						The probability (0 to 100%) that two rooms which meet the necessary merging conditions will be merged together.
						By default, this is 5%.
					</HelpText>
				</InputRow>

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(32)}>No Room Imperfections Chance</LabelButton>
					<input id="no_imperfections_chance" type="number" value={generation_constants.no_imperfections_chance} onChange={handleSetGenerationConstants} />
					<HelpText show-text={helpTextState[32]}>
						The probability (0 to 100%) that a room will not be given imperfections even if it was flagged to have them.
						By default, this is 60%.
					</HelpText>
				</InputRow>

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(33)}>Secondary Structures Flag Chance</LabelButton>
					<input id="secondary_structure_flag_chance" type="number" value={generation_constants.secondary_structure_flag_chance} onChange={handleSetGenerationConstants} />
					<HelpText show-text={helpTextState[33]}>
						The probability (0 to 100%) that a room will be given the secondary structure flag.
						This flag enables the room to be a candidate for having a secondary structure added to it later.
						By default, this is 80%.
					</HelpText>
				</InputRow>

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(34)}>Maximum Monster House Item / Trap Spawns</LabelButton>
					<input id="max_number_monster_house_item_spawns" type="number" value={generation_constants.max_number_monster_house_item_spawns} onChange={handleSetGenerationConstants} />
					<HelpText show-text={helpTextState[34]}>
						The maximum number of items / traps allowed to be spawned as part of generating a monster house.
						By default, this is 7.
					</HelpText>
				</InputRow>

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(35)}>Maximum Monster House Extra Enemy Spawns</LabelButton>
					<input id="max_number_monster_house_enemy_spawns" type="number" value={generation_constants.max_number_monster_house_enemy_spawns} onChange={handleSetGenerationConstants} />
					<HelpText show-text={helpTextState[35]}>
						The maximum number of extra enemies that can be spawned in a monster house as a result of a forced monster house spawn.
						A forced monster house spawn comes with generating the One Room Monster House and Two Rooms with Monster House floor layouts.
						By default, this is 30.
					</HelpText>
				</InputRow>

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(36)}>First Dungeon ID With Monster House Traps</LabelButton>
					<input id="first_dungeon_id_allow_monster_house_traps" type="number" value={generation_constants.first_dungeon_id_allow_monster_house_traps} onChange={handleSetGenerationConstants} />
					<HelpText show-text={helpTextState[36]}>
						The first story dungeon ID which allows traps to spawn as part of monster houses.
						By default this is 28, Dark Hill.
					</HelpText>
				</InputRow>
			</InputSection>

			<InputSection>
				<InputSubheader>Advanced Settings</InputSubheader>

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(37)}>Allow Wall Maze Room Generation</LabelButton>
					<Checkbox id="allow_wall_maze_room_generation" data-checked={advanced_generation_settings.allow_wall_maze_room_generation} onClick={(event) => handleSetAdvancedGenerationSettings(event, !advanced_generation_settings.allow_wall_maze_room_generation)} />
					<HelpText show-text={helpTextState[37]}>
						By default, maze rooms (with walls for the mazes, secondary terrain mazes are different) cannot spawn due to a check that we&apos;re on a negative floor generation attempt (which is impossible).
						Enabling this option will override this check and allow standard maze room generation to happen again.
					</HelpText>
				</InputRow>

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(38)}>Fix Dead-End Validation Error</LabelButton>
					<Checkbox id="fix_dead_end_validation_error" data-checked={advanced_generation_settings.fix_dead_end_validation_error} onClick={(event) => handleSetAdvancedGenerationSettings(event, !advanced_generation_settings.fix_dead_end_validation_error)} />
					<HelpText show-text={helpTextState[38]}>
						A bug exists when validating cells to remove the existence of dead ends from the floor. 
						The game ends up checking the same grid cell when looking in all 4 directions, resulting in potentially incorrect connections.
						Enabling this option fixes these checks to make sure the correct grid cell is checked in all directions.
					</HelpText>
				</InputRow>

				<InputRow>
					<LabelButton onClick={() => handleToggleHelpTextIndex(39)}>Fix Generate Outer Rooms Floor Error</LabelButton>
					<Checkbox id="fix_generate_outer_rooms_floor_error" data-checked={advanced_generation_settings.fix_generate_outer_rooms_floor_error} onClick={(event) => handleSetAdvancedGenerationSettings(event, !advanced_generation_settings.fix_generate_outer_rooms_floor_error)} />
					<HelpText show-text={helpTextState[39]}>
						Several bugs exist in the generator for the Outer Rooms floor layout.
						The main bug results in the layout not properly connecting if the generated grid has X dimensions of 2 or less.
						Additionally, there is a minor bug setting the last set of top and bottom connections, but this does not affect the connectivity of the map.
						Enabling this option fixes both of these bugs, ensuring the Outer Rooms layout will be consistently connected for all grid sizes.
					</HelpText>
				</InputRow>		
			</InputSection>
		</div>

		<div>
			<Header>
				Generation Results
				<div>
					<Button onClick={handleSetCurrentState}>Generate New Dungeon</Button>
				</div>
			</Header>
			
			<Grid display_data={generated_dungeon_data.maps[current_map_index]} show_cell_boundary={show_cell_boundary} show_entities={show_entities}/>

			<InputSection>
				<SelectorRow>
					<label htmlFor="current_generation_step">Current Generation Step</label>
					<SelectorBox>
						<GenerationStepSelector id="current_generation_step" value={current_map_index} onChange={(event) => handleSetCurrentMapIndex(Number(event?.target.value))} events={generated_dungeon_data.events} />
						<Button disabled={current_map_index <= 0} onClick={() => setCurrentMapIndex(current_map_index - 1)}>←</Button>
						<Button disabled={current_map_index >= generated_dungeon_data.maps.length - 1} onClick={() => setCurrentMapIndex(current_map_index + 1)}>→</Button>
					</SelectorBox>
				</SelectorRow>

				<InputRow>
					<label htmlFor="show_cell_boundary">Show Grid Cell Borders</label>
					<Checkbox id="show_cell_boundary" data-checked={show_cell_boundary} onClick={() => setShowCellBoundary(!show_cell_boundary)} />
				</InputRow>

				<InputRow>
					<label htmlFor="show_entities">Show Entities</label>
					<Checkbox id="show_entities" data-checked={show_entities} onClick={() => setShowEntities(!show_entities)} />
				</InputRow>
			</InputSection>

			<Legend>
				<div>
					<LegendSquare display_tile={ { tileColor: theme.dungeon.wall, isCellBoundary: false, hasEntity: false, entityColor: "" } } hasSquareBorder={true} />
					Wall Tile
				</div>
				
				<div>
				<LegendSquare display_tile={ { tileColor: theme.dungeon.grid_cell_border, isCellBoundary: false, hasEntity: false, entityColor: "" } } hasSquareBorder={true} />
					Grid Cell Border
				</div>

				<div>
					<LegendSquare display_tile={ { tileColor: theme.dungeon.room, isCellBoundary: false, hasEntity: false, entityColor: "" } } hasSquareBorder={true} />
					Room Tile
				</div>

				<div>
					<LegendSquare display_tile={ { tileColor: theme.dungeon.normal, isCellBoundary: false, hasEntity: false, entityColor: "" } } hasSquareBorder={true} />
					Hallway Tile
				</div>

				<div>
					<LegendSquare display_tile={ { tileColor: theme.dungeon.secondary_terrain, isCellBoundary: false, hasEntity: false, entityColor: "" } } hasSquareBorder={true} />
					Secondary Terrain
				</div>

				<div>
					<LegendSquare display_tile={ { tileColor: theme.dungeon.player, isCellBoundary: false, hasEntity: false, entityColor: "" } } hasSquareBorder={true} />
					Player Spawn
				</div>

				<div>
					<LegendSquare display_tile={ { tileColor: theme.dungeon.stairs, isCellBoundary: false, hasEntity: false, entityColor: "" } } hasSquareBorder={true} />
					Stairs
				</div>

				<div>
					<LegendSquare display_tile={ { tileColor: theme.dungeon.hidden_stairs, isCellBoundary: false, hasEntity: false, entityColor: "" } } hasSquareBorder={true} />
					Hidden Stairs
				</div>

				<div>
					<LegendSquare display_tile={ { tileColor: theme.dungeon.trap, isCellBoundary: false, hasEntity: false, entityColor: "" } } hasSquareBorder={true} />
					Trap or Wonder Tile
				</div>

				<div>
					<LegendSquare display_tile={ { tileColor: theme.dungeon.kecleon_shop, isCellBoundary: false, hasEntity: false, entityColor: "" } } hasSquareBorder={true} />
					Kecleon Shop
				</div>

				<div>
					<LegendSquare display_tile={ { tileColor: theme.dungeon.monster_house, isCellBoundary: false, hasEntity: false, entityColor: "" } } hasSquareBorder={true} />
					Monster House
				</div>
				
				<div>
					<LegendSquare display_tile={ { tileColor: theme.background, isCellBoundary: false, hasEntity: true, entityColor: theme.dungeon.item } } hasSquareBorder={true} />
					Item
				</div>

				<div>
					<LegendSquare display_tile={ { tileColor: theme.background, isCellBoundary: false, hasEntity: true, entityColor: theme.dungeon.enemy } } hasSquareBorder={true} />
					Enemy
				</div>
			</Legend>
		</div>
	</Container>
	</NonSSRWrapper>
  )
}

export default DungeoneerContext.connect(Home);

const Container = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;

	& > div {
		padding: 1rem;
	}
`;	

const SelectorRow = styled(InputRow)`
	grid-column: 2;

	& label {
		margin: 0 0.5rem 0 0;
		padding: 0 0 0 0;
	}
`;

const SelectorBox = styled.div`
	display: flex;

	padding: 0rem 0rem 0.5rem 0;

	& select {
		flex: 4 3 auto;
		margin: 0 0.75rem 0 0rem;
	}

	& Button {
		flex: 1.5 1 auto;
		padding: 0 0 0 0;
		margin: 0 0 0 0;
		font-size: 1.5rem;
	}
`;

const Legend = styled.div`
	display: flex;
	justify-content: space-evenly;

	& div {
		flex: 1 1 0px;
		text-align: center;
		
		& li {
			margin: auto;
		}
		margin: 0.5rem;
		font-size: 0.9rem;
		font-weight: 700;
		color: ${({ theme }) => theme.label};
	}
`;