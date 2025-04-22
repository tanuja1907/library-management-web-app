A Simple Library Management System built using java,springboot,mysql and jdbc

----
# Technologies Used:
** Java 21
** Spring boot
** JDBC
** MYSQL
** Postman(for api testing)


----DataBase Structure

Tables

1. **books**
   - `id` (INT, PK, AUTO_INCREMENT)
   - `title` (VARCHAR, UNIQUE)
   - `author` (VARCHAR)
   - `is_available` (BOOLEAN)
   - `borrowed_by` (INT, FK to patrons.id, nullable)

2. **patrons**
   - `id` (INT, PK, AUTO_INCREMENT)
   - `name` (VARCHAR, UNIQUE)

---- API EndPoints

### Books
Method          Endpoint                  Description                      

| GET    | `/book`                   | Get all books                    
| GET    | `/book/search?term=xyz`   | Search books by title/author     
| GET    | `/book/patron/{patronId}` | Get books borrowed by patron     
| GET    | `/book/borrowedBooks`     | Get all borrowed books with patron info 
| POST   | `/book`                   | Add a new book                   
| DELETE | `/book/{id}`              | Delete a book                    


### 👤 Patrons
 Method      Endpoint                   Description                    

| GET    | `/patron`                   | Get all patrons                 
| GET    | `/patron/{id}`              | Get patron by ID                
| GET    | `/patron/search?name=xyz`   |   Search patrons by name
| POST   | `/patron`                   | Add a new patron                
| DELETE | `/patron/{id}`              | Delete a patron and return borrowed books 

