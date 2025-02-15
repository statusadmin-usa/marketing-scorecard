
export interface UserPlan {
  type: 'free' | 'paid';
  maxScorecards: number;
  maxDownloads: number;
  canShare: boolean;
}

export const USER_PLANS = {
  free: {
    maxScorecards: 3,
    maxDownloads: 3,
    canShare: true
  },
  paid: {
    maxScorecards: Infinity,
    maxDownloads: 20,
    canShare: true
  }
} as const;
