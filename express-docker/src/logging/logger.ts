import pino from 'pino';
import pinoConfig from "./config";

const logger = pino(pinoConfig);

export default logger