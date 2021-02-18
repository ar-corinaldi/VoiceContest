import React, { useContext, useEffect, useState } from "react";
import {
  Row,
  Col,
  Badge,
  Descriptions,
  Button,
  Input,
  Form,
  Pagination,
} from "antd";
import { Link, useParams, useHistory } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { doFetch } from "../utils/useFetch";
import { AuthContext } from "../App";

const ContestDetail = () => {
  const [refresh, setRefresh] = useState(false);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState();
  const [observaciones, setObservaciones] = useState("");
  const [contest, setContest] = useState();
  const [voices, setVoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalVoices, setTotalVoices] = useState(0);
  const { contestUrl } = useParams();
  const { token } = useContext(AuthContext);
  const history = useHistory();
  useEffect(() => {
    async function getContest(url) {
      try {
        setIsLoading(true);
        const newContest = await doFetch(
          `/contests/${url}`,
          "GET",
          null,
          token
        );
        if (!newContest.error) {
          setContest(newContest);
          console.log(newContest);
        }
      } catch (e) {
        console.error("error", e);
      } finally {
        setIsLoading(false);
      }
    }

    getContest(contestUrl);
  }, [contestUrl, setContest, token]);

  useEffect(() => {
    async function getVoices(idContest) {
      try {
        setIsLoading(true);
        const newVoices = await doFetch(
          `/contests/${idContest}/voices/${page}`,
          "GET",
          null,
          null
        );
        const total = await doFetch(`/${idContest}/getLenVoices`, "GET");
        console.log(("count", total));
        console.log("newVoices", newVoices);
        if (!newVoices.error) {
          setVoices(newVoices);
        }
        if (!total.error) {
          console.log(total.totalVoices);
          setTotalVoices(total.totalVoices);
        }
      } catch (e) {
        console.error("error", e);
      } finally {
        setIsLoading(false);
      }
    }

    if (contest && contest.id) getVoices(contest.id);
  }, [contest, setIsLoading, setVoices, page, refresh]);

  const onEdit = () => {};

  const onDelete = async () => {
    try {
      const data = await doFetch(
        `/contests/${contestUrl}`,
        "DELETE",
        undefined,
        token
      );
      if (!data.error) {
        history.push("/");
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  async function postVoice() {
    try {
      let voice = {
        name: name,
        last_name: lastName,
        email: email,
        observation_message: observaciones,
      };
      doFetch(
        `/contests/${contest.id}/voices/${page}`,
        "POST",
        voice,
        token
      ).then((data) => {
        if (!data.error) {
          setVoices((prevVoices) => [...prevVoices, data]);
        }
        const formData = new FormData();
        formData.append("audio_file", file);
        const headers = new Headers();
        headers.append("Content-Type", "multipart/form-data");
        fetch(`http://localhost:5000/contests/${contest.id}/voices/${data}`, {
          method: "PUT",
          body: formData,
        });
        setRefresh(true);
      });
    } catch (e) {
      console.error("error", e);
    } finally {
    }
  }

  if (isLoading) {
    return (
      <Row className="mt-4">
        <Col>
          <LoadingOutlined style={{ fontSize: 24 }} spin />
        </Col>
      </Row>
    );
  }

  if (!contest) {
    return (
      <>
        <Row>
          <Col>
            <h3>Concurso no encontrado! Click para redireccionar</h3>
          </Col>
        </Row>

        <Row>
          <Col>
            <h3>
              <Link to="/">Inicio</Link>
            </h3>
          </Col>
        </Row>
      </>
    );
  }
  const changeFile = (ev) => {
    console.log(ev.target.files);
    setFile(ev.target.files[0]);
  };
  return (
    <React.Fragment>
      <Row className="mt-4">
        <Col span={24}>
          {token && <Link to="/">Ir a Concursos</Link>}
          <Descriptions title="Información del Concurso" bordered>
            <Descriptions.Item label="Nombre">{contest.name}</Descriptions.Item>
            <Descriptions.Item label="Pago">
              {contest.payment}
            </Descriptions.Item>
            <Descriptions.Item label="Fecha Inicial" span={6}>
              {contest.start_date}
            </Descriptions.Item>
            <Descriptions.Item label="Fecha Final" span={6}>
              {contest.finish_date}
            </Descriptions.Item>
            <Descriptions.Item label="Guión" span={6}>
              {contest.script}
            </Descriptions.Item>
            <Descriptions.Item label="Recomendaciones" span={6}>
              {contest.recommendations}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
      <Row justify="center" hidden={!token}>
        <Col className="p-3">
          <Button type="primary" onClick={onEdit}>
            Editar
          </Button>
        </Col>
        <Col className="p-3">
          <Button type="primary" onClick={onDelete} danger>
            Eliminar
          </Button>
        </Col>
      </Row>
      <Row justify="space-around">
        <Col>
          <Form
            name="nest-messages"
            validateMessages={validateMessages}
            encType="multipart/form-data"
          >
            <Form.Item
              name="name"
              label="Nombre"
              onChange={(e) => setName(e.target.value)}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={"last_name"}
              label="Apellido"
              onChange={(e) => setLastName(e.target.value)}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={"email"}
              label="Correo electrónico"
              onChange={(e) => setEmail(e.target.value)}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="original_voice_file_path"
              label="Archivo de voz"
              onChange={(e) => setFile(e.target.files[0])}
              rules={[{ required: true }]}
            >
              <Input type="file" />
            </Form.Item>
            <Form.Item
              name={"observation_message"}
              label="Obervaciones"
              onChange={(e) => setObservaciones(e.target.value)}
              rules={[{ required: true }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8 }}>
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => postVoice()}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col>
          <Row justify="center">
            {voices && voices.length === 0 && <div>No hay voces!</div>}
            {voices &&
              voices.map((voice, idx) => (
                <Col key={voice.id} className="m-3">
                  <div className="card">
                    <h5 className="card-header">
                      Audio # {idx + (page - 1) * 20 + 1}
                    </h5>
                    <div className="card-body">
                      <h5 className="card-title">
                        {voice.name + " " + voice.last_name}
                      </h5>
                      <p className="card-text">{voice.email}</p>
                      <button
                        onClick={async () => {
                          const res = await fetch(
                            `/${contest.id}/${voice.id}/getVoice`
                          );
                          console.log(res.headers);
                          console.log("res", res);
                          const blob = await res.blob();
                          let url = window.URL.createObjectURL(blob);
                          console.log(blob);
                          console.log(url);

                          let aTag = document.createElement("a");
                          aTag.href =
                            process.env.NODE_ENV === "production"
                              ? `http://172.24.98.143/${contest.id}/${voice.id}/getVoice`
                              : `http://localhost:5000/${contest.id}/${voice.id}/getVoice`;
                          aTag.target = "_blank";
                          aTag.click();
                        }}
                        className="btn btn-primary"
                      >
                        Go somewhere
                      </button>
                      <audio autoPlay controls>
                        <source id="source" />
                      </audio>
                    </div>
                  </div>
                </Col>
              ))}
          </Row>
          <Row justify="center">
            <Col>
              <Pagination
                defaultCurrent={page}
                pageSize={20}
                total={totalVoices}
                onChange={(page) => setPage(page)}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </React.Fragment>
  );
};

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

export default ContestDetail;
