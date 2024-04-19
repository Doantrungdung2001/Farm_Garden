import React, { useState } from 'react'
import { useParams } from 'react-router'
import GARDEN from '../../../services/gardenService'
import { notification, Button, Table, Form, Input, Modal, Space, Popconfirm } from 'antd'

import Loading from '../../../pages/Loading'
import { formatDate } from '../../../utils/helpers'

import useGardenProjectOutput from './useGardenProjectOutput'

const layout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
}

const UpdateStatusModal = ({ visible, onCancel, onComingUpdate, onCancelUpdate, onDoneUpdate, selectedDelivery }) => {
  return (
    selectedDelivery && (
      <Modal
        open={visible}
        title="Upate status"
        onCancel={onCancel}
        footer={null}
        width={400} // Đặt độ rộng cho Modal
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '20px', fontSize: '16px' }}>Vui lòng chọn một lựa chọn để tiếp tục:</p>
          {selectedDelivery.status !== 'coming' && (
            <Button onClick={onComingUpdate} style={{ marginBottom: '10px', width: '100%' }}>
              Coming
            </Button>
          )}
          {selectedDelivery.status !== 'done' && (
            <Button onClick={onDoneUpdate} style={{ marginBottom: '10px', width: '100%' }}>
              Done
            </Button>
          )}
          {selectedDelivery.status !== 'cancel' && (
            <Button onClick={onCancelUpdate} style={{ marginBottom: '10px', width: '100%' }}>
              Cancel
            </Button>
          )}
        </div>
      </Modal>
    )
  )
}

const CollectionCreateForm = ({ open, onCreate, onCancel, listPlant, isUpdate, selectedDelivery }) => {
  const [form] = Form.useForm()
  isUpdate && selectedDelivery
    ? form.setFieldsValue({
        plants: selectedDelivery.plants.map((p) => ({
          key: p.id,
          plantId: p.plantId,
          name: p.name,
          amount: p.amount
        })),
        note: selectedDelivery.note
      })
    : form.setFieldsValue({
        plants: listPlant.map((p) => ({
          key: p.id,
          name: p.name,
          plantId: p.plantId
        }))
      })
  return (
    <>
      {listPlant ? (
        <Modal
          open={open}
          title={isUpdate ? 'Cập nhật' : 'Thêm mới'}
          okText={isUpdate ? 'Cập nhật' : 'Thêm'}
          cancelText="Hủy"
          onCancel={() => {
            form.resetFields()
            onCancel()
          }}
          onOk={() => {
            form
              .validateFields()
              .then((values) => {
                form.setFieldsValue(values)
                onCreate(values)
              })
              .catch((info) => {
                console.log('Validate Failed:', info)
              })
          }}
        >
          <Form
            form={form}
            {...layout}
            name="form_in_modal"
            initialValues={
              isUpdate && selectedDelivery
                ? {
                    plants: selectedDelivery.plants.map((p) => ({
                      key: p.id,
                      plantId: p.plantId,
                      name: p.name,
                      amount: p.amount
                    })),
                    note: selectedDelivery.note
                  }
                : {
                    plants: listPlant.map((p) => ({
                      key: p.id,
                      name: p.name,
                      plantId: p.plantId
                    }))
                  }
            }
          >
            <Form.Item name="plants">
              <Form.List name="plants">
                {(subFields, subOpt) => (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      rowGap: 16
                    }}
                  >
                    {subFields.map((subField, i) => (
                      <Space key={subField.key}>
                        <span>{listPlant[i].name ? listPlant[i].name : ''}</span>
                        <Form.Item noStyle name={[subField.name, 'amount']} label={listPlant[i]?.name}>
                          <Input type="number" addonAfter="kg" />
                        </Form.Item>
                      </Space>
                    ))}
                  </div>
                )}
              </Form.List>
            </Form.Item>
            <Form.Item name="note" label="Ghi chú">
              <Input placeholder="Điền ghi chú" style={{ width: '100%' }} />
            </Form.Item>
            <div></div>
          </Form>
        </Modal>
      ) : (
        <Loading />
      )}
    </>
  )
}

const GardenProjectOutput = () => {
  const [api, contextHolder] = notification.useNotification()
  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
  }
  const [open, setOpen] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState(null)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [openUpdateStatus, setOpenUpdateStatus] = useState(false)
  const gardenId = useParams().id

  const handleAddDelivery = async (values) => {
    console.log('values: ', values)
    try {
      const data = {
        deliveryDetails: values.plants.map((plant) => ({
          plant: plant.plantId,
          amount: plant.amount ? Number(plant.amount) : 0
        })),
        note: values.note
      }
      console.log('data: ', data)
      const res = await GARDEN.addDelivery({ data, gardenId })
      if (res.status === 200) {
        refetch()
        openNotificationWithIcon('success', 'Thông báo', 'Thêm thành công')
      } else {
        openNotificationWithIcon('error', 'Thông báo', 'Thêm thất bại')
      }
    } catch (error) {
      console.log('error: ', error)
      openNotificationWithIcon('error', 'Thông báo', 'Thêm thất bại')
    }
    setOpen(false)
  }

  const handleUpdateDelivery = async (values) => {
    try {
      const data = {
        deliveryDetails: values.plants.map((plant) => ({
          plant: plant.plantId,
          amount: plant.amount ? Number(plant.amount) : 0
        })),
        note: values.note
      }

      console.log('data: ', data)

      const res = await GARDEN.updateDelivery({ data, gardenId, deliveryId: selectedDelivery.id })
      if (res.status === 200) {
        refetch()
        openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
      } else {
        openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại')
      }
      setOpenUpdate(false)
    } catch (error) {
      console.log('error: ', error)
      openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại')
    }
  }

  const handleUpdateStatus = async (status) => {
    const res = await GARDEN.updateDelivery({ data: { status }, gardenId, deliveryId: selectedDelivery.id })
    if (res.status === 200) {
      refetch()
      openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
    }
    setOpenUpdateStatus(false)
  }

  const handleDeleteDelivery = async (deliveryId) => {
    const res = await GARDEN.deleteDelivery({ gardenId, deliveryId })
    if (res.status === 200) {
      refetch()
      openNotificationWithIcon('success', 'Thông báo', 'Xóa thành công')
    }
  }

  const { comingDeliveries, doneDeliveries, cancelDeliveries, isSuccess, refetch, listPlant, isSuccessListPlant } =
    useGardenProjectOutput(gardenId)

  const columnsComing = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      width: 300,
      key: 'date',
      render: (_, record) => <div>{record?.time}</div>
    },
    {
      title: 'Thông tin',
      key: 'deliveryDetails',
      dataIndex: 'deliveryDetails',
      render: (_, record) => (
        <div>
          {record.plants.map((plant) => (
            <div key={plant?.name}>
              {plant.amount > 0 ? (
                <div>
                  {plant?.name} - {plant?.amount} kg
                </div>
              ) : (
                <div></div>
              )}
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      render: (_, record) => <div>{record.note}</div>
    },
    {
      title: 'Hành động',
      dataIndex: 'actions',
      key: 'actions',
      width: '400px',
      render: (_, record) => (
        <div>
          <Button
            type="primary"
            onClick={() => {
              console.log('record: ', record)
              setSelectedDelivery({
                id: record.id,
                plants: record.plants,
                note: record.note
              })
              setOpenUpdate(true)
            }}
            style={{ marginRight: '8px' }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa giao hàng"
            description="Bạn có chắc chắn muốn xóa giao hàng này không"
            onConfirm={handleDeleteDelivery.bind(this, record.id)}
          >
            <Button type="primary" style={{ marginRight: '8px' }}>
              Xóa
            </Button>
          </Popconfirm>
          <Button
            type="primary"
            onClick={() => {
              setSelectedDelivery({
                id: record.id,
                plants: record.plants,
                note: record.note,
                status: record.status
              })

              setOpenUpdateStatus(true)
              console.log('record: ', record)
            }}
          >
            Cập nhật trạng thái
          </Button>
        </div>
      )
    }
  ]

  const columnsDone = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      width: 300,
      key: 'date',
      render: (_, record) => <div>{record?.time}</div>
    },
    {
      title: 'Thông tin',
      key: 'deliveryDetails',
      dataIndex: 'deliveryDetails',
      render: (_, record) => (
        <div>
          {record.plants.map((plant) => (
            <div key={plant?.name}>
              {plant.amount > 0 ? (
                <div>
                  {plant?.name} - {plant?.amount} kg
                </div>
              ) : (
                <div></div>
              )}
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      render: (_, record) => <div>{record.note}</div>
    },
    {
      title: 'Khách chấp nhận',
      dataIndex: 'clientAccept',
      key: 'clientAccept',
      render: (_, record) => <div>{record.clientAccept}</div>
    },
    {
      title: 'Ghi chú của Khách',
      dataIndex: 'clientNote',
      key: 'clientNote',
      render: (_, record) => <div>{record.clientNote}</div>
    },
    {
      title: 'Hành động',
      dataIndex: 'actions',
      key: 'actions',
      width: '400px',
      render: (_, record) => (
        <div>
          <Button
            type="primary"
            onClick={() => {
              setSelectedDelivery({
                id: record.id,
                plants: record.plants,
                note: record.note,
                status: record.status
              })
              setOpenUpdateStatus(true)
              console.log('record: ', record)
            }}
          >
            Cập nhật trạng thái
          </Button>
        </div>
      )
    }
  ]

  const columnsCancel = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      width: 300,
      key: 'date',
      render: (_, record) => <div>{record?.time}</div>
    },
    {
      title: 'Thông tin',
      key: 'deliveryDetails',
      dataIndex: 'deliveryDetails',
      render: (_, record) => (
        <div>
          {record.plants.map((plant) => (
            <div key={plant?.name}>
              {plant.amount > 0 ? (
                <div>
                  {plant?.name} - {plant?.amount} kg
                </div>
              ) : (
                <div></div>
              )}
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      render: (_, record) => <div>{record.note}</div>
    },
    {
      title: 'Hành động',
      dataIndex: 'actions',
      key: 'actions',
      width: '400px',
      render: (_, record) => (
        <div>
          <Button
            type="primary"
            onClick={() => {
              setSelectedDelivery({
                id: record.id,
                plants: record.plants,
                note: record.note,
                status: record.status
              })
              setOpenUpdateStatus(true)
              console.log('record: ', record)
            }}
          >
            Cập nhật trạng thái
          </Button>
        </div>
      )
    }
  ]

  return (
    <div>
      {contextHolder}
      {isSuccess && isSuccessListPlant ? (
        <div>
          <Button
            type="primary"
            onClick={() => {
              setOpen(true)
            }}
          >
            Thêm
          </Button>
          <CollectionCreateForm
            open={open}
            onCreate={handleAddDelivery}
            onCancel={() => {
              setOpen(false)
            }}
            listPlant={listPlant}
          />
          <CollectionCreateForm
            open={openUpdate}
            onCreate={handleUpdateDelivery}
            onCancel={() => {
              setOpenUpdate(false)
            }}
            listPlant={listPlant}
            isUpdate={true}
            selectedDelivery={selectedDelivery}
          />
          <UpdateStatusModal
            visible={openUpdateStatus}
            onCancel={() => {
              setOpenUpdateStatus(false)
            }}
            onComingUpdate={() => {
              handleUpdateStatus('coming')
              setOpenUpdateStatus(false)
            }}
            onCancelUpdate={() => {
              handleUpdateStatus('cancel')
              setOpenUpdateStatus(false)
            }}
            onDoneUpdate={() => {
              handleUpdateStatus('done')
              setOpenUpdateStatus(false)
            }}
            selectedDelivery={selectedDelivery}
          />
          <h2 style={{ marginBottom: '1rem' }}>Sắp giao</h2>
          <Table bordered={true} columns={columnsComing} dataSource={comingDeliveries} />{' '}
          <h2 style={{ marginBottom: '1rem', marginTop: '1rem' }}>Đã giao</h2>
          <Table bordered={true} columns={columnsDone} dataSource={doneDeliveries} />{' '}
          <h2 style={{ marginBottom: '1rem', marginTop: '1rem' }}>Đã hủy</h2>
          <Table bordered={true} columns={columnsCancel} dataSource={cancelDeliveries} />{' '}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default GardenProjectOutput
