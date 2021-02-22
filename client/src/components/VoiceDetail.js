import React, { useEffect, useState, useContext } from "react";
import { Col, Button } from "antd";
import { AuthContext } from "../App";
import { doFetch } from "../utils/useFetch";

function VoiceDetail({ voice, page, idx, contest, setVoices }) {
  const [originalAudioURL, setOriginalAudioURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (voice && voice.state && voice.state.toLowerCase() === "convertida") {
    }
    getAudio();
  }, [voice]);

  const onDelete = async () => {
    try {
      const data = await doFetch(
        `/contests/${contest.id}/voices/${voice.id}`,
        "DELETE",
        undefined,
        token
      );
      if (!data.error) {
        setVoices((prev) => prev.filter((cur) => cur !== voice.id));
      }
    } catch (e) {
      console.log("error", e);
    }
  };
  const getAudio = async () => {
    try {
      setIsLoading(true);

      const ENDPOINT =
        process.env.NODE_ENV === "production"
          ? `http://172.24.98.143/${contest.id}/${voice.id}/downloadVoiceConverted`
          : `http://localhost:5000/${contest.id}/${voice.id}/downloadVoiceConverted`;
      const res = await fetch(ENDPOINT);
      console.log(res);
      const audio = await res.blob();
      let url = window.URL.createObjectURL(audio);
      new Audio(audio);
      setOriginalAudioURL(url);
      console.log(url);
    } finally {
      setIsLoading(false);
    }
  };

  const descargaConvertida = async () => {
    const ENDPOINT =
      process.env.NODE_ENV === "production"
        ? `http://172.24.98.143/${contest.id}/${voice.id}/downloadVoiceConverted`
        : `http://localhost:5000/${contest.id}/${voice.id}/downloadVoiceConverted`;
    console.log(ENDPOINT);
    const res = await fetch(ENDPOINT);
    console.log(res);
    const audio = await res.blob();
    console.log(audio);

    let aTag = document.createElement("a");
    aTag.href =
      process.env.NODE_ENV === "production"
        ? `/home/estudiante/VoiceContest/back/processed/${voice.filename}`
        : ENDPOINT;

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
                const ENDPOINT =
                  process.env.NODE_ENV === "production"
                    ? `http://172.24.98.143/${contest.id}/${voice.id}/downloadVoiceOriginal`
                    : `http://localhost:5000/${contest.id}/${voice.id}/downloadVoiceOriginal`;
                const res = await fetch(ENDPOINT);
                console.log(res);
                let aTag = document.createElement("a");
                aTag.href =
                  process.env.NODE_ENV === "production"
                    ? `/home/estudiante/VoiceContest/back/originals/${voice.filename}`
                    : ENDPOINT;

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
          {isLoading && !originalAudioURL && (
            <div class="spinner-border" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          )}
          {!isLoading && !!originalAudioURL && (
            <audio controls>
              <source
                id="original"
                src={`/home/estudiante/VoiceContest/back/processed/${voice.filename}`}
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
