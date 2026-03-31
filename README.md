<div align="center" style="border-bottom: none">
    <h1>
        Wicflow Meet
        <br>
        Privacy-First AI Meeting Assistant
    </h1>
    <br>
    <a href="https://github.com/Masudur0x/wicflow-meet/releases/latest"><img src="https://img.shields.io/badge/Download-Latest_Release-brightgreen" alt="Download"></a>
    <a href="https://github.com/Masudur0x/wicflow-meet/releases"><img alt="GitHub Downloads (all assets, all releases)" src="https://img.shields.io/github/downloads/Masudur0x/wicflow-meet/total?style=plastic"></a>
    <a href="https://github.com/Masudur0x/wicflow-meet/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue" alt="License"></a>
    <a href="https://github.com/Masudur0x/wicflow-meet/releases"><img src="https://img.shields.io/badge/Supported_OS-macOS,_Windows,_Linux-white" alt="Supported OS"></a>
    <a href="https://github.com/Masudur0x/wicflow-meet/releases"><img alt="GitHub Tag" src="https://img.shields.io/github/v/tag/Masudur0x/wicflow-meet?include_prereleases&color=yellow"></a>
    <br>
    <h3>
    <br>
    Open Source | Privacy-First | Enterprise-Ready
    </h3>
    <p align="center">

A privacy-first AI meeting assistant that captures, transcribes, and summarizes meetings entirely on your machine. No data ever leaves your computer.

</p>

</div>

---

<details>
<summary>Table of Contents</summary>

- [Introduction](#introduction)
- [Why Wicflow Meet?](#why-wicflow-meet)
- [Features](#features)
- [Installation](#installation)
- [Key Features in Action](#key-features-in-action)
- [System Architecture](#system-architecture)
- [For Developers](#for-developers)
- [Contributing](#contributing)
- [License](#license)

</details>

## Introduction

Wicflow Meet is a privacy-first AI meeting assistant that runs entirely on your local machine. It captures your meetings, transcribes them in real-time, and generates summaries — all without sending any data to the cloud. Perfect for professionals and enterprises who need complete control over their sensitive information.

## Why Wicflow Meet?

While there are many meeting transcription tools available, Wicflow Meet stands out by offering:

- **Privacy First:** All processing happens locally on your device.
- **Cost-Effective:** Uses open-source AI models instead of expensive APIs.
- **Flexible:** Works offline and supports multiple meeting platforms.
- **Customizable:** Self-host and modify for your specific needs.

<details>
<summary>The Privacy Problem</summary>

Meeting AI tools create significant privacy and compliance risks across all sectors:

- **$4.4M average cost per data breach** (IBM 2024)
- **Billions in GDPR fines** issued globally
- **Hundreds of unlawful recording cases** filed annually

Whether you're a defense consultant, enterprise executive, legal professional, or healthcare provider, your sensitive discussions shouldn't live on servers you don't control.

**Wicflow Meet solves this:** Complete data sovereignty on your infrastructure, zero vendor lock-in, and full control over your sensitive conversations.

</details>

## Features

- **Local First:** All processing is done on your machine. No data ever leaves your computer.
- **Real-time Transcription:** Get a live transcript of your meeting as it happens.
- **AI-Powered Summaries:** Generate summaries using powerful language models.
- **Multi-Platform:** Works on macOS, Windows, and Linux.
- **Open Source:** Wicflow Meet is open source and free to use.
- **Flexible AI Provider Support:** Choose from Ollama (local), Claude, Groq, OpenRouter, or use your own OpenAI-compatible endpoint.

## Installation

### macOS (Apple Silicon)

1. Download `wicflow-meet_x.x.x_aarch64.dmg` from [Releases](https://github.com/Masudur0x/wicflow-meet/releases/latest)
2. Open the downloaded `.dmg` file
3. Drag **Wicflow Meet** to your Applications folder
4. Open **Wicflow Meet** from Applications

### Windows

1. Download `wicflow-meet_x.x.x_x64-setup.exe` from [Releases](https://github.com/Masudur0x/wicflow-meet/releases/latest)
2. Run the installer
3. Open **Wicflow Meet** from the Start Menu

### Linux

1. Download `wicflow-meet_x.x.x_amd64.deb` (Debian/Ubuntu) or `wicflow-meet_x.x.x_amd64.AppImage` (universal) from [Releases](https://github.com/Masudur0x/wicflow-meet/releases/latest)
2. Install:
   - `.deb`: `sudo dpkg -i wicflow-meet_*.deb`
   - `.AppImage`: Make executable and run: `chmod +x wicflow-meet_*.AppImage && ./wicflow-meet_*.AppImage`

## Key Features in Action

### Local Transcription

Transcribe meetings entirely on your device using **Whisper** or **Parakeet** models. No cloud required.

### Import & Enhance

Import existing audio files to generate transcripts, or re-transcribe any recorded meeting with a different model or language — all processed locally.

### AI-Powered Summaries

Generate meeting summaries with your choice of AI provider. **Ollama** (local) is recommended, with support for Claude, Groq, OpenRouter, and OpenAI.

### Privacy-First Design

All data stays on your machine. Transcription models, recordings, and transcripts are stored locally.

### GPU Acceleration

Built-in support for hardware acceleration across platforms:

- **macOS**: Apple Silicon (Metal) + CoreML
- **Windows/Linux**: NVIDIA (CUDA), AMD/Intel (Vulkan)

Automatically enabled at build time — no configuration needed.

## System Architecture

Wicflow Meet is a single, self-contained desktop application built with [Tauri](https://tauri.app/). It uses a Rust-based backend for audio processing and transcription, and a Next.js frontend for the user interface.

## For Developers

If you want to contribute to Wicflow Meet or build it from source, you'll need Rust and Node.js installed. For detailed build instructions, see the [Building from Source guide](docs/BUILDING.md).

## Contributing

We welcome contributions from the community! If you have any questions or suggestions, please open an issue or submit a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

MIT License - Feel free to use this project for your own purposes.

## Acknowledgments

- Built on top of the [Meetily](https://github.com/Zackriya-Solutions/meeting-minutes) open-source project by Zackriya Solutions.
- Uses [Whisper.cpp](https://github.com/ggerganov/whisper.cpp) for local transcription.
- Uses code from [Screenpipe](https://github.com/mediar-ai/screenpipe) and [transcribe-rs](https://crates.io/crates/transcribe-rs).
- Thanks to **NVIDIA** for the **Parakeet** model.
