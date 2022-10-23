import compression from 'compression';

// https://github.com/expressjs/compression

const compressFilter = compression();

export default compressFilter;