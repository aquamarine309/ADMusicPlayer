import LeapChallengeBox from "./LeapChallengeBox.js";
import DescriptionDisplay from "../../DescriptionDisplay.js";
import EffectDisplay from "../../EffectDisplay.js";

export default {
  name: "LeapChallengeGroupRow",
  components: {
    LeapChallengeBox,
    DescriptionDisplay,
    EffectDisplay
  },
  props: {
    group: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      anyChallengeRunning: false,
      isCompleted: false
    }
  },
  methods: {
    update() {
      this.anyChallengeRunning = LeapChallenge.isRunning;
      this.isCompleted = this.group.isCompleted;
    },
    startRandomChallenge() {
      if (this.anyChallengeRunning) return;
      startRandomChallenge(this.group);
    }
  },
  computed: {
    challenges() {
      return this.group.challenges;
    },
    goalConfig() {
      return this.group.goal.config;
    },
    config() {
      return this.group.config.reward;
    },
    buttonText() {
      if (this.anyChallengeRunning) return "A single challenge is currently running";
      return "Random Challenge";
    },
    btnClass() {
      return {
        "c-leap-challenge-group--start-btn": true,
        "c-leap-challenge-group--start-btn--reverse": this.anyChallengeRunning
      }
    },
    title() {
      return this.group.config.requirement();
    }
  },
  template: `
    <div class="c-leap-challenge-group">
      <div class="c-leap-challenge-group--title">{{ title }}</div>
      <div class="c-challenge-box--leap__container">
        <LeapChallengeBox
          v-for="challenge in challenges"
          :challenge="challenge"
          :key="challenge.id"
        />
      </div>
      <div v-if="!isCompleted">
        <DescriptionDisplay
          :config="goalConfig"
          title="Goal:"
        />
      </div>
      <div class="c-challenge-box--leap__effect-good">
        <div v-if="!isCompleted">After Complete this challenge group:</div>
        <div v-else>Group reward:</div>
        <DescriptionDisplay :config="config" />
        <EffectDisplay :config="config" />
      </div>
      <button
        :class="btnClass"
        @click="startRandomChallenge"
      >
        {{ buttonText }}
      </button>
    </div>
  `
}