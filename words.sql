CREATE TABLE words (  
  id INT AUTO_INCREMENT,  
  entry_id INT,  
  word TEXT,  
  PRIMARY KEY (id),  
  FOREIGN KEY (entry_id) REFERENCES entries (id)  
);