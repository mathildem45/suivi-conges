import { useRef } from "react";

function Backup({
  conges = [],
  bulletin = {}
}) {

  const inputFileRef = useRef(null);


  /*
   * ============================================================
   * EXPORTER LES DONNÉES
   * ============================================================
   */

  function exporterDonnees() {

    const sauvegarde = {

      version: 1,

      dateSauvegarde:
        new Date().toISOString(),

      conges,

      bulletin

    };


    const contenu =
      JSON.stringify(
        sauvegarde,
        null,
        2
      );


    const fichier =
      new Blob(
        [contenu],
        {
          type: "application/json"
        }
      );


    const url =
      URL.createObjectURL(
        fichier
      );


    const lien =
      document.createElement("a");

    lien.href = url;

    lien.download =
      `suivi-conges-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;


    document.body.appendChild(lien);

    lien.click();

    document.body.removeChild(lien);

    URL.revokeObjectURL(url);

  }


  /*
   * ============================================================
   * OUVRIR LE SÉLECTEUR DE FICHIER
   * ============================================================
   */

  function choisirFichier() {

    if (inputFileRef.current) {

      inputFileRef.current.click();

    }

  }


  /*
   * ============================================================
   * IMPORTER UNE SAUVEGARDE
   * ============================================================
   */

  function importerDonnees(event) {

    const fichier =
      event.target.files?.[0];


    if (!fichier) {

      return;

    }


    const lecteur =
      new FileReader();


    lecteur.onload = () => {

      try {

        const sauvegarde =
          JSON.parse(
            lecteur.result
          );


        if (
          !sauvegarde ||
          !Array.isArray(
            sauvegarde.conges
          )
        ) {

          alert(
            "❌ Ce fichier ne semble pas être une sauvegarde valide de l'application."
          );

          return;

        }


        const confirmation =
          window.confirm(
            "⚠️ Restaurer cette sauvegarde ?\n\nLes données actuellement enregistrées dans l'application seront remplacées."
          );


        if (!confirmation) {

          return;

        }


        localStorage.setItem(
          "conges",
          JSON.stringify(
            sauvegarde.conges
          )
        );


        if (
          sauvegarde.bulletin
        ) {

          localStorage.setItem(
            "dernierBulletin",
            JSON.stringify(
              sauvegarde.bulletin
            )
          );

        }


        alert(
          "✅ Sauvegarde restaurée. L'application va être rechargée."
        );


        window.location.reload();

      } catch (erreur) {

        console.error(
          erreur
        );

        alert(
          "❌ Impossible de lire cette sauvegarde."
        );

      }

    };


    lecteur.onerror = () => {

      alert(
        "❌ Impossible de lire le fichier."
      );

    };


    lecteur.readAsText(
      fichier
    );


    /*
     * Permet de sélectionner
     * à nouveau le même fichier.
     */

    event.target.value = "";

  }


  /*
   * ============================================================
   * AFFICHAGE
   * ============================================================
   */

  return (

    <div className="card backup-card">

      <h2>
        💾 Sauvegarde
      </h2>


      <p>
        Sauvegarde tes congés et tes
        paramètres pour éviter de perdre
        tes données.
      </p>


      <div className="backup-actions">

        <button
          type="button"
          onClick={exporterDonnees}
        >
          💾 Exporter mes données
        </button>


        <button
          type="button"
          onClick={choisirFichier}
        >
          📥 Importer une sauvegarde
        </button>


        <input
          ref={inputFileRef}
          type="file"
          accept=".json,application/json"
          onChange={importerDonnees}
          style={{
            display: "none"
          }}
        />

      </div>

    </div>

  );

}


export default Backup;