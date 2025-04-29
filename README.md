A Simple Library Management System built using java,springboot,mysql and jdbc

----
# Technologies Used:
** Java 21
** Spring boot
** Spring data jpa
** MYSQL
** Postman(for api testing)


----DataBase Structure

Tables

1. **books**
   - `id` (INT, PK, AUTO_INCREMENT)
   - `title` (VARCHAR, UNIQUE)
   - `author` (VARCHAR)
   - `avilableCopies` (INTEGER)

2. **patrons**
   - `id` (INT, PK, AUTO_INCREMENT)
   - `name` (VARCHAR, UNIQUE)

3. **borrowed_books
   - `patron_id` (foreign Key)
   - `book_id`   (foreign key)

---- API EndPoints

### Books
Method          Endpoint                  Description                      

| GET    | `/book`                      | Get all books                    
| GET    | `/book/search?term=xyz`      | Search books by title/author     
| GET    | `books/bookByPatronId?id=5`  | Get books borrowed by patron id    
| GET    | `/book/borrowedBooks`        | Get all borrowed books
| POST   | `/book`                      | Add a new book                   
| DELETE | `/book/{id}`                 | Delete a book     
| PATCH  | `/book/{id}`                 | update a book     
| POST   | `/book/borrow`               | borrow  books
| POST   | `/book/return`               | return books

### 👤 Patrons
 Method      Endpoint                   Description                    

| GET    | `/patron`                   | Get all patrons                 
| GET    | `/patron/{id}`              | Get patron by ID                
| GET    | `/patron/search?pattern=xyz`   |   Search patrons by name
| POST   | `/patron`                   | Add a new patron                
| DELETE | `/patron/{id}`              | Delete a patron and return borrowed books 
| PATCH  | `/book/{id}`                | update patron by id   

