function OptimizeLeaves({
  cpN1Disponible = 0,
  cpNDisponible = 0,
  rttDisponible = 0,
  conges = [],
  onAddOptimization
}) {

  /*
   * ============================================================
   * OUTILS DE DATE
   * ============================================================
   */

  function creerDate(date) {

    if (date instanceof Date) {
      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
    }

    const [annee, mois, jour] =
      date.split("-").map(Number);

    return new Date(
      annee,
      mois - 1,
      jour
    );
  }


  function ajouterJours(date, nombre) {

    const resultat = creerDate(date);

    resultat.setDate(
      resultat.getDate() + nombre
    );

    return resultat;
  }


  function formatISO(date) {

    const annee =
      date.getFullYear();

    const mois =
      String(date.getMonth() + 1)
        .padStart(2, "0");

    const jour =
      String(date.getDate())
        .padStart(2, "0");

    return `${annee}-${mois}-${jour}`;
  }


  function formaterDate(date) {

    return date.toLocaleDateString(
      "fr-FR",
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );
  }


  /*
   * ============================================================
   * PÉRIODE D'ACQUISITION JUIN → MAI
   * ============================================================
   */

  const aujourdHui =
    creerDate(new Date());

  const anneeActuelle =
    aujourdHui.getFullYear();

  const moisActuel =
    aujourdHui.getMonth();

  const anneeDebut =
    moisActuel >= 5
      ? anneeActuelle
      : anneeActuelle - 1;


  const debutPeriode =
    creerDate(
      `${anneeDebut}-06-01`
    );


  const finPeriode =
    creerDate(
      `${anneeDebut + 1}-05-31`
    );


  /*
   * On ne propose jamais une période
   * déjà passée.
   */

  const debutRecherche =
    aujourdHui > debutPeriode
      ? aujourdHui
      : debutPeriode;


  /*
   * ============================================================
   * JOURS FÉRIÉS
   * ============================================================
   *
   * Le lundi de Pentecôte n'est volontairement
   * PAS considéré comme férié car tu travailles ce jour-là.
   * ============================================================
   */

  function calculerPaques(annee) {

    const a = annee % 19;
    const b = Math.floor(annee / 100);
    const c = annee % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);

    const h =
      (
        19 * a +
        b -
        d -
        g +
        15
      ) % 30;

    const i = Math.floor(c / 4);
    const k = c % 4;

    const l =
      (
        32 +
        2 * e +
        2 * i -
        h -
        k
      ) % 7;

    const m =
      Math.floor(
        (a + 11 * h + 22 * l) / 451
      );

    const mois =
      Math.floor(
        (h + l - 7 * m + 114) / 31
      );

    const jour =
      (
        h +
        l -
        7 * m +
        114
      ) % 31 + 1;

    return new Date(
      annee,
      mois - 1,
      jour
    );
  }


  function trouverJoursFeries(annee) {

    const paques =
      calculerPaques(annee);

    const lundiPaques =
      ajouterJours(
        paques,
        1
      );

    const ascension =
      ajouterJours(
        paques,
        39
      );

    return [

      `${annee}-01-01`,

      formatISO(lundiPaques),

      `${annee}-05-01`,

      `${annee}-05-08`,

      formatISO(ascension),

      `${annee}-07-14`,

      `${annee}-08-15`,

      `${annee}-11-01`,

      `${annee}-11-11`,

      `${annee}-12-25`

    ];
  }


  const joursFeries = [

    ...trouverJoursFeries(
      anneeDebut
    ),

    ...trouverJoursFeries(
      anneeDebut + 1
    )

  ];


  /*
   * ============================================================
   * IDENTIFICATION DES JOURS
   * ============================================================
   */

  function estWeekend(date) {

    const jour =
      date.getDay();

    return (
      jour === 0 ||
      jour === 6
    );
  }


  function estJourFerie(date) {

    return joursFeries.includes(
      formatISO(date)
    );
  }


  function estJourDejaPose(date) {

    const iso =
      formatISO(date);

    return conges.some(
      conge =>
        conge.debut === iso &&
        conge.deduireDuSolde !== false
    );
  }


  function estJourTravaille(date) {

    return (
      !estWeekend(date) &&
      !estJourFerie(date)
    );
  }


  /*
   * ============================================================
   * ANALYSE D'UNE PÉRIODE
   * ============================================================
   */

  function analyserPeriode(
    debut,
    fin
  ) {

    const joursAPoser = [];

    let nombreJoursFeriesUtiles = 0;


    for (
      let date = creerDate(debut);
      date <= fin;
      date = ajouterJours(date, 1)
    ) {

      /*
       * Jour férié qui tombe en semaine.
       */

      if (
        estJourFerie(date) &&
        !estWeekend(date)
      ) {

        nombreJoursFeriesUtiles++;

      }


      /*
       * Jour travaillé qui doit être posé.
       */

      if (
        estJourTravaille(date) &&
        !estJourDejaPose(date)
      ) {

        joursAPoser.push(
          creerDate(date)
        );

      }

    }


    /*
     * On ne veut pas proposer
     * plus de 4 jours à poser.
     */

    if (
      joursAPoser.length < 1 ||
      joursAPoser.length > 4
    ) {

      return null;

    }


    const duree =
      Math.round(
        (
          fin - debut
        ) /
        (1000 * 60 * 60 * 24)
      ) + 1;


    const gain =
      duree -
      joursAPoser.length;


    /*
     * On élimine les petites périodes
     * ordinaires sans jour férié.
     */

    if (
      nombreJoursFeriesUtiles === 0 &&
      duree < 7
    ) {

      return null;

    }


    /*
     * Minimum 2 jours gagnés.
     */

    if (gain < 2) {

      return null;

    }


    return {

      debut:
        creerDate(debut),

      fin:
        creerDate(fin),

      duree,

      joursAPoser,

      nombreJoursAPoser:
        joursAPoser.length,

      gain,

      nombreJoursFeries:
        nombreJoursFeriesUtiles

    };
  }


  /*
   * ============================================================
   * GÉNÉRATION DES CANDIDATS
   * ============================================================
   */

  function genererCandidats() {

    const candidats = [];


    for (
      let debut =
        creerDate(debutRecherche);

      debut <= finPeriode;

      debut =
        ajouterJours(debut, 1)
    ) {

      /*
       * On teste des périodes
       * de 3 à 14 jours.
       */

      for (
        let duree = 3;
        duree <= 14;
        duree++
      ) {

        const fin =
          ajouterJours(
            debut,
            duree - 1
          );


        if (
          fin > finPeriode
        ) {

          break;

        }


        const candidat =
          analyserPeriode(
            debut,
            fin
          );


        if (candidat) {

          candidats.push(
            candidat
          );

        }

      }

    }


    return candidats;
  }


  /*
   * ============================================================
   * SUPPRESSION DES DOUBLONS
   * ============================================================
   */

  function supprimerDoublons(
    candidats
  ) {

    const resultat = [];

    const cles = new Set();


    candidats.forEach(
      candidat => {

        const cle =
          `${formatISO(candidat.debut)}-${formatISO(candidat.fin)}`;


        if (!cles.has(cle)) {

          cles.add(cle);

          resultat.push(candidat);

        }

      }
    );


    return resultat;
  }


  /*
   * ============================================================
   * CLASSEMENT DES CANDIDATS
   * ============================================================
   *
   * Priorité :
   *
   * 1. Plus grand gain
   * 2. Plus grande durée de repos
   * 3. Moins de jours à poser
   * 4. Plus proche dans le temps
   * ============================================================
   */

  function comparerCandidats(a, b) {

    if (b.gain !== a.gain) {

      return b.gain - a.gain;

    }


    if (b.duree !== a.duree) {

      return b.duree - a.duree;

    }


    if (
      a.nombreJoursAPoser !==
      b.nombreJoursAPoser
    ) {

      return (
        a.nombreJoursAPoser -
        b.nombreJoursAPoser
      );

    }


    return a.debut - b.debut;
  }


  /*
   * ============================================================
   * SUPPRESSION DES PÉRIODES QUI SE CHEVAUCHENT
   * ============================================================
   *
   * On garde d'abord les meilleures périodes.
   * Puis on élimine les périodes qui se recouvrent.
   * ============================================================
   */

  function supprimerChevauchements(
    candidats
  ) {

    const tries =
      candidats
        .slice()
        .sort(comparerCandidats);


    const resultat = [];


    for (
      const candidat of tries
    ) {

      const chevauche =
        resultat.some(
          existant =>
            candidat.debut <= existant.fin &&
            candidat.fin >= existant.debut
        );


      if (!chevauche) {

        resultat.push(candidat);

      }


      /*
       * On ne garde jamais plus de 6
       * périodes réellement différentes.
       */

      if (resultat.length >= 6) {

        break;

      }

    }


    /*
     * Affichage chronologique.
     */

    resultat.sort(
      (a, b) =>
        a.debut - b.debut
    );


    return resultat;
  }


  /*
   * ============================================================
   * CALCUL FINAL
   * ============================================================
   */

  function trouverOptimisations() {

    const totalCP =
      Number(cpN1Disponible) +
      Number(cpNDisponible);

    const totalRTT =
      Number(rttDisponible);


    const totalDisponible =
      totalCP + totalRTT;


    if (
      totalDisponible <= 0
    ) {

      return [];

    }


    let candidats =
      genererCandidats();


    /*
     * Une proposition ne peut jamais
     * demander plus de jours disponibles.
     */

    candidats =
      candidats.filter(
        candidat =>
          candidat.nombreJoursAPoser <=
          totalDisponible
      );


    candidats =
      supprimerDoublons(
        candidats
      );


    /*
     * On sélectionne les meilleures
     * périodes sans chevauchement.
     */

    candidats =
      supprimerChevauchements(
        candidats
      );


    return candidats;
  }


  const optimisations =
    trouverOptimisations();


  /*
   * ============================================================
   * AFFICHAGE
   * ============================================================
   */

  return (

    <div className="card optimize-card">

      <h2>
        💡 Optimiser mes congés
      </h2>


      <p>
        Les meilleures périodes futures
        pour profiter au maximum de tes
        jours de congé.
      </p>


      {optimisations.length === 0 ? (

        <p>
          Aucune optimisation trouvée.
        </p>

      ) : (

        <div className="optimization-list">

          {optimisations.map(
            proposition => (

              <div
                key={
                  `${formatISO(
                    proposition.debut
                  )}-${formatISO(
                    proposition.fin
                  )}`
                }
                className="optimization-item"
              >

                <strong>

                  ⭐{" "}

                  {proposition.nombreJoursAPoser}{" "}
                  jour
                  {proposition.nombreJoursAPoser > 1
                    ? "s"
                    : ""
                  }{" "}
                  à poser

                </strong>


                <p>

                  📅 Du{" "}

                  {formaterDate(
                    proposition.debut
                  )}

                  {" au "}

                  {formaterDate(
                    proposition.fin
                  )}

                </p>


                <p>

                  🏖️ À poser :{" "}

                  {proposition.joursAPoser.map(
                    (
                      date,
                      indexDate
                    ) => (

                      <span
                        key={formatISO(date)}
                      >

                        {indexDate > 0
                          ? ", "
                          : ""
                        }

                        {formaterDate(
                          date
                        )}

                      </span>

                    )
                  )}

                </p>


                <p>

                  🛌{" "}
                  {proposition.duree} jours
                  de repos consécutifs

                </p>


                <p>

                  ✨ Gain :{" "}

                  {proposition.gain} jour
                  {proposition.gain > 1
                    ? "s"
                    : ""}

                </p>


                <div className="optimization-actions">

                  <button
                    type="button"
                    onClick={() =>
                      onAddOptimization(
                        proposition,
                        "CP"
                      )
                    }
                    disabled={
                      proposition.nombreJoursAPoser >
                      (
                        Number(cpN1Disponible) +
                        Number(cpNDisponible)
                      )
                    }
                  >
                    🏖️ Ajouter en CP
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      onAddOptimization(
                        proposition,
                        "RTT"
                      )
                    }
                    disabled={
                      proposition.nombreJoursAPoser >
                      Number(rttDisponible)
                    }
                  >
                    ⏰ Ajouter en RTT
                  </button>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>

  );
}


export default OptimizeLeaves;