import {
    message,
    Tabs,
    List,
    Card,
    Image,
    Carousel,
    Button,
    Tooltip,
    Space,
    Modal,
} from "antd"
import {
    LeftCircleFilled,
    RightCircleFilled,
    InfoCircleOutlined,
} from "@ant-design/icons"
import Text from "antd/lib/typography/Text"
import React, { useState, useEffect } from "react"
import { deleteStay, getReservationsByStay, getStaysByHost } from "../utils"
import UploadStay from "./UploadStay";

const { TabPane } = Tabs

function HostHomePage() {
    return (
        <Tabs defaultActiveKey="1" destroyInactiveTabPane={true}>
            <TabPane tab="My Stays" key="1">
                <MyStays />
            </TabPane>
            <TabPane tab="Upload Stay" key="2">
                <UploadStay />
            </TabPane>
        </Tabs>
    )
}

function MyStays() {
    const [loading, setLoading] = useState(false)
    const [data, setDate] = useState([])

    useEffect(
        () => {
            loadData()
        }
        , [])

    const loadData = async () => {
        setLoading(true)

        try {
            const resp = await getStaysByHost()
            setDate(resp)
        } catch (error) {
            message.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <List
            loading={loading}
            grid={{
                gutter: 16,
                xs: 1,
                sm: 3,
                md: 3,
                lg: 3,
                xl: 4,
                xxl: 4,
            }}
            dataSource={data}
            renderItem={(item) => (
                <List.Item>
                    <Card
                        key={item.id}
                        title={
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <Text ellipsis={true} style={{ maxWidth: 150 }}>
                                    {item.name}
                                </Text>
                                <StayDetailInfoButton stay={item} />
                            </div>
                        }
                        actions={[<ViewReservationsButton stay={item} />]}
                        extra={<RemoveStayButton stay={item} onRemoveSuccess={loadData} />}
                    >

                        {
                            <Carousel
                                dots={false}
                                arrows={true}
                                prevArrow={<LeftCircleFilled />}
                                nextArrow={<RightCircleFilled />}
                            >
                                {item.images.map((image, index) => (
                                    <div key={index}>
                                        <Image src={image.url} width="100%" />
                                    </div>
                                ))}
                            </Carousel>
                        }
                    </Card>
                </List.Item>
            )}
        />
    )
}

export function StayDetailInfoButton({ stay }) {
    const [modalVisible, setModalVisible] = useState(false)

    const openModal = () => {
        setModalVisible(true)
    }

    const handleCancel = () => {
        setModalVisible(false)
    }

    const { name, description, address, guest_number } = stay

    return (
        <>
            <Tooltip title="View Stay Details">
                <Button
                    onClick={openModal}
                    style={{ border: "none" }}
                    size="large"
                    icon={<InfoCircleOutlined />}
                />
            </Tooltip>
            {modalVisible && (
                <Modal
                    title={name}
                    centered={true}
                    visible={modalVisible}
                    closable={false}
                    footer={null}
                    onCancel={handleCancel}
                >
                    <Space direction="vertical">
                        <Text strong={true}>Description</Text>
                        <Text type="secondary">{description}</Text>
                        <Text strong={true}>Address</Text>
                        <Text type="secondary">{address}</Text>
                        <Text strong={true}>Guest Number</Text>
                        <Text type="secondary">{guest_number}</Text>
                    </Space>
                </Modal>
            )}
        </>
    )
}

function RemoveStayButton(props) {
    const [loading, setLoading] = useState(false)

    const handleRemoveStay = async () => {
        const { stay, onRemoveSuccess } = props
        setLoading(true)

        try {
            await deleteStay(stay.id)
            onRemoveSuccess()
        } catch (error) {
            message.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            loading={loading}
            onClick={handleRemoveStay}
            danger={true}
            shape="round"
            type="primary"
        >
            Remove Stay
        </Button>
    )
}

function ReservationList(props) {
    const [loading, setLoading] = useState(false)
    const [reservations, setReservations] = useState([])

    useEffect(() => {
        loadData()
    })

    const loadData = async () => {
        setLoading(true)

        try {
            const resp = await getReservationsByStay(props.stayId)
            setReservations(resp)
        } catch (error) {
            message.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <List
            loading={loading}
            dataSource={reservations}
            renderItem={(item) => (
                <List.Item>
                    <List.Item.Meta
                        title={<Text>Guest Name: {item.guest.username}</Text>}
                        description={
                            <>
                                <Text>Checkin Date: {item.checkin_date}</Text>
                                <br />
                                <Text>Checkout Date: {item.checkout_date}</Text>
                            </>
                        }
                    />
                </List.Item>
            )}
        />
    )

}

function ViewReservationsButton(props) {
    const [modalVisible, setModalVisible] = useState(false)

    const openModal = () => {
        setModalVisible(true)
    }

    const handleCancel = () => {
        setModalVisible(false)
    }

    const { stay } = props

    const modalTitle = `Reservations of ${stay.name}`

    return (
        <>
            <Button onClick={openModal} shape="round">
                View Reservations
            </Button>
            {modalVisible && (
                <Modal
                    title={modalTitle}
                    centered={true}
                    visible={modalVisible}
                    closable={false}
                    footer={null}
                    onCancel={handleCancel}
                    destroyOnClose={true}
                >
                    <ReservationList stayId={stay.id} />
                </Modal>
            )}
        </>
    )

}

export default HostHomePage