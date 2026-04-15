

import { LockClosedIcon, UserIcon, BookOpenIcon } from "@heroicons/react/24/outline";




export const Register = () =>
    {
        return(
            <div className="min-h-screen w-full flex items-center justify-center bg-white-50">
      
            {/* Conteneur Glassmorphic */}
          <div className="relative group">
            {/* Effet de lueur en arrière-plan (Optionnel) */}
            <div className="absolute -inset-0.5 bg-white-60 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            
            <div className="relative card w-96 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl p-8">
              <h2 className="text-3xl font-bold text-center text-white mb-8">Register</h2>
            
              <form className="space-y-6">
                {/* Champ Utilisateur */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-white/80">username</span>
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
                    <span className="label-text text-white/80">E-Mail</span>
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
                    <span className="label-text text-white/80">Password</span>
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
                  <button className="btn border-none bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all duration-300" >
                    S'inscrire
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">
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
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-white-50">
      
          <div className="relative group">
            {/* Effet de lueur en arrière-plan (Optionnel) */}
            <div className="absolute -inset-0.5 bg-white-60 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            
            <div className="relative card w-96 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl p-8">
              <h2 className="text-3xl font-bold text-center text-white mb-8">Connexion</h2>
            
              <form className="space-y-6">
                {/* Champ Utilisateur */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-white/80">Identifiant</span>
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
                    <span className="label-text text-white/80">Mot de passe</span>
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
                  <button className="btn border-none bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all duration-300">
                    Se connecter
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center between-y-4 flex flex-col items-center">
                <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                  Mot de passe oublié ?
                </a>
                <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                  I don't have an account ?
                </a>
              </div>
            </div>
          </div>
        </div>
        );
    };

