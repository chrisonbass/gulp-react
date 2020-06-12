# If you update this file on Windows
# run the command 
# sed -i 's/\r//g' app-setup.sh
# to fix line endings for linux 
cd /app
npm install
npm run watch
