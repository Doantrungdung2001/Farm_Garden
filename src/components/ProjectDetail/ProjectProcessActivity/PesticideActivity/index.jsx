import React, { useState } from 'react'
import dayjs from 'dayjs'
import { Button, Table, Modal, Form, Input, DatePicker, Select, Popconfirm, Tooltip, Spin, Divider } from 'antd'
import { ParagraphWithEllipsis, formatDateTime } from '../../../../utils/helpers'
import { DeleteFilled, EditFilled, HistoryOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
const { Option } = Select

const HistoryModal = ({ history, historyModalVisible, handleHistoryModalCancel, isGarden }) => {
  return (
    <Modal
      title="Lịch sử chỉnh sửa"
      open={historyModalVisible}
      onCancel={handleHistoryModalCancel}
      footer={null}
      width={600}
    >
      {history &&
        history.map((item, index) => (
          <div key={index} style={{ marginBottom: '8px' }}>
            <Divider>Nhập lúc: {formatDateTime(item.createdAtTime)}</Divider>
            <Divider>Chỉnh sửa lúc: {formatDateTime(item.modifiedAt)}</Divider>
            <p>
              <span>
                <strong>Thời gian: </strong>
              </span>
              {formatDateTime(item.time)}
            </p>

            <p>
              <span>
                <strong>Tên: </strong>
              </span>
              {item.pestAndDiseaseControlActivity.name}
            </p>
            <p>
              <span>
                <strong>Tác nhân: </strong>
              </span>
              {item.pestAndDiseaseControlActivity.type === 'pest' ? 'Sâu bệnh' : 'Dịch hại'}
            </p>
            <p>
              <span>
                <strong>Triệu chứng: </strong>
              </span>
              {/* {item.pestAndDiseaseControlActivity.symptoms} */}
              <ParagraphWithEllipsis text={item.pestAndDiseaseControlActivity.symptoms} rows={5} />
            </p>
            <p>
              <span>
                <strong>Giải pháp: </strong>
              </span>
              {item.pestAndDiseaseControlActivity.solution.map((sol, index) => (
                <ul>
                  <li key={index}>
                    <ParagraphWithEllipsis text={sol} rows={5} />
                  </li>
                </ul>
              ))}
            </p>
          </div>
        ))}
    </Modal>
  )
}

const Modal2 = ({ modal2Visible, handleModal2Ok, handleModal2Cancel, selectedPlantFarming, isUpdate }) => {
  const [form] = Form.useForm()
  form.setFieldsValue({
    time: selectedPlantFarming?.time ? dayjs(selectedPlantFarming?.time) : dayjs(new Date()),
    name: selectedPlantFarming?.name,
    type: selectedPlantFarming?.type,
    symptoms: selectedPlantFarming?.symptoms,
    solution: selectedPlantFarming?.solution
  })
  return (
    <Modal
      open={modal2Visible}
      title={isUpdate ? 'Cập nhật hành động' : 'Thêm hành động'}
      okText={isUpdate ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
      onCancel={() => {
        form.resetFields()
        handleModal2Cancel()
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.setFieldsValue(values)
            let data = {}
            if (isUpdate) {
              data = {
                processId: selectedPlantFarming.processId,
                time: values.time.toDate(),
                type: 'pesticide',
                pestAndDiseaseControlActivity: {
                  name: values.name,
                  type: values.type,
                  symptoms: values.symptoms,
                  solution: values.solution
                }
              }
            } else {
              data = {
                time: values.time.toDate(),
                type: 'pesticide',
                pestAndDiseaseControlActivity: {
                  name: values.name,
                  type: values.type,
                  symptoms: values.symptoms,
                  solution: values.solution
                }
              }
            }
            handleModal2Ok(data)
            handleModal2Cancel()
          })
          .catch((info) => {
            console.log('Validate Failed:', info)
          })
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          time: selectedPlantFarming?.time ? dayjs(selectedPlantFarming?.time) : dayjs(new Date()),
          name: selectedPlantFarming?.name,
          type: selectedPlantFarming?.type,
          symptoms: selectedPlantFarming?.symptoms,
          solution: selectedPlantFarming?.solution
        }}
      >
        {/* pick time */}
        <Form.Item name="time" label="Thời gian" rules={[{ required: true, message: 'Hãy chọn thời gian!' }]}>
          <DatePicker showTime />
        </Form.Item>
        <Form.Item name="name" label="Tên" rules={[{ required: true, message: 'Hãy nhập tên hoạt động!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="type" label="Tác nhân" rules={[{ required: true, message: 'Hãy nhập tác nhân!' }]}>
          <Select>
            <Option value="pest">Sâu bệnh</Option>
            <Option value="disease">Dịch hại</Option>
          </Select>
        </Form.Item>
        <Form.Item name="symptoms" label="Triệu chứng" rules={[{ required: true, message: 'Hãy nhập triệu chứng!' }]}>
          <Input.TextArea placeholder="Mô tả" style={{ width: '100%' }} autoSize={{ minRows: 5 }} />
        </Form.Item>
        <Form.Item name="solution" label="Giải pháp" rules={[{ required: true, message: 'Hãy nhập giải pháp!' }]}>
          <Form.List name="solution">
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item required={false} key={field.key}>
                    <Form.Item
                      {...field}
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: 'Hãy nhập giải pháp hoặc xóa trường này!'
                        }
                      ]}
                      noStyle
                    >
                      <Input.TextArea placeholder="Giải pháp" style={{ width: '100%' }} autoSize={{ minRows: 5 }} />
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined className="dynamic-delete-button" onClick={() => remove(field.name)} />
                    ) : null}
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{
                      width: '60%'
                    }}
                    icon={<PlusOutlined />}
                  >
                    Thêm giải pháp
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>
      </Form>
    </Modal>
  )
}

const PesticideTable = ({
  pesticide,
  pesticidePlantFarming,
  handleAddProcess,
  handleUpdateProcess,
  handleDeleteProcess,
  isGarden,
  loading
}) => {
  const [modal1Visible, setModal1Visible] = useState(false)
  const [modal2Visible, setModal2Visible] = useState(false)
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false)
  const [modalHistoryVisible, setModalHistoryVisible] = useState(false)
  const [selectedPlantFarming, setSelectedPlantFarming] = useState(null)

  const handleModal1Ok = () => {
    setModal1Visible(false)
    setModal2Visible(true)
  }

  const handleModal1Cancel = () => {
    setModal1Visible(false)
  }

  const handleModal2Cancel = () => {
    setModal2Visible(false)
  }

  const handleModalUpdateCancel = () => {
    setModalUpdateVisible(false)
  }

  const handlePlantFarmingSelect = (plantFarming) => {
    setSelectedPlantFarming(plantFarming)
    setModal1Visible(true)
  }

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
      width: '150px',
      render: (text, record) => formatDateTime(record.time),
      sorter: (a, b) => new Date(a.time) - new Date(b.time),
      showSorterTooltip: {
        title: 'Sắp xếp thời gian'
      }
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      width: '150px',
      render: (text, record) => record.pestAndDiseaseControlActivity.name
    },
    {
      title: 'Tác nhân',
      dataIndex: 'type',
      key: 'type',
      render: (text, record) => (record.pestAndDiseaseControlActivity.type === 'pest' ? 'Sâu bệnh' : 'Dịch hại'),
      width: '100px'
    },
    {
      title: 'Triệu chứng',
      dataIndex: 'symptoms',
      key: 'symptoms',
      width: 400,
      render: (text, record) => (
        <p>
          <ParagraphWithEllipsis text={record.pestAndDiseaseControlActivity.symptoms} rows={5} />
        </p>
      )
    },
    {
      title: 'Giải pháp',
      dataIndex: 'solution',
      key: 'solution',
      width: 500,
      render: (text, record) =>
        record.pestAndDiseaseControlActivity.solution.map((sol, index) => (
          <ul>
            <li key={index}>
              <ParagraphWithEllipsis text={sol} rows={5} />
            </li>
          </ul>
        ))
    },
    {
      title: 'Hành động',
      dataIndex: 'actions',
      key: 'actions',
      width: '150px',
      render: (text, record) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <EditFilled
              style={{ marginRight: '2rem', cursor: 'pointer' }}
              onClick={() => {
                setSelectedPlantFarming({
                  processId: record._id,
                  time: record.time,
                  name: record.pestAndDiseaseControlActivity.name,
                  type: record.pestAndDiseaseControlActivity.type,
                  symptoms: record.pestAndDiseaseControlActivity.symptoms,
                  solution: record.pestAndDiseaseControlActivity.solution
                })
                setModalUpdateVisible(true)
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa"
            description="Bạn có chắc chắn muốn xóa không"
            onConfirm={handleDeleteProcess.bind(this, record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title="Xóa">
              <DeleteFilled style={{ cursor: 'pointer', marginRight: '2rem' }} />
            </Tooltip>
          </Popconfirm>
          {record.isEdited ? (
            <Tooltip title="Xem lịch sử chỉnh sửa">
              <HistoryOutlined
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSelectedPlantFarming(record)
                  setModalHistoryVisible(true)
                }}
              />
            </Tooltip>
          ) : null}
        </>
      )
    }
  ]

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Button
          type="primary"
          style={{ marginRight: '8px' }}
          onClick={() => {
            setModal1Visible(true)
          }}
        >
          Thêm
        </Button>
      </div>
      <Spin spinning={loading}>
        <Table dataSource={pesticide} columns={columns} pagination={false} />
      </Spin>

      {/* Modal 1 */}
      <Modal
        title="Chọn loại canh tác"
        open={modal1Visible}
        onOk={handleModal1Ok}
        onCancel={handleModal1Cancel}
        okText="Tiếp theo"
        cancelText="Hủy"
      >
        {pesticidePlantFarming.map((plantFarming) => (
          <Button
            key={plantFarming.name}
            style={{
              marginBottom: '8px',
              display: 'block',
              backgroundColor: selectedPlantFarming === plantFarming ? '#1890ff' : '',
              color: selectedPlantFarming === plantFarming ? '#fff' : '',
              whiteSpace: 'normal',
              height: 'auto'
            }}
            onClick={() => handlePlantFarmingSelect(plantFarming)}
          >
            {plantFarming.name}
          </Button>
        ))}
        <Button
          key="none"
          style={{
            marginBottom: '8px',
            display: 'block',
            backgroundColor: selectedPlantFarming === null ? '#1890ff' : '',
            color: selectedPlantFarming === null ? '#fff' : ''
          }}
          onClick={() => handlePlantFarmingSelect(null)}
        >
          Khác
        </Button>
      </Modal>

      {/* Modal 2 */}
      <Modal2
        modal2Visible={modal2Visible}
        handleModal2Ok={handleAddProcess}
        handleModal2Cancel={handleModal2Cancel}
        selectedPlantFarming={selectedPlantFarming}
      />

      {/* Modal edit */}
      <Modal2
        modal2Visible={modalUpdateVisible}
        handleModal2Ok={handleUpdateProcess}
        handleModal2Cancel={handleModalUpdateCancel}
        selectedPlantFarming={selectedPlantFarming}
        isUpdate={true}
      />

      {/* Modal history */}
      <HistoryModal
        history={selectedPlantFarming?.historyProcess}
        historyModalVisible={modalHistoryVisible}
        handleHistoryModalCancel={() => setModalHistoryVisible(false)}
        isGarden={isGarden}
      />
    </div>
  )
}

export default PesticideTable
