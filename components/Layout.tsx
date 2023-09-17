import React from 'react'
import styled, { DefaultTheme } from 'styled-components'

export const THEMES = {
	dark: {
		background: '#291d30',
		backgroundSelected: '#000',
		backgroundDarkened: '#000',

		foreground: '#fff',
		foregroundHover: '#f403fc',
		
		primary: '#c718a1',
		primaryHover: '#ed66d0',

		label: '#ddd',
		anchor: '#000',

		error: '#f21313',

		input: {
			background: '#4f3a4c', //422f4d
			foreground: '#eee',
			border: '#63556b', // 7a7d31
			hover: '#000',
		},

		dungeon: {
			wall: '#3f3740',
			grid_cell_border: '#5f5361',
			room: '#b8b21c',
			normal: '#855225', //b8b21c
			secondary_terrain: '#1e518f', //286cbf
			player: '#eb3480',
			item: '#18dfed',
			enemy: '#eb0e0e',
			trap: '#eb710e',
			stairs: '#880eeb',
			hidden_stairs: '#4808d4',
			kecleon_shop: '#4ee014',
			monster_house: '#690a1a'
		}
	}
} as const;

export const Header = styled.h2`
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 1.5rem;
	color: ${({ theme }) => theme.foreground };
	font-weight: 700;
	margin: 0.5rem 0;
`;

export const InputSection = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr;
`;

export const InputSubheader = styled.div`
  grid-column: 1 / -1;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0.75rem 0;
`;

export const InputRow = styled.div`
  display: contents;
  & label,
  & header,
  & LabelButton {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0.5rem;
    padding-right: 0.5rem;
    font-weight: 700;
    line-height: 2;
	color: ${({ theme }) => theme.label};
  }
  & input,
  & textarea,
  & select {
	border-radius: 0.25rem;
    height: 2rem;
    margin: 0 0 0.5rem;
    padding: 0.25rem 0.5rem;
    font-size: 1rem;
	color: ${({ theme }) => theme.input.foreground};
	background-color: ${({ theme }) => theme.input.background};
	border: 1px solid ${({ theme }) => theme.input.border};
  }

  & textarea {
    min-height: 200px;
    resize: vertical;
  }
`;

export const Checkbox = styled.button<{ 'data-checked': boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${props => props['data-checked'] ? props.theme.primary : 'transparent'};
  border: ${props => props['data-checked'] ? 'none' : `1px solid ${props.theme.input.border}`};
  border-radius: 0.25rem;
  margin: 0.25rem 0 0.75rem;
  width: 1.5rem;
  height: 1.5rem;

  &::after {
	content: '✓';
	display: ${props => props['data-checked'] ? 'block' : 'none'};
	font-size: 1rem;
	font-weight: 700;
	margin-top: -2px;
	color: ${({ theme }) => theme.foreground};
  }
`;

export const Button = styled.button`
  color: #fff;
  margin: 0;
  padding: 0.25rem 0.5rem;

  border: none;
  border-radius: 0.25rem;
  background-color: ${props => props.theme.primary};
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;

  &:not(:disabled):hover, &:not(:disabled):active {
	background-color: ${({ theme }) => theme.primaryHover};
  }

  &:disabled {
	opacity: 0.5;
  }

  & + & {
	margin-left: 1rem;
  }
`;

export const LabelButton = styled.button`
  display: flex;  
  color: ${({ theme }) => theme.label};  
  border: none;
  background-color: transparent;  
  justify-content: flex-end;
  margin-bottom: 0.5rem;
  padding-right: 0.5rem;
  font-weight: 700;
  line-height: 2;
  font-size: 1rem;
  cursor: pointer;

  &:not(:disabled):hover,
  &:not(:disabled):active {
	background-color: transparent;
	color: ${({ theme }) => theme.foregroundHover };
  }
`;

export const ErrorText = styled.div`
  grid-column: 2;
  color: ${({ theme }) => theme.error };
  font-size: 1.1rem;
  font-weight: 700;
`;

export const HelpText = styled.div<{ 'show-text': boolean }>`
  display: ${props => props['show-text'] ? 'block' : 'none' };
  grid-column: 2;
  font-size: 0.9rem;
  font-style: italic;
  color: ${({ theme }) => theme.label };
  margin: -0.5rem 0 0.5rem;

  & a {
	color: ${({ theme }) => theme.anchor };
  }

  & + & {
  	margin-top: -0.25rem;
  }
`;

export const Tooltip = styled.div<{ 'show-tooltip': boolean }>`
  display: ${props => props['show-tooltip'] ? 'block' : 'none'};
  color: #fff;
  position: absolute;
  padding: 5px;
`;