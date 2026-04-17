import Button from '../Components/button';
import {Connexion, Register} from '../Components/form';

const Artistes = () => {
  return (
    <div className="text-black">
      <h1 className="text-3xl font-bold">Artistes</h1>
      <Button label="Enregistrer" onClick={() => console.log('cliqué')} />
      <Connexion/>
      <Register/>
    </div>
  );
};

export default Artistes;