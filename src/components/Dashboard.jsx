function Dashboard({
  cpN1Disponible = 0,
  cpNDisponible = 0,
  rttDisponible = 0
}) {

  function afficherNombre(nombre) {
    const valeur = Number(nombre);

    return valeur % 1 === 0
      ? valeur
      : valeur.toFixed(2);
  }

  function afficherJour(nombre) {
    return Number(nombre) > 1
      ? "jours"
      : "jour";
  }

  return (
    <div className="cards">

      <div className="card">

        <h2>🏖️ CP N-1</h2>

        <div className="value">
          {afficherNombre(cpN1Disponible)}
        </div>

        <p>
          {afficherJour(cpN1Disponible)} disponibles
        </p>

      </div>


      <div className="card">

        <h2>🏖️ CP N</h2>

        <div className="value">
          {afficherNombre(cpNDisponible)}
        </div>

        <p>
          {afficherJour(cpNDisponible)} disponibles
        </p>

      </div>


      <div className="card">

        <h2>⏰ RTT</h2>

        <div className="value">
          {afficherNombre(rttDisponible)}
        </div>

        <p>
          {afficherJour(rttDisponible)} disponibles
        </p>

      </div>

    </div>
  );
}

export default Dashboard;
