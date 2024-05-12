export const leapChallengeGroups = {
  preInfinity: {
    id: 1,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    checkRequirement: () => player.records.totalAntimatter.gte(100),
    onUnlock() {
      Modal.message.show("<b>All Antimatter Dimensions</b> are disabled.<br>Enter or complete the challenge to enable them.");
    },
    requirement: () => `Reach ${formatInt(100)} AM`,
    challenges: [
      {
        id: "timeWarp",
        level: 1
      },
      {
        id: "buyTenWeaker",
        level: 1
      },
      {
        id: "unstablePrice",
        level: 1
      }
    ],
    reward: {
      description: "Unlock Leap Dimensions."
    },
    goals: [
      {
        id: 0,
        checkEvent: GAME_EVENT.DIMBOOST_BEFORE,
        checkRequirement: () => true,
        description: "Reach a Dimension Boost."
      },
      {
        id: 1,
        checkEvent: GAME_EVENT.GALAXY_RESET_BEFORE,
        checkRequirement: () => true,
        description: "Buy a Antimatter Galaxy."
      },
      {
        id: 2,
        checkEvent: GAME_EVENT.GALAXY_RESET_BEFORE,
        checkRequirement: () => player.galaxies > 2,
        description: () => `Buy ${formatInt(2)} Galaxies.`
      },
      {
        id: 3,
        checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
        checkRequirement: () => true,
        description: "Go infinite."
      }
    ]
  }
};