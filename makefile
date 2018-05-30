REACT_OBJECTS := $(shell find ./src -name '*.js')

all: ./build/asset-manifest.json
	
./node_modules/last_install.txt: package.json yarn.lock
		yarn install --frozen-lockfile
		echo "install complete" > ./node_modules/last_install.txt

./build/asset-manifest.json: $(REACT_OBJECTS) ./node_modules/last_install.txt
		yarn build

clean:
		rm -rf node_modules
		rm -rf build
