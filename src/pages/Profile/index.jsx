import React, { useState } from 'react'
import useProfile from './useProfile'
import Loading from '../Loading'
import { Col, Row, notification } from 'antd'
import FARM from '../../services/farmService'
import PlaceComponent from '../../components/Profile/Map'
import ImagesProfile from '../../components/Profile/Image'
import ContactProfile from '../../components/Profile/Contact'
import OverViewProfile from '../../components/Profile/Overview'
import NameProfile from '../../components/Profile/Name'
import UpdatePasswordModal from '../../components/UpdatePasswordModal'

const Profile = () => {
  const { profile, isSuccess, refetch } = useProfile()

  const [isEditingOverView, setIsEditingOverView] = useState(false)
  const [description, setDescription] = useState(profile?.description)
  const [district, setDistrict] = useState(profile?.district)
  const [address, setAddress] = useState(profile?.address)

  const [isEditingLocation, setIsEditingLocation] = useState(false)
  const [api, contextHolder] = notification.useNotification()
  const [lat, setLat] = useState(profile?.lat)
  const [lng, setLng] = useState(profile?.lng)

  const [isEditingImages, setIsEditingImages] = useState(false)
  const [imageList, setImageList] = useState(profile?.images)

  const [isEditingContact, setIsEditingContact] = useState(false)
  const [phoneList, setPhoneList] = useState(profile?.phone)
  const [emailList, setEmailList] = useState(profile?.email)

  const [isEditingName, setIsEditingName] = useState(false)
  const [newName, setNewName] = useState(profile?.name)

  const [isModalVisible, setIsModalVisible] = useState(false)

  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
  }

  const handleSave = async () => {
    try {
      if (isEditingOverView) {
        const res = await FARM.updateProfile({
          data: {
            description,
            district,
            address
          }
        })

        if (res.status === 200) {
          refetch()
          openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
        } else {
          openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
        }
        setIsEditingOverView(false)
      }

      if (isEditingLocation) {
        const res = await FARM.updateProfile({
          data: {
            lat: lat,
            lng: lng
          }
        })

        if (res.status === 200) {
          refetch()
          openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
        } else {
          openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
        }
        setIsEditingLocation(false)
      }

      if (isEditingImages) {
        const res = await FARM.updateProfile({
          data: {
            images: imageList
          }
        })

        if (res.status === 200) {
          refetch()
          openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
        } else {
          openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
        }
        setIsEditingImages(false)
      }

      if (isEditingContact) {
        const res = await FARM.updateProfile({
          data: {
            phone: phoneList,
            email: emailList
          }
        })

        if (res.status === 200) {
          refetch()
          openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
        } else {
          openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
        }
        setIsEditingContact(false)
      }

      if (isEditingName) {
        console.log('new name: ', newName)
        const res = await FARM.updateProfile({
          data: {
            name: newName
          }
        })

        if (res.status === 200) {
          refetch()
          openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
        } else {
          openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
        }
        setIsEditingName(false)
      }
    } catch (error) {
      console.log('error: ', error)
      openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
      setIsEditingOverView(false)
    }
  }

  const handleUpdatePassword = async (values) => {
    try {
      // Xử lý logic cập nhật mật khẩu ở đây
      console.log('Form values:', values)
      setIsModalVisible(false)
      const res = await FARM.updatePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      })

      if (res.status === 200) {
        openNotificationWithIcon('success', 'Thông báo', 'Cập nhật mật khẩu thành công')
      } else {
        openNotificationWithIcon('error', 'Thông báo', 'Cập nhật mật khẩu thất bại')
      }
    } catch (error) {
      if (error.response?.data?.message === 'Old password is not correct') {
        openNotificationWithIcon('error', 'Thông báo', 'Mật khẩu cũ không đúng')
      } else {
        openNotificationWithIcon('error', 'Thông báo', 'Cập nhật mật khẩu thất bại')
      }
      console.error('Cập nhật mật khẩu thất bại:', error)
    }
  }

  return (
    <>
      {contextHolder}
      {isSuccess ? (
        <div>
          <NameProfile
            isEditingName={isEditingName}
            setIsEditingName={setIsEditingName}
            newName={newName || profile?.name}
            setNewName={setNewName}
            handleSave={handleSave}
            profile={profile}
          />

          <div>
            <span
              style={{
                fontStyle: 'italic',
                color: '#888',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'text-shadow 0.3s',
                fontSize: '20px',
                marginLeft: '25px'
              }}
              onClick={() => setIsModalVisible(true)}
            >
              Cập nhật mật khẩu
            </span>

            <UpdatePasswordModal
              visible={isModalVisible}
              onCancel={() => setIsModalVisible(false)}
              onUpdatePassword={handleUpdatePassword}
            />
          </div>

          <Row style={{ rowGap: '0px' }}>
            <Col span={16}>
              <OverViewProfile
                isEditingOverView={isEditingOverView}
                setIsEditingOverView={setIsEditingOverView}
                description={description || profile?.description}
                setDescription={setDescription}
                district={district || profile?.district}
                setDistrict={setDistrict}
                address={address || profile?.address}
                setAddress={setAddress}
                handleSave={handleSave}
                profile={profile}
              />
              <ImagesProfile
                isEditingImages={isEditingImages}
                setIsEditingImages={setIsEditingImages}
                imageList={imageList || profile?.images}
                setImageList={setImageList}
                handleSave={handleSave}
                profile={profile}
              />
            </Col>
            <Col span={8}>
              <ContactProfile
                isEditingContact={isEditingContact}
                setIsEditingContact={setIsEditingContact}
                phoneList={phoneList || profile?.phone}
                setPhoneList={setPhoneList}
                emailList={emailList || profile?.email}
                setEmailList={setEmailList}
                handleSave={handleSave}
                profile={profile}
              />
              {/* <PlaceComponent
                lat={lat || profile.lat}
                lng={lng || profile.lng}
                setLat={setLat}
                setLng={setLng}
                handleSave={handleSave}
                isEditingLocation={isEditingLocation}
                setIsEditingLocation={setIsEditingLocation}
              />  */}
            </Col>
          </Row>
        </div>
      ) : (
        <Loading />
      )}
    </>
  )
}

export default Profile
