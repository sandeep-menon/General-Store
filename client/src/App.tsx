import { Route, Routes } from 'react-router-dom';
import './App.css'
import Layout from './components/layout/Layout'
import { ThemeProvider } from './components/theme-provider'
// import { useStatusStore } from './store/status';
import Dashboard from './routes/Dashboard';
import Customers from './routes/Customers';
import Orders from './routes/Orders';
import Products from './routes/Products';

function App() {
  // const setStatus = useStatusStore((state) => state.setStatus);
  // const fetchData = async () => {
  //   setStatus("Loading...");
  //   await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
  //   setStatus("Ready");
  // };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Layout>
      <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </Layout>
    </ThemeProvider>

  )
}

export default App
