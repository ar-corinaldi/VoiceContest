import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Badge, Descriptions, Button, Input, Form } from "antd";
import { Link, useParams, useHistory } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { doFetch } from "../utils/useFetch";
import { AuthContext } from "../App";

const ContestDetail = () => {
  const [file, setFile] = useState();
  const [contest, setContest] = useState();
  const [voices, setVoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
          `/contests/${idContest}/voices`,
          "GET",
          null,
          null
        );
        if (!newVoices.error) {
          setVoices(newVoices);
        }
      } catch (e) {
        console.error("error", e);
      } finally {
        setIsLoading(false);
      }
    }

    if (contest && contest.id) getVoices(contest.id);
  }, [contest, setIsLoading, setVoices]);

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

  const postVoice = async (values) => {
    console.log(values);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (ev) => {
        console.log(ev.target.result);
        values = { ...values, original_voice_file_path: ev.target.result };
        doFetch(`/contests/${contest.id}/voices`, "POST", values, token).then(
          (data) => {
            if (!data.error) {
              setVoices((prevVoices) => [data, ...prevVoices]);
              // doFetch(`/${data.id}/upload_audio`, "POST", newForm, token);
            }
          }
        );
      };
    } catch (e) {
      console.error("error", e);
    } finally {
    }
  };

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
          {voices && voices.length === 0 && <div>No hay voces!</div>}
          {voices &&
            voices.map((voice) => (
              <div key={voice.id}>
                <div class="card">
                  <h5 class="card-header">Audio # {voice.id}</h5>
                  <div class="card-body">
                    <h5 class="card-title">
                      {voice.name + " " + voice.last_name}
                    </h5>
                    <p class="card-text">{voice.email}</p>
                    <a href="#" class="btn btn-primary">
                      Go somewhere
                    </a>
                  </div>
                </div>
              </div>
            ))}
        </Col>
        <Col>
          <Form
            name="nest-messages"
            onFinish={(values) => postVoice(values)}
            validateMessages={validateMessages}
            encType="multipart/form-data"
          >
            <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name={"last_name"}
              label="Apellido"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={"email"}
              label="Correo electrónico"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="original_voice_file_path"
              label="Archivo de voz"
              // rules={[{ required: true }]}
            >
              <Input type="file" onChange={changeFile} />
            </Form.Item>
            <Form.Item
              name={"observation_message"}
              label="Obervaciones"
              rules={[{ required: true }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
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
