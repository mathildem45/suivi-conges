function Dashboard({
  cpAcquis = 0,
  cpPris = 0,
  rttAcquis = 0,
  rttPris = 0,
}) {


  function afficherNombre(nombre) {

    const valeur = Number(nombre);

    return valeur % 1 === 0
      ? valeur
      : valeur.toFixed(1);

  }



  function afficherJour(nombre) {

    return nombre > 1
      ? "jours"
      : "jour";

  }




  const cpRestants =
    Number(cpAcquis) - Number(cpPris);



  const rttRestants =
    Number(rttAcquis) - Number(rttPris);




  return (

    <div className="cards">


      <div className="card">


        <h2>
          🏖️ Congés payés
        </h2>



        <div className="value">

          {afficherNombre(cpRestants)}

        </div>


        <p>
          {afficherJour(cpRestants)} disponibles
        </p>



        <small>

          Acquis : {afficherNombre(cpAcquis)} jours

          <br />

          Pris : {afficherNombre(cpPris)} jours

        </small>


      </div>





      <div className="card">


        <h2>
          ⏰ RTT
        </h2>



        <div className="value">

          {afficherNombre(rttRestants)}

        </div>


        <p>
          {afficherJour(rttRestants)} disponibles
        </p>



        <small>

          Acquis : {afficherNombre(rttAcquis)} jours

          <br />

          Pris : {afficherNombre(rttPris)} jours

        </small>


      </div>



    </div>

  );

}


export default Dashboard;