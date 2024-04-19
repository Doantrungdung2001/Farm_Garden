import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import Auth from './hooks/auth'
import Profile from './pages/Profile'
import ManagePlant from './pages/ManagePlant'
import PlantDetail from './pages/PlantDetail'
import ManageTemplate from './pages/ManageTemplate'
import ManageRequest from './pages/ManageRequest'
import ManageGarden from './pages/ManageGarden'
import GardenProjectDetail from './pages/GardenProjectDetail'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import OtherInfo from './pages/OtherInfo'
import ResetPasswordPage from './pages/ResetPasswordPage'
import Notfound from './pages/Notfound'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/manage-planting-garden" />} />
          <Route element={<LoginPage />} path="/login" />
          <Route element={<ForgotPasswordPage />} path="/forgot-password" />
          <Route element={<ResetPasswordPage />} path="/reset-password/:resetToken/:email" />
        </Route>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Auth path={'/login'}>{<ManageGarden />}</Auth>} path="manage-planting-garden" />
          <Route element={<Auth path={'/login'}>{<Profile />}</Auth>} path="profile" />
          <Route element={<Auth path={'/login'}>{<ManagePlant />}</Auth>} path="manage-plant" />
          <Route element={<Auth path={'/login'}>{<ManageTemplate />}</Auth>} path="manage-template" />
          <Route element={<Auth path={'/login'}>{<ManageRequest />}</Auth>} path="manage-request" />
          <Route element={<Auth path={'/login'}>{<GardenProjectDetail />}</Auth>} path="manage-planting-garden/:id" />
          <Route element={<Auth path={'/login'}>{<PlantDetail />}</Auth>} path="plant/:id" />
          <Route element={<Auth path={'/login'}>{<OtherInfo />}</Auth>} path="other-information" />
        </Route>
        <Route path="*" element={<Notfound />} />
      </Routes>
    </div>
  )
}

export default App
