interface Window {
  google?: {
    accounts: {
      id: {
        initialize: (config: {
          client_id: string;
          callback: (response: { credential: string }) => void;
          auto_select?: boolean;
          cancel_on_tap_outside?: boolean;
          context?: string;
          state_cookie_domain?: string;
          ux_mode?: string;
          allowed_parent_origin?: string | string[];
        }) => void;
        renderButton: (
          element: HTMLElement | null,
          options: {
            theme?: "outline" | "filled_blue" | "filled_black";
            size?: "large" | "medium" | "small";
            width?: string | number;
            text?: "signin_with" | "signup_with" | "continue_with" | "signin";
            shape?: "rectangular" | "pill" | "circle" | "square";
            logo_alignment?: "left" | "center";
            locale?: string;
            type?: "standard" | "icon";
          }
        ) => void;
        prompt: (callback?: (notification: {
          isNotDisplayed: () => boolean;
          isSkippedMoment: () => boolean;
          isDismissedMoment: () => boolean;
          getNotDisplayedReason: () => string;
          getSkippedReason: () => string;
          getDismissedReason: () => string;
        }) => void) => void;
        disableAutoSelect: () => void;
        storeCredential: (credential: { id: string; password: string }) => Promise<void>;
        cancel: () => void;
        revoke: (hint: string, callback?: () => void) => void;
      };
    };
  };
  handleGoogleScriptLoad?: () => void;
}
