import { useEffect, useState } from "react";

import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Calendar from "./components/Calendar";
import LeaveHistory from "./components/LeaveHistory";

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


  useEffect(() => {

    localStorage.setItem(
      "conges",
      JSON.stringify(conges)
    );

  }, [conges]);



  const cpPris =
    conges
      .filter(conge => conge.type === "CP")
      .reduce(
        (total, conge) =>
          total + conge.jours,
        0
      );


  const rttPris =
    conges
      .filter(conge => conge.type === "RTT")
      .reduce(
        (total, conge) =>
          total + conge.jours,
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
      />


      <LeaveHistory
        conges={conges}
        setConges={setConges}
      />


    </div>

  );

}


export default App;