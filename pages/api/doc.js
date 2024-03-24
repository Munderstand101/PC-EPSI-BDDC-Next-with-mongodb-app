// pages/api/doc.js
import { withSwagger } from 'next-swagger-doc';

const swaggerHandler = withSwagger({
    openApiVersion: '3.0.0',
    title: 'Sample Mflix API',
    version: '1.0.0',
    apiFolder: 'pages/api',
    tags: [
        { name: 'Movies', description: 'Endpoints related to movies' },
        { name: 'Comments', description: 'Endpoints related to comments' }
    ]
});

export default swaggerHandler();
