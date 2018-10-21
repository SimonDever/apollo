# Apollo

Cross platform open source desktop application to manage a local video collection.

Features:

- Searching and loading metadata from [MovieDB](https://themoviedb.org)  
- Sort and filter entries by metadata fields  
- JavaScript only embedded persistent database  

## Dependencies

- [Electron 1.8.4](https://github.com/electron/electron)
- [Angular 5.2.9](https://github.com/angular)
- [NGRX 5.2.0](https://github.com/ngrx)
- [NeDB 1.8.0](https://github.com/louischatriot/nedb)
- [Bootstrap](https://github.com/twbs/bootstrap)
- [moviedb-promise](https://github.com/grantholle/moviedb-promise)
- [octicons](https://github.com/primer/octicons)

## Building

```
npm install
npm run build
npm run electron
```

## Developing

```
npm install
npm run start
```

To enable MovieDb searching create `.moviedb-api-key` file with API key in root directory.
