import { GameMechanicState } from "./game-mechanics/index.js";
import { deepmergeAll } from "../utility/deepmerge.js";

const levelRewards = new Map();

class LeapChallengeRewardBaseState extends GameMechanicState {
  constructor(config, challenge) {
    super(config);
    this._challenge = challenge;
  }
  
  get level() {
    return this._level;
  }
  
  getLevelId(level) {
    return `${this.challenge.id}/${level}`;
  }
  
  get challenge() {
    return this._challenge;
  }
  
  get isEffectActive() {
    return !this.isBase && this.challenge.isCompleted;
  }
  
  setLevel(level) {
    if (!this.isBase) throw "Only the base class can be set level.";
    const id = this.getLevelId(level);
    if (levelRewards.has(id)) return levelRewards.get(id);
    const result = new LeapChallengeRewardState(this.config, this.challenge, level);
    levelRewards.set(id, result);
    return result;
  }
  
  get isBase() {
    return true;
  }
};

class LeapChallengeRewardState extends LeapChallengeRewardBaseState {
  constructor(config, challenge, level) {
    const effect = config.effect;
    const configCopy = deepmergeAll([{}, config]);
    configCopy.effect = () => effect(level);
    super(configCopy, challenge);
    this._level = level;
  }
  
  get isBase() {
    return false;
  }
}

const levelChallenges = new Map();

class LeapChallengeBaseState extends GameMechanicState {
  constructor(config) {
    super(config);
    this._reward = new LeapChallengeRewardBaseState(config.reward, this);
  }
  
  get level() {
    return this._level;
  }
  
  getLevelId(level) {
    return `${this.id}/${level}`
  }
  
  setLevel(level) {
    if (!this.isBase) throw "Only the base class can be set level.";
    const id = this.getLevelId(level);
    if (levelChallenges.has(id)) return levelChallenges.get(id);
    const result = new LeapChallengeState(this.config, level);
    levelChallenges.set(id, result);
    return result;
  }
  
  get isExistential() {
    return this.id > 0 && this.level > 0;
  }
  
  get reward() {
    return this._reward;
  }
  
  get isRunning() {
    return this.isExistential && ((player.leap.challenge.current.id === this.id && player.leap.challenge.current.level === this.level) || this.isGroupActive);
  }
  
  get isEffectActive() {
    return this.isExistential && !this.isBase && this.isRunning;
  }
  
  get isGroupActive() {
    return this.isExistential && LeapChallengeGroup.isRunning && LeapChallengeGroup.current.challengeIds.includes(this.id);
  }
  
  get isCompleted() {
    return this.isExistential && player.leap.challenge.completedLevels[this.id] >= this.level;
  }
  
  get isBase() {
    return true;
  }
  
  complete() {
    if (!this.isExistential) return;
    if (this.isCompleted) return;
    Tab.leap.challenges.show();
    player.leap.challenge.completedLevels[this.id] = this.level;
    player.leap.challenge.current.id = 0;
    player.leap.challenge.current.level = 0;
  }
  
  start() {
    if (!this.isExistential) return;
    if (this.isRunning) return;
    Tab.dimensions.antimatter.show();
    player.leap.challenge.current.id = this.id;
    player.leap.challenge.current.level = this.level;
  }
};

class LeapChallengeState extends LeapChallengeBaseState {
  constructor(config, level) {
    const effect = config.effect;
    const rewardEffect = config.reward.effect;
    const configCopy = deepmergeAll([{}, config]);
    configCopy.effect = () => effect(level);
    configCopy.reward.effect = () => rewardEffect(level);
    super(configCopy);
    this._level = level;
    this._reward = this._reward.setLevel(level);
  }
  
  get isBase() {
    return false;
  }
}

export const LeapChallenge = mapGameDataToObject(
  GameDatabase.leap.challenges,
  config => new LeapChallengeBaseState(config)
);

Object.defineProperty(LeapChallenge, "isRunning", {
  get: function() { return player.leap.challenge.current.id > 0; }
});

Object.defineProperty(LeapChallenge, "current", {
  get: function() { return LeapChallenge.all[player.leap.challenge.current.id - 1].setLevel(player.leap.challenge.current.level) || null; }
});

class LeapChallengeGoalState extends GameMechanicState {
  constructor(config, group) {
    super(config);
    this.registerEvents(config.checkEvent, args => this.tryReach(args));
    this._group = group;
  }
  
  get group() {
    return this._group;
  }
  
  get isReached() {
    return this.group.goalIndex > this.id;
  }
  
  get isCurrent() {
    return this.group.goalIndex === this.id;
  }
  
  tryReach(args) {
    if (this.isReached) return;
    if (!this.isCurrent) return;
    if (this.group.isCompleted) return;
    if (!this.config.checkRequirement(args)) return;
    if (!LeapChallenge.isRunning) return;
    if (this.group.allSingleCompleted) {
      this.group.complete();
      return;
    }
    LeapChallenge.current.complete();
  }
}


class LeapChallengeGroupRewardState extends GameMechanicState {
  constructor(config, group) {
    super(config);
    this._group = group;
  }
  
  get group() {
    return this._group;
  }
  
  get isEffectActive() {
    return this.group.isCompleted;
  }
}

class LeapChallengeGroupState extends GameMechanicState {
  constructor(config) {
    super(config);
    this._challenges = config.challenges.map (c => LeapChallenge[c.id].setLevel(c.level));
    this._challengeIds = this._challenges.map(c => c.id);
    this._goals = mapGameData(
      config.goals,
      config => new LeapChallengeGoalState(config, this)
    );
    this._reward = new LeapChallengeGroupRewardState(config.reward, this);
    this.registerEvents(config.checkEvent, args => this.tryUnlock(args));
  }
  
  get reward() {
    return this._reward;
  }
  
  get challenges() {
    return this._challenges;
  }
  
  get challengeIds() {
    return this._challengeIds;
  }
  
  get goals() {
    return this._goals;
  }
  
  get isUnlocked() {
    return player.leap.challenge.group.unlocked >= this.id;
  }
  
  tryUnlock(args) {
    if (this.isUnlocked) return;
    if (!this.config.checkRequirement(args)) return;
    this.unlock();
  }
  
  unlock() {
    if (this.isUnlocked) return;
    player.leap.challenge.group.unlocked = this.id;
  }
  
  get isRunning() {
    return  player.leap.challenge.group.current === this.id;
  }
  
  get isEffectActive() {
    return this.isRunning;
  }
  
  get isCompleted() {
    return (player.leap.challenge.group.completedBits & (1 << this.id)) !== 0;
  }
  
  complete() {
    player.leap.challenge.group.completedBits |= (1 << this.id);
  }
  
  get allSingleCompleted() {
    return this.challenges.every(c => c.isCompleted);
  }
  
  get groupGoal() {
    return this.goals[this.challenges.length];
  }
  
  get goalIndex() {
    return this.challenges.countWhere(c => c.isCompleted);
  }
  
  get goal() {
    return this.goals[this.goalIndex];
  }
};

export const LeapChallengeGroup = mapGameDataToObject(
  GameDatabase.leap.challengeGroups
  ,
  config => new LeapChallengeGroupState(config)
);

Object.defineProperty(LeapChallengeGroup, "isRunning", {
  get: function() { return player.leap.challenge.group.current > 0; }
});

Object.defineProperty(LeapChallengeGroup, "current", {
  get: function() { return LeapChallengeGroup.all[player.leap.challenge.group.current - 1] || null; }
});

Object.defineProperty(LeapChallengeGroup, "latest", {
  get: function() { return LeapChallengeGroup.all[player.leap.challenge.group.unlocked - 1] || null }
});


const LeapChallengeRNG = new class {
  get seed() {
    return player.leap.challenge.seed;
  }
  
  set seed(value) {
    player.leap.challenge.seed = value;
  }
  
  uniform() {
    const state = xorshift32Update(this.seed);
    this.seed = state;
    return state * 2.3283064365386963e-10 + 0.5;
  }
}();

export function startRandomChallenge(group) {
  if (group.challenges.some(c => c.isRunning)) return;
  if (group.challenges.every(c => c.isCompleted)) return;
  const challenges = group.challenges.filter(c => !c.isCompleted);
  const challenge = challenges[Math.floor(LeapChallengeRNG.uniform() * challenges.length)];
  challenge.start();
  return challenge;
}

export function getLeapChallengeEffect(key) {
  const challenge = LeapChallenge[key];
  if (challenge === undefined) throw `Unexpect Leap Challenge key: ${key}.`;
  return challenge.setLevel(player.leap.challenge.current.level);
}

export function getLeapChallengeRewardEffect(key) {
  const challenge = LeapChallenge[key];
  if (challenge === undefined) throw `Unexpect Leap Challenge key: ${key}.`;
  return challenge.reward.setLevel(player.leap.challenge.completedLevels[challenge.id]);
}