import React, { useState } from "react"
import { Form, Button, Input, Space, Checkbox, message } from "antd"
import { UserOutlined } from "@ant-design/icons"
import { login, register } from "../utils"
 
function LoginPage(props) {
  const formRef = React.createRef()

  const [asHost, setAsHost] = useState(false)
  const [loading, setLoading] = useState(false)
 
  const onFinish = () => {
    console.log("finish form")
  }
 
  const handleLogin = async () => {
    const formInstance = formRef.current
 
    try {
      await formInstance.validateFields()
    } catch (error) {
      return
    }
 
    try {
      const resp = await login(formInstance.getFieldsValue(true), asHost)
      props.handleLoginSuccess(resp.token, asHost)
    } catch (error) {
      message.error(error.message)
    } finally {
      setLoading(false)
    }
  }
 
  const handleRegister = async () => {
    const formInstance = formRef.current
 
    try {
      await formInstance.validateFields()
    } catch (error) {
      return
    }
 
    setLoading(true)
 
    try {
      await register(formInstance.getFieldsValue(true), asHost)
      message.success("Register Successfully")
    } catch (error) {
      message.error(error.message)
    } finally {
      setLoading(false)
    }
  }
 
  const handleCheckboxOnChange = (e) => {
    setAsHost(e.target.checked)
  }
 
    return (
      <div style={{ width: 500, margin: "20px auto" }}>
        <Form ref={formRef} onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              disabled={loading}
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              disabled={loading}
              placeholder="Password"
            />
          </Form.Item>
        </Form>
        <Space>
          <Checkbox
            disabled={loading}
            checked={asHost}
            onChange={handleCheckboxOnChange}
          >
            As Host
          </Checkbox>
          <Button
            onClick={handleLogin}
            disabled={loading}
            shape="round"
            type="primary"
          >
            Log in
          </Button>
          <Button
            onClick={handleRegister}
            disabled={loading}
            shape="round"
            type="primary"
          >
            Register
          </Button>
        </Space>
      </div>
    )
}
 
export default LoginPage