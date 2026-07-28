function Dashboard({
  cpAcquis = 0,
  cpPris = 0,
  rttAcquis = 0,
  rttPris = 0,
}) {

  const cpTotal = Number(cpAcquis);
  const cpPrisTotal = Number(cpPris);

  const rttTotal = Number(rttAcquis);
  const rttPrisTotal = Number(rttPris);


  return (
    <div className="cards">

      <div className="card">

        <h2>🏖️ Congés payés</h2>

        <div className="value">
          {(cpTotal - cpPrisTotal).toFixed(2)}
        </div>

        <p>jours disponibles</p>

        <small>
          Acquis : {cpTotal.toFixed(2)}
          <br />
          Pris : {cpPrisTotal}
        </small>

      </div>



      <div className="card">

        <h2>⏰ RTT</h2>

        <div className="value">
          {(rttTotal - rttPrisTotal).toFixed(2)}
        </div>

        <p>jours disponibles</p>

        <small>
          Acquis : {rttTotal.toFixed(2)}
          <br />
          Pris : {rttPrisTotal}
        </small>

      </div>


    </div>
  );
}

export default Dashboard;