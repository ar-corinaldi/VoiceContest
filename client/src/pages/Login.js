import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Modal,
  DatePicker,
  InputNumber,
} from "antd";
import { admin } from "../App";
import { useHistory } from "react-router-dom";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Login = ({ admin, setAdmin, setToken, token }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formInfo, setFormInfo] = useState({});

  const onFinish = async (values) => {
    // const myHeaders = new Headers();
    // myHeaders.append("Content-Type", "application/json");
    // const res = await fetch("/login", {
    //   method: "POST",
    //   body: JSON.stringify(values),
    //   headers: myHeaders,
    // });
    // const data = await res.json();
    // if (data.error === "Email no existe, desea crear una cuenta nueva?") {
    //   setFormInfo(values);
    //   return showModal();
    // }
    getToken(values);
    // if (data && !data.error && setAdmin) {
    setAdmin(values);
    // setAdmin(data);
    // }
  };

  async function getToken(values) {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const res = await fetch("/auth", {
        method: "POST",
        body: JSON.stringify({
          adminname: values.email,
          password: values.password,
        }),
        headers: myHeaders,
      });
      const data = await res.json();
      setToken(data.access_token);
    } catch (e) {
      console.error(e);
    }
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setIsModalVisible(false);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const res = await fetch("/register", {
      method: "POST",
      body: JSON.stringify(formInfo),
      headers: myHeaders,
    });
    const data = await res.json();
    if (data && !data.error && setAdmin) {
      setAdmin(data);
      getToken(formInfo);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.error("Failed:", errorInfo);
  };

  if (admin) {
    return (
      <Row className="mt-4">
        <Col span={12} offset={6}>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              if (setAdmin) setAdmin(undefined);
            }}
          >
            Cerrar Sesión
          </Button>
        </Col>
      </Row>
    );
  }

  return (
    <Row className="mt-4">
      <Modal
        title="Crear Cuenta"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Email No Existe Desea Crear Una Nueva Cuenta</p>
      </Modal>
      <Col span={12} offset={6}>
        <Form
          {...layout}
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Usuario"
            name="username"
            rules={[{ required: true, message: "Campo obligatorio!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Campo obligatorio!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default Login;
