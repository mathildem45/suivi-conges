function Dashboard({
  cpN1Disponible = 0,
  cpNDisponible = 0,
  rttDisponible = 0,
  cpN1Pris = 0,
  cpNPris = 0,
  rttPris = 0,
  conges = []
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


  /*
   * ============================================================
   * OUTILS DE DATE
   * ============================================================
   */

  function creerDate(date) {

    const resultat = new Date(date);

    resultat.setHours(0, 0, 0, 0);

    return resultat;

  }


  function ajouterUnJour(date) {

    const resultat = creerDate(date);

    resultat.setDate(
      resultat.getDate() + 1
    );

    return resultat;

  }


  function datesIdentiques(date1, date2) {

    return (
      creerDate(date1).getTime() ===
      creerDate(date2).getTime()
    );

  }


  /*
   * ============================================================
   * PROCHAIN CONGÉ
   * ============================================================
   */

  function trouverProchainConge() {

    const aujourdHui =
      creerDate(new Date());


    const prochainsConges =
      conges
        .filter(conge => {

          const date =
            creerDate(conge.debut);

          return date >= aujourdHui;

        })
        .sort(
          (a, b) =>
            creerDate(a.debut) -
            creerDate(b.debut)
        );


    return prochainsConges[0] || null;

  }


  /*
   * ============================================================
   * TROUVER LA FIN DE LA PÉRIODE DE CONGÉ
   * ============================================================
   */

  function trouverFinPeriode(prochainConge) {

    if (!prochainConge) {
      return null;
    }


    let fin =
      creerDate(prochainConge.debut);


    /*
     * On regarde les jours suivants.
     *
     * Tant qu'un congé existe pour le jour suivant,
     * on considère qu'il fait partie de la même période.
     */

    while (true) {

      const lendemain =
        ajouterUnJour(fin);


      const congeSuivant =
        conges.find(
          conge =>
            datesIdentiques(
              conge.debut,
              lendemain
            )
        );


      if (!congeSuivant) {
        break;
      }


      /*
       * On ne regroupe que les congés
       * du même type.
       */

      if (
        congeSuivant.type !==
        prochainConge.type
      ) {

        break;

      }


      fin = lendemain;

    }


    return fin;

  }


  /*
   * ============================================================
   * FORMATAGE DES DATES
   * ============================================================
   */

  function afficherDateComplete(date) {

    return creerDate(date).toLocaleDateString(
      "fr-FR",
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );

  }


  function afficherPeriode(debut, fin) {

    const dateDebut =
      creerDate(debut);

    const dateFin =
      creerDate(fin);


    /*
     * Si le congé ne dure qu'un seul jour,
     * on affiche simplement la date.
     */

    if (
      datesIdentiques(
        dateDebut,
        dateFin
      )
    ) {

      return afficherDateComplete(
        dateDebut
      );

    }


    /*
     * Si les deux dates sont dans le même mois,
     * on évite de répéter le mois et l'année.
     *
     * Exemple :
     * Du 7 au 15 novembre 2026
     */

    if (
      dateDebut.getMonth() ===
        dateFin.getMonth() &&

      dateDebut.getFullYear() ===
        dateFin.getFullYear()
    ) {

      const mois =
        dateDebut.toLocaleDateString(
          "fr-FR",
          {
            month: "long"
          }
        );


      return (
        `Du ${dateDebut.getDate()} au ` +
        `${dateFin.getDate()} ${mois} ` +
        `${dateFin.getFullYear()}`
      );

    }


    /*
     * Si la période traverse plusieurs mois.
     *
     * Exemple :
     * Du 28 décembre 2026 au 3 janvier 2027
     */

    return (
      `Du ${afficherDateComplete(dateDebut)} ` +
      `au ${afficherDateComplete(dateFin)}`
    );

  }


  /*
   * ============================================================
   * NOMBRE DE JOURS AVANT LE CONGÉ
   * ============================================================
   */

  function nombreDeJoursAvant(date) {

    const aujourdHui =
      creerDate(new Date());


    const dateConge =
      creerDate(date);


    const difference =
      dateConge - aujourdHui;


    return Math.ceil(
      difference /
      (1000 * 60 * 60 * 24)
    );

  }


  const prochainConge =
    trouverProchainConge();


  const finProchainConge =
    trouverFinPeriode(
      prochainConge
    );


  return (

    <div className="cards">


      {/* ======================================================
          CP N-1
      ====================================================== */}

      <div className="card">

        <h2>
          🏖️ CP N-1
        </h2>

        <div className="value">
          {afficherNombre(cpN1Disponible)}
        </div>

        <p>
          {afficherJour(cpN1Disponible)} disponibles
        </p>

        <small>
          {afficherNombre(cpN1Pris)}{" "}
          {afficherJour(cpN1Pris)} pris
        </small>

      </div>


      {/* ======================================================
          CP N
      ====================================================== */}

      <div className="card">

        <h2>
          🏖️ CP N
        </h2>

        <div className="value">
          {afficherNombre(cpNDisponible)}
        </div>

        <p>
          {afficherJour(cpNDisponible)} disponibles
        </p>

        <small>
          {afficherNombre(cpNPris)}{" "}
          {afficherJour(cpNPris)} pris
        </small>

      </div>


      {/* ======================================================
          RTT
      ====================================================== */}

      <div className="card">

        <h2>
          ⏰ RTT
        </h2>

        <div className="value">
          {afficherNombre(rttDisponible)}
        </div>

        <p>
          {afficherJour(rttDisponible)} disponibles
        </p>

        <small>
          {afficherNombre(rttPris)}{" "}
          {afficherJour(rttPris)} pris
        </small>

      </div>


      {/* ======================================================
          PROCHAIN CONGÉ
      ====================================================== */}

      <div className="card next-leave-card">

        <h2>
          📅 Prochain congé
        </h2>


        {prochainConge ? (

          <>

            <div className="next-leave-date">

              {afficherPeriode(
                prochainConge.debut,
                finProchainConge
              )}

            </div>


            <p>

              {nombreDeJoursAvant(
                prochainConge.debut
              ) === 0

                ? "Aujourd'hui"

                : nombreDeJoursAvant(
                    prochainConge.debut
                  ) === 1

                ? "Demain"

                : `Dans ${
                    nombreDeJoursAvant(
                      prochainConge.debut
                    )
                  } jours`

              }

            </p>


            <span className="next-leave-type">

              {prochainConge.type === "CP"

                ? "🏖️ Congé payé"

                : "⏰ RTT"

              }

            </span>

          </>

        ) : (

          <>

            <div className="next-leave-date">
              Aucun congé
            </div>

            <p>
              Aucun congé prévu
            </p>

          </>

        )}

      </div>


    </div>

  );

}


export default Dashboard;