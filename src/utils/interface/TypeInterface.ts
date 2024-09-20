interface BotState {
    todayPostCount: number;
    remainingPosts: number;
    totalPostsMade: number;
    timeAllotted: number;
    lastActiveDate: string;
}

export type {
    BotState
};