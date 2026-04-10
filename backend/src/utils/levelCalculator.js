// ==========================================
// UTIL: Level Calculator ⭐ (Người 3)
// Tính level từ tổng điểm
// ==========================================

const LEVELS = [
  { level: 1, minPoints: 0, maxPoints: 99, name: 'Beginner' },
  { level: 2, minPoints: 100, maxPoints: 299, name: 'Learner' },
  { level: 3, minPoints: 300, maxPoints: 599, name: 'Achiever' },
  { level: 4, minPoints: 600, maxPoints: 999, name: 'Expert' },
  { level: 5, minPoints: 1000, maxPoints: Infinity, name: 'Master' }
];

/**
 * Tính level từ tổng điểm
 * @param {number} totalPoints
 * @returns {{ level: number, name: string }}
 */
function calculateLevel(totalPoints) {
  for (const lvl of LEVELS) {
    if (totalPoints >= lvl.minPoints && totalPoints <= lvl.maxPoints) {
      return { level: lvl.level, name: lvl.name };
    }
  }
  return { level: 1, name: 'Beginner' };
}

/**
 * Kiểm tra user có lên level không
 * @param {number} oldPoints
 * @param {number} newPoints
 * @returns {{ leveledUp: boolean, oldLevel: object, newLevel: object }}
 */
function checkLevelUp(oldPoints, newPoints) {
  const oldLevel = calculateLevel(oldPoints);
  const newLevel = calculateLevel(newPoints);
  return {
    leveledUp: newLevel.level > oldLevel.level,
    oldLevel,
    newLevel
  };
}

module.exports = { calculateLevel, checkLevelUp, LEVELS };
