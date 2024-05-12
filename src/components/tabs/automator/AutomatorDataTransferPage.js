import AutomatorDataTransferSingleEntry from "./AutomatorDataTransferSingleEntry.js";

export default {
  name: "AutomatorDataTransferPage",
  components: {
    AutomatorDataTransferSingleEntry,
  },
  data() {
    return {
      scripts: 0,
    };
  },
  computed: {
    maxScriptCount: () => AutomatorData.MAX_ALLOWED_SCRIPT_COUNT,
  },
  created() {
    this.loadScripts();
    this.on$(GAME_EVENT.AUTOMATOR_SAVE_CHANGED, () => {
      this.loadScripts();
    });
  },
  methods: {
    loadScripts() {
      this.scripts = Object.values(player.reality.automator.scripts).map(script => ({
        id: script.id,
        name: script.name,
      }));
    },
  },
  template: `
  <div
    class="l-panel-padding"
    data-v-automator-data-transfer-page
  >
    This page lets you import and export scripts with additional data attached; the encoded text will also include data
    for any Time Study presets or constants used within the script. This will allow you to more easily transfer working
    scripts between different save files, but you may have to overwrite existing data in the process due to limited
    space for study presets and constants. Data exported from this page is also imported in the same way that single
    script data is imported.
    <br>
    <br>
    Note: Any mentions of constant names or full study-buying commands within comments will also be counted as being
    "used" within a script. This is intentional, as the comment is assumed to be indicative of what the script itself
    is attempting to do with presets or constants.
    <br>
    <br>
    <div
      v-for="(script, id) in scripts"
      :key="id"
    >
      <AutomatorDataTransferSingleEntry
        class="l-entry-margin"
        :script="script"
        data-v-automator-data-transfer-page
      />
    </div>
  </div>
  `
};