# App

## Javascript

### Global variables in javascript application

* **`VERSION`**<br>
  Git version based on [git-describe](http://www.git-scm.com/docs/git-describe) such as `v0.0.0-34-g7c16d8b`

* **`COMMITHASH`**<br>
  Git commit hash such as `7c16d8b1abeced419c14eb9908baeb4229ac0542`

## Styles

### SVG sprite

Plugin [svg-sprite-loader](https://github.com/kisenka/svg-sprite-loader)

Add files into `src/assets/svg-sprite`

Example for `src/assets/svg-sprite/hamburger.svg`:

```html
<svg class="icon">
  <use xlink:href="#hamburger"></use>
</svg>
```

### SVG inline

Plugin [postcss-svg](https://github.com/Pavliko/postcss-svg/blob/master/README.md)

Add files into `src/assets/svg-inline`

Example for `src/assets/svg-inline/logo.svg`:

```css
.logo {
  background-image: svg('logo');
}
```
