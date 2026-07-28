import { useEffect, useState } from "react";

import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Calendar from "./components/Calendar";
import LeaveHistory from "./components/LeaveHistory";
import AddLeaveModal from "./components/AddLeaveModal";

import { settings } from "./data/settings";
import { congesInitiaux } from "./data/conges";

import "./App.css";


function App() {


  const [conges, setConges] = useState(() => {

    const sauvegarde =
      localStorage.getItem("conges");

    return sauvegarde
      ? JSON.parse(sauvegarde)
      : congesInitiaux;

  });



  const [dateSelectionnee, setDateSelectionnee] =
    useState(null);



  useEffect(() => {

    localStorage.setItem(
      "conges",
      JSON.stringify(conges)
    );

  }, [conges]);



  function ajouterConge(nouveauConge) {

    setConges([
      ...conges,
      nouveauConge
    ]);

  }



  function supprimerConge(conge) {

    setConges(
      conges.filter(
        c =>
          c.debut !== conge.debut
      )
    );

  }



  const cpPris =
    conges
      .filter(c => c.type === "CP")
      .reduce(
        (total,c) =>
          total + c.jours,
        0
      );



  const rttPris =
    conges
      .filter(c => c.type === "RTT")
      .reduce(
        (total,c) =>
          total + c.jours,
        0
      );



  return (

    <div className="app">

      <Header />


      <Dashboard

        cpAcquis={settings.cpAcquis}

        cpPris={cpPris}

        rttAcquis={settings.rttAcquis}

        rttPris={rttPris}

      />



      <Calendar

        conges={conges}

        setConges={setConges}

        onSelectDate={setDateSelectionnee}

      />



      <LeaveHistory

        conges={conges}

        onDelete={supprimerConge}

      />



      {dateSelectionnee && (

        <AddLeaveModal

          date={dateSelectionnee}

          onClose={() =>
            setDateSelectionnee(null)
          }

          onSave={ajouterConge}

        />

      )}


    </div>

  );

}


export default App;