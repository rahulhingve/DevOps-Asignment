## server_setup.sh

```bash
#!/bin/bash

# Exit on any error
set -e




echo " Installing PM2 globally..."
sudo npm install -g pm2

echo "Cloning your Node.js app..."
cd /root
git clone https://github.com/rahulhingve/DevOps-Asignment AssignmentApp

cd AssignmentApp

echo " Installing dependencies..."
npm install

echo "Starting app with PM2..."
pm2 start index.js --name assignment-app

echo " Server setup completed!"
📝 Deliverable

```


```bash

chmod +x server_setup.sh
```
Run it:

```bash

./server_setup.sh
```





### What it Does (Assuming Node.js pm2 amd  npm are installed)
- Clones my assignment repo
- Installs Node.js dependencies 
- Starts the app with PM2

### How to Use
```bash
chmod +x server_setup.sh
./server_setup.sh
```