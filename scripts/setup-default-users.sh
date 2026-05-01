#!/bin/bash

echo "Setting up default users for Child Abuse Database Management System..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   Run: sudo systemctl start mongod"
    exit 1
fi

# Check if Node.js dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
fi

# Create default users
echo "👤 Creating default test users..."
npx ts-node src/seeds/create-default-users.ts

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "Default test users are now available:"
echo ""
echo "🔹 ADMIN USER:"
echo "   Email: admin@childsafe.ng"
echo "   Password: Admin@123"
echo ""
echo "🔹 SOCIAL WORKER:"
echo "   Email: social@childsafe.ng"
echo "   Password: Worker@123"
echo ""
echo "🔹 LAW ENFORCEMENT:"
echo "   Email: law@childsafe.ng"
echo "   Password: Enforce@123"
echo ""
echo "🚀 You can now start the development server with: npm run start:dev"
echo "🌐 Then access the application at: http://localhost:3000"
