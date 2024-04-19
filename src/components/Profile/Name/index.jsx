import React from 'react'
import { Button, Input, Tooltip } from 'antd'
import { EditFilled } from '@ant-design/icons'

const NameProfile = ({ isEditingName, setIsEditingName, newName, setNewName, handleSave, profile }) => {
  const handleCancel = () => {
    // Code để hủy chỉnh sửa
    setIsEditingName(false)
    // Khôi phục lại tên ban đầu nếu đã thay đổi
    setNewName(profile?.name)
  }

  return (
    <div>
      <div>
        {isEditingName ? (
          <div style={{ marginLeft: '10px' }}>
            <h1 style={{ margin: '1rem' }}>Tên trang trại mới:</h1>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{ marginBottom: '8px', marginLeft: '15px', width: '600px', fontSize: '20px' }}
            />
          </div>
        ) : (
          <div style={{ display: 'flex', marginLeft: '10px' }}>
            <h1 style={{ margin: '1rem' }}>Tên trang trại: {profile.name}</h1>
            <Tooltip title="Chỉnh sửa lại tên trang trại">
              <EditFilled style={{ color: '#476930' }} onClick={() => setIsEditingName(true)} />
            </Tooltip>
          </div>
        )}
        <div>
          {isEditingName && (
            <div style={{ marginBottom: '30px' }}>
              <Button type="primary" onClick={handleSave} style={{ marginLeft: '25px' }}>
                Lưu
              </Button>
              <Button onClick={handleCancel} style={{ marginLeft: '10px' }}>
                Hủy
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NameProfile
