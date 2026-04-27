import formbg from "../assets/bg-form.jpg";
import logo from "../assets/wart.svg";
import {Connexion} from "../Components/form";

const Login = () =>
    {
        return(
            <section  className="w-full h-screen bg-cover bg-center relative"
            style={{backgroundImage: `url(${formbg})` }}>
                    <Connexion/>
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute bottom-50 left-8 z-10">
                            <img src={logo} alt="Logo" className="h-16 w-auto" />
                        </div>
            </section>
        );
    };

export default Login;