import React from 'react'
import { useParams } from 'react-router'
import { Table } from 'antd'
import Loading from '../../../pages/Loading'
import useGardenProjectClientRequest from './useGardenProjectClientRequest'

const GardenProjectClientRequest = () => {
  const gardenId = useParams().id
  const { initData, isSuccess } = useGardenProjectClientRequest(gardenId)

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'time',
      width: 200,
      key: 'time',
      render: (_, record) => <div>{record.time}</div>
    },
    {
      title: 'Loại',
      key: 'type',
      dataIndex: 'type',
      width: 200,
      render: (_, record) => <div>{record.type}</div>
    },
    {
      title: 'Chi tiết',
      dataIndex: 'detail',
      key: 'detail',
      render: (_, record) => <div>{record.detail}</div>
    }
  ]

  return (
    <div>
      {isSuccess ? (
        <div>
          <h2 style={{ marginBottom: '1rem' }}>Mong muốn của người dùng</h2>
          <Table bordered={true} columns={columns} dataSource={initData} />{' '}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default GardenProjectClientRequest
