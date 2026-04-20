import formbg from "../assets/bg-form.jpg";
import logo from "../assets/wart.svg";
import {Register} from "../Components/form";

const Registers = () =>
    {
        return(
            <section  className="w-full h-screen bg-cover bg-center relative"
            style={{backgroundImage: `url(${formbg})` }}>
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute bottom-20 left-8 z-10">
                            <img src={logo} alt="Logo" className="h-16 w-auto" />
                        </div>
                <div className="absolute bottom-8 left-8 z-10">
                    <p className="italic text-lg text-white drop-shadow">Bienvenue sur Wart</p>
                    <p className="italic text-sm text-white/80 mt-1 drop-shadow">
                        une E-Galerie d'art numérique dédiée à la promotion de l'art contemporain et à la valorisation du travail des artistes émergents.
                    </p>
                </div>
                <Register/>
            </section>
        );
    };

export default Registers;