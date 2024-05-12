import AutomatorDefineSingleEntry from "./AutomatorDefineSingleEntry.js";
import PrimaryButton from "../../PrimaryButton.js";

export default {
  name: "AutomatorDefinePage",
  components: {
    AutomatorDefineSingleEntry,
    PrimaryButton,
  },
  data() {
    return {
      constants: [],
      count: 0,
      refreshConstants: false,
    };
  },
  computed: {
    maxConstantCount() {
      return AutomatorData.MAX_ALLOWED_CONSTANT_COUNT;
    },
    maxNameLength() {
      return AutomatorData.MAX_ALLOWED_CONSTANT_NAME_LENGTH;
    },
    maxValueLength() {
      return AutomatorData.MAX_ALLOWED_CONSTANT_VALUE_LENGTH;
    },
    hasConstants() {
      return this.constants.length > 1 || this.constants[0] !== "";
    }
  },
  created() {
    // This key-swaps the container for all the constants in order to force a re-render when externally changed
    this.on$(GAME_EVENT.AUTOMATOR_CONSTANT_CHANGED, () => {
      this.refreshConstants = true;
      this.$nextTick(() => this.refreshConstants = false);
    });
  },
  methods: {
    update() {
      const existingValues = player.reality.automator.constantSortOrder;
      this.count = existingValues.length;
      this.constants = this.count < this.maxConstantCount ? [...existingValues, ""] : [...existingValues];
    },
    deleteAllConstants() {
      if (this.hasConstants) Modal.clearAutomatorConstants.show();
    },
    importPresets() {
      Modal.importTSConstants.show();
    },
  },
  template: `
  <div
    class="l-panel-padding"
    data-v-automator-define-page
  >
    This panel allows you to define case-sensitive constant values which can be used in place of numbers or Time Study
    import strings. These definitions are shared across all of your scripts and are limited to a maximum of
    {{ maxConstantCount }} defined constants. Additionally, constant names and values are limited to lengths of
    {{ maxNameLength }} and {{ maxValueLength }} characters respectively. Changes made to constants will not apply
    until any currently running scripts are restarted.
    <br>
    <br>
    As a usage example, defining
    <b>first 🠈 11,21,22,31,32,33</b>
    allows you to use
    <b>studies purchase first</b>
    in order to purchase all of the studies in the first three rows.
    <br>
    <br>
    <PrimaryButton
      v-tooltip="hasConstants ? null : 'You have no valid constants to delete!'"
      class="c-delete-margin o-primary-btn--subtab-option"
      :class="{ 'o-primary-btn--disabled' : !hasConstants }"
      @click="deleteAllConstants"
      data-v-automator-define-page
    >
      Delete all constants
    </PrimaryButton>
    <br>
    <br>
    <PrimaryButton
      class="c-delete-margin o-primary-btn--subtab-option"
      @click="importPresets"
      data-v-automator-define-page
    >
      Import Time Study Presets
    </PrimaryButton>
    <div
      :key="count + refreshConstants"
      class="l-definition-container"
      data-v-automator-define-page
    >
      <AutomatorDefineSingleEntry
        v-for="(constant, i) in constants"
        :key="i"
        :constant="constant"
        data-v-automator-define-page
      />
    </div>
  </div>
  `
};