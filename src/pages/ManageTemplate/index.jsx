import React from 'react'
import { useState } from 'react'
import { Row, Col, Button, Form, Modal, InputNumber, Divider, Tooltip, notification, Popconfirm } from 'antd'
import { DeleteFilled, EditFilled } from '@ant-design/icons'
import Loading from '../Loading'
import { Card } from 'antd'
import './style.css'
import GARDEN_SERVICE_TEMPLATE from '../../services/gardenServiceTemplate'
import useManageTemplate from './useManageTemplate'

const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}

const CollectionCreateForm = ({ open, onCreate, onCancel, template2 }) => {
  const [form] = Form.useForm()
  return (
    <Modal
      destroyOnClose={true}
      open={open}
      title="Dịch vụ"
      okText={template2 ? 'Cập nhật' : 'Tạo mới'}
      cancelText="Hủy"
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields()
            onCreate(values, template2)
          })
          .catch((info) => {
            console.log('Validate Failed:', info)
          })
      }}
    >
      <Form form={form} {...layout} name="form_in_modal" initialValues={template2}>
        <Form.Item
          name="square"
          label="Diện tích"
          rules={[
            {
              required: true,
              message: 'Trường thông tin này không được để trống!'
            }
          ]}
        >
          <InputNumber addonAfter="M2" style={{ width: 300 }} />
        </Form.Item>
        <Form.Item
          name="price"
          label="Giá tiền"
          rules={[
            {
              required: true,
              message: 'Trường thông tin này không được để trống!'
            }
          ]}
        >
          <InputNumber addonAfter="VNĐ" style={{ width: 300 }} />
        </Form.Item>
        <Divider>Chủng loại gieo trồng</Divider>
        <Form.Item
          name="leafyMax"
          label="Rau ăn lá"
          rules={[
            {
              required: true,
              message: 'Trường thông tin này không được để trống!'
            }
          ]}
        >
          <InputNumber addonAfter="cây" style={{ width: 300 }} />
        </Form.Item>
        <Form.Item
          name="herbMax"
          label="Rau gia vị"
          rules={[
            {
              required: true,
              message: 'Trường thông tin này không được để trống!'
            }
          ]}
        >
          <InputNumber addonAfter="cây" style={{ width: 300 }} />
        </Form.Item>
        <Form.Item
          name="rootMax"
          label="Củ"
          rules={[
            {
              required: true,
              message: 'Trường thông tin này không được để trống!'
            }
          ]}
        >
          <InputNumber addonAfter="củ" style={{ width: 300 }} />
        </Form.Item>
        <Form.Item
          name="fruitMax"
          label="Quả"
          rules={[
            {
              required: true,
              message: 'Trường thông tin này không được để trống!'
            }
          ]}
        >
          <InputNumber addonAfter="quả" style={{ width: 300 }} />
        </Form.Item>

        <Divider>Cam kết</Divider>
        <Form.Item
          name="expectedOutput"
          label="Sản lượng dự kiến"
          rules={[
            {
              required: true,
              message: 'Trường thông tin này không được để trống!'
            }
          ]}
        >
          <InputNumber addonAfter="kg" style={{ width: 300 }} />
        </Form.Item>
        <Form.Item
          name="expectDeliveryPerWeek"
          label="Số lần giao/tuần"
          rules={[
            {
              required: true,
              message: 'Trường thông tin này không được để trống!'
            }
          ]}
        >
          <InputNumber addonAfter="lần" style={{ width: 300 }} />
        </Form.Item>
        <Form.Item
          name="expectDeliveryAmount"
          label="Số lượng 1 lần giao"
          rules={[
            {
              required: true,
              message: 'Trường thông tin này không được để trống!'
            }
          ]}
        >
          <InputNumber addonAfter="kg/lần" style={{ width: 300 }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
const ManageTemplate = () => {
  const [api, contextHolder] = notification.useNotification()
  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
  }
  const { templates, isSuccess, refetch } = useManageTemplate()
  const [template, setTemplate] = useState(null)
  const [open, setOpen] = useState(false)
  const onCreate = async (values, template2) => {
    if (template2) {
      await GARDEN_SERVICE_TEMPLATE.updateServiceTemplate(values, template2._id)
      refetch()
      openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
    } else {
      await GARDEN_SERVICE_TEMPLATE.addServiceTemplate(values)
      refetch()
      openNotificationWithIcon('success', 'Thông báo', 'Thêm thành công')
    }
    setOpen(false)
  }

  const handleDeleteTemplate = async (templateId) => {
    const res = await GARDEN_SERVICE_TEMPLATE.deleteServiceTemplate(templateId)
    if (res.status === 200) {
      refetch()
      openNotificationWithIcon('success', 'Thông báo', 'Xóa thành công')
    } else {
      openNotificationWithIcon('error', 'Thông báo', 'Xóa thất bại')
    }
  }

  return (
    <div>
      {contextHolder}
      {isSuccess ? (
        <div>
          <h2 style={{ textAlign: 'left' }}>Danh sách các bản mẫu của dịch vụ</h2>
          <Row>
            <Col span={6}>
              <div style={{ marginBottom: '1.5rem' }}>
                <Button
                  type="primary"
                  onClick={() => {
                    setTemplate(null)
                    setOpen(true)
                  }}
                >
                  Tạo bản dịch vụ mới
                </Button>
                <CollectionCreateForm
                  open={open}
                  onCreate={onCreate}
                  onCancel={() => {
                    setOpen(false)
                  }}
                  template2={template}
                />
              </div>
            </Col>
          </Row>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap'
            }}
          >
            {templates.map((temp) => (
              <Card
                title={`Diện tích ${temp.square} M2`}
                extra={
                  <>
                    <Tooltip title="Chỉnh sửa dịch vụ">
                      <EditFilled
                        onClick={() => {
                          setTemplate(temp)
                          setOpen(true)
                        }}
                        style={{ color: '#fff', cursor: 'pointer', marginRight: '1.5rem' }}
                      />
                    </Tooltip>
                    <Tooltip title="Xóa dịch vụ">
                      <Popconfirm
                        title="Xóa"
                        description="Bạn có chắc chắn muốn xóa không"
                        onConfirm={handleDeleteTemplate.bind(this, temp._id)}
                      >
                        <DeleteFilled style={{ color: '#fff', cursor: 'pointer' }} />
                      </Popconfirm>
                    </Tooltip>
                  </>
                }
                style={{
                  width: '30%',
                  marginBottom: '1.5rem',
                  borderTopLeftRadius: '15px',
                  borderTopRightRadius: '15px',
                  marginRight: '1.5rem'
                }}
              >
                <div style={{ textAlign: 'end' }}>
                  <div className="styleText">
                    <p style={{ fontWeight: '600' }}>CHỦNG LOẠI GIEO TRỒNG</p>
                  </div>
                  <p>{temp.leafyMax} Rau ăn lá</p>
                  <p>{temp.herbMax} Rau gia vị</p>
                  <p>{temp.rootMax} Củ</p>
                  <p>{temp.fruitMax} Quả</p>
                  <div className="styleText">
                    <p style={{ fontWeight: '600' }}>SẢN LƯỢNG DỰ KIẾN</p>
                    <p>{temp.expectedOutput} kg/tháng</p>
                  </div>
                  <div className="styleText">
                    <p style={{ fontWeight: '600' }}>SỐ LẦN GỬI RAU TỚI NHÀ</p>
                    <p>{temp.expectDeliveryPerWeek} lần/ tuần</p>
                  </div>
                  <div className="styleText">
                    <p style={{ fontWeight: '600' }}>SỐ LƯỢNG GIAO MỘT LẦN</p>
                    <p>{temp.expectDeliveryAmount} kg/ lần</p>
                  </div>
                  <div className="styleText">
                    <p style={{ fontWeight: '600' }}>GIÁ</p>
                    <p>
                      {temp.price.toLocaleString('it-IT', {
                        style: 'currency',
                        currency: 'VND'
                      })}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default ManageTemplate
