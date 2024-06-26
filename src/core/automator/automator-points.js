export const AutomatorPoints = {
  get perks() {
    return Perks.all.filter(p => p.automatorPoints);
  },

  // This also rejects rebuyables, where automatorPoints is undefined
  get upgrades() {
    return RealityUpgrades.all.filter(p => p.automatorPoints);
  },

  get pointsFromPerks() {
    return this.perks
      .filter(p => p.isBought)
      .map(p => p.automatorPoints)
      .sum();
  },

  get pointsFromUpgrades() {
    return this.upgrades
      .filter(p => p.isBought)
      .map(p => p.automatorPoints)
      .sum();
  },

  get pointsFromOther() {
    return GameDatabase.reality.automator.otherAutomatorPoints.map(s => s.automatorPoints()).sum();
  },
  
  get pointsFromClicking() {
    return player.clickingAP;
  },

  get totalPoints() {
    return this.pointsFromPerks + this.pointsFromUpgrades + this.pointsFromOther + this.pointsFromClicking;
  },

  get pointsForAutomator() {
    return 100;
  },
  
  click() {
    if ((player.clickingAP < 100) && (Math.random() < 0.05 * Math.sqrt(player.clickingAP + 1))) {
      ++player.clickingAP;
      GameUI.notify.success("You have got an AP from clicking button!");
    };
  }
};
