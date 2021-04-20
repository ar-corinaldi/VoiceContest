import React, { useEffect, useState, useContext } from "react";
import { Col, Button } from "antd";
import { AuthContext } from "../App";
import { doFetch } from "../utils/useFetch";

function VoiceDetail({ voice, page, idx, contest, setVoices }) {
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const [endpoint, setEndpoint] = useState("");
  useEffect(() => {
    setIsLoading(true);
    try {
      setEndpoint(
        process.env.NODE_ENV === "production"
          ? `${process.env.REACT_APP_URL_ENDPOINTS_PROD}/${contest.id}/${voice.id}`
          : `${process.env.REACT_APP_URL_ENDPOINTS_TEST}/${contest.id}/${voice.id}`
      );
      console.log(endpoint);
    } finally {
      setIsLoading(false);
    }
  }, [setEndpoint, contest.id, voice.id]);

  const onDelete = async () => {
    try {
      const data = await doFetch(
        `/contests/${contest.id}/voices/${voice.id}`,
        "DELETE",
        undefined,
        token
      );
      if (!data.error) {
        setVoices((prev) => prev.filter((cur) => cur.id !== voice.id));
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  const descargaConvertida = async () => {
    console.log(endpoint);
    const res = await fetch(endpoint);
    console.log(res);
    const audio = await res.blob();
    console.log(audio);

    let aTag = document.createElement("a");
    aTag.href = `${endpoint}/downloadVoiceConverted`;
    aTag.target = "_blank";
    aTag.click();
  };
  return (
    <Col key={voice.id} className="m-3">
      <div className="card">
        <h5 className="card-header">Audio # {idx + (page - 1) * 20 + 1}</h5>
        <div className="card-body">
          <h5 className="card-title">{voice.name + " " + voice.last_name}</h5>
          <p className="card-text">{voice.email}</p>
          <div className="d-flex justify-center">
            <Button
              onClick={async () => {
                // const res = await fetch(ENDPOINT);
                // console.log(res);
                let aTag = document.createElement("a");
                console.log(voice.filename);
                aTag.href = `http://d3a4e69hv3qlpz.cloudfront.net/originals/${voice.filename}`;
                aTag.target = "_blank";
                aTag.click();
              }}
              className="btn btn-primary"
            >
              Descargar Original
            </Button>
            <Button onClick={descargaConvertida} className="btn btn-secondary">
              Descargar Convertida
            </Button>
          </div>
          {isLoading &&
            !endpoint(
              <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            )}
          {!isLoading && endpoint && (
            <audio controls>
              <source
                id="original"
                src={`${endpoint}/downloadVoiceConverted`}
                type="audio/mp3"
              />
            </audio>
          )}
        </div>
        {!!token && (
          <Button type="primary" onClick={onDelete} danger>
            Eliminar
          </Button>
        )}
      </div>
    </Col>
  );
}

export default VoiceDetail;
