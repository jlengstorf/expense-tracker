# Expense Tracker

A simple app that tracks expenses for a group of people and keeps tabs on who owes money to whom.

## Why?

There aren't any apps out there (that I can find, at least) that offer category-based percentage splits. For example:

- Housing is split 70/30
- Entertainment is split 50/50
- Everything else is split 60/40

This is something I need, because my girlfriend and I use an income-based split for most shared expenses (but not all), and so far the only solution we've come up with is an unwieldy spreadsheet.

## Development

This app is built with React (using Flux). The whole thing is packaged up using Webpack, so it's a JS-required app.

The back-end is Node + Socket.IO and MongoDB.

### Goals

- [ ] Offline support using localStorage
- [ ] Persistent storage in a database
- [ ] Edit-in-place functionality for expenses
- [ ] If it doesn't require anything crazy, port this sucker to React Native
