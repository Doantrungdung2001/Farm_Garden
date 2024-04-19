/* global google */
import React, { useRef } from 'react'
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api'
import { Button } from 'antd'

const PlaceComponent = ({ lat, lng, setLat, setLng, handleSave, isEditingLocation, setIsEditingLocation }) => {
  const inputRef = useRef()

  const handlePlaceChanged = () => {
    const [place] = inputRef.current.getPlaces()
    if (place) {
      console.log(place?.formatted_address)
      console.log(place?.geometry?.location?.lat())
      console.log(place?.geometry?.location?.lng())
      setLat(place?.geometry?.location?.lat())
      setLng(place?.geometry?.location?.lng())
    }
  }

  const handleGetCurrentLocation = () => {
    if (navigator?.geolocation) {
      navigator?.geolocation?.getCurrentPosition(
        (position) => {
          setLat(position?.coords?.latitude)
          setLng(position?.coords?.longitude)
        },
        (error) => {
          console.error('Error getting current location:', error)
          // Xử lý lỗi nếu có
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
      // Xử lý trường hợp trình duyệt không hỗ trợ Geolocation
    }
  }

  const handleMapClick = (event) => {
    setLat(event.latLng.lat())
    setLng(event.latLng.lng())
  }

  return (
    <div style={{ marginTop: '50px', marginLeft: '10px' }}>
      <LoadScript googleMapsApiKey="AIzaSyDNQg8DF-2ufJKgzOQSZO0DB7OP5iptLlA" libraries={['places']}>
        {isEditingLocation && (
          <div style={{ display: 'flex', marginBottom: '2rem' }}>
            <StandaloneSearchBox onLoad={(input) => (inputRef.current = input)} onPlacesChanged={handlePlaceChanged}>
              <input
                type="text"
                placeholder="Nhập địa chỉ"
                style={{
                  boxSizing: `border-box`,
                  border: `1px solid transparent`,
                  width: `100%`,
                  height: `50px`,
                  padding: `0 12px`,
                  borderRadius: `3px`,
                  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                  fontSize: `14px`,
                  outline: `none`,
                  textOverflow: `ellipses`,
                  position: 'absolute',
                  left: '50%',
                  marginRight: '5rem'
                }}
              />
            </StandaloneSearchBox>
            <Button type="primary" onClick={handleGetCurrentLocation}>
              Lấy vị trí hiện tại
            </Button>
          </div>
        )}
        {isEditingLocation && (
          <div style={{ margin: '10px' }}>
            <Button type="primary" onClick={handleSave} style={{ marginRight: '10px' }}>
              Lưu
            </Button>
            <Button onClick={() => setIsEditingLocation(false)}>Hủy</Button>
          </div>
        )}
        {!isEditingLocation && (
          <Button type="primary" style={{ marginBottom: '10px' }} onClick={() => setIsEditingLocation(true)}>
            Chỉnh sửa vị trí
          </Button>
        )}
        {console.log('lat: ', lat)}
        {console.log('lng: ', lng)}
        <GoogleMap
          mapContainerStyle={{
            height: `400px`,
            width: `100%`
          }}
          zoom={10}
          center={{
            lat: lat,
            lng: lng
          }}
          onClick={handleMapClick}
        >
          <Marker
            position={{
              lat: lat,
              lng: lng
            }}
          />
        </GoogleMap>
      </LoadScript>
    </div>
  )
}

export default PlaceComponent
