import { LeaderboardJson } from '@hha/common';
import Api from 'actions/Api';
import { ENDPOINT_LEADERBOARD_GET } from 'constants/endpoints';
import { TOAST_LEADERBOARD_GET_ERROR } from 'constants/toastErrorMessages';
import { History } from 'history';

export const getLeaderboard = async (history: History): Promise<LeaderboardJson[]> => {
  const controller = new AbortController();
  try {
    const leaderboards: LeaderboardJson[] = await Api.Get(
      ENDPOINT_LEADERBOARD_GET,
      TOAST_LEADERBOARD_GET_ERROR,
      history,
      controller.signal,
    );

    return leaderboards;
  } catch (error) {
    console.error('Error fetching leaderboards:', error);
    throw error;
  } finally {
    controller.abort();
  }
};
