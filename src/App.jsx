import React from 'react'
import AppRouter from "./router";
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <div>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
    </div>
  )
}

export default App
