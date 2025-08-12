const fs = require('fs');
const axios = require('axios');

const jsonData = JSON.parse(fs.readFileSync('ml-course.json', 'utf-8'));

axios.post('http://localhost:8080/api/courses', jsonData)
  .then(res => {
    console.log('✅ Course uploaded successfully:', res.data);
  })
  .catch(err => {
    console.error('❌ Failed to upload course:', err.response?.data || err.message);
  });
