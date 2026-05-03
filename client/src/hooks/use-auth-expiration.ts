import { useEffect, useRef } from "react";
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { logout, updateCredentials } from "@/features/auth/authSlice";
import { useRefreshMutation } from "@/features/auth/authAPI";

const TOKEN_REFRESH_BUFFER = 5 * 60 * 1000;

const useAuthExpiration = () => {
  const { accessToken, expiresAt, refreshToken } = useTypedSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [refreshTokenApi] = useRefreshMutation();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkTokenExpiration = async () => {
      if (!accessToken || !expiresAt || !refreshToken) return;

      const currentTime = Date.now();
      const timeUntilExpiration = expiresAt - currentTime;

      if (timeUntilExpiration <= 0) {
        dispatch(logout());
        return;
      }

      if (timeUntilExpiration <= TOKEN_REFRESH_BUFFER) {
        try {
          const result = await refreshTokenApi({ refreshToken }).unwrap();
          dispatch(updateCredentials({
            accessToken: result.accessToken,
            expiresAt: result.expiresAt,
            refreshToken: result.refreshToken,
            refreshExpiresAt: result.refreshExpiresAt,
          }));
        } catch {
          dispatch(logout());
        }
      }
    };

    checkTokenExpiration();

    intervalRef.current = setInterval(checkTokenExpiration, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [accessToken, expiresAt, refreshToken, dispatch, refreshTokenApi]);
};

export default useAuthExpiration;