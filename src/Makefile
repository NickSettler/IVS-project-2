.PHONY: test pack-docs
.DEFAULT_GOAL := all

# Plan packing variables
COMMON_FILENAME_PREFIX = xmoise01_xmaroc00_xpasyn00
PLAN_ARCHIVE = $(COMMON_FILENAME_PREFIX)_plan.zip
PLAN_SOURCE = plan/*.*
PLAN_UNPACKED = $(COMMON_FILENAME_PREFIX)_plan

# Standard deviation CLI application variables
STDDEV_CLI_APP = stddev

# Pack folders
TEMP_PACK_FOLDER=pack_archive_temp
TEMP_PACK_REPO_NAME=repo
TEMP_PACK_DOCS_NAME=doc
TEMP_PACK_INSTALL_NAME=install
TEMP_PACK_REPO=$(TEMP_PACK_FOLDER)/$(TEMP_PACK_REPO_NAME)
TEMP_PACK_DOCS=$(TEMP_PACK_FOLDER)/$(TEMP_PACK_DOCS_NAME)
TEMP_PACK_INSTALL=$(TEMP_PACK_FOLDER)/$(TEMP_PACK_INSTALL_NAME)
PACK_ARCHIVE=$(COMMON_FILENAME_PREFIX).zip

# Yarn variables
YARN_EXECUTABLE=yarn

# Yarn commands
YARN_INSTALL_COMMAND=install
YARN_START_COMMAND=start
YARN_DOCS_GENERATE_COMMAND=docs:generate
YARN_STDDEV_BUILD_COMMAND=std_dev:build
YARN_TEST_COMMAND=test

# Yarn generated output variables
YARN_DOCS_FOLDER=../library_docs
YARN_STDDEV_OUTPUT=../$(STDDEV_CLI_APP)

# Github variables
GITHUB_REPO=NickSettler/IVS-project-2
GITHUB_LATEST_RELEASE=https://api.github.com/repos/$(GITHUB_REPO)/releases/latest
DEB_WILDCARD=download/.*/*.deb\"
DMG_WILDCARD=download/.*/*.dmg\"

# Clean files and folders
BUILD_FOLDERS=../dist ../out



# Prerequisites target

PREREQUISITES_APPS=node yarn bun zip git curl grep cut tr wget unzip

_check_software:
	@for app in $(PREREQUISITES_APPS); do \
		if ! command -v $$app &> /dev/null; then \
			echo "Error: $$app is not installed"; \
			exit 1; \
		fi; \
	done

	@echo "All prerequisites are installed"

# Pack targets
_pack-clean-pack-folder:
	@if [ -d $(TEMP_PACK_FOLDER) ]; then \
		echo "Removing existing $(TEMP_PACK_FOLDER) directory"; \
		rm -rf $(TEMP_PACK_FOLDER); \
	fi

_pack-clean-pack-archive:
	@if [ -f $(PACK_ARCHIVE) ]; then \
		echo "Removing existing $(PACK_ARCHIVE) file"; \
		rm -f $(PACK_ARCHIVE); \
	fi

pack-clean: _pack-clean-pack-folder
pack-clean: _pack-clean-pack-archive
pack-clean: pack-repo-clean
pack-clean: pack-docs-clean
pack-clean: pack-install-clean

_pack-docs-create-dir:
	@echo "Creating $(TEMP_PACK_DOCS) directory"
	@mkdir -p $(TEMP_PACK_DOCS)
	@echo "$(TEMP_PACK_DOCS) directory created"

_pack-docs-generate:
	@echo "Generating documentation"
	@cd .. && $(YARN_EXECUTABLE) $(YARN_DOCS_GENERATE_COMMAND) 1> /dev/null
	@echo "Documentation generated"

_pack-docs-move:
	@echo "Moving documentation to $(TEMP_PACK_DOCS)"
	@cp -r $(YARN_DOCS_FOLDER)/* $(TEMP_PACK_DOCS)
	@echo "Documentation moved to $(TEMP_PACK_DOCS)"

_pack-docs-remove-generated-directory:
	@if [ -d $(YARN_DOCS_FOLDER) ]; then \
		echo "Removing existing $(YARN_DOCS_FOLDER) directory"; \
		rm -rf $(YARN_DOCS_FOLDER); \
	fi

_pack-docs-remove-existing-directory:
	@if [ -d $(TEMP_PACK_DOCS) ]; then \
		echo "Removing existing $(TEMP_PACK_DOCS) directory"; \
		rm -rf $(TEMP_PACK_DOCS); \
	fi

pack-docs: _pack-docs-remove-generated-directory
pack-docs: _pack-docs-remove-existing-directory
pack-docs: _pack-docs-create-dir
pack-docs: _pack-docs-generate
pack-docs: _pack-docs-move
pack-docs:
	@$(MAKE) _pack-docs-remove-generated-directory

pack-docs-clean: _pack-docs-remove-generated-directory _pack-docs-remove-existing-directory

_pack-repo-create-dir:
	@echo "Creating $(TEMP_PACK_REPO) directory"
	@mkdir -p $(TEMP_PACK_REPO)
	@echo "$(TEMP_PACK_REPO) directory created"

_pack-repo-clone:
	@echo "Cloning repository to $(TEMP_PACK_REPO)"
	@git clone .. $(TEMP_PACK_REPO) &> /dev/null
	@echo "Repository cloned to $(TEMP_PACK_REPO)"

_pack-repo-remove-existing-directory:
	@if [ -d $(TEMP_PACK_REPO) ]; then \
		echo "Removing existing $(TEMP_PACK_REPO) directory"; \
		rm -rf $(TEMP_PACK_REPO); \
	fi

pack-repo: _pack-repo-remove-existing-directory
pack-repo: _pack-repo-create-dir
pack-repo: _pack-repo-clone

pack-repo-clean: _pack-repo-remove-existing-directory

_pack-install-create-dir:
	@echo "Creating $(TEMP_PACK_INSTALL) directory"
	@mkdir -p $(TEMP_PACK_INSTALL)
	@echo "$(TEMP_PACK_INSTALL) directory created"

_pack-install-download-application:
	@echo "Downloading latest application version from $(GITHUB_LATEST_RELEASE)"
	@curl -s $(GITHUB_LATEST_RELEASE) \
  	 	| grep -E "$(DEB_WILDCARD)" \
  		| cut -d : -f 2,3 \
  		| tr -d \" \
  		| wget -qi - -P $(TEMP_PACK_INSTALL)
	@echo "Application version downloaded"

_pack-install-install-dependencies:
	@echo "Installing dependencies"
	@cd ../ && $(YARN_EXECUTABLE) $(YARN_INSTALL_COMMAND) 1> /dev/null
	@echo "Dependencies installed"

_pack-install-build-stddev:
	@echo "Building standard deviation CLI application"
	@cd ../ && $(YARN_EXECUTABLE) $(YARN_STDDEV_BUILD_COMMAND) 1> /dev/null
	@echo "Standard deviation CLI application built"

_pack-install-copy-stddev:
	@echo "Copying application to $(TEMP_PACK_INSTALL)"
	@mv $(YARN_STDDEV_OUTPUT) $(TEMP_PACK_INSTALL)/$(STDDEV_CLI_APP)
	@echo "Standard deviation CLI application copied"

_pack-install-remove-stddev-output:
	@if [ -f $(YARN_STDDEV_OUTPUT) ]; then \
		echo "Removing existing standard deviation CLI application file"; \
		rm -f $(YARN_STDDEV_OUTPUT); \
	fi

_pack-install-remove-existing-directory:
	@if [ -d $(TEMP_PACK_INSTALL) ]; then \
		echo "Removing existing $(TEMP_PACK_INSTALL) directory"; \
		rm -rf $(TEMP_PACK_INSTALL); \
	fi

pack-install: _pack-install-remove-existing-directory
pack-install: _pack-install-remove-stddev-output
pack-install: _pack-install-create-dir
pack-install: _pack-install-download-application
pack-install: _pack-install-install-dependencies
pack-install: _pack-install-build-stddev
pack-install: _pack-install-copy-stddev
pack-install:
	@$(MAKE) _pack-install-remove-stddev-output

pack-install-clean: _pack-install-remove-existing-directory _pack-install-remove-stddev-output

_pack-main-archive:
	@echo "Packing $(COMMON_FILENAME_PREFIX).zip"
	@cd $(TEMP_PACK_FOLDER) && zip -q -r ../$(COMMON_FILENAME_PREFIX).zip $(TEMP_PACK_REPO_NAME) $(TEMP_PACK_DOCS_NAME) $(TEMP_PACK_INSTALL_NAME)
	@echo "$(COMMON_FILENAME_PREFIX).zip packed"

# Plan targets
download:
	@echo "Downloading $(COMMON_FILENAME_PREFIX)_plan.zip"
	@curl -s -o $(COMMON_FILENAME_PREFIX)_plan.zip https://www.fit.vutbr.cz/study/courses/ISS/public/proj2019/$(COMMON_FILENAME_PREFIX)_plan.zip
	@echo "$(COMMON_FILENAME_PREFIX)_plan.zip downloaded"

plan-pack: plan-clean
	@echo "Packing plan to $(PLAN_ARCHIVE)"
	@zip -qj $(PLAN_ARCHIVE) $(PLAN_SOURCE)
	@echo "Plan packed to $(PLAN_ARCHIVE)"

plan-unpack: plan-pack
	@echo "Unpacking plan to $(PLAN_UNPACKED)"
	@unzip -qo $(PLAN_ARCHIVE) -d $(PLAN_UNPACKED)
	@echo "Plan unpacked to $(PLAN_UNPACKED)"

plan-clean:
	@if [ -w $(PLAN_ARCHIVE) ] || [ -d $(PLAN_UNPACKED) ]; then \
		echo "Cleaning plan"; \
		rm -rf $(PLAN_ARCHIVE) $(PLAN_UNPACKED); \
		echo "Plan cleaned"; \
	fi

# Task targets
all:
	@$(MAKE) _pack-install-install-dependencies
	@$(MAKE) _pack-install-build-stddev

pack: pack-clean pack-repo pack-docs pack-install
	@$(MAKE) _pack-main-archive
	@$(MAKE) _pack-clean-pack-folder

clean: pack-clean
	@echo "Cleaning application files and folders"
	@rm -rf $(BUILD_FOLDERS)
	@echo "Application files and folders cleaned"

test:
	cd .. & $(YARN_EXECUTABLE) $(YARN_TEST_COMMAND)

doc:
	cd .. && $(YARN_EXECUTABLE) $(YARN_DOCS_GENERATE_COMMAND) 1> /dev/null

run:
	@echo "Running application"
	@cd .. && $(YARN_EXECUTABLE) $(YARN_START_COMMAND)
	@echo "Application finished"

profile:
	@echo "Profiling application"
	@cd .. && ./stddev
	@echo "Profiling finished"
