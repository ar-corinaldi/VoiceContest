import React, { useContext, useEffect, useState } from "react";
import { Row, Table, Col } from "antd";
import { Link } from "react-router-dom";
import { doFetch } from "../utils/useFetch";
import { LoadingOutlined } from "@ant-design/icons";
import { AuthContext } from "../App";
import FormEvent from "../components/FormEvent";
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

const Contests = () => {
  const [contests, setContests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useContext(AuthContext);
  useEffect(() => {
    async function getContests() {
      const newContests = await doFetch("/contests", "GET", null, token);
      if (!newContests.error) {
        setContests(newContests);
      }
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
    <>
      <Row className="mt-4">
        <Col>
          <FormEvent setContests={setContests}></FormEvent>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table dataSource={contests} columns={initialColumns} />
        </Col>
      </Row>
    </>
  );
};

export default Contests;
