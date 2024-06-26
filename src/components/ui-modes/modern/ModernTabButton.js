export default {
  name: "ModernTabButton",
  props: {
    tab: {
      type: Object,
      required: true
    },
    tabPosition: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isAvailable: false,
      isHidden: false,
      subtabVisibilities: [],
      showSubtabs: false,
      hasNotification: false,
      tabName: ""
    };
  },
  computed: {
    classObject() {
      return {
        "o-tab-btn": true,
        "o-tab-btn--modern-tabs": true,
        "o-tab-btn--subtabs": this.showSubtabs,
        "o-tab-btn--active": this.isCurrentTab && Theme.currentName() !== "S9"
      };
    },
    isCurrentTab() {
      return this.tab.isOpen;
    }
  },
  methods: {
    update() {
      this.isAvailable = this.tab.isAvailable;
      this.isHidden = this.tab.isHidden;
      this.subtabVisibilities = this.tab.subtabs.map(x => x.isAvailable);
      this.showSubtabs = this.isAvailable && this.subtabVisibilities.length >= 1;
      this.hasNotification = this.tab.hasNotification;
      if (this.tabPosition < Pelle.endTabNames.length) {
        this.tabName = Pelle.transitionText(
          this.tab.name,
          Pelle.endTabNames[this.tabPosition],
          Math.clamp(GameEnd.endState - (this.tab.id % 4) / 10, 0, 1)
        );
      } else {
        this.tabName = this.tab.name;
      }
    },
    isCurrentSubtab(id) {
      return player.options.lastOpenSubtab[this.tab.id] === id && Theme.currentName() !== "S9";
    },
    handleClick() {
      this.tab.show(true);
      playNote([0, 2, 4, 5, 7, 9, 11][this.tabPosition % 7] + 12 * Math.floor(this.tabPosition / 7));
      AutomatorPoints.click();
    },
    handleSubtabClick(subtab, index) {
      subtab.show(true);
      playNote([0, 2, 4, 5, 7, 9, 11][index % 7] + 12 * Math.floor(index / 7), "bass");
      AutomatorPoints.click();
    }
  },
  template: `
  <div
    v-if="!isHidden && isAvailable"
    :class="[classObject, tab.config.UIClass]"
    data-v-modern-tab-button
  >
    <div
      class="l-tab-btn-inner"
      data-v-modern-tab-button
      @click="handleClick"
    >
      {{ tabName }}
      <div
        v-if="hasNotification"
        class="fas fa-circle-exclamation l-notification-icon"
      />
    </div>
    <div
      v-if="showSubtabs"
      class="subtabs"
      data-v-modern-tab-button
    >
      <template
        v-for="(subtab, index) in tab.subtabs"
      >
        <div
          v-if="subtabVisibilities[index]"
          :key="index"
          class="o-tab-btn o-tab-btn--subtab"
          :class="
            [tab.config.UIClass,
             {'o-subtab-btn--active': isCurrentSubtab(subtab.id)}]
          "
          @click="handleSubtabClick(subtab, index)"
          data-v-modern-tab-button
        >
          <span v-html="subtab.symbol" />
          <div
            v-if="subtab.hasNotification"
            class="fas fa-circle-exclamation l-notification-icon"
          />
          <div
            class="o-subtab__tooltip"
            data-v-modern-tab-button
          >
            {{ subtab.name }}
          </div>
        </div>
      </template>
    </div>
  </div>
  `
};