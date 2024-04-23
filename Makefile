.PHONY: test

# Plan packing variables
COMMON_FILENAME_PREFIX = xmoise01_xmaroc00_xpasyn00
PLAN_ARCHIVE = $(COMMON_FILENAME_PREFIX)_plan.zip
PLAN_SOURCE = docs/plan/*.*
PLAN_UNPACKED = $(COMMON_FILENAME_PREFIX)_plan

# Pack variables
TEMP_PACK_FOLDER=pack_archive_temp
TEMP_PACK_REPO=$(TEMP_PACK_FOLDER)/repo
TEMP_PACK_DOCS=$(TEMP_PACK_FOLDER)/doc

YARN_DOCS_FOLDER=library_docs

pack: pack-repo pack-docs

pack-clean: pack-repo-clean pack-docs-clean
	@if [ -d $(TEMP_PACK_FOLDER) ]; then \
		echo "Removing existing $(TEMP_PACK_FOLDER) directory"; \
		rm -rf $(TEMP_PACK_FOLDER); \
	fi

pack-docs: pack-docs-clean
	@echo "Creating $(TEMP_PACK_DOCS) directory"
	@mkdir -p $(TEMP_PACK_DOCS)
	@yarn docs:generate &> /dev/null
	@cp -r $(YARN_DOCS_FOLDER)/* $(TEMP_PACK_DOCS)
	@echo "$(TEMP_PACK_DOCS) directory created"

pack-docs-clean:
	@if [ -d $(TEMP_PACK_DOCS) ]; then \
		echo "Removing existing $(TEMP_PACK_DOCS) directory"; \
		rm -rf $(TEMP_PACK_DOCS); \
	fi
	@if [ -d $(YARN_DOCS_FOLDER) ]; then \
		echo "Removing existing $(YARN_DOCS_FOLDER) directory"; \
		rm -rf $(YARN_DOCS_FOLDER); \
	fi

pack-repo: pack-repo-clean
	@echo "Creating $(TEMP_PACK_REPO) directory"
	@mkdir -p $(TEMP_PACK_REPO)
	@git clone . $(TEMP_PACK_REPO) &> /dev/null
	@echo "$(TEMP_PACK_REPO) directory created"

pack-repo-clean:
	@if [ -d $(TEMP_PACK_REPO) ]; then \
		echo "Removing existing $(TEMP_PACK_REPO) directory"; \
		rm -rf $(TEMP_PACK_REPO); \
	fi

test:
	yarn test

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


