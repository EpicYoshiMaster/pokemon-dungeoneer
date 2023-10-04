import '../styles/globals.css'
import Head from 'next/head'
import Link from 'next/link'
import { DefaultSeo } from 'next-seo'
import type { AppProps } from 'next/app'
import styled, { ThemeProvider } from 'styled-components'
import { THEMES } from '../components/Layout'

const META_DESCRIPTION = "Generation and analysis tool for Pokémon Mystery Dungeon: Explorers of Sky's dungeon layouts.";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider theme={THEMES.dark}>
			<Layout>
				<Head>
					<title>Pokémon Dungeoneer</title>
					<link rel="shortcut icon" href="/favicon.png" />
					<meta charSet="UTF-8" />
				</Head>

				<Header>
					<li>
						<Link href="/">Pokémon Dungeoneer</Link>
					</li>
				</Header>

				<Content>
					<DefaultSeo 
						description={META_DESCRIPTION}
						canonical="https://pokemon-dungeoneer.vercel.app/"
						title="Pokémon Dungeoneer"
						openGraph={{
							type: 'website',
							locale: 'en_US',
							url: 'https://pokemon-dungeoneer.vercel.app/',
							site_name: 'Pokémon Dungeoneer',
							description: META_DESCRIPTION,
							title: 'Pokémon Dungeoneer',
							images: [
								{
									url: 'https://pokemon-dungeoneer.vercel.app/dungeoneer_logo_half.png',
									width: 1200,
									height: 600,
									alt: 'Chatot holding a Luminous Orb Logo',
									type: 'image/png',
								},
							],
							
						}}
						twitter={{
							cardType: 'summary_large_image',
						}}
					/>
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