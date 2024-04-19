import React, { useEffect, useState } from 'react'
import { Button, Select } from 'antd'
import Loading from '../../../pages/Loading'
import useGardenProjectInput from '../GardenProjectInput/useGardenProjectInput'
import { useParams } from 'react-router-dom'
import { formatDateTime } from '../../../utils/helpers'
import ProcessActivityPage from '../../ProjectDetail/ProjectProcessActivity'

const GardenProjectProcess = () => {
  const gardenId = useParams().id
  const { initData, isSuccess } = useGardenProjectInput(gardenId)
  const [selectedPlant, setSelectedPlant] = useState(initData ? initData[0]?._id : null)

  useEffect(() => {
    if (initData) {
      setSelectedPlant(initData[0]?._id)
    }
  }, [initData])

  const handlePlantSelect = (plantId) => {
    setSelectedPlant(plantId)
  }

  const renderStatus = (status) => {
    switch (status) {
      case 'inProgress':
        return 'Đang thực hiện'
      case 'harvesting':
        return 'Đang thu hoạch'
      case 'almostFinished':
        return 'Sắp thu hoạch xong'
      case 'finished':
        return 'Hoàn thành'
      case 'cancel':
        return 'Đã hủy'
      default:
        return 'Chưa có thông tin'
    }
  }

  const onChange = (value) => {
    console.log(`selected ${value}`)
    handlePlantSelect(value)
  }

  // Filter `option.label` match the user type `input`
  const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  return isSuccess ? (
    <div>
      <div style={{ marginBottom: '16px', marginLeft: '25px' }}>
        <h2>Hãy chọn 1 cây trong vườn để xem chi tiết</h2>
        <Select
          showSearch
          placeholder="Hãy chọn 1 cây"
          optionFilterProp="children"
          onChange={onChange}
          filterOption={filterOption}
          defaultValue={initData[0]._id}
          options={initData.map((project) => ({
            label: `${project.name} - ${formatDateTime(project.startDate)} - ${renderStatus(project.status)}`,
            value: project._id
          }))}
          style={{ width: 500 }}
        />
      </div>
      {/* Render ProcessActivityPage component if a plant is selected */}
      {selectedPlant && <ProcessActivityPage projectId={selectedPlant} />}
    </div>
  ) : (
    <Loading />
  )
}

export default GardenProjectProcess
