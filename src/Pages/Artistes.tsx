import Button from '../Components/button';
const Artistes = () => {
  return (
    <div className="text-black">
      <h1 className="text-3xl font-bold">Artistes</h1>
      <Button label="Enregistrer" onClick={() => console.log('cliqué')} />
    </div>
  );
};

export default Artistes;