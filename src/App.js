import { Layout, Dropdown, Menu, Button } from "antd"
import { UserOutlined } from "@ant-design/icons"
import React, { useEffect, useState } from "react"
import LoginPage from "./components/LoginPage"
import HostHomePage from "./components/HostHomePage"
import GuestHomePage from "./components/GuestHomePage"

const { Header, Content } = Layout

function App() {

  const [authed, setAuthed] = useState(false)
  const [asHost, setAsHost] = useState(false)

  useEffect(
    () => {
      const authToken = localStorage.getItem("authToken")
      const asHost = localStorage.getItem("asHost") === "true"
      setAuthed(authToken !== null)
      setAsHost(asHost)
    },
    []
  )

  const handleLoginSuccess = (token, asHost) => {
    localStorage.setItem("authToken", token)
    localStorage.setItem("asHost", asHost)
    setAuthed(true)
    setAsHost(asHost)
  }

  const handleLogOut = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("asHost")
    setAuthed(false)
  }

  const renderContent = () => {
    if (!authed) {
      return <LoginPage handleLoginSuccess={handleLoginSuccess} />
    }

    if (asHost) {
      return <HostHomePage />
    }

    return <GuestHomePage />
  }

  const userMenu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogOut}>
        Log Out
      </Menu.Item>
    </Menu>
  )

  return (
    <Layout style={{ height: "100vh" }}>
      <Header style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: "white" }}>
          Stays Booking
        </div>
        {authed && (
          <div>
            <Dropdown trigger="click" overlay={userMenu}>
              <Button icon={<UserOutlined />} shape="circle" />
            </Dropdown>
          </div>
        )}
      </Header>
      <Content
        style={{ height: "calc(100% - 64px)", margin: 20, overflow: "auto" }}
      >
        {renderContent()}
      </Content>
    </Layout>
  )
}

export default App
