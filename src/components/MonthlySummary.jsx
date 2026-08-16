function MonthlySummary({
  bulletin,
  cpDepuisBulletin = 0,
  rttDepuisBulletin = 0,
  cpParMois = 2.08,
  rttParMois = 0.50
}) {

  if (!bulletin) {
    return null;
  }


  const dateBulletin = new Date(
    bulletin.dateFin ||
    `${bulletin.mois}-01`
  );


  const aujourdHui = new Date();


  // Nombre de mois complets écoulés
  // depuis la fin du dernier bulletin
  const moisEcoules = Math.max(
    0,
    (
      (aujourdHui.getFullYear() -
        dateBulletin.getFullYear()) * 12
      +
      (aujourdHui.getMonth() -
        dateBulletin.getMonth())
      - 1
    )
  );


  const cpAcquisDepuis =
    moisEcoules * Number(cpParMois);


  const rttAcquisDepuis =
    moisEcoules * Number(rttParMois);


  // Mois actuel
  const moisEnCours =
    aujourdHui.toLocaleDateString(
      "fr-FR",
      {
        month: "long",
        year: "numeric"
      }
    );


  // Soldes officiels + droits déjà acquis
  // - congés posés depuis le bulletin
  const cpActuel =
    Number(bulletin.cpNDisponible)
    +
    cpAcquisDepuis
    -
    Number(cpDepuisBulletin);


  const rttActuel =
    Number(bulletin.rttDisponible)
    +
    rttAcquisDepuis
    -
    Number(rttDepuisBulletin);


  // Prévision après acquisition du mois en cours
  const cpFinMois =
    cpActuel + Number(cpParMois);


  const rttFinMois =
    rttActuel + Number(rttParMois);


  function afficher(nombre) {

    const valeur = Number(nombre);

    return valeur % 1 === 0
      ? valeur.toFixed(0)
      : valeur.toFixed(2);

  }


  return (

    <div className="monthly-summary">


      <div className="monthly-summary-header">

        <div>

          <h2>
            📊 Suivi depuis le dernier bulletin
          </h2>

          <p>
            Bulletin de {bulletin.mois}
          </p>

        </div>

      </div>


      {/* MOIS EN COURS */}

      <div className="current-month">

        <strong>
          📅 {moisEnCours}
        </strong>

        <span>
          Mois en cours
        </span>

      </div>


      {/* CP */}

      <div className="summary-section">

        <h3>
          🏖️ Congés payés
        </h3>


        <div className="summary-line">

          <span>
            Solde au bulletin
          </span>

          <strong>
            {afficher(
              bulletin.cpNDisponible
            )}
          </strong>

        </div>


        <div className="summary-line positive">

          <span>
            ➕ Acquis depuis le bulletin
          </span>

          <strong>
            +{afficher(cpAcquisDepuis)}
          </strong>

        </div>


        <div className="summary-line negative">

          <span>
            ➖ Posés depuis le bulletin
          </span>

          <strong>
            −{afficher(cpDepuisBulletin)}
          </strong>

        </div>


        <div className="summary-total">

          <span>
            Solde actuel
          </span>

          <strong>
            {afficher(cpActuel)}
          </strong>

        </div>


        <div className="summary-forecast">

          <span>
            🔮 Prévision fin {moisEnCours}
          </span>

          <strong>
            {afficher(cpFinMois)}
          </strong>

          <small>
            si aucun nouveau congé n'est posé
          </small>

        </div>

      </div>


      {/* RTT */}

      <div className="summary-section">

        <h3>
          ⏰ RTT
        </h3>


        <div className="summary-line">

          <span>
            Solde au bulletin
          </span>

          <strong>
            {afficher(
              bulletin.rttDisponible
            )}
          </strong>

        </div>


        <div className="summary-line positive">

          <span>
            ➕ Acquis depuis le bulletin
          </span>

          <strong>
            +{afficher(rttAcquisDepuis)}
          </strong>

        </div>


        <div className="summary-line negative">

          <span>
            ➖ Posés depuis le bulletin
          </span>

          <strong>
            −{afficher(rttDepuisBulletin)}
          </strong>

        </div>


        <div className="summary-total">

          <span>
            Solde actuel
          </span>

          <strong>
            {afficher(rttActuel)}
          </strong>

        </div>


        <div className="summary-forecast">

          <span>
            🔮 Prévision fin {moisEnCours}
          </span>

          <strong>
            {afficher(rttFinMois)}
          </strong>

          <small>
            si aucun nouveau RTT n'est posé
          </small>

        </div>

      </div>


      <div className="monthly-summary-note">

        💡 Le solde du bulletin reste la référence
        officielle. Les prévisions sont indicatives.

      </div>


    </div>

  );

}


export default MonthlySummary;