const express = require('express');
const fs = require('fs');



const app = express();
app.use(express.json());

app.post('/students', (req, res) => {
    const { stuName, stuRegistrationNumber } = req.body;
  
    const stuData = JSON.parse(fs.readFileSync('students.json'));
  
    const newStu = {
        stuName,
        stuRegistrationNumber,
    };
  
    stuData .push(newStu);
  
    fs.writeFileSync('students.json', JSON.stringify(stuData));
  
    res.status(201).json(newStu);
  });
  


  
  app.get('/students', (req, res) => {
    const stuData  = JSON.parse(fs.readFileSync('students.json'));
    res.json(stuData);
  });
  



  app.get('/students/:regNo', (req, res) => {
    const { regNo } = req.params;
  
    const stuData = JSON.parse(fs.readFileSync('students.json'));
  
    const isStudent = stuData.find(student => student.stuRegistrationNumber === regNo);
  
    if (isStudent) {
      res.json(isStudent);
    } else {
      res.status(404).json({ error: 'Error !!! , Student not found' });
    }
  });
  


  app.patch('/students/:regNo', (req, res) => {
    const { regNo } = req.params;
    const { newName } = req.body;
  
    const stuData = JSON.parse(fs.readFileSync('students.json'));
  
    const isStudent = stuData.find(student => student.stuRegistrationNumber === regNo);
  
    if (isStudent) {
      isStudent.stuName = newName;
  
      fs.writeFileSync('students.json', JSON.stringify(stuData));
  
      res.json(isStudent);
    } else {
      res.status(404).json({ error: 'Error !!! , Student not found' });
    }
  });
  



  app.delete('/students/:regNo', (req, res) => {
    const { regNo } = req.params;
  
    const stuData = JSON.parse(fs.readFileSync('students.json'));
  
    const isStudentIndex = stuData.findIndex(student => student.stuRegistrationNumber === regNo);
  
    if (isStudentIndex  !== -1) {
      const delStudent = stuData.splice(isStudentIndex , 1)[0];
  
      fs.writeFileSync('students.json', JSON.stringify(stuData));
  
      res.json(delStudent);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  });
  


  const port = 5000; 

app.listen(port, () => {
  console.log(`Hello !!! , Server is running on port ${port}`);
});


/*R1.)Reading :
cmd : Invoke-RestMethod -Uri "http://localhost:5000/students" -Method GET

stuName     stuRegistrationNumber
-------     ---------------------
Subramanian 123456

 */


// U2.)Searching through regNo :
// Invoke-RestMethod -Uri "http://localhost:5000/students/123456" -Method PATCH -Body '{"newName": "Jane Doe"}' -ContentType "application/json"
// subbu -> subramanian
/*results : stuName    stuRegistrationNumber
Subramanian 123456 */


/*D3.)Deleting :
Invoke-RestMethod -Uri "http://localhost:5000/students/123456" -Method DELETE              

stuName     stuRegistrationNumber
-------     ---------------------
Subramanian 123456

*/


/*C4.)Creating : 
$body = @{
>>     stuName = "Sam"
>>     stuRegistrationNumber = "123456789"
>> } | ConvertTo-Json
>> 
>> Invoke-RestMethod -Uri "http://localhost:5000/students" -Method POST -Body $body -ContentType "application/json"
>> 

stuName stuRegistrationNumber
------- ---------------------
Sam     123456789
*/
