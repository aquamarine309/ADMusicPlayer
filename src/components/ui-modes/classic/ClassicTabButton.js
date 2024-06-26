export default {
  name: "ClassicTabButton",
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
      hasNotification: false,
      tabName: ""
    };
  },
  computed: {
    isCurrentTab() {
      return this.tab.isOpen && Theme.currentName() !== "S9";
    }
  },
  methods: {
    update() {
      this.isAvailable = this.tab.isAvailable;
      this.hasNotification = this.tab.hasNotification;
      if (this.tabPosition < Pelle.endTabNames.length) {
        this.tabName = Pelle.transitionText(
          this.tab.name,
          Pelle.endTabNames[this.tabPosition],
          Math.max(Math.min(GameEnd.endState - (this.tab.id) % 4 / 10, 1), 0)
        );
      } else {
        this.tabName = this.tab.name;
      }
    },
    handleClick() {
      this.tab.show(true);
      playNote([0, 2, 4, 5, 7, 9, 11][this.tabPosition % 7] + 12 * Math.floor(this.tabPosition / 7));
      AutomatorPoints.click();
    }
  },
  template: `
  <button
    v-if="isAvailable"
    :class="
      [tab.config.UIClass,
       { 'o-tab-btn--active': isCurrentTab }]
    "
    class="o-tab-btn"
    @click="handleClick"
    data-v-class-tab-button
  >
    {{ tabName }}
    <div
      v-if="hasNotification"
      class="fas fa-circle-exclamation l-notification-icon"
    />
  </button>
  `
};