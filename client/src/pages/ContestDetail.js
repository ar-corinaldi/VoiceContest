import React, { useEffect, useState } from "react";
import { Row, Col, Badge, Descriptions } from "antd";
import { Link, useParams } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
const ContestDetail = ({ admin, setAdmin, token, setToken }) => {
  const [contest, setContest] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { contestId } = useParams();

  useEffect(() => {
    async function getContest(id) {
      try {
        setIsLoading(true);
        const res = await fetch(`/contests/${id}`);
        const data = await res.json();
        setContest(data);
      } finally {
        setIsLoading(false);
      }
    }
    getContest(contestId);
  }, [contestId, setContest]);

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
          <Descriptions title="User Info" bordered>
            <Descriptions.Item label="Nombre">{contest.name}</Descriptions.Item>
            <Descriptions.Item label="Pago">
              {contest.payment}
            </Descriptions.Item>
            <Descriptions.Item label="Fecha Inicial" span={6}>
              {contest.start_date}
            </Descriptions.Item>
            <Descriptions.Item label="Fecha Final" span={6}>
              {contest.end_date}
            </Descriptions.Item>
            <Descriptions.Item label="Guion" span={6}>
              {contest.script}
            </Descriptions.Item>
            <Descriptions.Item label="Recomendaciones" span={6}>
              {contest.recommendations}
            </Descriptions.Item>
            <Descriptions.Item label="Estado" span={3}>
              <Badge status="processing" text="Running" />
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ContestDetail;
