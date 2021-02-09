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
import { doFetch } from "../utils/useFetch";

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
    console.log(JSON.stringify(values));
    try {
      const data = await doFetch("/auth", "POST", values, token);
      console.log(data);
      if (data.description === "Invalid credentials") {
        setFormInfo(values);
        return showModal();
      }
      console.log(data);
      setToken(data.access_token);
      setAdmin(values);
    } catch (e) {
      console.error("error", e);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setIsModalVisible(false);
    const data = await doFetch("/users", "POST", formInfo, token);

    if (data && !data.error && setAdmin) {
      setAdmin(data);
      onFinish(data);
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
