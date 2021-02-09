import React, { useEffect, useState } from "react";
import { Row, Table, Col } from "antd";
import { Link } from "react-router-dom";
import { doFetch } from "../utils/useFetch";
import { LoadingOutlined } from "@ant-design/icons";

const initialColumns = [
  {
    title: "URL",
    dataIndex: "url",
    key: "url",
    render: (name, row) => {
      return <Link to={`/${row.url}/home`}>{name}</Link>;
    },
  },
  {
    title: "Nombre",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Fecha Inicio",
    dataIndex: "start_date",
    key: "start_date",
  },
  {
    title: "Pago",
    dataIndex: "payment",
    key: "payment",
  },
];

const Contests = ({ admin, setAdmin, token, setToken }) => {
  const [contests, setContests] = useState([
    { url: "shit", name: "hello", start_date: "29-09-1999", payment: 5000 },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getContests() {
      const newContests = doFetch("/contests", "GET", null, token);
      setContests(newContests);
    }
    try {
      setIsLoading(true);
      getContests();
    } catch (e) {
      console.error("error", e);
    } finally {
      setIsLoading(false);
    }
  }, [token, setContests]);

  if (isLoading) {
    return (
      <Row className="mt-4">
        <Col>
          <LoadingOutlined style={{ fontSize: 24 }} spin />
        </Col>
      </Row>
    );
  }

  return (
    <React.Fragment>
      <Row className="mt-4"></Row>
      <Row>
        <Col span={24}>
          <Table dataSource={contests} columns={initialColumns} />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Contests;
