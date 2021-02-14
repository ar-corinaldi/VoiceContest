/* eslint-disable no-template-curly-in-string */
import React, { useContext } from "react";
import { Input, Form, Button, DatePicker } from "antd";
import { v4 } from "uuid";
import { doFetch } from "../utils/useFetch";
import { AuthContext } from "../App";
const { RangePicker } = DatePicker;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
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

const FormEvent = ({ setContests }) => {
  const { token } = useContext(AuthContext);

  const postContest = async (values) => {
    const sd = values.startEndDate[0]._d;
    const ed = values.startEndDate[1]._d;
    const start_date = `${
      sd.getUTCDate() <= 9 ? `0${sd.getUTCDate()}` : sd.getUTCDate()
    }-${
      sd.getUTCMonth() + 1 <= 9
        ? `0${sd.getUTCMonth() + 1}`
        : `${sd.getUTCMonth() + 1}`
    }-${sd.getUTCFullYear()}`;
    const finish_date = `${
      ed.getUTCDate() <= 9 ? `0${ed.getUTCDate()}` : ed.getUTCDate()
    }-${
      ed.getUTCMonth() + 1 <= 9
        ? `0${sd.getUTCMonth() + 1}`
        : `${sd.getUTCMonth() + 1}`
    }-${ed.getUTCFullYear()}`;
    const { name, script, bannerPath, recommendations, payment } = values;
    const contestData = {
      name,
      script,
      banner_path: bannerPath,
      start_date,
      finish_date,
      recommendations,
      payment,
      url: v4(),
    };
    const newContest = await doFetch("/contests", "POST", contestData, token);
    setContests((prevContests) => [newContest, ...prevContests]);
  };

  return (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={(values) => postContest(values)}
      validateMessages={validateMessages}
    >
      <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name={"bannerPath"}
        label="Banner"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name={"payment"} label="Pago" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name={"startEndDate"}
        label="Fecha"
        rules={[{ required: true }]}
      >
        <RangePicker />
      </Form.Item>
      <Form.Item name={"script"} label="Guión" rules={[{ required: true }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name={"recommendations"}
        label="Recomendaciones"
        rules={[{ required: true }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormEvent;
