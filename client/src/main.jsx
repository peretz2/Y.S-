import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';
import { ThemeProvider } from './theme/ThemeContext.jsx';
import { CompanyInfoProvider } from './company/CompanyInfoContext.jsx';
import { SiteContentProvider } from './content/SiteContentContext.jsx';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <CompanyInfoProvider>
            <SiteContentProvider>
              <App />
            </SiteContentProvider>
          </CompanyInfoProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
