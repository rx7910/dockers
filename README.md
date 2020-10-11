## Get Started

Print Hugo Help:

```bash
docker run --rm -it duranx/hugo:latest hugo help
```

Create a new Hugo managed website:

```bash
docker run --rm -it -v $PWD:/src -u hugo duranx/hugo:latest hugo new site mysite
cd mysite

# Now, you probably want to add a theme (see https://themes.gohugo.io/):
git init
git submodule add https://github.com/budparr/gohugo-theme-ananke.git themes/ananke;
echo 'theme = "ananke"' >> config.toml
```

Add some content:

```bash
docker run --rm -it -v $PWD:/src -u hugo duranx/hugo:latest hugo new posts/my-first-post.md

# Now, you can edit this post, add your content and remove "draft" flag:
xdg-open content/posts/my-first-post.md
```

Build your site:

```bash
docker run --rm -it -v $PWD:/src -u hugo duranx/hugo:latest hugo
```

Serve your site locally:

```bash
docker run --rm -it -v $PWD:/src -p 1313:1313 -u hugo duranx/hugo:latest hugo server -w --bind=0.0.0.0
```

Then open [`http://localhost:1313/`](http://localhost:1313/) in your browser.

To go further, read the [Hugo documentation](https://gohugo.io/documentation/).

## Bash Alias

For ease of use, you can create a bash alias:

```bash
alias hugo='docker run --rm -it -v $PWD:/src -u hugo duranx/hugo:latest hugo'
alias hugo-server='docker run --rm -it -v $PWD:/src -p 1313:1313 -u hugo duranx/hugo:latest hugo server --bind 0.0.0.0'
```

Now, you can use `hugo help`, `hugo new foo/bar.md`, `hugo-server -w`, etc.

## Users

By default, this docker image run as the root user. This makes it easy to use as base image for other Dockerfiles (switching back and forth adds extra layers and is against the current [best practices](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/#user) advised by Docker). Most (all official?) base images leave the default user as root.

However, this docker image also define a non-root user `hugo` (UID 1000, GID 1000) which can be switched on at run time using the `--user` flag to `docker run`.

```bash
docker run --rm -it -v $PWD:/src --user hugo duranx/hugo:latest hugo
```

You can also change this according your needs, by setting another UID/GID. For instance, to run hugo with user `www-data:www-data` (UID 33, GID 33) :

```bash
docker run --rm -it -v $PWD:/src -u 33:33 duranx/hugo:latest hugo
```

