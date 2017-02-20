# Templates

Used pug (ex jade) templates in express application

## Folder structure example

```bash
$ tree src/views

src/views
├── _partials
│   ├── header.pug
│   └── layout.pug
├── category
│   └── index.pug
├── index.pug
└── page1.pug
```

## Global variables in templates

* **`env`**<br>
  Type: `development|production`<br>
  Environment variable in template. Try `console.log('env', #{env})`

  ```jade
  if env == 'production'
      link(rel="stylesheet", href="/main.css")
  ```
