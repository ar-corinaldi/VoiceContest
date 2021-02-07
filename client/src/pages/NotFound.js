import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div>
    <p>Click para redireccionar a "/" que es una ruta conocida:</p>
    <Link to="/">Click!!</Link>
  </div>
);

export default NotFound;
