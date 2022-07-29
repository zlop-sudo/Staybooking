import React from "react";
import {
    Image,
    message,
    Tabs,
    List,
    Typography,
    Form,
    InputNumber,
    DatePicker,
    Button,
    Card,
    Carousel,
    Modal,
} from "antd";
import { bookStay, cancelReservation, getReservations, searchStays } from "../utils";
import { LeftCircleFilled, RightCircleFilled } from "@ant-design/icons";
import { StayDetailInfoButton } from "./HostHomePage";

const { TabPane } = Tabs;
const { Text } = Typography;

class GuestHomePage extends React.Component {
    render() {
        return (
            <Tabs defaultActiveKey="1" destroyInactiveTabPane={true}>
                <TabPane tab="Search Stays" key="1">
                    <SearchStays />
                </TabPane>
                <TabPane tab="My Reservations" key="2">
                    <MyReservations />
                </TabPane>
            </Tabs>
        );
    }
}

class MyReservations extends React.Component {
    state = {
        loading: false,
        data: [],
    };

    componentDidMount() {
        this.loadData();
    }

    loadData = async () => {
        this.setState({
            loading: true,
        });

        try {
            const resp = await getReservations();
            this.setState({
                data: resp,
            });
        } catch (error) {
            message.error(error.message);
        } finally {
            this.setState({
                loading: false,
            });
        }
    };

    render() {
        return (
            <List
                style={{ width: 1000, margin: "auto" }}
                loading={this.state.loading}
                dataSource={this.state.data}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <CancelReservationButton onCancelSuccess={this.loadData} reservationId={item.id} />,
                        ]}
                    >

                        <List.Item.Meta
                            title={<Text>{item.stay.name}</Text>}
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
        );
    }
}

class SearchStays extends React.Component {
    state = {
        data: [],
        loading: false,
    };

    search = async (query) => {
        this.setState({
            loading: true,
        });

        try {
            const resp = await searchStays(query);
            this.setState({
                data: resp,
            });
        } catch (error) {
            message.error(error.message);
        } finally {
            this.setState({
                loading: false,
            });
        }
    };

    render() {
        return (
            <>
                <Form onFinish={this.search} layout="inline">
                    <Form.Item
                        label="Guest Number"
                        name="guest_number"
                        rules={[{ required: true }]}
                    >
                        <InputNumber min={1} />
                    </Form.Item>
                    <Form.Item
                        label="Checkin Date"
                        name="checkin_date"
                        rules={[{ required: true }]}
                    >
                        <DatePicker />
                    </Form.Item>
                    <Form.Item
                        label="Checkout Date"
                        name="checkout_date"
                        rules={[{ required: true }]}
                    >
                        <DatePicker />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            loading={this.state.loading}
                            type="primary"
                            htmlType="submit"
                        >
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
                <List
                    style={{ marginTop: 20 }}
                    loading={this.state.loading}
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 3,
                        md: 3,
                        lg: 3,
                        xl: 4,
                        xxl: 4,
                    }}
                    dataSource={this.state.data}
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
                                extra={<BookStayButton stay={item} />}
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
            </>
        );
    }
}

class BookStayButton extends React.Component {
    state = {
        loading: false,
        modalVisible: false,
    };

    handleCancel = () => {
        this.setState({
            modalVisible: false,
        });
    };

    handleBookStay = () => {
        this.setState({
            modalVisible: true,
        });
    };

    handleSubmit = async (values) => {
        const { stay } = this.props;
        this.setState({
            loading: true,
        });

        try {
            await bookStay({
                checkin_date: values.checkin_date.format("YYYY-MM-DD"),
                checkout_date: values.checkout_date.format("YYYY-MM-DD"),
                stay: {
                    id: stay.id,
                },
            });
            message.success("Successfully book stay");
        } catch (error) {
            message.error(error.message);
        } finally {
            this.setState({
                loading: false,
            });
        }
    };

    render() {
        const { stay } = this.props;
        return (
            <>
                <Button onClick={this.handleBookStay} shape="round" type="primary">
                    Book Stay
                </Button>
                <Modal
                    destroyOnClose={true}
                    title={stay.name}
                    visible={this.state.modalVisible}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <Form
                        preserve={false}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        onFinish={this.handleSubmit}
                    >
                        <Form.Item
                            label="Checkin Date"
                            name="checkin_date"
                            rules={[{ required: true }]}
                        >
                            <DatePicker />
                        </Form.Item>
                        <Form.Item
                            label="Checkout Date"
                            name="checkout_date"
                            rules={[{ required: true }]}
                        >
                            <DatePicker />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button
                                loading={this.state.loading}
                                type="primary"
                                htmlType="submit"
                            >
                                Book
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        );
    }
}

class CancelReservationButton extends React.Component {
    state = {
        loading: false,
    };

    handleCancelReservation = async () => {
        const { reservationId, onCancelSuccess } = this.props;
        this.setState({
            loading: true,
        });

        try {
            await cancelReservation(reservationId);
        } catch (error) {
            message.error(error.message);
        } finally {
            this.setState({
                loading: false,
            });
        }

        onCancelSuccess();
    };

    render() {
        return (
            <Button
                loading={this.state.loading}
                onClick={this.handleCancelReservation}
                danger={true}
                shape="round"
                type="primary"
            >
                Cancel Reservation
            </Button>
        );
    }
}


export default GuestHomePage;