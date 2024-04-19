import React, { useState } from 'react'
import { Button, Upload, message, Space, Image, Tooltip, Modal, List } from 'antd'
import { EditFilled, PlusOutlined } from '@ant-design/icons'
import token from '../../../utils/token'
import { baseUrl } from '../../../services/http/baseUrl'
const { getAccessToken, getRefreshToken } = token

const ImagesProfile = ({
  isEditingImages,
  setIsEditingImages,
  imageList,
  setImageList,
  handleSave,
  profile,
  text = 'Hình ảnh',
  width = 220
}) => {
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState(
    imageList?.map((image, index) => ({ uid: String(-index), name: `image-${index}.png`, url: image }))
  )

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
        marginBottom: '1rem'
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8
        }}
      >
        Tải lên
      </div>
    </button>
  )

  const handleCancelPreview = () => setPreviewOpen(false)

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
  }

  const handleCancel = () => {
    // Code để hủy chỉnh sửa ảnh
    setIsEditingImages(false)
    setImageList(profile?.images)
  }

  const handleImageChange = (info) => {
    // Code để xử lý khi có thay đổi trong danh sách ảnh
    console.log('info', info)
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`)
      // Cập nhật danh sách ảnh mới
      setImageList(info.fileList.map((file) => (file.response ? file.response?.metadata?.thumb_url : file.url)))
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`)
    }
    const newFileList = info.fileList
    setFileList([...newFileList])
  }

  const handleRemoveImage = (index) => {
    // Code để xóa ảnh khỏi danh sách
    const newList = [...imageList]
    newList.splice(index, 1)
    setImageList(newList)
  }

  const uploadProps = {
    action: `${baseUrl}/upload/single`,
    method: 'post',
    accept: 'image/*',
    name: 'file',
    listType: 'picture-card',
    headers: {
      authorization: getAccessToken(),
      'x-rtoken-id': getRefreshToken()
    },
    onChange: (info) => handleImageChange(info),
    onPreview: handlePreview,
    onRemove: (file) => {
      handleRemoveImage(parseInt(file.uid))
    }
  }

  return (
    <div style={{ marginLeft: '15px' }}>
      <div style={{ display: 'flex', marginLeft: '10px', marginTop: '10px' }}>
        <h2>{text} </h2>
        <Tooltip title="Chỉnh sửa hình ảnh">
          <EditFilled style={{ color: '#476930', marginLeft: '5px' }} onClick={() => setIsEditingImages(true)} />
        </Tooltip>
      </div>
      {isEditingImages ? (
        <div>
          <Upload {...uploadProps} fileList={fileList}>
            {uploadButton}
          </Upload>
          <Space>
            <Button type="primary" onClick={handleSave}>
              Lưu
            </Button>
            <Button onClick={handleCancel}>Hủy</Button>
          </Space>
          <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancelPreview}>
            <img
              alt="example"
              style={{
                width: '100%'
              }}
              src={previewImage}
            />
          </Modal>
        </div>
      ) : (
        <div>
          {console.log('imageList', imageList)}
          {imageList && imageList.length > 0 ? (
            <List
              grid={{
                gutter: 4,
                xs: 1,
                sm: 2,
                md: 2,
                lg: 2,
                xl: 4,
                xxl: 4
              }}
              dataSource={imageList}
              renderItem={(item, index) =>
                item && (
                  <List.Item key={index}>
                    <div style={{ position: 'relative' }}>
                      <Image src={item} alt={`image-${item}`} width={width} style={{ borderRadius: '10px' }} />
                    </div>
                  </List.Item>
                )
              }
            />
          ) : (
            <div style={{ marginLeft: '10px' }}>
              <p>Chưa có ảnh nào</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ImagesProfile
