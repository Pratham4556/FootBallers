// app/page.js
import PlayerStatsClient from './PlayerStatsClient';

export async function generateMetadata({ searchParams }) {
  console.log(searchParams);
  // Get the parameters after awaiting
  const club = (await searchParams)?.club || "Football";
  const range = (await searchParams)?.top || "";
  
  const title = range && club 
    ? `Top ${range} Scorers from ${club} - Player Statistics`
    : `${club} - Top ${range} Player Statistics`;
    
  const description = range && club
    ? `Discover the top ${range} goal scorers from ${club}. Get detailed statistics, performance data, and scoring records for ${club}'s best players.`
    : "Explore comprehensive football player statistics, including top scorers from premier clubs like Manchester United, Barcelona, Real Madrid, and more.";

  return {
    title,
    description,
    keywords: [
      club,
      "football statistics",
      "top scorers",
      "goal scorers",
      "player stats",
      "football data",
      range && `top ${range} players`,
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      type: "website",
      siteName: `${club} Statistics`,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://yourwebsite.com/${club ? `${club.replace(/\s+/g, '')}/Top/${range}` : ''}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// You might also want to make the page component async
export default async function Page({ searchParams }) {
  return <PlayerStatsClient />;
}