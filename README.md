# Warehouse Return Inspector

iPad-optimized app for warehouse workers to inspect returns using the 8returns API.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Credentials

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_8RETURNS_API_KEY=your_api_key_here
NEXT_PUBLIC_8RETURNS_API_PASSWORD=your_api_password_here
```

Get your API credentials from [8returns API documentation](https://docs.8returns.com/api-documentation/rest-api).

### 3. Run the Application

```bash
npm run dev
```

### 4. Access the App

Open [http://localhost:3000](http://localhost:3000) on your iPad.

## Using the App

1. **Scan Order**: Use barcode scanner or manually enter order number
2. **Review Items**: View all return items and their current status
3. **Inspect**: Tap "Mark as Inspected" button for each item
4. **Track Progress**: Monitor inspection progress bar
5. **Scan Next**: Tap "Scan New Order" when done

## iPad Setup (Optional)

For the best warehouse experience:

1. Open the app in Safari on iPad
2. Tap the Share button and select "Add to Home Screen"
3. Connect your barcode scanner (Bluetooth or USB)
4. Configure scanner to send "Enter" after each scan

## Build for Production

```bash
npm run build
npm start
```

## Features

- Large touch-friendly buttons (no mouse/keyboard needed)
- Barcode scanner integration
- Real-time status updates via 8returns API
- Visual progress tracking
- Color-coded inspection status (Green = Inspected, Orange = Pending)
