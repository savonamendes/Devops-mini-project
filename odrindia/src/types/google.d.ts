declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            element: HTMLElement | null,
            options: {
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              width?: string | number;
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
            }
          ) => void;
          prompt: (callback?: (notification: {
            isNotDisplayed: () => boolean;
            isSkippedMoment: () => boolean;
            isDismissedMoment: () => boolean;
            getDismissedReason: () => string;
            getNotDisplayedReason: () => string;
            getSkippedReason: () => string;
          }) => void) => void;
        };
      };
    };
  }
}

export {};
