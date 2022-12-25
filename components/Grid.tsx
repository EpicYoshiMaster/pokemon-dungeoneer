import { GenerationStepLevel, GenerationType, Dungeon, DungeonGenerationInfo, FloorGenerationStatus, TerrainType } from 'dungeon-mystery';
import React from 'react'
import styled from 'styled-components'

const FLOOR_MAX_X = 56;
const FLOOR_MAX_Y = 32;

export class TileDisplayData
{
	tileColor: string = "";
	isCellBoundary: boolean = false;

	hasEntity: boolean = false;
	entityColor: string = "";
};

export function ToTileDisplayData(theme: any, generation_step_level: GenerationStepLevel,
	generation_type: GenerationType,
	dungeon_data: Dungeon, 
	dungeon_generation_info: DungeonGenerationInfo, 
	floor_generation_status: FloorGenerationStatus, 
	list_x: number[],
	list_y: number[]): TileDisplayData[][]
{

	let new_dungeon_map: TileDisplayData[][] = new Array(FLOOR_MAX_Y);
	let x_idx = 0, y_idx = 0, on_x_border = false, on_y_border = false;
	
	for(let x = 0; x < FLOOR_MAX_X; x++)
	{
		new_dungeon_map[x] = new Array(FLOOR_MAX_X);

		if(list_x && x_idx < list_x.length && x >= list_x[x_idx] - 1)
		{
			if(x >= list_x[x_idx])
			{
				x_idx++;
			}
			
			on_x_border = true;
		}
		else
		{
			on_x_border = false;
		}

		y_idx = 0;

		for(let y = 0; y < FLOOR_MAX_Y; y++)
		{
			if(list_y && y_idx < list_y.length && y >= list_y[y_idx] - 1)
			{
				if(y >= list_y[y_idx])
				{
					y_idx++;
				}

				on_y_border = true;
			}
			else
			{
				on_y_border = false;
			}

			let tile = dungeon_data.list_tiles[x][y];
			let tileColor, entityColor, hasEntity = false, isCellBoundary = false;

			//
			// Tile
			//
		
			switch(tile.terrain_flags.terrain_type)
			{
				case TerrainType.TERRAIN_NORMAL: 
					
					if(tile.room_index != 0xFF)
					{
						tileColor = theme.dungeon.room;
					}
					else
					{
						tileColor = theme.dungeon.normal;
					}
					break;
				case TerrainType.TERRAIN_SECONDARY:
					tileColor = theme.dungeon.secondary_terrain;
					break;
				case TerrainType.TERRAIN_WALL: 
					if(on_x_border || on_y_border)
					{
						isCellBoundary = true;
					}

					tileColor = theme.dungeon.wall;
					break;
			}
		
			if(tile.terrain_flags.f_in_kecleon_shop)
			{
				tileColor = theme.dungeon.kecleon_shop;
			}
		
			if(tile.terrain_flags.f_in_monster_house)
			{
				tileColor = theme.dungeon.monster_house;
			}

			if(tile.spawn_or_visibility_flags.f_trap)
			{
				tileColor = theme.dungeon.trap;
			}
		
			if(tile.spawn_or_visibility_flags.f_stairs)
			{
				if(x == dungeon_generation_info.hidden_stairs_spawn_x && y == dungeon_generation_info.hidden_stairs_spawn_y)
				{
					tileColor = theme.dungeon.hidden_stairs;
				}
				else
				{
					tileColor = theme.dungeon.stairs;
				}
			}

			if(x == dungeon_generation_info.player_spawn_x && y == dungeon_generation_info.player_spawn_y)
			{
				tileColor = theme.dungeon.player;
			}

			//
			// Entity
			//
			if(tile.spawn_or_visibility_flags.f_item)
			{
				entityColor = theme.dungeon.item;
				hasEntity = true;
			}

			if(tile.spawn_or_visibility_flags.f_monster)
			{
				entityColor = theme.dungeon.enemy;
				hasEntity = true;
			}
		
			let tile_data = 
			{ 
				tileColor: tileColor, 
				isCellBoundary: isCellBoundary, 
				hasEntity: hasEntity, 
				entityColor: entityColor 
			};

			new_dungeon_map[x][y] = tile_data;
		}
	}

	return new_dungeon_map;
};

export function Grid(props: {display_data: TileDisplayData[][], show_cell_boundary: boolean, show_entities: boolean})
{
	return (
		<StyledGrid>
		{
			props.display_data.map((column, i) => 
				{ return <GridColumn display_column={column} show_cell_boundary={props.show_cell_boundary} show_entities={props.show_entities} key={i}/> }
			)
		}
		</StyledGrid>
	);
}

function GridColumn(props: {display_column: TileDisplayData[], show_cell_boundary: boolean, show_entities: boolean})
{
	return (
		<StyledGridColumn>
		{ 
			props.display_column.map((tile, i) => 
				{ return <GridSquare display_tile={tile} show_cell_boundary={props.show_cell_boundary} show_entities={props.show_entities} key={i}/> }
			)
		}
		</StyledGridColumn>
	);
}

function GridSquare(props: {display_tile: TileDisplayData, show_cell_boundary: boolean, show_entities: boolean})
{
	return (
		<>
			<StyledGridSquare tileColor={props.display_tile.tileColor} show-cell-boundary={props.show_cell_boundary && props.display_tile.isCellBoundary} has-square-border={false}>
				<StyledGridCircle show={props.show_entities && props.display_tile.hasEntity} circleColor={props.display_tile.entityColor} />
			</StyledGridSquare>
		</>
	);
}

export function LegendSquare(props: {display_tile: TileDisplayData, hasSquareBorder: boolean})
{
	return (
		<>
			<StyledGridSquare tileColor={props.display_tile.tileColor} show-cell-boundary={props.display_tile.isCellBoundary} has-square-border={false}>
				<StyledGridCircle show={props.display_tile.hasEntity} circleColor={props.display_tile.entityColor} />
			</StyledGridSquare>
		</>
	);
}

const StyledGrid = styled.div`
	margin: 1.5rem 0 0.5rem 0;
	padding: 0;

	display: grid;
	grid-template-columns: repeat(56, min-content);
	grid-auto-columns: min-content;
`;

const StyledGridColumn = styled.ul`
	margin: 0;
	padding: 0;

	display: flex;
	flex-direction: column;
	list-style: none;
`;

const StyledGridSquare = styled.li<{ 'tileColor': string, 'show-cell-boundary': boolean, 'has-square-border': boolean }>`
	list-style: none;
	border: ${props => props['has-square-border'] ? `1px solid white` : '' };
	margin: 1px;
	width: 1.75vmin;
	height: 1.75vmin;

	background-color: ${props => props['show-cell-boundary'] ? props.theme.dungeon.grid_cell_border : props.tileColor};
`;

const StyledGridCircle = styled.li<{ 'show': boolean, 'circleColor': string }>`
	list-style: none;
	display: ${props => props['show'] ? 'block' : 'none'};
	border: 1px solid ${({ theme }) => theme.background};
	border-radius: 10px;
	width: 100%;
	height: 100%;

	background-color: ${props => props.circleColor};
`;