const express = require('express');  
const app = express();  
const mysql = require('mysql');  
  
// connect to database  
const db = mysql.createConnection({  
  host: 'your_host',  
  user: 'your_user',  
  password: 'your_password',  
  database: 'your_database'  
});  
  
db.connect((err) => {  
  if (err) {  
   console.error('error connecting:', err);  
   return;  
  }  
  console.log('connected as id ' + db.threadId);  
});  
  
// create entries table  
db.query('CREATE TABLE IF NOT EXISTS entries (id INT AUTO_INCREMENT, date DATE, amount INT, words TEXT, PRIMARY KEY (id))', (err, results) => {  
  if (err) {  
   console.error('error creating table:', err);  
  }  
});  
  
// create words table  
db.query('CREATE TABLE IF NOT EXISTS words (id INT AUTO_INCREMENT, entry_id INT, word TEXT, PRIMARY KEY (id), FOREIGN KEY (entry_id) REFERENCES entries (id))', (err, results) => {  
  if (err) {  
   console.error('error creating table:', err);  
  }  
});  
  
// handle POST request to create new entry  
app.post('/entries', (req, res) => {  
  const { date, amount, words } = req.body;  
  db.query('INSERT INTO entries SET ?', { date, amount, words }, (err, results) => {  
   if (err) {  
    console.error('error creating entry:', err);  
    res.status(500).send({ message: 'Error creating entry' });  
   } else {  
    const entryId = results.insertId;  
    // insert words into words table  
    words.split(' ').forEach((word) => {  
      db.query('INSERT INTO words SET ?', { entry_id: entryId, word }, (err, results) => {  
       if (err) {  
        console.error('error inserting word:', err);  
       }  
      });  
    });  
    res.send({ message: 'Entry created successfully' });  
   }  
  });  
});  
  
// handle GET request to retrieve all entries  
app.get('/entries', (req, res) => {  
  db.query('SELECT * FROM entries', (err, results) => {  
   if (err) {  
    console.error('error retrieving entries:', err);  
    res.status(500).send({ message: 'Error retrieving entries' });  
   } else {  
    res.send(results);  
   }  
  });  
});  
  
// handle GET request to retrieve single entry for editing  
app.get('/entries/:id', (req, res) => {  
  const entryId = req.params.id;  
  db.query('SELECT * FROM entries WHERE id = ?', [entryId], (err, results) => {  
   if (err) {  
    console.error('error retrieving entry:', err);  
    res.status(500).send({ message: 'Error retrieving entry' });  
   } else {  
    res.send(results[0]);  
   }  
  });  
});  
  
// handle PUT request to update entry  
app.put('/entries/:id', (req, res) => {  
  const entryId = req.params.id;  
  const { date, amount, words } = req.body;  
  db.query('UPDATE entries SET ? WHERE id = ?', [{ date, amount, words }, entryId], (err, results) => {  
   if (err) {  
    console.error('error updating entry:', err);  
    res.status(500).send({ message: 'Error updating entry' });  
   } else {  
    // update words in words table  
    words.split(' ').forEach((word) => {  
      db.query('UPDATE words SET word = ? WHERE entry_id = ?', [word, entryId], (err, results) => {  
       if (err) {  
        console.error('error updating word:', err);  
       }  
      });  
    });  
    res.send({ message: 'Entry updated successfully' });  
   }  
  });  
});  
  
// handle DELETE request to delete entry  
app.delete('/entries/:id', (req, res) => {  
    const entryId = req.params.id;  
    db.query('DELETE FROM entries WHERE id = ?', [entryId], (err, results) => {  
     if (err) {  
      console.error('error deleting entry:', err);  
      res.status(500).send({ message: 'Error deleting entry' });  
     } else {  
      // delete words associated with entry  
      db.query('DELETE FROM words WHERE entry_id = ?', [entryId], (err, results) => {  
        if (err) {  
         console.error('error deleting words:', err);  
        }  
      });  
      res.send({ message: 'Entry deleted successfully' });  
     }  
    });  
  });  
    
  // start server  
  const port = 3000;  
  app.listen(port, () => {  
    console.log(`Server listening on port ${port}`);  
  });
  