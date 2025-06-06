# ShareSpace


## 📁 Project Structure
    ```
    /sharespace
    ├── client # React frontend (ShareSpace UI)
    ├── posts # Post service (Node.js/Express)
    ├── comments # Comment service (Node.js/Express)
    ```

## Getting Started

1. **Install dependencies** in each folder:
   ```
   cd client && npm install

   cd ../posts && npm install
   
   cd ../comments && npm install
   ```

2. **Start services:**
    ```
    cd posts && npm start

    cd comments && npm start

    cd client && npm start
    ```