# Expense Tracker

A simple app that tracks expenses for a group of people and keeps tabs on who owes money to whom.

## Why?

There aren't any apps out there (that I can find, at least) that offer category-based percentage splits. For example:

- Housing is split 70/30
- Entertainment is split 50/50
- Everything else is split 60/40

This is something I need, because my girlfriend and I use an income-based split for most shared expenses (but not all), and so far the only solution we've come up with is an unwieldy spreadsheet.

## Development

This app uses [React](https://facebook.github.io/react/) with the [Flux](https://facebook.github.io/flux/) (using [Flux Utils](https://facebook.github.io/flux/docs/flux-utils.html)) architecture. Routing is handled by [Aviator](https://github.com/swipely/aviator). OAuth is managed by [hello.js](http://adodson.com/hello.js/), and dates are processed with [Moment.js](http://momentjs.com/).

The site is compiled with [webpack](https://webpack.github.io/), scripts are transpiled from ES6 using [Babel](https://babeljs.io/), and styles are post-(pre-?)processed with [PostCSS](https://github.com/postcss/postcss).

### Issues and Feature Improvements

Progress and issues are tracked at https://github.com/jlengstorf/expense-tracker/issues
