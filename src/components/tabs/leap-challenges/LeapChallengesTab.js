import LeapChallengeGroupRow from "./LeapChallengeGroupRow.js";

export default {
  name: "LeapChallengesTab",
  components: {
    LeapChallengeGroupRow
  },
  computed: {
    group() {
      return LeapChallengeGroup.latest;
    }
  },
  template: `
    <div>
      <LeapChallengeGroupRow
        :group="group"
      />
    </div>
  `
}