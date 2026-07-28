import Calendar from "./components/Calendar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import AddLeaveModal from "./components/AddLeaveModal";
import LeaveHistory from "./components/LeaveHistory";
import { settings } from "./data/settings";
import { congesInitiaux } from "./data/conges";
import { useEffect, useState } from "react";
import "./App.css";

function App() {

  const [conges, setConges] = useState(() => {

    const sauvegarde = localStorage.getItem("conges");

    return sauvegarde
      ? JSON.parse(sauvegarde)
      : congesInitiaux;

  });

  const [dateSelectionnee, setDateSelectionnee] = useState(null);

  useEffect(() => {

    localStorage.setItem(
      "conges",
      JSON.stringify(conges)
    );

  }, [conges]);



  function enregistrerConge(nouveauConge) {

    const [jour, mois, annee] =
      nouveauConge.date.split("-");

    const dateISO =
      `${annee}-${mois}-${jour}`;

    setConges([
  ...conges,
  {
    debut: dateISO,
    fin: dateISO,
    type: nouveauConge.type,
    jours: nouveauConge.duree,
    moment: nouveauConge.moment
  }
]);

    setDateSelectionnee(null);

  }



  const cpPris =
    conges
      .filter(c => c.type === "CP")
      .reduce(
        (total, c) => total + c.jours,
        0
      );



  const rttPris =
    conges
      .filter(c => c.type === "RTT")
      .reduce(
        (total, c) => total + c.jours,
        0
      );

function supprimerConge(congeASupprimer) {

  const confirmation =
    window.confirm(
      "Supprimer ce congé ?"
    );

  if (!confirmation) {
    return;
  }


  setConges(
    conges.filter(
      c =>
        !(
          c.debut === congeASupprimer.debut
          &&
          c.type === congeASupprimer.type
        )
    )
  );

}

  return (

    <div className="app">

      <Header />

      <Dashboard
        cpAcquis={settings.cpAcquis}
        cpPris={cpPris}
        rttAcquis={settings.rttAcquis}
        rttPris={rttPris}
      />

      <div className="card">

        <h2>📌 Informations</h2>

        <p>
          Date d'entrée : 02-02-2026
        </p>

        <p>
          Lundi de Pentecôte travaillé : Oui
        </p>

      </div>

      <Calendar
  conges={conges}
  onSelectDate={setDateSelectionnee}
  onDeleteConge={supprimerConge}
/>

      {dateSelectionnee && (

        <AddLeaveModal
          date={dateSelectionnee}
          onClose={() => setDateSelectionnee(null)}
          onSave={enregistrerConge}
        />

      )}
<LeaveHistory
  conges={conges}
  onDelete={supprimerConge}
/>
    </div>

  );

}

export default App;