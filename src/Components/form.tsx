import { useNavigate } from 'react-router-dom';
import Button from '../Components/button';


import { LockClosedIcon, UserIcon, BookOpenIcon } from "@heroicons/react/24/outline";


const Title = ({ children }: { children: React.ReactNode }) => (
  <h1 className="inline-block text-xl text-center font-medium pb-2  mb-8 border-b-2 border-[#E2725B]">
    {children}
  </h1>
)



export const Register = () =>
    {
      const navigate = useNavigate()
        return(
            <div className="min-h-screen w-full flex items-center justify-center bg-white-50">
      
            {/* Conteneur Glassmorphic */}
          <div className="relative group">
            {/* Effet de lueur en arrière-plan */}
            <div className="absolute -inset-0.5 bg-white-60 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            
            <div className="relative card w-96 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl p-8">
              <Title>Register</Title>
            
              <form className="space-y-6">
                {/* Champ Utilisateur */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-black/80">username</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <UserIcon className="h-5 w-5 text-white/60" />
                    </span>
                    <input 
                      type="text" 
                      placeholder="Surname" 
                      className="input input-bordered w-full pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none" 
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-black/80">E-Mail</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <BookOpenIcon className="h-5 w-5 text-white/60" />
                    </span>
                    <input 
                      type="text" 
                      placeholder="nom@exemple.com" 
                      className="input input-bordered w-full pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none" 
                    />
                  </div>
                </div>

                {/* Champ Mot de passe */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-black/80">Password</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <LockClosedIcon className="h-5 w-5 text-white/60" />
                    </span>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="input input-bordered w-full pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none" 
                    />
                  </div>
                </div>

                {/*Bouton perso*/}
                <div className="form-control mt-6 flex items-center justify-center">
                  <Button label="Enregistrer" onClick={() => console.log('Enregistrement')} />
                </div>
              </form>

              <div className="mt-6 text-center">
                <a onClick={() =>{navigate(``)}} className="text-sm text-white/60 hover:text-white transition-colors">
                  I already have an account?
                </a>
              </div>
            </div>
          </div>
        </div>
        );
    }




export const Connexion = () =>
    {
        const navigate = useNavigate()
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-white-50">
      
          <div className="relative group">
            {/* Effet de lueur en arrière-plan*/}
            <div className="absolute -inset-0.5 bg-white-60 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            
            <div className="relative card w-96 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl p-8">
              <Title>Login</Title>
            
              <form className="space-y-6">
                {/* Champ Utilisateur */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-black/80">Identifiant</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <UserIcon className="h-5 w-5 text-white/60" />
                    </span>
                    <input 
                      type="text" 
                      placeholder="nom@exemple.com" 
                      className="input input-bordered w-full pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none" 
                    />
                  </div>
                </div>

                {/* Champ Mot de passe */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-black/80">Mot de passe</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <LockClosedIcon className="h-5 w-5 text-white/60" />
                    </span>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="input input-bordered w-full pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none" 
                    />
                  </div>
                </div>

                {/* Bouton Daisy UI customisé */}
                <div className="form-control mt-6 flex items-center justify-center">
                        <Button label="Se connecter" onClick={() => console.log('cliqué')} />
                </div>
              </form>

              <div className="mt-6 text-center between-y-4 flex flex-col items-center">
                <a onClick={() =>{navigate(``)}} className="text-sm text-white/60 hover:text-white transition-colors">
                  Mot de passe oublié ?
                </a>
                <a onClick={() =>{navigate(``)}} className="text-sm text-white/60 hover:text-white transition-colors">
                  I don't have an account ?
                </a>
              </div>
            </div>
          </div>
        </div>
        );
    };

