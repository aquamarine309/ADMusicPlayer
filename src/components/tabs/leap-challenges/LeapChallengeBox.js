import DescriptionDisplay from "../../DescriptionDisplay.js";
import EffectDisplay from "../../EffectDisplay.js";

export default {
  name: "LeapChallengeBox",
  components: {
    DescriptionDisplay,
    EffectDisplay
  },
  props: {
    challenge: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isRunning: false,
      isCompleted: false,
      otherRunning: false
    }
  },
  methods: {
    update() {
      this.isRunning = this.challenge.isRunning;
      this.isCompleted = this.challenge.isCompleted;
      this.otherRunning = LeapChallenge.isRunning && !this.isRunning;
    }
  },
  computed: {
    config() {
      return this.challenge.config;
    },
    reward() {
      return this.config.reward;
    },
    symbol() {
      return this.config.symbol;
    },
    title() {
      return this.config.name;
    },
    level() {
      return this.challenge.level;
    }
  },
  template: `
    <div class="c-challenge-box--leap">
      <div class="c-challenge-box--leap__title">
        <div class="c-challenge-box--leap__title-symbol-container">
          <div
            v-html="symbol"
            class="c-challenge-box--leap__title-symbol"
          />
          <div class="c-challenge-box--leap__title--level">Lv. {{ level }}</div>
        </div>
        <div class="c-challenge-box--leap__title-text">{{ title }}</div>
      </div>
      <div class="c-challenge-box--leap__description">
        <DescriptionDisplay :config="config" />
        <EffectDisplay
          br
          :config="config"
          class="c-challenge-box--leap__effect-bad"
        />
      </div>
      <div class="c-challenge-box--leap__description">
        <DescriptionDisplay
          :config="reward"
          title="Reward:"
        />
        <EffectDisplay
          br
          class="c-challenge-box--leap__effect-good"
          :config="reward"
        />
      </div>
      <div
        v-if="isCompleted"
        class="c-challenge-box--leap__effect-good"
      >
        The challenge (level {{ level }}) is completed.
      </div>
      <div
        v-else-if="isRunning"
        class="c-challenge-box--leap__running"
      >
        The challenge is running.
      </div>
      <div
        v-else-if="otherRunning"
        class="c-challenge-box--leap__effect-bad"
      >
        Other challenge is running. Reach the goal to complete it.
      </div>
      <div
        v-else
        class="c-challenge-box--leap__effect-bad"
      >
        Click on "Random Challenge" button below to start.
      </div>
    </div>
  `
}