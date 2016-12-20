1. If you don't have it, compile and install as root NodeJS 4.x or later:

	```bash
	yum install -y gcc gcc-c++
	cd /tmp
	wget https://nodejs.org/download/release/v4.7.0/node-v4.7.0.tar.xz
	tar xf node-v4.7.0.tar.xz
	cd node-v4.7.0
	./configure
	make
	make install
	rm -rf /tmp/node-v*
	```

2. As the destination user (for instance `rdconnect-rest`) clone the code, install its dependencies, and prepare it for deployment:

	```bash
	cd "${HOME}"
	git clone https://github.com/inab/rd-connect-user-management-interface.git
	cd rd-connect-user-management-interface
	npm install
	npm install --dev
	export PATH="${PWD}/node_modules/.bin:$PATH"
	gulp build
	```

3. Install the web user interface, for instance as /user_management:

	```bash
	cp -dpTr build "${HOME}/DOCUMENT_ROOT/user-management"
	```
