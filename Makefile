COMMON_FILENAME_PREFIX = xmoise01_xmaroc00_xpasyn00
PLAN_ARCHIVE = $(COMMON_FILENAME_PREFIX)_plan.zip
PLAN_SOURCE = docs/plan/*.*
PLAN_UNPACKED = $(COMMON_FILENAME_PREFIX)_plan

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


