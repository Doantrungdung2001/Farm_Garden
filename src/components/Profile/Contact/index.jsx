import React from 'react'
import { Button, Space, Input, Tooltip, Card, Row, Col } from 'antd'
import { EditFilled, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

const ContactProfile = ({
  isEditingContact,
  setIsEditingContact,
  phoneList,
  setPhoneList,
  emailList,
  setEmailList,
  handleSave,
  profile
}) => {
  const handleCancel = () => {
    // Code để hủy chỉnh sửa
    setIsEditingContact(false)
    // Khôi phục lại thông tin ban đầu nếu đã thay đổi
    setPhoneList(profile.phone || [])
    setEmailList(profile.email || [])
  }

  const handleAddPhone = () => {
    setPhoneList([...phoneList, ''])
  }

  const handleRemovePhone = (index) => {
    const updatedPhoneList = [...phoneList]
    updatedPhoneList.splice(index, 1)
    setPhoneList(updatedPhoneList)
  }

  const handleAddEmail = () => {
    setEmailList([...emailList, ''])
  }

  const handlePhoneChange = (index, value) => {
    const newList = [...phoneList]
    newList[index] = value
    setPhoneList(newList)
  }

  const handleRemoveEmail = (index) => {
    const updatedEmailList = [...emailList]
    updatedEmailList.splice(index, 1)
    setEmailList(updatedEmailList)
  }

  const handleEmailChange = (index, value) => {
    const newList = [...emailList]
    newList[index] = value
    setEmailList(newList)
  }

  const tittleCard = () => {
    return (
      <div style={{ display: 'flex' }}>
        <h2 style={{ marginRight: '1rem' }}>Thông tin liên lạc</h2>
        <Tooltip title="Chỉnh sửa thông tin liên lạc">
          <EditFilled style={{ color: '#476930' }} onClick={() => setIsEditingContact(true)} />
        </Tooltip>
      </div>
    )
  }

  return (
    <div>
      {isEditingContact ? (
        <Card
          title={tittleCard()}
          bordered={false}
          style={{
            width: '100%',
            padding: '20px'
          }}
        >
          <Row>
            <Col span={10}>
              <div>
                <h3>Phone: </h3>
                {phoneList.map((phone, index) => (
                  <Input.Group key={index} style={{ marginBottom: '8px', display: 'flex' }}>
                    <Input
                      placeholder="Phone number"
                      value={phone}
                      onChange={(e) => handlePhoneChange(index, e.target.value)}
                    />
                    <Button onClick={() => handleRemovePhone(index)} icon={<MinusCircleOutlined />} />
                  </Input.Group>
                ))}
                <Button type="dashed" onClick={handleAddPhone} icon={<PlusOutlined />}>
                  Thêm sđt
                </Button>
              </div>
            </Col>
            <Col span={2}></Col>
            <Col span={12}>
              <div>
                <h3>Email: </h3>
                {emailList.map((email, index) => (
                  <Input.Group key={index} style={{ marginBottom: '8px', display: 'flex' }}>
                    <Input
                      placeholder="Phone number"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                    />
                    <Button onClick={() => handleRemoveEmail(index)} icon={<MinusCircleOutlined />} />
                  </Input.Group>
                ))}
                <Button type="dashed" onClick={handleAddEmail} icon={<PlusOutlined />}>
                  Thêm Email
                </Button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={16}></Col>
            <Col span={8}>
              <div style={{ marginTop: '10px' }}>
                <Space>
                  <Button type="primary" onClick={handleSave}>
                    Lưu
                  </Button>
                  <Button onClick={handleCancel}>Hủy</Button>
                </Space>
              </div>
            </Col>
          </Row>
        </Card>
      ) : (
        <Card
          title={tittleCard()}
          bordered={true}
          style={{
            width: '100%',
            padding: '20px'
          }}
        >
          <Row>
            <Col span={12}>
              <h3>Số điện thoại: </h3>
              {phoneList && phoneList.length > 0 ? (
                phoneList.map((phone, index) => <p key={index}>{phone}</p>)
              ) : (
                <p>Chưa có số điện thoại</p>
              )}
            </Col>
            <Col span={12}>
              <h3>Email: </h3>
              {emailList && emailList.length > 0 ? (
                emailList.map((email, index) => <p key={index}>{email}</p>)
              ) : (
                <p>Chưa có email</p>
              )}
            </Col>
          </Row>
        </Card>
      )}
    </div>
  )
}

export default ContactProfile
