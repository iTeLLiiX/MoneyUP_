// Gamification Engine for MoneyUP App
// Handles achievements, points, and user engagement

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  category: string;
  unlocked: boolean;
  unlockedDate?: string;
}

export interface UserProgress {
  totalPoints: number;
  level: number;
  achievements: Achievement[];
  streak: number;
  lastActivity: string;
}

class GamificationEngine {
  private static instance: GamificationEngine;
  private userProgress: UserProgress | null = null;

  public static getInstance(): GamificationEngine {
    if (!GamificationEngine.instance) {
      GamificationEngine.instance = new GamificationEngine();
    }
    return GamificationEngine.instance;
  }

  public initialize(): void {
    console.log('🎮 Initializing Gamification Engine...');
    this.loadUserProgress();
    console.log('✅ Gamification Engine initialized');
  }

  private loadUserProgress(): void {
    const savedProgress = localStorage.getItem('moneyup-gamification');
    if (savedProgress) {
      try {
        this.userProgress = JSON.parse(savedProgress);
      } catch (error) {
        console.error('Error loading gamification progress:', error);
        this.userProgress = this.createDefaultProgress();
      }
    } else {
      this.userProgress = this.createDefaultProgress();
    }
  }

  private createDefaultProgress(): UserProgress {
    return {
      totalPoints: 0,
      level: 1,
      achievements: this.getDefaultAchievements(),
      streak: 0,
      lastActivity: new Date().toISOString(),
    };
  }

  private getDefaultAchievements(): Achievement[] {
    return [
      {
        id: 'first_login',
        title: 'Erste Schritte',
        description: 'Zum ersten Mal angemeldet',
        icon: '🚀',
        points: 10,
        category: 'onboarding',
        unlocked: false,
      },
      {
        id: 'onboarding_complete',
        title: 'Onboarding Meister',
        description: 'Onboarding erfolgreich abgeschlossen',
        icon: '🎯',
        points: 50,
        category: 'onboarding',
        unlocked: false,
      },
      {
        id: 'first_transaction',
        title: 'Erste Transaktion',
        description: 'Erste Transaktion hinzugefügt',
        icon: '💳',
        points: 25,
        category: 'transactions',
        unlocked: false,
      },
      {
        id: 'transaction_master',
        title: 'Transaktions-Meister',
        description: '10 Transaktionen hinzugefügt',
        icon: '📊',
        points: 75,
        category: 'transactions',
        unlocked: false,
      },
      {
        id: 'first_goal',
        title: 'Zielsetzer',
        description: 'Erstes Sparziel erstellt',
        icon: '🎯',
        points: 50,
        category: 'goals',
        unlocked: false,
      },
      {
        id: 'goal_achiever',
        title: 'Zielerreicher',
        description: 'Erstes Sparziel erreicht',
        icon: '🏆',
        points: 150,
        category: 'goals',
        unlocked: false,
      },
      {
        id: 'premium_user',
        title: 'Premium Mitglied',
        description: 'MoneyUP Premium erworben',
        icon: '💎',
        points: 100,
        category: 'premium',
        unlocked: false,
      },
    ];
  }

  public getUserProgress(): UserProgress | null {
    return this.userProgress;
  }

  public checkAchievement(achievementId: string): boolean {
    if (!this.userProgress) return false;

    const achievement = this.userProgress.achievements.find(a => a.id === achievementId);
    if (!achievement || achievement.unlocked) return false;

    // Check if achievement should be unlocked
    let shouldUnlock = false;

    switch (achievementId) {
      case 'first_login':
        shouldUnlock = true;
        break;
      case 'onboarding_complete':
        shouldUnlock = localStorage.getItem('moneyup-onboarding-completed') === 'true';
        break;
      case 'first_transaction':
        const transactions = JSON.parse(localStorage.getItem('moneyup-transactions') || '[]');
        shouldUnlock = transactions.length >= 1;
        break;
      case 'transaction_master':
        const transactions2 = JSON.parse(localStorage.getItem('moneyup-transactions') || '[]');
        shouldUnlock = transactions2.length >= 10;
        break;
      case 'first_goal':
        const goals = JSON.parse(localStorage.getItem('moneyup-goals') || '[]');
        shouldUnlock = goals.length >= 1;
        break;
      case 'goal_achiever':
        const goals2 = JSON.parse(localStorage.getItem('moneyup-goals') || '[]');
        shouldUnlock = goals2.some((g: any) => g.status === 'completed');
        break;
      case 'premium_user':
        shouldUnlock = localStorage.getItem('moneyup-premium-user') === 'true';
        break;
    }

    if (shouldUnlock) {
      this.unlockAchievement(achievementId);
      return true;
    }

    return false;
  }

  private unlockAchievement(achievementId: string): void {
    if (!this.userProgress) return;

    const achievement = this.userProgress.achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedDate = new Date().toISOString();
      this.userProgress.totalPoints += achievement.points;
      this.userProgress.level = Math.floor(this.userProgress.totalPoints / 100) + 1;
      
      this.saveUserProgress();
      
      console.log(`🏆 Achievement unlocked: ${achievement.title} (+${achievement.points} points)`);
    }
  }

  public addPoints(points: number, reason: string): void {
    if (!this.userProgress) return;

    this.userProgress.totalPoints += points;
    this.userProgress.level = Math.floor(this.userProgress.totalPoints / 100) + 1;
    this.userProgress.lastActivity = new Date().toISOString();
    
    this.saveUserProgress();
    
    console.log(`🎯 Points added: +${points} (${reason})`);
  }

  public updateStreak(): void {
    if (!this.userProgress) return;

    const today = new Date().toISOString().split('T')[0];
    const lastActivity = new Date(this.userProgress.lastActivity).toISOString().split('T')[0];
    
    if (today === lastActivity) {
      // Same day, maintain streak
      return;
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (lastActivity === yesterdayStr) {
      // Consecutive day, increase streak
      this.userProgress.streak += 1;
    } else {
      // Streak broken, reset
      this.userProgress.streak = 1;
    }
    
    this.userProgress.lastActivity = new Date().toISOString();
    this.saveUserProgress();
  }

  private saveUserProgress(): void {
    if (this.userProgress) {
      localStorage.setItem('moneyup-gamification', JSON.stringify(this.userProgress));
    }
  }

  public getLevelInfo(): { level: number; pointsToNext: number; progress: number } {
    if (!this.userProgress) {
      return { level: 1, pointsToNext: 100, progress: 0 };
    }

    const currentLevel = this.userProgress.level;
    const pointsInCurrentLevel = this.userProgress.totalPoints % 100;
    const pointsToNext = 100 - pointsInCurrentLevel;
    const progress = (pointsInCurrentLevel / 100) * 100;

    return {
      level: currentLevel,
      pointsToNext,
      progress,
    };
  }

  public getRecentAchievements(limit: number = 5): Achievement[] {
    if (!this.userProgress) return [];

    return this.userProgress.achievements
      .filter(a => a.unlocked)
      .sort((a, b) => new Date(b.unlockedDate || '').getTime() - new Date(a.unlockedDate || '').getTime())
      .slice(0, limit);
  }

  public getUnlockedAchievements(): Achievement[] {
    if (!this.userProgress) return [];

    return this.userProgress.achievements.filter(a => a.unlocked);
  }

  public getLockedAchievements(): Achievement[] {
    if (!this.userProgress) return [];

    return this.userProgress.achievements.filter(a => !a.unlocked);
  }
}

export default GamificationEngine;
