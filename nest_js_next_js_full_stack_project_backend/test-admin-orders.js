const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/v1/orders/admin/all-orders?page=1&limit=50',
  method: 'GET',
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();
