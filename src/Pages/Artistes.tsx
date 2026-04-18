import { useNavigate } from 'react-router-dom'
import ArtistCard from '../Components/artistCard'
import bgImage from '../assets/bg-artiste.png'

interface Artist {
  id: number
  tag: string
  artistName: string
  artistHandle: string
  artistAvatar?: string
  artistProfile: string
  artistPaints: string[]
}

//test
const ARTISTS: Artist[] = [
  {
    id: 1, tag: 'Peinture',
    artistName: 'Sandra Vasquez', artistHandle: '@s.vasquez',
    artistProfile: 'Artiste colombienne explorant les mythes ancestraux à travers la peinture.',
    artistPaints: ['/oeuvres/1.jpg', '/oeuvres/2.jpg', '/oeuvres/3.jpg', '/oeuvres/4.jpg'],
  },
  {
    id: 2, tag: 'Sculpture',
    artistName: 'Yayoi Tazong', artistHandle: '@y.tazong',
    artistProfile: "Pionnière de l'art conceptuel et du pop art japonais, obsédée par les points.",
    artistPaints: ['/oeuvres/5.jpg', '/oeuvres/6.jpg', '/oeuvres/7.jpg'],
  },
  {
    id: 3, tag: 'Photographie',
    artistName: 'Gordon Parks', artistHandle: '@g.parks',
    artistProfile: 'Photographe américain documentant les inégalités raciales avec poésie.',
    artistPaints: ['/oeuvres/8.jpg', '/oeuvres/9.jpg'],
  },
  {
    id: 4, tag: 'Installation',
    artistName: 'Kara Walker', artistHandle: '@k.walker',
    artistProfile: 'Connue pour ses silhouettes en papier noir explorant race et genre.',
    artistPaints: ['/oeuvres/10.jpg', '/oeuvres/11.jpg', '/oeuvres/12.jpg', '/oeuvres/13.jpg'],
  },
  {
    id: 5, tag: 'Art sonore',
    artistName: 'Basquiat', artistHandle: '@basquiat',
    artistProfile: "Graffeur Gabonais devenu l'une des figures majeures de l'art contemporain.",
    artistPaints: ['/oeuvres/14.jpg', '/oeuvres/15.jpg', '/oeuvres/16.jpg'],
  },
  {
    id: 6, tag: 'Peinture',
    artistName: 'Frida Kahlo', artistHandle: '@f.kahlo',
    artistProfile: 'Peintre mexicaine célèbre pour ses autoportraits intenses et symboliques.',
    artistPaints: ['/oeuvres/17.jpg', '/oeuvres/18.jpg', '/oeuvres/19.jpg', '/oeuvres/20.jpg'],
  },
]

const Artistes = () => {
  const navigate = useNavigate()

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="min-h-screen bg-white/70 backdrop-blur-[1px]">
        <div className="pt-32 pb-24 ">
          <div className="flex flex-col gap-10 w-220 mx-auto">
            {ARTISTS.map((artist) => (
              <ArtistCard
                key={artist.id}
                id={artist.id}
                tag={artist.tag}
                artistName={artist.artistName}
                artistHandle={artist.artistHandle}
                artistAvatar={artist.artistAvatar}
                artistProfile={artist.artistProfile}
                artistPaints={artist.artistPaints}
                onClick={() => navigate(`/artistes/${artist.id}`)}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Artistes