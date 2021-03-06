# Editors' Notes renderer
JavaScript application that communicates (read/write) with the [Editors' Notes server API](https://github.com/editorsnotes/editorsnotes). Pages can be rendered both server- and client-side.

Requires nodejs >=0.12.0

## Running
  1. Run an instance of an [Editors' Notes server](https://github.com/editorsnotes/editorsnotes). 
  2. Set up this repository with `npm install`
  2. Compile the client-side application with `npm run compile`
  3. Start the Editors' Notes server and this one (using `npm start`). The configuration currently assumes that you will be running the Editors' Notes server on port 8001.
  4. Set up a proxy that will server static files and forward non-HTML requests. An example nginx is included below.

## Publishing

We use `npm version` along with some pre/post scrips to release new versions. To tag a new release:

  1. Make sure your master branch is tracking the upstream branch. You might need to run `git branch master --set-upstream-to=origin/master` for this to be the case.

  2. When you want to tag a new version from master, make sure you are up to date with the upstream branch (i.e. run `git push` and/or `git pull`)

  3. Run `npm version` with an argument of `major`, `minor`, or `patch` to tag a new version. It will automatically be pushed upstream.



## nginx configuration
```
server {
	listen 8000;

	location / {
		proxy_pass_request_headers on;
		proxy_set_header Host $http_host;

		# Forward non-html requests to the Editors' Notes server
		if ($http_accept ~* "html") {
			proxy_pass http://localhost:8450;
			break;
		}

		# Forward html requests to the HTML renderer, to render templates server-side
		proxy_pass http://localhost:8001;
	}


	# Replace with path where this repository lives
	location /static/ {
		root $PATH_TO_THIS_REPOSITORY/editorsnotes-renderer;
	}
}
```
