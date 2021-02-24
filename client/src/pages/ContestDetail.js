import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Descriptions, Button, Input, Form, Pagination } from "antd";
import { Link, useParams, useHistory } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { doFetch } from "../utils/useFetch";
import { AuthContext } from "../App";
import VoiceDetail from "../components/VoiceDetail";
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const ContestDetail = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState();
  const [observaciones, setObservaciones] = useState("");
  const [contest, setContest] = useState();
  const [voices, setVoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalVoices, setTotalVoices] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
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
  }, [contest, setIsLoading, setVoices, page]);

  const onEdit = async (values) => {
    try {
      const editedContest = await doFetch(
        `/contests/${contestUrl}`,
        "PUT",
        values,
        token
      );
      if (!editedContest.error) {
        setContest(editedContest);
      }
    } catch (e) {
      console.error("paila", e);
    } finally {
      setIsEditing(false);
    }
  };

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
      let data = await doFetch(
        `/contests/${contest.id}/voices/${page}`,
        "POST",
        voice,
        token
      );
      console.log(data);
      if (!data.error) {
        const formData = new FormData();
        formData.append("audio_file", file);
        const ENDPOINT =
          process.env.NODE_ENV === "production"
            ? `http://172.24.98.143/contests/${contest.id}/voices/${data.id}`
            : `http://172.24.98.143:4000/contests/${contest.id}/voices/${data.id}`;
        console.log("ENDPOINT FETCH PUT:", ENDPOINT);
        console.log(file, formData);
        let res = await fetch(ENDPOINT, {
          method: "PUT",
          body: formData,
        });
        console.log("RESPONSE FETCH PUT:", res);
        let x = await res.json();
        setVoices((prevVoices) => [...prevVoices, x]);
      }
    } catch (e) {
      console.error("error subiendo voz", e);
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

  return (
    <React.Fragment>
      <Row className="mt-4">
        <Col span={24}>
          {token && <Link to="/">Ir a Concursos</Link>}
          {!isEditing && (
            <Descriptions title="Información del Concurso" bordered>
              <Descriptions.Item label="Nombre">
                {contest.name}
              </Descriptions.Item>
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
          )}
          {isEditing && (
            <Form {...layout} validateMessages onFinish={onEdit}>
              <Form.Item name="name" label="Nombre">
                <Input />
              </Form.Item>
              <Form.Item name="payment" label="Pago">
                <Input type="number" />
              </Form.Item>
              <Form.Item name="start_date" label="Fecha Inicial">
                <Input type="datetime-local" />
              </Form.Item>
              <Form.Item name="finish_date" label="Fecha Final">
                <Input type="datetime-local" />
              </Form.Item>
              <Form.Item name="banner_path" label="Banner">
                <Input />
              </Form.Item>
              <Form.Item name="script" label="Guión">
                <Input />
              </Form.Item>
              <Form.Item name="recommendations" label="Recomendaciones">
                <Input />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8 }}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          )}
        </Col>
      </Row>
      <Row justify="center" hidden={!token}>
        <Col className="p-3">
          <Button type="primary" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Dejar de editar" : "Editar"}
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
              label="Observaciones"
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
              voices.map((voice, idx) => {
                return (
                  <VoiceDetail
                    key={voice.id}
                    voice={voice}
                    idx={idx}
                    contest={contest}
                    page={page}
                    setVoices={setVoices}
                  />
                );
              })}
          </Row>
          <Row justify="center">
            <Col>
              <Pagination
                defaultCurrent={page}
                pageSize={40}
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
