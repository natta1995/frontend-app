import React, { useState } from "react";
import { Button } from "react-bootstrap";


const HandleUser = () =>
{
  return (
    <div style={{textAlign: "center", paddingTop: "5%"}}>
    <h2>Vill du ta bort ditt konto?</h2>
    <p>Du vet väll att du när som helst kan ta bort ditt konto?</p>
    <p>OBS: Ett raderat konto går inte att återfå.</p>
    <Button variant="danger">Radera Konto</Button>
    </div>
  )
}

export default HandleUser;