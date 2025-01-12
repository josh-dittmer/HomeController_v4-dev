BUILDDIR = build

CPP_BUILDDIR = $(BUILDDIR)/cpp
TS_BUILDDIR = $(BUILDDIR)/ts

NPM_PACKAGE_DIR = npm/hc_flatbuffers/lib

FILES += devices/rgb_lights/rgb_lights.fbs

cpp:
	flatc --cpp --gen-all --scoped-enums -o $(CPP_BUILDDIR) $(FILES)

ts:
	flatc --ts --gen-all -o $(TS_BUILDDIR) $(FILES)

all: cpp ts

clean:
	rm -r build/cpp/*
	rm -r build/ts/*

install:
	cp -r $(TS_BUILDDIR)/* $(NPM_PACKAGE_DIR)
	cd $(NPM_PACKAGE_DIR) && npm run build && npm link

.PHONY: clean install