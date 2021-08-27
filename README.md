<p align="center">
  <img src="./public/assets/logo-skizzle.svg" alt="Skizzle" width="512"/>
</p>
<p align="center">
<sub><sup>Platforms: Windows and macOS</sup></sub>
</p>

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/AxaGuilDEv/skizzle/Check%20tests?style=for-the-badge) ![GitHub release (latest by date)](https://img.shields.io/github/v/release/AxaGuilDEv/skizzle?style=for-the-badge) [![GitHub license](https://img.shields.io/github/license/AxaGuilDEv/skizzle?style=for-the-badge)](https://github.com/AxaGuilDEv/Skizzle/blob/master/LICENSE.md) [![GitHub issues](https://img.shields.io/github/issues/AxaGuilDEv/skizzle?style=for-the-badge)](https://github.com/AxaGuilDEv/skizzle/issues) [![GitHub stars](https://img.shields.io/github/stars/AxaGuilDEv/skizzle?style=for-the-badge)](https://github.com/AxaGuilDEv/skizzle/stargazers) [![GitHub forks](https://img.shields.io/github/forks/AxaGuilDEv/skizzle?style=for-the-badge)](https://github.com/AxaGuilDEv/skizzle/network) ![GitHub All Releases](https://img.shields.io/github/downloads/AxaGuilDEv/skizzle/total?style=for-the-badge)

<hr />

# Introduction

Skizzle is a Svelte + Electron application fetch and group the pull requests from all your projects from Azure DevOps. Skizzle notify you when a new pull request is available.

This app uses the [Azure DevOps API](https://docs.microsoft.com/en-us/rest/api/azure/devops/?view=azure-devops-rest-5.1) API, and it is built with [Electron](https://electronjs.org/) and [Svelte](https://svelte.dev).

<p align="center">
  <img src="./docs/screenshot.jpg" alt="Skizzle displays a list of pull requests" />
</p>

# Getting Started

Clone this repository:

```bash
# download
git clone https://github.com/AxaGuilDEv/skizzle.git
cd Skizzle

# install dependencies
npm install

# Run project
npm start
```

## Installing

Installing Skizzle is pretty basic. Just follow the installer.
For logging into the app, you have to use your Azure devOps account.

**Note for Mac users** : Skizzle is not signed (yet). It can be a problem on some Macs. To fix it, you have to copy the Skizzle app in Application folder being administrator and then type the command : `bash xattr -rc /Applications/Skizzle.app/.`

# Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our [code of conduct](CODE_OF_CONDUCT.md), and the process for submitting pull requests to us.

# Authors

BOUKORRAS Jerome - Software Engineer.
DE BAERDEMAEKER Mathieu - Software Engineer.

# License

This project is licensed under MIT License - see the [LICENSE.md](LICENSE.md) file for details
