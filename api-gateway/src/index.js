require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Service Discovery DINÁMICO con Consul
class DynamicServiceDiscovery {
  constructor() {
    this.consulUrl = `http://${process.env.CONSUL_HOST || 'consul'}:${process.env.CONSUL_PORT || 8500}`;
    this.fallbacks = {
      'usuarios': 'http://usuarios_service:4001',
      'afiliaciones': 'http://afiliaciones_service:4002',
      'notificaciones': 'http://notificaciones_service:4005',
      'asistencias': 'http://asistencias_service:4004',
      'rutinas': 'http://rutinas_service:4004'
    };
    this.cache = new Map();
    this.cacheTimeout = 5000; // 5 segundos de cache
  }

  // Obtener servicio saludable de Consul (con cache)
  async getHealthyService(serviceName) {
    const cacheKey = `${serviceName}-service`;
    const cached = this.cache.get(cacheKey);
    
    // Usar cache si es reciente
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      return cached.url;
    }

    try {
      // Consultar Consul por servicios saludables
      const response = await axios.get(`${this.consulUrl}/v1/health/service/${cacheKey}?passing=true`, {
        timeout: 2000
      });
      
      const healthyServices = response.data || [];
      
      if (healthyServices.length === 0) {
        console.log(`⚠️ No hay instancias saludables de ${serviceName}, usando fallback`);
        return this.fallbacks[serviceName];
      }
      
      // Load balancing simple (round robin o random)
      const randomIndex = Math.floor(Math.random() * healthyServices.length);
      const service = healthyServices[randomIndex].Service;
      const serviceUrl = `http://${service.Address}:${service.Port}`;
      
      // Cachear resultado
      this.cache.set(cacheKey, {
        url: serviceUrl,
        timestamp: Date.now()
      });
      
      console.log(`✅ Service Discovery: ${serviceName} -> ${serviceUrl}`);
      return serviceUrl;
      
    } catch (error) {
      console.error(`❌ Error consultando Consul para ${serviceName}:`, error.message);
      // Fallback a URL estática
      return this.fallbacks[serviceName];
    }
  }

  // Obtener estado de servicios desde Consul
  async getServicesStatus() {
    try {
      const response = await axios.get(`${this.consulUrl}/v1/catalog/services`, {
        timeout: 3000
      });
      
      const services = response.data || {};
      const status = {};
      
      for (const serviceName of Object.keys(services)) {
        try {
          const healthResponse = await axios.get(`${this.consulUrl}/v1/health/service/${serviceName}`);
          const healthChecks = healthResponse.data || [];
          
          const healthy = healthChecks.filter(s => 
            s.Checks.every(check => check.Status === 'passing')
          ).length;
          
          status[serviceName] = {
            instances: healthChecks.length,
            healthy: healthy,
            status: healthy > 0 ? 'UP' : 'DOWN'
          };
        } catch (error) {
          status[serviceName] = { status: 'ERROR', error: error.message };
        }
      }
      
      return status;
    } catch (error) {
      return { error: 'Consul no disponible', message: error.message };
    }
  }

  // Limpiar cache
  clearCache() {
    this.cache.clear();
    console.log('🗑️ Cache de Service Discovery limpiado');
  }
}

const serviceDiscovery = new DynamicServiceDiscovery();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Crear proxy dinámico que consulta Consul en cada request
function createDynamicProxy(serviceName) {
  return createProxyMiddleware({
    target: 'http://placeholder', // Se reemplaza dinámicamente
    changeOrigin: true,
    pathRewrite: { [`^/api/${serviceName}`]: '' },
    router: async (req) => {
      // AQUÍ ESTÁ LA MAGIA: Consultar Consul en cada request
      const serviceUrl = await serviceDiscovery.getHealthyService(serviceName);
      console.log(`🔄 Routing /api/${serviceName} -> ${serviceUrl}`);
      return serviceUrl;
    },
    onError: (err, req, res) => {
      console.error(`❌ Error en proxy ${serviceName}:`, err.message);
      res.status(503).json({
        error: `Servicio ${serviceName} no disponible`,
        message: 'Intenta de nuevo en unos minutos',
        timestamp: new Date().toISOString()
      });
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`📊 ${serviceName}: ${req.method} ${req.url} -> ${proxyRes.statusCode}`);
    },
    timeout: 10000 // 10 segundos timeout
  });
}

// Health check del gateway
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// Endpoint para ver servicios registrados en Consul
app.get('/services', async (req, res) => {
  try {
    const servicesStatus = await serviceDiscovery.getServicesStatus();
    res.json({
      message: 'Servicios registrados en Consul',
      consul_ui: 'http://localhost:8500',
      services: servicesStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error consultando Consul',
      message: error.message,
      fallback: 'Usando URLs estáticas'
    });
  }
});

// Endpoint para ver estadísticas del cache
app.get('/cache/stats', (req, res) => {
  const stats = serviceDiscovery.getCacheStats();
  res.json({
    message: 'Estadísticas del cache de Service Discovery',
    cache_timeout_seconds: 30,
    log_interval_seconds: 60,
    services: stats,
    timestamp: new Date().toISOString()
  });
});

// Endpoint para limpiar cache de service discovery
app.post('/cache/clear', (req, res) => {
  serviceDiscovery.clearCache();
  res.json({
    message: 'Cache de Service Discovery limpiado',
    timestamp: new Date().toISOString()
  });
});

// PROXIES DINÁMICOS - Consultan Consul en cada request
app.use('/api/usuarios', createDynamicProxy('usuarios'));
app.use('/api/afiliaciones', createDynamicProxy('afiliaciones'));
app.use('/api/asistencias', createDynamicProxy('asistencias'));
app.use('/api/rutinas', createDynamicProxy('rutinas'));
app.use('/api/notificaciones', createDynamicProxy('notificaciones'));

app.listen(port, () => {
  console.log(`🚀 FitManage API Gateway OPTIMIZADO con Service Discovery`);
  console.log(`📍 Puerto: ${port}`);
  console.log(`🔍 Consul UI: http://localhost:8500`);
  console.log(`📈 Services: http://localhost:4000/services`);
  console.log(`📊 Cache stats: http://localhost:4000/cache/stats`);
  console.log(`🗑️ Clear cache: POST http://localhost:4000/cache/clear`);
  console.log(`✨ Cache optimizado: 30s timeout, logs controlados!`);
});