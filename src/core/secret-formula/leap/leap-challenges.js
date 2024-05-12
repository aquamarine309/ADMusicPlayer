import { DC } from "../../constants.js";

export const leapChallenges = {
  timeWarp: {
    id: 1,
    name: "Time Warp",
    description: `The game runs slower.`,
    effect: value => Math.clamp(Math.pow(2, Math.pow(value, 3)), 1, 1e60),
    formatEffect: value => `/${format(value, 2)}`,
    symbol: "Δ",
    reward: {
      description: "The game runs faster.",
      effect: value => 1 + 0.5 * Math.pow(value, 6),
      formatEffect: value => formatX(value, 2, 2)
    }
  },
  buyTenWeaker: {
    id: 2,
    name: "Inferior Dimension",
    description: "Reduce the multiplier for buying ten dimensions.",
    effect: value => 1 / Math.pow(Math.log(value + 1) + 1, 0.2),
    formatEffect: value => formatPow(value, 0, 2),
    symbol: "<i class='fas fa-book'></i>",
    reward: {
      description: "Increase the multiplier for buying ten Antimatter Dimensions.",
      effect: value => 0.5 * Math.pow(value, 1.2),
      formatEffect: value => `+${format(value, 2, 2)}`
    }
  },
  unstablePrice: {
    id: 3,
    name: "Unstable Price",
    description: "The cost of Tickspeed is increased.",
    symbol: "<i class='fas fa-tag'></i>",
    effect: value => Math.pow(value, 4) * 3,
    formatEffect: value => `+${format(value, 2)} Tickspeed`,
    reward: {
      description: "Decrease the cost of Tickspeed.",
      effect: value => Math.pow(value, 2) * 2,
      formatEffect: value => `-${format(value, 2)} Tickspeed`
    }
  }
};

