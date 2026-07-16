
# Picast

**Picast** is a Chrome extension designed to bridge your web browser with a custom server, typically running on a Raspberry Pi. It allows you to send URLs from your browser to a service listening on port `2020` to perform specific tasks like downloading media or bookmarking links.

*Derived from: RaspberryCast*

---

## Features

The extension provides three convenient ways to interact with your server:

### 1. Popup Menu
Clicking the extension icon opens a small window with dedicated buttons for **Music Download** and **Bookmark**. These actions apply to the currently active tab.

### 2. Context Menu
Right-click any link on a webpage and select **"Send to Rpi."** You can configure in the extension's options whether this action defaults to downloading music or bookmarking the link.

### 3. Keyboard Shortcuts
Use keyboard shortcuts to quickly send the current tab's URL to your server.

| Action | Windows/Linux | macOS |
| :--- | :--- | :--- |
| **Music Download** | `Ctrl+Shift+M` | `Command+Shift+M` |
| **Bookmark Page** | `Ctrl+B` | `Command+B` |

---

## Technical Details

-   **Communication:** Uses the Fetch API in a background service worker (`background.js`) to make HTTP requests to the Raspberry Pi.
-   **Storage & Configuration:** Uses `chrome.storage.local` to remember the Raspberry Pi's IP address and preferred context menu action.
-   **Feedback:** Utilizes Chrome's notification system to confirm successful requests or report connection failures.
-   **User Interface:** The options and popup pages are styled using **Bootstrap** and powered by **jQuery**.

### Server API Endpoints

The extension sends GET requests to the following endpoints on your server (e.g., `http://<your-pi-ip>:2020/`):

-   **Music Download:**
    -   `GET /music-dl?url=<encoded_url>`
    -   Sends a URL to be downloaded.

-   **Bookmark:**
    -   `GET /bookmark/add?url=<encoded_url>&title=<encoded_title>`
    -   Sends a URL and its page title to be bookmarked.
    -   The server is expected to return a plain text response of `3` to indicate a successful bookmark. Any other response will trigger an error notification in the browser.

---

## Setup

1.  Install the extension.
2.  The options page will open automatically (or can be accessed via extension settings).
3.  Enter the **IP address** or **hostname** (e.g., `192.168.1.10` or `raspberrypi.local`) of your server.
4.  Click **Save**.

---
