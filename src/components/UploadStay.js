import React, { useState } from "react"
import { Form, Input, InputNumber, Button, message } from "antd"
import { uploadStay } from "../utils"

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
}

function UploadStay() {
    const [loading, setLoading] = useState(false)

    const fileInputRef = React.createRef()

    const handleSubmit = async (values) => {
        const formData = new FormData()
        const { files } = fileInputRef.current

        if (files.length > 5) {
            message.error("You can at most upload 5 pictures.")
            return
        }

        for (let i = 0; i < files.length; i++) {
            formData.append("images", files[i])
        }

        formData.append("name", values.name)
        formData.append("address", values.address)
        formData.append("description", values.description)
        formData.append("guest_number", values.guest_number)

        setLoading(true)
        try {
            await uploadStay(formData)
            message.success("upload successfully")
        } catch (error) {
            message.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form
            {...layout}
            name="nest-messages"
            onFinish={handleSubmit}
            style={{ maxWidth: 1000, margin: "auto" }}
        >
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true }]}
            >
                <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
            </Form.Item>
            <Form.Item
                name="guest_number"
                label="Guest Number"
                rules={[{ required: true, type: "number", min: 1 }]}
            >
                <InputNumber />
            </Form.Item>
            <Form.Item name="picture" label="Picture" rules={[{ required: true }]}>
                <input
                    type="file"
                    accept="image/png, image/jpeg"
                    ref={fileInputRef}
                    multiple={true}
                />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )

}

export default UploadStay
