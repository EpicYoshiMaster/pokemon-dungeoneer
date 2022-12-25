// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' 
{
  export interface DefaultTheme 
  {
		background: string,
		backgroundSelected: string,
		backgroundDarkened: string,
		foreground: string,
		foregroundHover: string,
		primary: string,
		primaryHover: string,
		label: string,
		anchor: string,
		error: string,
		input: {
			background: string,
			foreground: string,
			border: string,
			hover: string,
		},
		dungeon: {
			wall: string,
			grid_cell_border: string,
			room: string,
			normal: string,
			secondary_terrain: string,
			player: string,
			item: string,
			enemy: string,
			trap: string,
			stairs: string,
			hidden_stairs: string,
			kecleon_shop: string,
			monster_house: string
		}
	}
}