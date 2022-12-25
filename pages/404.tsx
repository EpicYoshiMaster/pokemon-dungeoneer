import { Header } from "../components/Layout";
import Image from 'next/image'
import styled from "styled-components";

export default function Custom404() 
{
	return (
	<CenteredHeader>
		Error 404: Looks like you&apos;ve stumbled upon a page that doesn&apos;t exist...
		<div>
			<Image src="/spintrap.png" width="400" height="400" alt="Image of a Spin Trap from the Pokemon Mystery Dungeon series." />
		</div>
		<Textbox>
			It&apos;s a Spin Trap!
			<div>
				<Highlight>Chatot</Highlight> became confused!
			</div>
		</Textbox>
	</CenteredHeader>);
}

const CenteredHeader = styled.h2`
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;
`;

const Textbox = styled.div`
	background-color: rgba(12, 22, 59, 0.5);
`;

const Highlight = styled.div`
	display: inline-block;
	color: yellow;
`;