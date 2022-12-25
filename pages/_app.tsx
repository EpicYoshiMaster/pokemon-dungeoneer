import '../styles/globals.css'
import Head from 'next/head'
import Link from 'next/link'
import type { AppProps } from 'next/app'
import styled, { ThemeProvider } from 'styled-components'
import { THEMES } from '../components/Layout'

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider theme={THEMES.dark}>
			<Layout>
				<Head>
					<title>Pokémon Dungeoneer</title>
					<link rel="shortcut icon" href="/favicon.png" />
				</Head>

				<Header>
					<li>
						<Link href="/">Pokémon Dungeoneer</Link>
					</li>
				</Header>

				<Content>
					<Component {...pageProps} />
				</Content>
			</Layout>
		</ThemeProvider>
	)
}

const Layout = styled.div`
	display: grid;
	width: 100vw;
	height: 100vh;
	grid-template-rows: max-content 1fr;
	background-color: ${({theme}) => theme.background};
	color: ${({theme}) => theme.foreground};
`;

const ActionSet = styled.ul`
	display: flex;
	flex-direction: row;
	height: 100%;
	padding: 0;
	margin: 0;
	list-style: none;

	& > li > a, & > li > button {
		display: block;
		padding: 1rem 1rem;
		height: 100%;
		font-size: 1.25rem;
		font-weight: bold;
		cursor: pointer;
		border: none;
		background-color: transparent;
		border-radius: 0;

		&:hover, &:active {
			background-color: rgba(255, 255, 255, 0.25);
		}
	}
`;

const Header = styled(ActionSet)`
	color: #fff;
	background-color: ${({theme}) => theme.primary};
`;

const Content = styled.div`
	position: relative;
	overflow-y: auto;
`;