# Templates

Used pug (ex jade) templates in express application

## Folder structure example

```bash
$ tree src/views

├── 404
│   └── index.pug   # custom 404 error page
├── _partials
│   ├── header.pug
│   └── layout.pug
├── category        # resolve /category
│   └── index.pug
├── index.pug       # resolve /
└── page1.pug       # resolve /page1.html
```

## Global variables in templates

* **`env`**<br>
  Type: `development|production`<br>
  Environment variable in template. Try `console.log('env', #{env})`

  ```jade
  if env == 'production'
      link(rel="stylesheet", href="/main.css")
  ```
