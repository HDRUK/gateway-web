[![LICENCE](https://img.shields.io/github/license/HDRUK/gateway-web)](https://github.com/HDRUK/gateway-web/blob/master/LICENSE)
[![Support](https://img.shields.io/badge/Supported%20By-HDR%20UK-blue)](https://hdruk.ac.uk)

# HDR UK GATEWAY - Frontend (ReactJS)

This is a React Application, which provides the Front End to the Gateway. It uses [axios](https://www.npmjs.com/package/axios) to perform XMLHttpRequests from the browser to negotiate with the Gateway's Back-end API server [gateway-api](https://github.com/HDRUK/gateway-api) for all user interactions with the Gateway resources.

## Installation / Running Instructions

To set up the API on your local do the following steps

### Step 1

Clone the WEB repository.

```
git clone https://github.com/HDRUK/gateway-web
```

### Step 2

Run the npm install and add axios module via command line.

```
npm install
npm i -S axios
```

### Step 3

Start the WEB via command line.

```
npm start
```

## Configuring vscode

1. Go to File > Preferences > Settings
2. On your right-hand side, there is an icon to Open Settings in JSON format. Click on that icon
3. Add below JSON code there

```
{
  "editor.codeActionsOnSave": { "source.fixAll.eslint": true },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.alwaysShowStatus": true,
  "terminal.integrated.shell.windows": "C:\\Program Files\\Git\\bin\\bash.exe",
  "security.workspace.trust.untrustedFiles": "open"
}

```

## .env

Skip preflight check needs to be true due to conflict with babel loader versions between storybook and react-scripts. Please create your own .env file with the following content:

```
SKIP_PREFLIGHT_CHECK=true
REACT_APP_API_VERSION=v1
```
