// src/main.jsx (ĐÃ SỬA)
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from './state/store.js';
import AppInitializer from './components/AppInitializer.jsx';
import App from './App.jsx';
import './styles/global.css'; // Import global styles

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <AppInitializer>
          <App />
        </AppInitializer>
      </Router>
    </Provider>
  </StrictMode>,
);