import pinoHttp from 'pino-http';
import pinoConfig from '../../logging/config';

const accessLog = pinoHttp(pinoConfig)

export default accessLog