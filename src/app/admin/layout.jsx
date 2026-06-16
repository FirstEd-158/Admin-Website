import React from 'react'
import AdminSidebar from './adminSidebar'


const layout = ({ children }) => {
  return (
    <>
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div className="md:w-64  text-white fixed top-16 left-0 bottom-0">
          <AdminSidebar/>
        </div>

        {/* Main Content */}
        <div className="flex-1 md:ml-64 h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  )
}

export default layout