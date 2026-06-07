import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import storesRoutes from './routes/stores.js'
import kpiRoutes from './routes/kpi.js'
import dishesRoutes from './routes/dishes.js'
import alertsRoutes from './routes/alerts.js'
import procurementRoutes from './routes/procurement.js'
import reportRoutes from './routes/report.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app: express.Application = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use((req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.replace('Bearer ', '')
  if (token) {
    const idPart = token.replace('token-', '')
    if (idPart.startsWith('hq')) {
      req.headers['x-user-role'] = 'headquarters'
    } else if (idPart.startsWith('rg')) {
      req.headers['x-user-role'] = 'region'
      req.headers['x-user-region-id'] = 'east'
    } else if (idPart.startsWith('st')) {
      req.headers['x-user-role'] = 'store'
      req.headers['x-user-store-id'] = idPart.toUpperCase()
    }
  }
  next()
})

app.use('/api/auth', authRoutes)
app.use('/api/stores', storesRoutes)
app.use('/api/kpi', kpiRoutes)
app.use('/api/dishes', dishesRoutes)
app.use('/api/alerts', alertsRoutes)
app.use('/api/procurement', procurementRoutes)
app.use('/api/report', reportRoutes)

app.use(
  '/api/health',
  (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).json({
      success: true,
      message: 'ok',
    })
  },
)

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error)
  res.status(500).json({
    success: false,
    error: 'Server internal error',
  })
})

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API not found',
  })
})

export default app
