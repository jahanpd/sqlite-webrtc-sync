# Instructions
These instructions should be followed as much as possible when planning and building this project.

# High Level Goal
I want to create a package that exposes a high level api for a browser database that can be shared/synced between devices.

# Subgoals
## Use SQLite wasm with persistence using OPFS
This means the database should work in a web worker.

## Connect/sync via WebRTC
Peers that want the database should connect via WebRTC. Feel free to use a package like PeerJS to make WebRTC easier.

## Simple sync
I don't want to use a complicated sync protocol.
All I want is while peers are connected they share database writes/updates.
There is no automatic syncronisation of the database on connection however.
If peers choose to sync, the entire sqlite file is shared with all connected peers and merged with their current sqlite file.
There should be both a import sync option to get sqlite files from connected peers and merge them, and an export where you push your sqlite file to connected peers.

# Tests
I want you to make a series of tests to make sure the code is working properly, including using a browser testing framework like playwright.


