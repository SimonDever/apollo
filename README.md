# Apollo

Cross platform open source desktop application to manage a local video collection.

Features:

- Searching and loading metadata from [MovieDB](https://themoviedb.org)
- Sort and filter entries by metadata fields
- JavaScript only embedded persistent database
- Resizable and responsive interface with borderless mode
- Fast rendering and smooth virtual scrolling of thousands of grid items

## Dependencies

- [Electron](https://github.com/electron/electron)
- [Angular](https://github.com/angular)
- [NGRX](https://github.com/ngrx)
- [NeDB](https://github.com/louischatriot/nedb)
- [Bootstrap](https://github.com/twbs/bootstrap)
- [themoviedb-javascript-library](https://github.com/cavestri/themoviedb-javascript-library)
- [ngx-electron](https://github.com/ThorstenHans/ngx-electron)
- [ngx-virtual-scroller](https://github.com/rintoj/ngx-virtual-scroller)
- [octicons](https://github.com/primer/octicons)

## Developing and Testing

```
npm install
npm run build
npm run electron
```

## Building and Publishing

Setup [code signing certificate](https://www.electron.build/code-signing) and environment variables.

```
npm install
npm run package
```
