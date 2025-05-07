import React from 'react'
import AppRouter from "./router";
import { AuthProvider } from './context/AuthContext';
import './i18n/i18n';

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
