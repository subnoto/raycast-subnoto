# Subnoto

Upload documents to [Subnoto](https://subnoto.com) for electronic signature directly from Raycast.

## Features

- **Quick Upload**: Select a PDF or Word document and upload it to Subnoto with a single command
- **Automatic Browser Redirect**: After uploading, the envelope edit page opens automatically in your browser
- **Custom Titles**: Optionally set a custom title for your envelope, or use the filename by default

## Setup

### Prerequisites

You need a Subnoto account with API access. If you don't have one, sign up at [subnoto.com](https://subnoto.com).

### Getting Your API Keys

1. Log in to your [Subnoto dashboard](https://app.subnoto.com)
2. Navigate to **Settings** → **API Keys**
3. Create a new API key pair (Access Key and Secret Key)
4. Copy both keys for use in the extension preferences

### Configuration

1. Open Raycast and search for "Upload Document"
2. You'll be prompted to enter your API credentials:
   - **API Access Key**: Your Subnoto API access key
   - **API Secret Key**: Your Subnoto API secret key

## Usage

1. Open Raycast and search for **"Upload Document"**
2. Select a PDF or Word document (.pdf, .doc, .docx)
3. Optionally enter a custom title for the envelope
4. Press Enter to upload
5. The envelope edit page will open in your browser where you can add recipients and signature fields

## Supported File Types

- PDF (.pdf)
- Microsoft Word (.doc, .docx)

Maximum file size: 50 MB

## Links

- [Subnoto Website](https://subnoto.com)
- [Subnoto Documentation](https://subnoto.com/documentation)
- [TypeScript SDK Documentation](https://subnoto.com/documentation/developers/sdks/typescript)
